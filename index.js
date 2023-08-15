import createTwittetPost from './createTwitterPost.js';
import readAccounts from './readAccounts.js';
import scrapImages from './scrapImages.js';



const accounts = await readAccounts();
const imagesInfo = await scrapImages(accounts.length);

await createTwittetPost(accounts, imagesInfo);
