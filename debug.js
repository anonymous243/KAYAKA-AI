const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  // Listen to all console logs
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });

  page.on('pageerror', err => {
    console.log('UNHANDLED EXCEPTION:', err.message);
  });

  // Navigate to local dev server
  await page.goto('http://localhost:5174/');
  
  // Fake login session to bypass auth
  await page.evaluate(() => {
    localStorage.setItem('kayaka_ai_user_cache', JSON.stringify({id: '123', email: 'test@test.com'}));
  });
  
  // Reload so authStore picks it up
  await page.goto('http://localhost:5174/dashboard', { waitUntil: 'networkidle2' });
  
  console.log('Looking for upload link...');
  try {
    const uploadLink = await page.$('a[href="/upload"]');
    if (uploadLink) {
      console.log('Clicking upload...');
      await uploadLink.click();
      await page.waitForTimeout(2000);
    } else {
      console.log('Upload link not found!');
    }
    
    // Also try checking checkout directly
    await page.goto('http://localhost:5174/checkout', { waitUntil: 'networkidle2' });
    
  } catch (err) {
    console.log('Script Error:', err);
  }
  
  await browser.close();
})();
