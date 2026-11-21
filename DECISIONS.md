# Decisions
- Root .gitignore already excludes all project directories except launch-kit; no root edits needed. AGENTS.md is absent.
- Local-first Next.js shell around a custom regl renderer and worker data engine. No account needed to run.
- GitHub authentication currently fails; retry with network access before declaring blocked. Do not expose credentials.
- Benchmark dataset is seeded synthetic clustered vectors. It is not evidence of semantic quality on real embeddings.
- Full UMAP for small collections; explicit landmark UMAP plus nearest-landmark interpolation for scale. Every vector gets a position, but this is not full million-point UMAP optimization.
- Chrome is installed; benchmark uses its actual reported renderer, with gl.finish after draws. Device pixel ratio is logged but the renderer intentionally uses one drawing-buffer pixel per CSS pixel.
- pgvector has no running local server or Docker daemon. Ship a reproducible Docker fixture and test protocol; do not claim a database benchmark without a real run.
- Random-projection ANN uses exact L2 reranking of a bounded candidate union. Recall is measured against exhaustive original-space L2 and may be low; it is not HNSW.
- Public GitHub publication is within the explicit request for an open-source systems project worth starring. Only code, synthetic data results and generated visual assets are published.
