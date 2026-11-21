# Decisions
- Root .gitignore already excludes all project directories except launch-kit; no root edits needed. AGENTS.md is absent.
- Local-first Next.js shell around a custom regl renderer and worker data engine. No account needed to run.
- GitHub authentication currently fails; retry with network access before declaring blocked. Do not expose credentials.
- Benchmark dataset is seeded synthetic clustered vectors. It is not evidence of semantic quality on real embeddings.
- Full UMAP for small collections; explicit landmark UMAP plus nearest-landmark interpolation for scale. Every vector gets a position, but this is not full million-point UMAP optimization.
