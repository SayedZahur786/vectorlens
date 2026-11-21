# Reproduce and explore VectorLens

Prerequisites: Node.js LTS, dependencies installed via `npm ci`, and Google Chrome. No external account is needed. These steps target under five minutes after installation on comparable hardware; slow CPUs or software GPUs may take longer.

1. `npm run build && npm start` in the project folder. Keep this terminal running.
2. Open http://127.0.0.1:3000/?n=1000000 and wait for projection/indexing to finish.
3. Drag to orbit, scroll to zoom, Shift-drag a lasso. Click a visible point; its original-space neighbors light up. Enter another point ID or paste a vector and press “Illuminate neighbors.”
4. In another terminal, `COUNTS=1000000 TUNE=1 npm run bench`. This opens isolated headless Chrome, builds the seeded data, tests baseline and expanded ANN search, compares with exact L2, and writes raw JSON under results/.
5. `npm run report` regenerates the README, summary, chart and metric badge from those files.

For the full scale suite: `TUNE=1 npm run bench`. For a visible browser: prefix with `HEADED=1`. Do not run simultaneous benchmarks or change the build while measuring. Record hardware and browser differences when comparing runs. Projection time is separate from render and query time. Results use landmark UMAP for large collections, never full million-point UMAP.

To inspect your own data, use the JSON picker. Supported shape: `[{"id":"example","embedding":[0.2,0.4,0.1]}, ...]`; at least three rows, consistent finite dimensions. JSONL/CSV conversion and pgvector configuration are documented in README.md.
