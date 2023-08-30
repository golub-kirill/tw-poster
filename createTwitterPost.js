import { TwitterApi } from 'twitter-api-v2';

export default async function createTwittetPost(accounts, imagesInfo) {
    console.log(`Preparing ${accounts.length} accounts to post`);

    for (let index = 0; index < accounts.length; index++) {
        const { appKey, appSecret, accessToken, accessSecret } =
            accounts[index];

        const getMessageText = () => {
            const messageHeader =
                `🔥RETWEET FOR CHAIN REACTION🔥` +
                `\n` +
                `#followback #follow4follow #followme #teamfollowback #autofollow #refollow` +
                `\n`;

            const messageDescription = imagesInfo.description[index + 1]; 

            const indexOfLastSpace = (messageHeader + messageDescription)
                .substring(0, 280)
                .trim()
                .lastIndexOf(' ');

            return (messageHeader + messageDescription)
                .trim()
                .substring(0, indexOfLastSpace);
        };

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
                    text: getMessageText(),
                    media: { media_ids: [mediaId] },
                },
            ]);
        } catch (error) {
            console.log(error);
        }
    }
}
