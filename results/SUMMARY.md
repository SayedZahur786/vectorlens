# Generated benchmark summary

1,000,000 vectors: **60.00 FPS**, **51.20 ms p95 query-to-GPU-highlight**, **97.5% mean recall@20**. Target: display-rate rendering at 60 FPS and highlight below 100 ms. Near-60 results reflect refresh pacing; frame tails are included below.

Measured in headless Chrome on **Apple M5**, arm64; renderer: `ANGLE (Apple, ANGLE Metal Renderer: Apple M5, Unspecified Version)`. Drawing buffer: 1064 × 570 pixels; 2px points. Synthetic 32-dimensional clustered vectors, seed 42; 600 recorded frame intervals and 50 timed queries in the headline run (earlier scale runs use shorter samples). Recall uses 20 exact comparisons (alternating perturbed external vectors in the extended run). These are small benchmark samples, not a production SLA.

| Vectors | Search | FPS | Frame p95 ms | Query → GPU p95 ms | Recall@20 | Index / projection s |
|---:|:---|---:|---:|---:|---:|---:|
| 10,000 | [baseline](10000-baseline-1795269288346.json) | 60.00 | 16.80 | 16.70 | 100.0% | 0.03 / 0.25 |
| 10,000 | [expanded](10000-tuned-1795269292211.json) | 60.00 | 16.70 | 16.80 | 100.0% | 0.03 / 0.25 |
| 100,000 | [baseline](100000-baseline-1795269297665.json) | 60.00 | 16.80 | 17.10 | 90.0% | 0.22 / 1.10 |
| 100,000 | [expanded](100000-tuned-1795269301695.json) | 60.00 | 16.70 | 33.80 | 100.0% | 0.22 / 1.10 |
| 1,000,000 | [baseline](1000000-baseline-1795269454037.json) | 60.00 | 16.70 | 17.60 | 19.3% | 2.18 / 7.94 |
| 1,000,000 | [expanded](1000000-tuned-1795269468650.json) | 60.00 | 16.70 | 51.20 | 97.5% | 2.18 / 7.94 |
