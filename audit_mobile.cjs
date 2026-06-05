const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } }); // iPhone 14

  const pages = [
    { name: 'home', url: 'https://meenakshigirish.com/' },
    { name: 'about', url: 'https://meenakshigirish.com/about' },
    { name: 'freelancing', url: 'https://meenakshigirish.com/freelancing' },
    { name: 'book', url: 'https://meenakshigirish.com/the-book' },
    { name: 'speaking', url: 'https://meenakshigirish.com/speaking' },
    { name: 'contact', url: 'https://meenakshigirish.com/contact' },
  ];

  for (const p of pages) {
    console.log(`Capturing ${p.name}...`);
    await page.goto(p.url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `mobile_${p.name}_top.png`, fullPage: false });
    
    // Scroll to middle
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.3));
    await page.waitForTimeout(500);
    await page.screenshot({ path: `mobile_${p.name}_mid.png`, fullPage: false });
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.7));
    await page.waitForTimeout(500);
    await page.screenshot({ path: `mobile_${p.name}_bot.png`, fullPage: false });
  }

  await browser.close();
  console.log('Done! All mobile screenshots captured.');
})();
