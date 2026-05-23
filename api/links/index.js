const { Redis } = require("@upstash/redis");

function getRedis() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    console.error("Missing KV_REST_API_URL or KV_REST_API_TOKEN env vars");
    return null;
  }
  return new Redis({ url, token });
}

function normalizeUrl(raw) {
  let url = raw.trim();
  if (!url) return null;
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  try { return new URL(url).href; } catch { return null; }
}

async function parseBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", () => {
      try { resolve(JSON.parse(body)); }
      catch { resolve({}); }
    });
  });
}

module.exports = async function handler(req, res) {
  try {
    const redis = getRedis();
    if (!redis) {
      return res.status(500).json({ error: "Storage not configured — set env vars" });
    }

    if (req.method === "GET") {
      const links = await redis.get("links");
      return res.status(200).json(links || []);
    }

    if (req.method === "POST") {
      const body = await parseBody(req);
      const url = body?.url;
      const normalized = normalizeUrl(url || "");
      if (!normalized) return res.status(400).json({ error: "invalid url" });
      const links = (await redis.get("links")) || [];
      links.push(normalized);
      await redis.set("links", links);
      return res.status(200).json({ ok: true, url: normalized });
    }

    if (req.method === "DELETE") {
      const i = parseInt(req.query.index);
      const links = (await redis.get("links")) || [];
      if (isNaN(i) || i < 0 || i >= links.length) return res.status(404).json({ error: "not found" });
      links.splice(i, 1);
      await redis.set("links", links);
      return res.status(200).json({ ok: true });
    }

    res.status(405).end();
  } catch (err) {
    console.error("API error:", err.message);
    res.status(500).json({ error: err.message || "Internal error" });
  }
};