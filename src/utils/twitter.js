import { Client } from 'twitter-api-sdk'
import store from '@/store'
import { refreshToken } from '@/utils/account'

async function checkAccessToken() {
    let acc = store.getters.getAccountInfo;
    if (acc && acc.accessToken) {
        const { expiresAt } = acc;
        if (expiresAt - new Date().getTime() < 600000) {
            // refresh token 
            try {
                await refreshToken();
                acc = store.getters.getAccountInfo;
            }catch(e) {
                throw 'log out';
            }
        }
        return acc.accessToken
    }else {
        // need auth again
        throw 'log out';
    }
}

export const getTweetById = async (tweetId) => {
    console.log(1);
    const accessToken = await checkAccessToken();
    console.log(2);
    const client = new Client(accessToken);
    console.log(3);
    const tweet = await client.tweets.findTweetById('1590465906039091201');
    const dd = await client.users.usersIdFollow('sdf', {
        target_user_id: ''
    })
    // like a tweet
    client.tweets.usersIdLike('adff', {
        tweet_id: ''
    })

    // wheather user liked tweet
    client.tweets.usersIdLikedTweets('2355', {

    })

    // wheather user follow someone
    client.users.usersIdFollowing('23455', {
        max_results: 23,
        "user.fields": ['created_at'],
        "tweet.fields": ['author_id'],
        pagination_token: '',
        
    }, '45',
    )
    console.log(234, tweet, dd);
}