
const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox']
    });
    const [page] = await browser.pages();
    await page.goto('https://google.com', {
        timeout: 90000,
    });
    await browser.close();

    console.log(page.content);
})();