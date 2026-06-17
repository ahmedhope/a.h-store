import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import Database from "better-sqlite3";

const url = process.env.DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("DATABASE_URL and TURSO_AUTH_TOKEN are required");
  process.exit(1);
}

async function main() {
  console.log("Connecting to Turso...");
  const client = createClient({ url, authToken });

  // Step 1: Apply schema
  console.log("Applying schema...");
  const schemaSql = readFileSync("scripts/schema.sql", "utf-8");
  const statements = schemaSql
    .split("\n\n")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    try {
      await client.execute(stmt);
      console.log(`  ✓ ${stmt.slice(0, 50)}...`);
    } catch (err: any) {
      if (err.message?.includes("already exists")) {
        console.log(`  - ${stmt.slice(0, 50)}... (already exists)`);
      } else {
        console.error(`  ✗ ${stmt.slice(0, 50)}...`);
        console.error(`    ${err.message}`);
      }
    }
  }

  // Step 2: Seed data from local SQLite
  console.log("\nSeeding data...");
  const local = new Database("./dev.db");

  const tables = ["AdminUser", "Category", "Product", "Coupon", "SiteSetting"];

  for (const table of tables) {
    const rows = local.prepare(`SELECT * FROM "${table}"`).all() as any[];
    if (rows.length === 0) {
      console.log(`  - ${table}: no data`);
      continue;
    }

    for (const row of rows) {
      const keys = Object.keys(row);
      const values = keys.map((k) => row[k]);
      const placeholders = keys.map(() => "?").join(", ");
      const cols = keys.map((k) => `"${k}"`).join(", ");

      try {
        await client.execute({
          sql: `INSERT INTO "${table}" (${cols}) VALUES (${placeholders})`,
          args: values,
        });
      } catch (err: any) {
        if (err.message?.includes("UNIQUE constraint")) {
          console.log(`  - ${table}: ${row.id || row.code || ""} (already exists)`);
        } else {
          console.error(`  ✗ ${table}: ${err.message}`);
        }
      }
    }
    console.log(`  ✓ ${table}: ${rows.length} rows`);
  }

  local.close();
  client.close();
  console.log("\nDone!");
}

main().catch(console.error);
