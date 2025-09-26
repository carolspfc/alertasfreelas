const express = require("express");
const fetch = require("node-fetch");
const Database = require("better-sqlite3");
const path = require("path");
const { CronJob } = require("cron");

const db = new Database("./jobs.db");
db.prepare(`
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    source TEXT,
    title TEXT,
    company TEXT,
    location TEXT,
    tags TEXT,
    url TEXT,
    created_at TEXT,
    raw JSON
  )
`).run();

const upsert = db.prepare(`
  INSERT OR REPLACE INTO jobs 
  (id, source, title, company, location, tags, url, created_at, raw) 
  VALUES (@id, @source, @title, @company, @location, @tags, @url, @created_at, @raw)
`);

async function fetchRemoteOK() {
  try {
    const res = await fetch("https://remoteok.io/api");
    const data = await res.json();
    for (const item of data) {
      if (!item || !item.id) continue;
      const job = {
        id: `remoteok_${item.id}`,
        source: "remoteok",
        title: item.position || item.title || "",
        company: item.company || "",
        location: item.location || (item.remote ? "Remote" : ""),
        tags: (item.tags || []).join(","),
        url: item.url || item.link || "",
        created_at: item.date || new Date().toISOString(),
        raw: JSON.stringify(item),
      };
      upsert.run(job);
    }
    console.log("RemoteOK atualizado:", new Date().toISOString());
  } catch (e) {
    console.error("Erro RemoteOK:", e.message);
  }
}

new CronJob("*/10 * * * *", fetchRemoteOK, null, true, "America/Sao_Paulo");

const app = express();

app.get("/api/jobs", (req, res) => {
  const q = req.query.q || "";
  const stmt = db.prepare(
    "SELECT id,source,title,company,location,tags,url,created_at FROM jobs WHERE title LIKE '%'||?||'%' OR tags LIKE '%'||?||'%' ORDER BY created_at DESC LIMIT 100"
  );
  res.json(stmt.all(q, q));
});

app.use(express.static(path.join(__dirname, "frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando em http://localhost:${PORT}`));
