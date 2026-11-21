import assert from "node:assert/strict";
import fs from "node:fs";
import pg from "pg";
import { GET, POST } from "../app/api/pg/route.js";
const checks = [],
  client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  const response = await GET();
  assert.equal(response.status, 200);
  const { rows } = await response.json();
  assert.equal(rows.length, 10000);
  checks.push("snapshot ingest and stable IDs");
  const vector = rows[420].embedding;
  const request = (body) =>
    new Request("http://localhost/api/pg", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  const times = [];
  let neighbors;
  for (let i = 0; i < 20; i++) {
    const start = performance.now();
    const r = await POST(request({ vector }));
    assert.equal(r.status, 200);
    ({ neighbors } = await r.json());
    times.push(performance.now() - start);
  }
  assert.equal(neighbors.length, 20);
  assert.equal(neighbors[0].key, rows[420].id);
  assert.equal(neighbors[0].distance, 0);
  checks.push("live original-space L2 nearest neighbors");
  const plan = await client.query(
    "EXPLAIN (FORMAT JSON) SELECT id FROM embeddings ORDER BY embedding <-> $1::vector LIMIT 20",
    [JSON.stringify(vector)],
  );
  assert.match(JSON.stringify(plan.rows), /embeddings_hnsw/);
  checks.push("planner uses HNSW index");
  assert.equal((await POST(request({ vector: ["bad"] }))).status, 400);
  checks.push("invalid query rejected");
  process.env.PG_TABLE = "embeddings; DROP TABLE embeddings";
  assert.equal((await GET()).status, 400);
  delete process.env.PG_TABLE;
  checks.push("identifier injection rejected");
  const version = await client.query(
    "SELECT version(), (SELECT extversion FROM pg_extension WHERE extname='vector') AS vector_version",
  );
  fs.writeFileSync(
    "results/pg-check.json",
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        passed: true,
        checks,
        n: rows.length,
        d: vector.length,
        versions: version.rows[0],
        routeLatencyMs: times,
        plan: plan.rows,
        note: "Local synthetic integration fixture. Includes connection setup. Not the million-point browser headline.",
      },
      null,
      2,
    ),
  );
  console.log(checks);
} finally {
  await client.end();
}
