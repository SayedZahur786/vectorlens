import fs from "node:fs";
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length,
  p95 = (a) => [...a].sort((a, b) => a - b)[Math.ceil(a.length * 0.95) - 1];
const logs = fs
  .readdirSync("results")
  .filter((f) => /^\d.*\.json$/.test(f))
  .map((file) => ({ ...JSON.parse(fs.readFileSync("results/" + file)), file }));
const latest = new Map();
for (const r of logs.sort((a, b) => a.timestamp.localeCompare(b.timestamp)))
  latest.set(`${r.n}-${r.tuned}`, r);
const rows = [...latest.values()].sort(
  (a, b) => a.n - b.n || Number(a.tuned) - Number(b.tuned),
);
if (!rows.length) throw Error("No logged runs");
const summarize = (r) => ({
  ...r,
  fps: 1000 / mean(r.frameIntervalsMs),
  frame95: p95(r.frameIntervalsMs),
  query95: p95(r.queries.map((q) => q.latency)),
  recall: mean(r.quality.map((q) => q.recall)),
});
const s = rows.map(summarize),
  best = s.filter((r) => r.tuned).at(-1) || s.at(-1);
const table = [
  "| Vectors | Search | FPS | Frame p95 ms | Query → GPU p95 ms | Recall@20 | Index / projection s |",
  "|---:|:---|---:|---:|---:|---:|---:|",
  ...s.map(
    (r) =>
      `| ${r.n.toLocaleString("en-US")} | [${r.tuned ? "expanded" : "baseline"}](results/${r.file}) | ${r.fps.toFixed(2)} | ${r.frame95.toFixed(2)} | ${r.query95.toFixed(2)} | ${(r.recall * 100).toFixed(1)}% | ${(r.indexMs / 1000).toFixed(2)} / ${(r.projectionMs / 1000).toFixed(2)} |`,
  ),
].join("\n");
const env = `Measured in ${best.headed ? "headed" : "headless"} Chrome on **${best.host.cpu}**, ${best.host.arch}; renderer: \`${best.gpu}\`. Drawing buffer: ${best.viewport.join(" × ")} pixels; ${best.pointSize}px points. Synthetic ${best.d}-dimensional clustered vectors, seed ${best.seed}; ${best.frameIntervalsMs.length} recorded frame intervals and ${best.queries.length} timed queries in the headline run (earlier scale runs use shorter samples). Recall uses ${best.quality.length} exact comparisons (alternating perturbed external vectors in the extended run). These are small benchmark samples, not a production SLA.`;
const headline = `${best.n.toLocaleString("en-US")} vectors: **${best.fps.toFixed(2)} FPS**, **${best.query95.toFixed(2)} ms p95 query-to-GPU-highlight**, **${(best.recall * 100).toFixed(1)}% mean recall@20**. Target: display-rate rendering at 60 FPS and highlight below 100 ms. Near-60 results reflect refresh pacing; frame tails are included below.`;
fs.writeFileSync(
  "results/SUMMARY.md",
  "# Generated benchmark summary\n\n" +
    headline +
    "\n\n" +
    env +
    "\n\n" +
    table.replaceAll("(results/", "(") +
    "\n",
);
const bars = s
  .map((r, i) => {
    const y = 65 + i * 48;
    return `<text x="20" y="${y + 17}" fill="#bed0e0" font-size="12">${r.n.toLocaleString("en-US")} ${r.tuned ? "expanded" : "baseline"}</text><rect x="220" y="${y}" width="${r.fps * 3}" height="23" rx="3" fill="#76dfbb"/><text x="${230 + r.fps * 3}" y="${y + 17}" fill="white" font-size="12">${r.fps.toFixed(2)}</text><rect x="550" y="${y}" width="${r.query95 * 2}" height="23" rx="3" fill="#86a9ff"/><text x="${560 + r.query95 * 2}" y="${y + 17}" fill="white" font-size="12">${r.query95.toFixed(2)} ms</text>`;
  })
  .join("");
fs.writeFileSync(
  "docs/benchmark.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="${100 + s.length * 48}"><rect width="100%" height="100%" rx="12" fill="#0c1521"/><g font-family="monospace"><text x="220" y="35" fill="#76dfbb">RENDER / FPS</text><text x="550" y="35" fill="#86a9ff">QUERY → GPU / P95</text>${bars}</g></svg>`,
);
fs.writeFileSync(
  "docs/metric.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" width="310" height="24"><rect width="310" height="24" rx="4" fill="#163b34"/><text x="155" y="16" text-anchor="middle" font-family="monospace" font-size="11" fill="#a2f4d6">${best.n.toLocaleString("en-US")} points | ${best.fps.toFixed(1)} FPS | ${best.query95.toFixed(1)}ms p95</text></svg>`,
);
let readme = fs
  .readFileSync("docs/README.template.md", "utf8")
  .replace("{{METRICS}}", headline + "\n\n" + env + "\n\n" + table);
fs.writeFileSync("README.md", readme);
console.log(
  "Generated README, summary, chart and badge from " +
    logs.length +
    " raw logs.",
);
