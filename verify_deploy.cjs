const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Collect console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  // Track failed network requests (broken images/assets)
  const failedRequests = [];
  page.on('response', response => {
    if (response.status() >= 400) {
      failedRequests.push(`${response.status()} ${response.url()}`);
    }
  });

  // Test About page
  console.log('=== TESTING ABOUT PAGE ===');
  await page.goto('https://meenakshigirish.vercel.app/about', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000); // wait for loading screen

  // Screenshot the about page
  await page.screenshot({ path: 'verify_about.png', fullPage: false });
  console.log('Screenshot saved: verify_about.png');

  // Check navbar styles
  const navStyles = await page.evaluate(() => {
    const header = document.querySelector('header');
    if (!header) return 'NO HEADER FOUND';
    const cs = window.getComputedStyle(header);
    return {
      backgroundColor: cs.backgroundColor,
      backdropFilter: cs.backdropFilter,
      webkitBackdropFilter: cs.webkitBackdropFilter,
      position: cs.position,
      zIndex: cs.zIndex,
      classes: header.className,
      inlineStyle: header.getAttribute('style'),
    };
  });
  console.log('Navbar computed styles:', JSON.stringify(navStyles, null, 2));

  // Check all images on page
  const imageStatus = await page.evaluate(() => {
    const imgs = document.querySelectorAll('img');
    return Array.from(imgs).map(img => ({
      src: img.src,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      loaded: img.complete && img.naturalWidth > 0,
      alt: img.alt,
    }));
  });
  console.log('\nImages on about page:');
  imageStatus.forEach(img => {
    const status = img.loaded ? '✅' : '❌ BROKEN';
    console.log(`  ${status} ${img.src} (${img.naturalWidth}x${img.naturalHeight})`);
  });

  // Check failed requests
  console.log('\nFailed network requests:');
  if (failedRequests.length === 0) {
    console.log('  None');
  } else {
    failedRequests.forEach(r => console.log(`  ❌ ${r}`));
  }

  // Console errors
  console.log('\nConsole errors:');
  if (errors.length === 0) {
    console.log('  None');
  } else {
    errors.forEach(e => console.log(`  ❌ ${e}`));
  }

  // Now scroll down to test navbar blur
  await page.evaluate(() => window.scrollTo(0, 200));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'verify_about_scrolled.png', fullPage: false });
  
  const navStylesScrolled = await page.evaluate(() => {
    const header = document.querySelector('header');
    if (!header) return 'NO HEADER FOUND';
    const cs = window.getComputedStyle(header);
    return {
      backgroundColor: cs.backgroundColor,
      backdropFilter: cs.backdropFilter,
      webkitBackdropFilter: cs.webkitBackdropFilter,
      inlineStyle: header.getAttribute('style'),
    };
  });
  console.log('\nNavbar styles after scroll:', JSON.stringify(navStylesScrolled, null, 2));

  // Test Freelancing page
  console.log('\n=== TESTING FREELANCING PAGE ===');
  const failedRequests2 = [];
  page.on('response', response => {
    if (response.status() >= 400) {
      failedRequests2.push(`${response.status()} ${response.url()}`);
    }
  });
  
  await page.goto('https://meenakshigirish.vercel.app/freelancing', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'verify_freelancing.png', fullPage: false });

  const freelancingImages = await page.evaluate(() => {
    const imgs = document.querySelectorAll('img');
    return Array.from(imgs).map(img => ({
      src: img.src,
      loaded: img.complete && img.naturalWidth > 0,
    }));
  });
  console.log('Images on freelancing page:');
  freelancingImages.forEach(img => {
    const status = img.loaded ? '✅' : '❌ BROKEN';
    console.log(`  ${status} ${img.src}`);
  });

  // Check footer
  console.log('\n=== CHECKING FOOTER ===');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'verify_footer.png', fullPage: false });
  
  const footerImages = await page.evaluate(() => {
    const footer = document.querySelector('footer');
    if (!footer) return ['NO FOOTER FOUND'];
    const imgs = footer.querySelectorAll('img');
    return Array.from(imgs).map(img => ({
      src: img.src,
      loaded: img.complete && img.naturalWidth > 0,
    }));
  });
  console.log('Footer images:');
  footerImages.forEach(img => {
    if (typeof img === 'string') { console.log(`  ${img}`); return; }
    const status = img.loaded ? '✅' : '❌ BROKEN';
    console.log(`  ${status} ${img.src}`);
  });

  await browser.close();
  console.log('\n=== DONE ===');
})();
