import puppeteer from "puppeteer-core";
import fs from "fs";

async function run() {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto("http://localhost:8081/");
  
  // wait for input
  await page.waitForSelector("input");
  await page.type("input", "https://whanwa.com/");
  
  // wait for button and click
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const startBtn = buttons.find(b => b.innerText.includes('Start Crawl'));
    if (startBtn) startBtn.click();
  });

  // wait until "Reset Scanner" button appears or error is logged
  await new Promise(r => setTimeout(r, 15000));
  
  const logs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.space-y-2 > div')).map(el => el.innerText);
  });
  console.log("UI Logs:", logs);
  
  await page.screenshot({ path: "test_screenshot.png" });

  await browser.close();
}
run();
