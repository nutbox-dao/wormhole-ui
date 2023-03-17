/**
 * Parse twitter data
 */

import { getPageOg } from './ogGetter'
import { getTweetById } from './twitter'

const SpaceRex = /https:\/\/twitter\.com\/i\/spaces\/([0-9a-z-A-Z]+)/
const regex_hive_tag = /#hive-[0-9]{4,7}/
const regex_tweet_link = new RegExp("https://twitter.com/([a-zA-Z0-9\_]+)/status/([0-9]+)[/]?$")

export const getSpaceIdFromUrls = (urls) => {
    if (!urls || urls.length === 0) return null;
    for (let url of urls) {
        if (url.expanded_url === url.unwound_url) {
            const group = url.expanded_url.match(SpaceRex);
            if (group) {
                const spaceId = group[1]
                return spaceId;
            }
        }
    }
}

export function getAuthor(tweet) {
    if ("includes" in tweet && "users" in tweet.includes) {
        return tweet.includes.users.find((user) => tweet.data.author_id == user.id);
    }
    return null;
}

export function getTags(tweet) {
    // get hive tag
    const hive = tweet.data.text.match(regex_hive_tag);
    let hivetag = null;
    if (hive && hive.length > 0) {
        try {
            hivetag = hive[0].trim().substring(1)
        } catch (e) { }
    }
    if ("data" in tweet && "entities" in tweet.data && "hashtags" in tweet.data.entities) {
        let tags = [];
        for (let i in tweet.data.entities.hashtags) {
            if (tweet.data.entities.hashtags[i].tag === 'hive' && hivetag) {
                tags.push(hivetag)
                continue;
            }
            tags.push(tweet.data.entities.hashtags[i].tag);
        }
        if (tags.length > 0) return [...new Set(tags)];// JSON.stringify(tags);
        return ["iweb3"];
    }
    return ["iweb3"];
}

function getRetweetId(tweet) {
    if ("data" in tweet && "entities" in tweet.data && "urls" in tweet.data.entities) {
        for (let url of tweet.data.entities.urls.reverse()) {
            const group = url.expanded_url.match(regex_tweet_link)
            if (!!group) {
                return group[2]
            }
        }
    }
    return null;
}

/**
 * tweet content contains the url which is redirect url transformed by twitter, we change them back to original page
 * @param {*} tweet 
 */
 export function showOriginalUrl(tweet) {
    if ("data" in tweet && "entities" in tweet.data && "urls" in tweet.data.entities) {
        for (let url of tweet.data.entities.urls) {
            if (url.expanded_url.startsWith('https://twitter.com/') || (url.unwound_url && url.unwound_url.startsWith('https://twitter.com/'))) {

            } else {
                tweet.data.text = tweet.data.text.replace(url.url, url.unwound_url ?? url.expanded_url)
                const u = url.unwound_url ?? url.expanded_url;
            }
        }
    }
    return tweet;
}

export function delSelfUrl(tweet) {
    if (tweet.data && tweet.data.entities && tweet.data.entities.urls) {
        for (let u of tweet.data.entities.urls) {
            if (u.expanded_url.indexOf(tweet.data.id) !== -1) {
                tweet.data.text = tweet.data.text.replace(u.url, '')
                return tweet
            }
        }
    }
    return tweet
}

async function fetchPageInfo(tweet, content) {
    if ("data" in tweet && "entities" in tweet.data && "urls" in tweet.data.entities) {
        const ret = tweet.data.entities.urls[tweet.data.entities.urls.length - 1]
        let info = {}
        const retweetId = getRetweetId(tweet);
        if (retweetId) {
            // fetch retweet info
            let retweet;
            try {
                retweet = await getTweetById(retweetId);
            } catch (e) {
                logger.debug('Get tweet fail:', e)
                return [null, {}, content]
            }
            if (!retweet.data) {
                // wrong quote tweet®
                return [null, {}, content]
            }
            retweet = delSelfUrl(retweet)
            retweet = showOriginalUrl(retweet)
            const author = getAuthor(retweet)
            let images = []
            if ("includes" in retweet && "media" in retweet.includes) {
                for (let index in retweet.includes.media) {
                    let media = retweet.includes.media[index];
                    images.push(media.preview_image_url ?? media.url)
                }
            }
            let retweetInfo = {
                id: retweet.data.id,
                text: retweet.data.text,
                createdAt: retweet.data.created_at,
                author,
                images
            }

            info['retweetInfo'] = JSON.stringify(retweetInfo)
            content = content.replace(ret.url, ret.expanded_url)
        } else {
            if (ret.media_key) {
                return [null, info, content]
            }
            // fetch page info
            let pageInfo = await getPageOg(ret.unwound_url ?? ret.expanded_url)
            pageInfo.title = ret.title ?? pageInfo.title;
            pageInfo.description = ret.description ?? pageInfo.description;
            info['pageInfo'] = JSON.stringify(pageInfo)
        }
        return [retweetId, info, content]
    }
    return [null, {}, content];
}

export async function parseTweet(tweet, needQuoteInfo=true) {
    try {
    tweet = delSelfUrl(tweet);
    tweet = showOriginalUrl(tweet);
    let text = tweet.data.text.trim();
    if (!needQuoteInfo) {
        let retweetId = getRetweetId(tweet)
        let tags = getTags(tweet);
        let user = getAuthor(tweet);
        let post = {
            parentTweetId: tweet.data.conversation_id,
            postId: tweet.data.id,
            twitterId: tweet.data.author_id,
            name: user.name,
            username: user.username,
            profileImg: user.profile_image_url.replace('normal', '200x200'),
            verified: user.verified,
            followers: user.public_metrics.followers_count,
            following: user.public_metrics.following_count,
            content: text,
            postTime: tweet.data.created_at,
            tags: JSON.stringify(tags),
            retweetId,
        }

        if ("includes" in tweet && "media" in tweet.includes) {
            for (let index in tweet.includes.media) {
                let media = tweet.includes.media[index];
                post.content += "\n" + (media.url ?? media.preview_image_url);
            }
        }
        return post
    }else {
        let [retweetId, pageInfo, content] = await fetchPageInfo(tweet, text)
        let tags = getTags(tweet);
        let user = getAuthor(tweet);
        let post = {
            parentTweetId: tweet.data.conversation_id,
            postId: tweet.data.id,
            twitterId: tweet.data.author_id,
            name: user.name,
            username: user.username,
            profileImg: user.profile_image_url.replace('normal', '200x200'),
            verified: user.verified,
            followers: user.public_metrics.followers_count,
            following: user.public_metrics.following_count,
            content,
            postTime: tweet.data.created_at,
            tags: JSON.stringify(tags),
            pageInfo: pageInfo.pageInfo,
            retweetInfo: pageInfo.retweetInfo,
            retweetId,
        }
    
        if ("includes" in tweet && "media" in tweet.includes) {
            for (let index in tweet.includes.media) {
                let media = tweet.includes.media[index];
                post.content += "\n" + (media.url ?? media.preview_image_url);
            }
        }
        return post
    }
}catch(e) {
    console.log(661, e);
}
}