const path = require("path");
const Database = require("better-sqlite3");
const d = new Database(path.join(__dirname, "..", "dev.db"));
const tables = d.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
console.log("Tables:", tables.map(r => r.name));
const siteSetting = d.prepare("SELECT * FROM SiteSetting").all();
console.log("SiteSetting row count:", siteSetting.length);
console.log("Rows:", siteSetting.map(r => r.key).join(", "));
d.close();
