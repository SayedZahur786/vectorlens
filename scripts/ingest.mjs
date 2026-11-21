// Convert newline-delimited embedding objects or a plain numeric CSV to validated JSON.
import fs from "node:fs";
import { validate } from "../lib/engine.mjs";
const [input, output] = process.argv.slice(2);
if (!input || !output)
  throw Error("Usage: node scripts/ingest.mjs input.jsonl|csv output.json");
const text = fs.readFileSync(input, "utf8").trim();
const rows = input.endsWith(".csv")
  ? text.split(/\r?\n/).map((line) =>
      line.split(",").map((x) => {
        if (!x.trim()) throw Error("Empty CSV field");
        return Number(x);
      }),
    )
  : text.split(/\r?\n/).map((line) => JSON.parse(line));
validate(rows);
fs.writeFileSync(output, JSON.stringify(rows));
console.log(`Validated ${rows.length} embeddings → ${output}`);
