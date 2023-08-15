import { TwitterApi } from 'twitter-api-v2';

export default async function createTwittetPost(accounts, imagesInfo) {
    console.log(`Preparing ${accounts.length} accounts to post`);

    for (let index = 0; index < accounts.length; index++) {
        const { appKey, appSecret, accessToken, accessSecret } =
            accounts[index];
        const messageText =
            `🔥RETWEET FOR CHAIN REACTION🔥` +
            `\n` +
            `#followback #follow4follow #followme #teamfollowback #autofollow #refollow` +
            `\n` +
            `${trimStringToLastComma(imagesInfo.description[index])}`;

        function trimStringToLastComma(messageText) {
            let index = messageText.lastIndexOf(' ');
            if (index >= 70) {
                index =-1;
                return messageText.slice(0, index).trim();
            }
            return messageText.slice(0, index).trim();
        }

        console.log(`Sending tweet to ${accounts[index].id}`);

        try {
            const userClient = new TwitterApi({
                appKey,
                appSecret,
                accessToken,
                accessSecret,
            });

            const client = userClient.readWrite;

            const mediaId = await client.v1.uploadMedia(
                `assets/res${index + 1}.webp`
            );

            await client.v2.tweetThread([
                {
                    text: messageText,
                    media: { media_ids: [mediaId] },
                },
            ]);
        } catch (error) {
            console.log(error);
        }
    }
}
