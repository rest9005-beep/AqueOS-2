export default async function handler(req, res) {
  try {
    const target = req.query.url;
    if (!target || !/^https?:\/\//i.test(target)) {
      res.status(400).send("Bad url. Use /api/proxy?url=https://example.com");
      return;
    }

    const upstream = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      },
      redirect: "follow"
    });

    const contentType = upstream.headers.get("content-type") || "";

    // Proxy non-HTML assets too (images, css, js)
    if (!contentType.includes("text/html")) {
      res.status(upstream.status);
      res.setHeader("Content-Type", contentType);
      res.setHeader("Access-Control-Allow-Origin", "*");
      const buf = Buffer.from(await upstream.arrayBuffer());
      res.send(buf);
      return;
    }

    let html = await upstream.text();

    // Insert <base> for relative URLs
    const baseTag = `<base href="${target}">`;
    if (/<head[^>]*>/i.test(html)) {
      html = html.replace(/<head[^>]*>/i, (m) => `${m}\n${baseTag}\n`);
    } else {
      html = `${baseTag}\n${html}`;
    }

    // Rewrite absolute URLs to go back through the proxy
    html = html.replace(
      /\b(href|src|action)\s*=\s*["'](https?:\/\/[^"']+)["']/gi,
      (m, attr, u) => `${attr}="/api/proxy?url=${encodeURIComponent(u)}"`
    );

    res.status(upstream.status);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(html);
  } catch (e) {
    res.status(500).send("Proxy error: " + String(e?.message || e));
  }
}