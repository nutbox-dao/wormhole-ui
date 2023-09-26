
export const SendPwdServerPubKey = '215ae8d490ddbf62242a3cca9849a73df847997f91982d77b9708411e17c647f'
export const ParseKeyNonce = '111111111111111111111111111111111111111111111111'

export const TWITTER_MONITOR_ACCOUNT = '@NutboxDao'
export const TWITTER_MONITOR_RULE = "@wormhole_3"
export const TWITTER_POST_TAG = "%23iweb3"

export const BACKEND_API_URL = 'https://alpha-api.wormhole3.io'
// export const BACKEND_API_URL = 'http://localhost:3100'
// export const BACKEND_API_URL = 'https://api-test.web3id.pro'

export const CURATION_SHORT_URL = 'https://wh3.io/'
// export const CURATION_SHORT_URL = 'https://test.wormhole3.io/#/curation-detail/'

// Google analynize ID
export const GAID = process.env.GAID || 'G-LERTNRZPMF';

export const SignUpMessage = JSON.stringify({
    project: 'wormhole3',
    method: 'create account'
}, null, 4)

// polygon
export const RPC_NODE = 'https://polygon-rpc.com'
export const MultiAddress = "0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507"
export const CHAIN_NAME = 'Polygon'
export const CHAIN_ID = 137
export const MainToken = {
    name: 'MATIC',
    symbol: 'MATIC',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
    decimals: 18
}

export const BLOCK_CHAIN_BROWER = 'https://polygonscan.com';

export const SteemScan = 'https://ecosynthesizer.com/steem/'

/**
 * ERROR CODE DEFINE
 */
 export const errCode = {
    NO_STAKING_FACTORY: 101,
    ASSET_ID_ERROR: 102,
    WRONG_ETH_ADDRESS: 103,
    NOT_A_TOKEN_CONTRACT: 104,
    TRANSACTION_FAIL: 105,
    ASSET_EXIST: 106,
    TOKEN_DEPLOYING: 107,
    INSUFIENT_BALANCE: 108,
    LARGE_IMG: 109,
    OUT_OF_USAGE: 110,
    UPLOAD_FAIL: 111,

    INSUFFICIENT_RC: 307,
    INSUFFICIENT_VP: 308,
    BLOCK_CHAIN_ERR: 351,
    CONTRACT_CREATE_FAIL: 352,
    USER_CANCEL_SIGNING: 353,
    NOT_CONNECT_METAMASK: 354,
    UNLOCK_METAMASK: 355,
    WRONG_CHAIN_ID: 356,
    HAVE_CREATED_COMMUNITY: 357,

    SIGNATURE_FAILED: 451,
    INVALID_NONCE: 452,
    DB_ERROR: 453,

    SERVER_ERR: 500,
    TWITTER_ERROR:  505,
    USER_NOT_REGISTERED: 508,
    USER_ORDER_PENDING: 509,
    NO_REWARD_TO_CLAIM: 510,

    TWEET_NOT_FOUND: 701
  };

// reputation NFT configs
export const REPUTATION_NFT = '0x383870Ae4E834155192cEce2fb5B0528CE0790E9'
export const REPUTATION_NFT_RPC = RPC_NODE
export const REPUTATION_NFT_ID = 1;

export const LIQUIDATION_NFT = '0x3724E11f09cF1D690f0Cfe9874108bC0F1DC7AbC';

export const CURATION_FUND_CONTRACT = '0x525B88B649F5c8AD225122F8fe6e9304e9d54000';

export const AutoCurationContract = '0x9B43E8015CB8B4a5F4C11d48fD299a27f2b01b09'

export const Multi_Config = {
    rpcUrl: RPC_NODE,
    multicallAddress: MultiAddress,
    interval: 3000,
}

export const followUrl = 'https://twitter.com/intent/follow?screen_name=GameBoyNFTs'

/**
 * ignore steem id's post
 * only showing steem link
 */
export const IgnoreAuthor = [
    'greattranslatcn',
    'democretard',
    'Mydoglucky2',
    'Lawrenc09874431',
    '1180358936249032704',
    '1485658668259770370',
    '1443781057703145473',
    '903140569685270528',
    '1596918985609601024',
    '1628853473193369600',
    '1639196064275382274',
    "1661652520207536128",
    '1062560079847682048',
    '1608018167049355265'
]

export const STELLAR_TREK_NFT = [
    {
        id: 21,
        name: "Tweet on chain",
        description: "Tweet with #iweb3, #StellarTrek and #postonchain hashtags; Go to the Wormhole3 square page and screenshot this linked post and tweet again with @Wormhole3.",
        image: "https://gateway.nutbox.app/ipfs/QmcuJyKGuSfSh7SQgKhvympxUPQmix4mwKzymBJ68w21Su"
    },
    {
        id: 22,
        name: "Tip on Twitter",
        description: "Tip your friends who have also registered Wormhole3 with a tweet with the hashtags #iweb3 #StellarTrek and #Wormhole3Tips",
        image: "https://gateway.nutbox.app/ipfs/QmXJ7PA1QoY4tVNEwSAQ24sgB9t8y4yAZd7y1q2rGMYTFd"
    },
    {
        id: 23,
        name: "Show off your Twitter Reputation NFT",
        description: "After successfully registering Wormhole3，view your Wormhole3 Twitter Reputation NFT and post a screenshot of @wormhole3 with the hashtag #iweb3 #StellarTrek and #Wormhole3NFT",
        image: "https://gateway.nutbox.app/ipfs/Qme5HKeFGq2FshSUcp2EpmjE154tfrGdWciXydK98oMQ67"
    },
    {
        id: 24,
        name: "Get upvotes",
        description: "Send a tweet that you think is awesome and ask your friends to like it with @wormhole3. Wormhole3 officials will like it in turn, and you can check the revenue from the likes on Wormhole3's page. Tweet a screenshot of the revenue from the tweet with the hashtag #iweb3 #StellarTrek#getupvotes",
        image: "https://gateway.nutbox.app/ipfs/QmYtYPSuFBFfHsR9AejQfRDbRDCeebkaEagEVG4r3Drwvj"
    },
    {
        id: 25,
        name: "Tagverse",
        description: "Every Stellar Treker can build your own or desired hashtag to build your on-chain community. Create your own hashtag and tweet it as #tag [explanation of tag] @Wormhole3 with the hashtag #iweb3 #StellarTrek #tagverse",
        image: "https://gateway.nutbox.app/ipfs/QmVgNBvePgRzyBN91zDBnA3JNWqPqrHQ5L9spnswLjyP7j"
    },
    {
        id: 26,
        name: "Show off your assets",
        description: "After the user participated in some StellarTrek activities and project side ecological activities, he/she got some NFTS and tokens, and tweeted the FT and NFT assets with the hashtag #iweb3 #StellarTrek#Wormhole3Assets",
        image: "https://gateway.nutbox.app/ipfs/QmY2Zu8zNWyCQqwKTRwysnRYjinuimv7vaUyiF5V7L4jfZ"
    },
    {
        id: 27,
        name: 'Twitter Space Attendance',
        description: "Join Twitter Space hosted by Wormhole3 official, earn the NFT according to the rules of each Twitter Space.",
        image: "https://gateway.nutbox.app/ipfs/QmUK3RvGfS5iqAsbvzfyDvQZc24SCSq7PsUt7AGmqPsg1N"
    }
]

export const WC2022_NFT = [
    {
        id: 31,
        name: "World Cup Qatar 2022 - NLD vs USA",
        description: `#NetherlandsWin or #USAWin 
        Guess what will be the result of the match and win a prize from the Wormhole3 World Cup 2022 Campaign.`,
        image: "https://gateway.nutbox.app/ipfs/QmPChzXtjmVsuAmFDPsDT1DYNK7YWWF7U6rZGRGdHYSG58"
    },
    {
        id: 32,
        name: "World Cup Qatar 2022 - ARG vs AUS",
        description: `#ArgentinaWin or #AustraliaWin 
        Guess what will be the result of the match and win a prize from the Wormhole3 World Cup 2022 Campaign.`,
        image: "https://gateway.nutbox.app/ipfs/QmXj5BSZ3Lgt2mHn6S9taPSgBT1wbkNQaQ47nqSMgRjXUx"
    },
    {
        id: 33,
        name: "World Cup Qatar 2022 - FRA vs POL",
        description: `#FranceWin or #PolandWin
        Guess what will be the result of the match and win a prize from the Wormhole3 World Cup 2022 Campaign.`,
        image: "https://gateway.nutbox.app/ipfs/QmYLjju14Rg44yZxUbuPNapTBGHEwvbV8DuB7CiyqQkTvS"
    },
    {
        id: 34,
        name: "World Cup Qatar 2022 - GBR vs SEN",
        description: `#EnglandWin or #SenegalWin
        Guess what will be the result of the match and win a prize from the Wormhole3 World Cup 2022 Campaign.`,
        image: "https://gateway.nutbox.app/ipfs/QmRfedDQ6aWFt6XLBBzPU1iNZPVfyEnVH5KmKiwvAQGhpp"
    },
    {
        id: 35,
        name: "World Cup Qatar 2022 - JPN vs HRV",
        description: `#JapanWin or #CroatiaWin
        Guess what will be the result of the match and win a prize from the Wormhole3 World Cup 2022 Campaign.`,
        image: "https://gateway.nutbox.app/ipfs/QmSLfgdUbpn5axHVowrBs1CVgDQX3BgyRhFJ5hsQ5WPbUV"
    },
    {
        id: 36,
        name: "World Cup Qatar 2022 - BRA vs KOR",
        description: `#BrazilWin or #SouthKoreaWin
        Guess what will be the result of the match and win a prize from the Wormhole3 World Cup 2022 Campaign.`,
        image: "https://gateway.nutbox.app/ipfs/QmaaiGHWsPEGqP67TP9bozuXHRGd7X9XCLhA2SfjCQzESW"
    },
    {
        id: 37,
        name: "World Cup Qatar 2022 - MAR vs ESP",
        description: `#MoroccoWin or #SpainWin
        Guess what will be the result of the match and win a prize from the Wormhole3 World Cup 2022 Campaign.`,
        image: "https://gateway.nutbox.app/ipfs/QmZqDJUfaRqZWaaCqRSczyxPuoPy2hxuZrvymVaNnTBdgJ"
    },
    {
        id: 38,
        name: "World Cup Qatar 2022 - PRT vs CHE",
        description: `#PortugalWin or #SwitzerlandWin
        Guess what will be the result of the match and win a prize from the Wormhole3 World Cup 2022 Campaign.`,
        image: "https://gateway.nutbox.app/ipfs/QmbEqrXDaX1Pa31eQmpubY89zApmcjgKT7HCWpjT2gzeQf"
    },
    {
        id: 39,
        name: "World Cup Qatar 2022 - HRV vs BRA",
        description: `#CroatiaWin or #BrazilWin
        Guess what will be the result of the match and win a prize from the Wormhole3 World Cup 2022 Campaign.`,
        image: "https://gateway.nutbox.app/ipfs/Qme6CgHaU6kqvC7qJb4dbGTmJ8cNQcquZQefSCABy7eHzU"
    },
    {
        id: 40,
        name: "World Cup Qatar 2022 - NLD vs ARG",
        description: `#NetherlandsWin or #ArgentinaWin
        Guess what will be the result of the match and win a prize from the Wormhole3 World Cup 2022 Campaign.`,
        image: "https://gateway.nutbox.app/ipfs/QmdJXsqYHgVe1Hr9rxmrnSVtE9fcsWLrsuEEFPSiKrxmra"
    },
    {
        id: 41,
        name: "World Cup Qatar 2022 - MAR vs PRT",
        description: `#MoroccoWin or #PortugalWin
        Guess what will be the result of the match and win a prize from the Wormhole3 World Cup 2022 Campaign.`,
        image: "https://gateway.nutbox.app/ipfs/QmYGoK7oJyBrPssMiUiojNbJdq9kXZExyukorx4rf3n3ad"
    },
    {
        id: 42,
        name: "World Cup Qatar 2022 - GBR vs FRA",
        description: `#EnglandWin or #FranceWin
        Guess what will be the result of the match and win a prize from the Wormhole3 World Cup 2022 Campaign.`,
        image: "https://gateway.nutbox.app/ipfs/QmdR6SpJC7A7sanVqEjVif8TAjLGGmnyTMjK43UzoBtfda"
    },
    {
        id: 43,
        name: "World Cup Qatar 2022 - ARG vs HRV",
        description: `#ArgentinaWin or #CroatiaWin
        Guess what will be the result of the match and win a prize from the Wormhole3 World Cup 2022 Campaign.`,
        image: "https://gateway.nutbox.app/ipfs/QmZbB5uZRYLk6WRwuEPLryvNnv6wxFt1yA2yue5f7rr5cn"
    },
    {
        id: 44,
        name: "World Cup Qatar 2022 - FRA vs MAR",
        description: `#FranceWin or #MoroccoWin
        Guess what will be the result of the match and win a prize from the Wormhole3 World Cup 2022 Campaign.`,
        image: "https://gateway.nutbox.app/ipfs/QmSGZB9uUYELfDcGwhZL3TdFWNT9mckBRcQa1KWNUvVdpo"
    },
    {
        id: 45,
        name: "World Cup Qatar 2022 - HRV vs MAR The 3rd Place Match",
        description: `#CroatiaWin or #MoroccoWin
        Guess what will be the result of the match and win a prize from the Wormhole3 World Cup 2022 Campaign.`,
        image: "https://gateway.nutbox.app/ipfs/QmNcdfu6zY6AHBVGt6g4vG69abB7pVrF4MfnojE3851sSN"
    },
    {
        id: 46,
        name: "World Cup Qatar 2022 - FRA vs ARG Final Championship",
        description: `#FranceWin or #ArgentinaWin 
        Guess what will be the result of the match and win a prize from the Wormhole3 World Cup 2022 Campaign.`,
        image: "https://gateway.nutbox.app/ipfs/QmYM8L2WXvGnRYBur9r7QwVXBydvRz2AFZForWD7xBsvaE"
    }
]

export const Christmas_NFT = [
    {
        id: 50,
        name: "Christmas NFT",
        description: `2022 Christmas Campaign`,
        image: "https://gateway.nutbox.app/ipfs/QmVudQSy1hvGgigAvZtP1x7qj6Vg6j7WD8bJykG8pg6WKF"
    },
]

export const Curator_NFT = {
        id: 2,
        name: "Curator NFT",
        description: `Certified curator: The owner of this NFT can curate any post to wormhole3 without input any tokens as rewards.`,
        image: "https://gateway.nutbox.app/ipfs/QmdZH2BuwbFiuhtk16FTosvrW3DL4AXNfKgrSgyfqjW3wW"
    }


// vp consume
export const VP_CONSUME = Object.freeze({
    QUOTE: 20,
    RETWEET: 15,
    LIKE: 3,
    COMMENT: 5,
});
// rc consume
export const RC_CONSUME = Object.freeze({
    POST: 200,
    QUOTE: 20,
    RETWEET: 15,
    COMMENT: 5,
    LIKE: 3,
    TIP: 5,
    FOLLOW: 5
});

export const MAX_VP = 200;
export const VP_RECOVER_DAY = 3;

export const MAX_RC = 2000;
export const RC_RECOVER_DAY = 3;
