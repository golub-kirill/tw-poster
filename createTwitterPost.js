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

            const messageDescription = imagesInfo.description[index-1];

            const indexOfLastSpace = (messageHeader + messageDescription).substring(0, 280).trim().lastIndexOf(' ');

            return (messageHeader + messageDescription).trim().substring(0, indexOfLastSpace);
        };
        // const messageText =
        //     `🔥RETWEET FOR CHAIN REACTION🔥` +
        //     `\n` +
        //     `#followback #follow4follow #followme #teamfollowback #autofollow #refollow` +
        //     `\n` +
        //     `${trimStringToLast(imagesInfo.description[index])}`;
        //
        //         function trimStringToLast(messageText) {
        //             let index = messageText.lastIndexOf(' ');
        //             while (index >= 160) {
        //                 console.log('Last index: ' + index)
        //                 const newIndex = messageText.slice(0, index-2).trim().lastIndexOf(' ');
        //                 console.log('Trimmed, new last index: ' + newIndex)
        //
        //                 return messageText.slice(0, newIndex).trim()
        //             }
        //             return messageText.slice(0, index).trim();
        //         }

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
