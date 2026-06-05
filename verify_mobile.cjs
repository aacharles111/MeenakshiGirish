const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  const pages = [
    { name: 'home', url: 'https://meenakshigirish.com/' },
    { name: 'about', url: 'https://meenakshigirish.com/about' },
    { name: 'freelancing', url: 'https://meenakshigirish.com/freelancing' },
    { name: 'contact', url: 'https://meenakshigirish.com/contact' },
  ];

  for (const p of pages) {
    console.log(`Capturing ${p.name}...`);
    await page.goto(p.url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `verify_mobile_${p.name}_top.png`, fullPage: false });

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.4));
    await page.waitForTimeout(500);
    await page.screenshot({ path: `verify_mobile_${p.name}_mid.png`, fullPage: false });
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.75));
    await page.waitForTimeout(500);
    await page.screenshot({ path: `verify_mobile_${p.name}_bot.png`, fullPage: false });
  }

  await browser.close();
  console.log('Done!');
})();
