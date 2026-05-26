import fs from "fs";

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
    console.log("First 200 chars:", html.substring(0, 200));

    // Now test server function logic
    // We will just print if there's any error
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}

run();
