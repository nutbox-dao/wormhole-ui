
export const SendPwdServerPubKey = '215ae8d490ddbf62242a3cca9849a73df847997f91982d77b9708411e17c647f'
export const ParseKeyNonce = '111111111111111111111111111111111111111111111111'
export const BEARER_TOKEN = process.env.VUE_APP_BEARER_TOKEN

export const TWITTER_MONITOR_ACCOUNT = '@NutboxDao'
export const TWITTER_MONITOR_RULE = "@wormhole_3"
export const TWITTER_POST_TAG = "%23iweb3"

export const BACKEND_API_URL = 'https://alpha-api.wormhole3.io'
// export const BACKEND_API_URL = 'http://localhost:3100'

// bsc net
// export const RPC_NODE = 'https://bsc-dataseed.binance.org'
// export const MultiAddress = "0x41263cba59eb80dc200f3e2544eda4ed6a90e76c"
// export const CHAIN_NAME = 'BSC Mainnet'
// export const CHAIN_ID = 56
// export const MainToken = {
//     name: 'BNB',
//     symbol: 'BNB',
//     icon: 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png',
//     decimals: 18
// }
// export const BLOCK_CHAIN_BROWER = 'https://bscscan.com/';

// bsc test
// export const RPC_NODE = 'https://data-seed-prebsc-1-s1.binance.org:8545'
// export const MultiAddress = "0xae11C5B5f29A6a25e955F0CB8ddCc416f522AF5C"
// export const CHAIN_NAME = 'BSC Testnet'
// export const CHAIN_ID = 97
// export const MainToken = {
//     name: 'BNB',
//     symbol: 'BNB',
//     icon: 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png',
//     decimals: 18
// }
// export const BLOCK_CHAIN_BROWER = 'https://bscscan.com/';

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

// eth
// export const RPC_NODE = 'https://mainnet.infura.io/v3/0573c5d2e8c54ed79669b80cb3b78978'
// export const MultiAddress = '0xeefba1e63905ef1d7acba5a8513c70307c1ce441'
// export const BSC_CHAIN_ID = 1
// export const MainToken = {
//     name: 'Ethereum',
//     symbol: 'ETH',
//     icon: 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x2170Ed0880ac9A755fd29B2688956BD959F933F8/logo.png',
//     decimals: 18
// }

// polygon
export const ERC20List = [
    {symbol: 'TEST-U', name: 'TEST USDT', address: '0x4cF89A27A27425d81C49c0B345e58A18De8A7273', decimals: 18, icon: 'https://cdn.wherein.mobi/wormhole3/logo/t-usdt.png'},
    {symbol: 'USDT', name: 'Tether USD', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6, icon: 'https://cdn.wherein.mobi/wormhole3/logo/usdt.png'},
    {symbol: 'USDC', name: 'USD Coin', address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', decimals: 6, icon: 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d/logo.png'},
    // {symbol: 'UNI', name: "Uniswap", address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', decimals: 18, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png'}
]

export const TokenIcon = {
    'ETH': 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x2170Ed0880ac9A755fd29B2688956BD959F933F8/logo.png',
    'BNB': 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
    'USDT': 'https://cdn.wherein.mobi/wormhole3/logo/usdt.png',
    'TEST-U': 'https://cdn.wherein.mobi/wormhole3/logo/t-usdt.png',
    'USDC': 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d/logo.png',
    'UNI': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png',
    'BUSD': 'https://s2.coinmarketcap.com/static/img/coins/64x64/4687.png',
    'MATIC': 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png'
}

export const TokenName = {
    'ETH': 'Ethereum',
    'BNB': 'BSC Token',
    'USDT': 'Tether USD',
    'USDC': 'USD Coin',
    'UNI': 'Uniswap',
    'BUSD': 'BSC-USD',
    'MATIC': 'Polygon',
    'TEST-U': 'TEST USDT'
}

/**
 * EVM Chains
 */
export const EVM_CHAINS = {
    // ETH: {
    //     rpc: "https://mainnet.infura.io/v3/0573c5d2e8c54ed79669b80cb3b78978",
    //     scan: 'https://etherscan.io/',
    //     id: 1,
    //     main: {
    //         name: 'Ethereum',
    //         symbol: 'ETH',
    //         icon: 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x2170Ed0880ac9A755fd29B2688956BD959F933F8/logo.png',
    //         decimals: 18
    //     },
    //     assets: {
    //         USDT: {symbol: 'USDT', name: 'Tether USD', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, icon: 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x55d398326f99059fF775485246999027B3197955/logo.png'},
    //         USDC: {symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, icon: 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d/logo.png'},
    //         UNI:  {symbol: 'UNI', name: "Uniswap", address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', decimals: 18, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png'}
    //     },
    //     Multi_Config: {
    //         rpcUrl: 'https://mainnet.infura.io/v3/0573c5d2e8c54ed79669b80cb3b78978',
    //         multicallAddress: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
    //         interval: 3000,
    //     }
    // },
    // BNB: {
    //     rpc:'https://bsc-dataseed.binance.org',
    //     scan: 'https://bscscan.com/',
    //     id: 56,
    //     main: {
    //         name: 'BNB',
    //         symbol: 'BNB',
    //         icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
    //         decimals: 18
    //     },
    //     assets: {
    //         // WETH: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    //         BUSD: {symbol: 'BUSD', name: 'BSC-USD', address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', decimals: 18, icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4687.png'},
    //         USDT: {symbol: 'USDT', name: 'Tether USD', address: '0x55d398326f99059fF775485246999027B3197955', decimals: 18, icon: 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x55d398326f99059fF775485246999027B3197955/logo.png'},
    //         USDC: {symbol: 'USDC', name: 'USD Coin', address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', decimals: 18, icon: 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d/logo.png'},
    //     },
    //     Multi_Config: {
    //         rpcUrl: 'https://bsc-dataseed.binance.org',
    //         multicallAddress: '0x41263cba59eb80dc200f3e2544eda4ed6a90e76c',
    //         interval: 3000,
    //     }
    // },
    MATIC: {
        rpc: 'https://polygon-rpc.com',
        scan: 'https://polygonscan.com/',
        id: 137,
        main: {
            name: 'Polygon',
            symbol: 'MATIC',
            icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
            decimals: 18
        },
        assets: {
            "TEST-U":{symbol: 'TEST-U', name: 'TEST USDT', address: '0x4cF89A27A27425d81C49c0B345e58A18De8A7273', decimals: 18, icon: 'https://cdn.wherein.mobi/wormhole3/logo/t-usdt.png'},
            USDT: {symbol: 'USDT', name: 'Tether USD', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6, icon: 'https://cdn.wherein.mobi/wormhole3/logo/usdt.png'},
            USDC: {symbol: 'USDC', name: 'USD Coin', address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', decimals: 6, icon: 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d/logo.png'},
        },
        Multi_Config: {
            rpcUrl: 'https://polygon-rpc.com',
            multicallAddress: '0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507',
            interval: 3000,
        }
    },
    STEEM: {
        rpc: '',
        scan: 'https://ecosynthesizer.com/steem/'
    }
}

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
  };

// reputation NFT configs
export const REPUTATION_NFT = '0x383870Ae4E834155192cEce2fb5B0528CE0790E9'
export const REPUTATION_NFT_RPC = RPC_NODE
export const REPUTATION_NFT_ID = 1;

export const CURATION_CONTRACT = '0x89c6b801802bcD16ddCe515933753405eBCbed86'

export const Multi_Config = {
    rpcUrl: RPC_NODE,
    multicallAddress: MultiAddress,
    interval: 3000,
}

/**
 * ignore steem id's post
 * only showing steem link
 */
export const IgnoreAuthor = [
    'greattranslatcn',
    'democretard'
]

export const STELLAR_TREK_NFT = [
    {
        name: "Tweet on chain",
        description: "Tweet with #iweb3, #StellarTrek and #postonchain hashtags; Go to the Wormhole3 square page and screenshot this linked post and tweet again with @Wormhole3.",
        image: "https://gateway.nutbox.app/ipfs/QmcuJyKGuSfSh7SQgKhvympxUPQmix4mwKzymBJ68w21Su"
    },
    {
        name: "Tip on Twitter",
        description: "Tip your friends who have also registered Wormhole3 with a tweet with the hashtags #iweb3 #StellarTrek and #Wormhole3Tips",
        image: "https://gateway.nutbox.app/ipfs/QmXJ7PA1QoY4tVNEwSAQ24sgB9t8y4yAZd7y1q2rGMYTFd"
    },
    {
        name: "Show off your Twitter Reputation NFT",
        description: "After successfully registering Wormhole3，view your Wormhole3 Twitter Reputation NFT and post a screenshot of @wormhole3 with the hashtag #iweb3 #StellarTrek and #Wormhole3NFT",
        image: "https://gateway.nutbox.app/ipfs/Qme5HKeFGq2FshSUcp2EpmjE154tfrGdWciXydK98oMQ67"
    },
    {
        name: "Get upvotes",
        description: "Send a tweet that you think is awesome and ask your friends to like it with @wormhole3. Wormhole3 officials will like it in turn, and you can check the revenue from the likes on Wormhole3's page. Tweet a screenshot of the revenue from the tweet with the hashtag #iweb3 #StellarTrek#getupvotes",
        image: "https://gateway.nutbox.app/ipfs/QmYtYPSuFBFfHsR9AejQfRDbRDCeebkaEagEVG4r3Drwvj"
    },
    {
        name: "Tagverse",
        description: "Every Stellar Treker can build your own or desired hashtag to build your on-chain community. Create your own hashtag and tweet it as #tag [explanation of tag] @Wormhole3 with the hashtag #iweb3 #StellarTrek #tagverse",
        image: "https://gateway.nutbox.app/ipfs/QmVgNBvePgRzyBN91zDBnA3JNWqPqrHQ5L9spnswLjyP7j"
    },
    {
        name: "Show off your assets",
        description: "After the user participated in some StellarTrek activities and project side ecological activities, he/she got some NFTS and tokens, and tweeted the FT and NFT assets with the hashtag #iweb3 #StellarTrek#Wormhole3Assets",
        image: "https://gateway.nutbox.app/ipfs/QmY2Zu8zNWyCQqwKTRwysnRYjinuimv7vaUyiF5V7L4jfZ"
    }
]