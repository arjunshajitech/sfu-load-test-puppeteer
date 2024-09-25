const puppeteer = require("puppeteer");

let i = 1;
let pages = [];

const sleep = (time) => {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}
const createBrowser = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--use-fake-device-for-media-stream",
            "--use-fake-ui-for-media-stream",
            "--no-sandbox",
            "--window-size=1280,720",
            "--unsafely-treat-insecure-origin-as-secure=http://192.168.2.107:5173/"
        ],
    });
    return browser;
}

const runTest = async (browser) => {
    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 720 });
        await page.goto("http://192.168.2.107:5173/", { waitUntil: "networkidle0" });
        await page.waitForSelector("#join-conference");
        await page.type("#display-name", "Name_" + i++);
        await page.type("#meeting-id", "123");
        await page.click("#join-conference");
        pages.push(page);
    } catch (err) {
        console.error(`Error during test run: ${err}`);
    }
}

async function startTest() {
    try {
        const browser = await createBrowser();
        for (let j = 1; j <= 10; j++) {
            await runTest(browser);
            await sleep(500);
        }

        await sleep(3600000);
        pages.forEach(async (page) => {
            await page.close();
        });
        await browser.close();
    } catch (error) {
        console.error(`Error during test: ${error}`);
    }
}

startTest();

