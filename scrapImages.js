import puppeteer from 'puppeteer-extra';
import stealthplugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import sharp from 'sharp';

puppeteer.use(stealthplugin());
const browser = await puppeteer.launch();

const assetsDir = './assets';
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
} 

export default async function scrapImages(imagesCount) {
    try {
        const page = await browser.newPage();
        await page.goto('https://www.midjourney.com/showcase/recent/', {
            waitUntil: 'networkidle2',
            timeout: 10000,
        });

        const imagesInfo = await page.evaluate(() => {
            const imgs = Array.from(
                document.querySelectorAll('img[data-job-type="v5_upscale"]')
            );
            const srcs = imgs.map((img) => img.src);
            const description = imgs.map((img) => img.alt);
            return { srcs, description };
        });

        for (let i = 0, j = 0; i < imagesInfo.srcs.length && j < imagesCount; i++) {
            // Переходим на URL изображения
            await page.goto(imagesInfo.srcs[i], {
                waitUntil: 'networkidle2',
                timeout: 10000,
            });

            await page.waitForSelector('img', {
                visible: true,
            });

            const width = await page.evaluate(() => {
                return document.querySelector('img').width;
            });

            const height = await page.evaluate(() => {
                return document.querySelector('img').height;
            });
            console.log(`Trying ${i+1} image of ${imagesInfo.srcs.length}`);
            if (width >= 380 && height >= 380) {
                page.setViewport({ width, height });

                await page.screenshot({
                    path: `${assetsDir}/${j + 1}.webp`,
                    type: 'webp',
                    quality: 100,
                    fullPage: true,
                });

                console.log(
                    `Image ${i + 1} has width ${width} and height ${height}`
                );

                await sharp(`${assetsDir}/${j + 1}.webp`)
                    .resize(900, 1600, {
                        fastShrinkOnLoad: true,
                        kernel: sharp.kernel.nearest,
                    })

                    .webp({ lossless: true, quality: 100 })
                    .toFile(`${assetsDir}/res${j + 1}.webp`)
                    .then(() => {
                        console.log(`Image ${j + 1} resized`);
                        j++;
                    });
                    
            }
        }

        return imagesInfo;

    } catch (error) {
        console.log(error);
    } finally {
        browser.close();
    }
}
