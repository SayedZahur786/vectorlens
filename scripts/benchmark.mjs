import { chromium } from "playwright";
import fs from "node:fs";
import os from "node:os";
import { execSync } from "node:child_process";
const browser = await chromium.launch({
  channel: "chrome",
  headless: !process.env.HEADED,
  args: ["--enable-webgl", "--ignore-gpu-blocklist"],
});
try {
  for (const n of (process.env.COUNTS || "10000,100000,1000000")
    .split(",")
    .map(Number)) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
      deviceScaleFactor: 1,
    });
    page.on("pageerror", (e) => console.error(e));
    page.on("console", (m) => console.log("browser:", m.text()));
    await page.goto(`http://127.0.0.1:3000/?n=${n}`);
    await page.waitForFunction(() => window.vectorlens, null, {
      timeout: 60000,
    });
    await page.evaluate(() => window.vectorlens.ready);
    for (const tuned of [false, ...(process.env.TUNE ? [true] : [])]) {
      const result = await page.evaluate(
        (tuned) => window.vectorlens.benchmark({ tuned }),
        tuned,
      );
      result.host = {
        platform: os.platform(),
        arch: os.arch(),
        cpu: os.cpus()[0].model,
        memoryBytes: os.totalmem(),
      };
      result.revision = execSync("git rev-parse HEAD").toString().trim();
      result.headed = !!process.env.HEADED;
      const path = `results/${n}-${tuned ? "tuned" : "baseline"}-${Date.now()}.json`;
      fs.writeFileSync(path, JSON.stringify(result, null, 2));
      console.log(
        path,
        JSON.stringify({
          fps:
            1000 /
            (result.frameIntervalsMs.reduce((a, b) => a + b) /
              result.frameIntervalsMs.length),
          queryMs: result.queries.map((x) => x.latency),
          recall: result.quality,
        }),
      );
    }
    await page.screenshot({ path: `docs/demo-${n}.png` });
    await page.close();
  }
} finally {
  await browser.close();
}
