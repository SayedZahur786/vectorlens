import { build } from "esbuild";
await build({
  entryPoints: ["lib/worker.mjs"],
  bundle: true,
  outfile: "public/worker.js",
  format: "iife",
  minify: true,
});
