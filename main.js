const puppeteer = require('puppeteer');

var i = 0;

function sleep(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

async function createBrowser() {
    const browser = await puppeteer.launch({
        headless: false,
        ignoreHTTPSErrors: true,
        args: [
            '--use-fake-device-for-media-stream',
            '--use-fake-ui-for-media-stream',
            '--no-sandbox',
            '--window-size=1280,720',
            '--unsafely-treat-insecure-origin-as-secure=http://192.168.2.107:5173/'
        ],
    });
    return browser;
}

async function runTest(browser) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto('http://192.168.2.107:5173/');
    await page.waitForSelector('#join-conference');
    await page.locator('#display-name').fill('A' + i++);
    await page.locator('#meeting-id').fill('a');
    await page.locator('#join-conference').click();
}
async function test() {
    const browser = await createBrowser();
    for (let j = 0; j < 10; j++) {
        await runTest(browser);
    }
    await sleep(60 * 10 * 1000)
    await browser.close();
}

test();