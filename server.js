const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const LINKS_FILE = path.join(__dirname, "links.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function readLinks() {
  try { return JSON.parse(fs.readFileSync(LINKS_FILE, "utf8")); }
  catch { return []; }
}

function writeLinks(links) {
  fs.writeFileSync(LINKS_FILE, JSON.stringify(links, null, 2));
}

app.get("/api/links", (req, res) => {
  res.json(readLinks());
});

function normalizeUrl(raw) {
  let url = raw.trim();
  if (!url) return null;
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  try { return new URL(url).href; } catch { return null; }
}

app.post("/api/links", (req, res) => {
  const { url } = req.body;
  const normalized = normalizeUrl(url || "");
  if (!normalized) return res.status(400).json({ error: "invalid url" });
  const links = readLinks();
  links.push(normalized);
  writeLinks(links);
  res.json({ ok: true, url: normalized });
});

app.delete("/api/links/:index", (req, res) => {
  const links = readLinks();
  const i = parseInt(req.params.index);
  if (i < 0 || i >= links.length) return res.status(404).json({ error: "not found" });
  links.splice(i, 1);
  writeLinks(links);
  res.json({ ok: true });
});

app.listen(3000, () => console.log("http://localhost:3000"));