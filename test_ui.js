import puppeteer from "puppeteer-core";

async function run() {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));

  await page.goto("http://localhost:8081/");
  await page.waitForSelector("input[placeholder='https://example.com']");
  
  await page.type("input[placeholder='https://example.com']", "https://whanwa.com/");
  
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const startBtn = buttons.find(b => b.innerText.includes('Start Crawl'));
    if (startBtn) startBtn.click();
  });

  await new Promise(r => setTimeout(r, 10000));
  
  const logs = await page.evaluate(() => {
    const logContainer = document.querySelector('.space-y-2');
    if (!logContainer) return [];
    return Array.from(logContainer.querySelectorAll('.flex.gap-4')).map(el => el.innerText);
  });
  console.log("UI Logs:", logs);

  await browser.close();
}
run();
