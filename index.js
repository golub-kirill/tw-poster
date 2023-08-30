import createTwittetPost from './createTwitterPost.js';
import readAccounts from './readAccounts.js';
import scrapImages from './scrapImages.js';

await readAccounts().then(async (accounts) => {
    await scrapImages(accounts.length).then(async (imagesInfo) => {
        imagesInfo !== null && await createTwittetPost(accounts, imagesInfo)
        
    });
});
