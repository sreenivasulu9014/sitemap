import * as cheerio from "cheerio";

async function run() {
  const url = "https://whanwa.com/";
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": 'Mozilla/5.0 (compatible; SitemapGenerator/2.5; +https://xmlsitemaps.pro/bot)',
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      },
      redirect: 'follow'
    });
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const images = [];
    $('img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      if (src) {
        try {
          images.push({
            loc: src.startsWith('http') ? src : new URL(src, url).toString(),
            caption: $(el).attr('alt') || "",
            title: $(el).attr('title') || ""
          });
        } catch {}
      }
    });

    console.log("Images count:", images.length);
    console.log("Images total size (approx JSON bytes):", JSON.stringify(images).length);

  } catch (err) {
    console.error("Crawl error:", err);
  }
}

run();
