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
    
    console.log("Fetch OK:", response.ok, response.status);
    const html = await response.text();
    console.log("HTML length:", html.length);
    
    const $ = cheerio.load(html);
    const links = [];
    
    // Link Extraction
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && !href.startsWith("#") && !href.startsWith("javascript:") && 
          !href.startsWith("mailto:") && !href.startsWith("tel:")) {
        try {
          const absolute = new URL(href, url).toString();
          links.push(absolute);
        } catch (e) {
          console.error("URL parse error:", e);
        }
      }
    });
    console.log("Extracted links:", links.length);
    if (links.length > 0) {
      console.log("First few links:", links.slice(0, 5));
    }

  } catch (err) {
    console.error("Crawl error:", err);
  }
}

run();
