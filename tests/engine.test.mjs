import { test } from "node:test";
import assert from "node:assert/strict";
import { fixture, Index, topK, validate, inside } from "../lib/engine.mjs";
test("ANN full candidate window equals exact L2 including external queries", () => {
  const data = fixture(200, 8),
    index = new Index(data, 8),
    q = Array(8).fill(0.4);
  assert.deepEqual(
    index.search(q, 10, 200).neighbors,
    topK(
      data,
      8,
      q,
      Array.from({ length: 200 }, (_, i) => i),
      10,
    ),
  );
});
test("validation rejects malformed inputs", () => {
  for (const rows of [[], [[1], [1, 2]], [[Infinity]], [[null]]])
    assert.throws(() => validate(rows));
  assert.equal(validate([{ embedding: [1, 2], id: "a" }]).labels[0], "a");
});
test("query validates dimensions and finite values", () => {
  const index = new Index(fixture(30, 4), 4);
  assert.throws(() => index.search([1]));
  assert.throws(() => index.search([1, 2, 3, NaN]));
});
test("lasso includes interior and excludes exterior", () => {
  assert.equal(
    inside(1, 1, [
      [0, 0],
      [2, 0],
      [2, 2],
      [0, 2],
    ]),
    true,
  );
  assert.equal(
    inside(3, 1, [
      [0, 0],
      [2, 0],
      [2, 2],
      [0, 2],
    ]),
    false,
  );
});
