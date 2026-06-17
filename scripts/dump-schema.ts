import Database from "better-sqlite3";
import { writeFileSync } from "fs";

const db = new Database("./dev.db");
const rows = db.prepare("SELECT sql, name, type FROM sqlite_master WHERE sql IS NOT NULL ORDER BY type DESC, name").all() as any[];
const schema = rows.map((r: any) => r.sql).join("\n\n");
writeFileSync("scripts/schema.sql", schema);
console.log("Schema written to scripts/schema.sql");
console.log(schema);
db.close();
