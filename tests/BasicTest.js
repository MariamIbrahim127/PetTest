const { chromium } = require('playwright');

(async () => {
    // Launch a new browser instance
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to a website
    await page.goto('https://example.com');

    // Take a screenshot
    await page.screenshot({ path: `example.png` });

    // Close the browser
    await browser.close();
})();
