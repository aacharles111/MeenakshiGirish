const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Go to About page and scroll to make navbar visible over content
  await page.goto('https://meenakshigirish.vercel.app/about', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  
  // Scroll down so content is behind navbar
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'verify_navbar_blur.png', fullPage: false });

  // Check navbar computed styles
  const styles = await page.evaluate(() => {
    const el = document.querySelector('.navbar');
    if (!el) return 'NO .navbar FOUND';
    const cs = window.getComputedStyle(el);
    return {
      background: cs.background,
      backgroundColor: cs.backgroundColor,
      backdropFilter: cs.backdropFilter,
      webkitBackdropFilter: cs.webkitBackdropFilter,
      classes: el.className,
    };
  });
  console.log('Navbar styles:', JSON.stringify(styles, null, 2));

  // Also fetch the raw CSS to confirm backdrop-filter is in the stylesheet
  const cssContent = await page.evaluate(() => {
    const sheets = document.styleSheets;
    let found = [];
    for (const sheet of sheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText === '.navbar') {
            found.push(rule.cssText);
          }
        }
      } catch(e) {}
    }
    return found;
  });
  console.log('\n.navbar CSS rules in page:', JSON.stringify(cssContent, null, 2));

  await browser.close();
})();
