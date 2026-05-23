import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

function normalizeUrl(raw) {
  let url = raw.trim();
  if (!url) return null;
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  try { return new URL(url).href; } catch { return null; }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const links = await redis.get("links");
    return res.status(200).json(links || []);
  }

  if (req.method === "POST") {
    const url = req.body?.url;
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
    if (i < 0 || i >= links.length) return res.status(404).json({ error: "not found" });
    links.splice(i, 1);
    await redis.set("links", links);
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}