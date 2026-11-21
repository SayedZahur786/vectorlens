CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE embeddings (id bigint PRIMARY KEY, embedding vector(32));
CREATE INDEX embeddings_hnsw ON embeddings USING hnsw (embedding vector_l2_ops);
