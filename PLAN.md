# VectorLens plan

## Measurement first
Smallest slice: seeded high-dimensional fixture → worker-built search index → GPU position buffer → moving-camera RAF trace → query → highlighted draw submitted and GPU-fenced. Log raw frame intervals, query latencies, dimensions, seed, point count, browser, renderer, viewport, DPR and revision in results/*.json. Do not call CPU submission time GPU time. Separate projection, index build, rendering and search. Compare ANN with exact top-k; preserve misses and baseline/tuned runs. Generate README tables, SVG chart and metric badge from these logs.

## Closest work
- [TensorBoard Embedding Projector](https://arxiv.org/abs/1611.05469): interactive embedding inspection. Reuse interaction concepts; build a compact million-point renderer and auditable benchmark, not claim novel projection.
- [regl-scatterplot](https://github.com/flekschas/regl-scatterplot): GPU scatterplot with selection. Reuse regl itself; build 3D camera, picking and lasso with the same projection as the shader.
- [UMAP](https://arxiv.org/abs/1802.03426): manifold projection. Reuse [umap-js](https://github.com/PAIR-code/umap-js) in a worker; explicitly distinguish full UMAP from scalable landmark interpolation.
- [pgvector](https://github.com/pgvector/pgvector): Postgres vector search and HNSW. Reuse database ANN; build validated local ingest/export and live query bridge. No hosted service required.

## Slices
1. Repo, seeded fixture, renderer, benchmark harness and first logged measurement.
2. Worker UMAP, original-space ANN index, recall validation, file ingest, pgvector adapter.
3. Orbit/zoom, lasso, inspection, live vector query, visual capture.
4. Full benchmark, one tuning pass if missed, generated documentation, checks, commits and GitHub push if authenticated.

## Acceptance
No sampled rendering hidden as a million points. Full UMAP is available for small input; million-scale landmark mode must identify itself. Local ANN must search original vectors, never projected coordinates. Benchmark includes real browser GPU completion, not only mock timing. Missing GPU/database/auth is recorded as a limitation rather than fabricated evidence.
