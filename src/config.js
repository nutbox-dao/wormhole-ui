
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

export const GAID = process.env.GAID || 'G-LERTNRZPMF';

export const SignUpMessage = JSON.stringify({
    project: 'wormhole3',
    method: 'create account'
}, null, 4)

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

// bsc test
// export const RPC_NODE = 'https://data-seed-prebsc-2-s3.binance.org:8545'
// export const MultiAddress = "0xae11C5B5f29A6a25e955F0CB8ddCc416f522AF5C"
// export const CHAIN_NAME = 'BSC Testnet'
// export const CHAIN_ID = 97

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
    // {symbol: 'MATIC', name: 'Matic Token', address: '0x0000000000000000000000000000000000001010', decimals: 18, icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png'},
    {symbol: 'WMATIC', name: 'Wrapped Matic', address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', decimals: 18, icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png'},
    {symbol: 'USDT', name: 'Tether USD', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6, icon: 'https://cdn.wherein.mobi/wormhole3/logo/usdt.png'},
    {symbol: 'USDC', name: 'USD Coin', address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', decimals: 6, icon: 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d/logo.png'},
    {symbol: 'DAI', name: 'Dai Stablecoin', address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', decimals: 18, icon: 'https://polygonscan.com/token/images/mcdDai_32.png'},
    {symbol: 'TEST-U', name: 'TEST USDT', address: '0x4cF89A27A27425d81C49c0B345e58A18De8A7273', decimals: 18, icon: 'https://cdn.wherein.mobi/wormhole3/logo/t-usdt.png'},
    // {symbol: 'UNI', name: "Uniswap", address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', decimals: 18, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png'}
]

export const TokenIcon = {
    'ETH': 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x2170Ed0880ac9A755fd29B2688956BD959F933F8/logo.png',
    'BNB': 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
    'WBNB': 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
    'USDT': 'https://cdn.wherein.mobi/wormhole3/logo/usdt.png',
    'TEST-U': 'https://cdn.wherein.mobi/wormhole3/logo/t-usdt.png',
    'USDC': 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d/logo.png',
    'UNI': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png',
    'BUSD': 'https://s2.coinmarketcap.com/static/img/coins/64x64/4687.png',
    'MATIC': 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
    'WMATIC': 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
    'DAI': 'https://polygonscan.com/token/images/mcdDai_32.png',
    'FRAX': 'https://cdn.wherein.mobi/wormhole3/logo/frax.png',
    'NEAR': 'https://cdn.wherein.mobi/wormhole3/logo/near.png',
    'AURORA': 'https://cdn.wherein.mobi/wormhole3/logo/aurora.png',
    'GLMR': 'https://cdn.wherein.mobi/wormhole3/logo/moonbeam.png',
    'WGLMR': 'https://cdn.wherein.mobi/wormhole3/logo/moonbeam.png',
    'PNUT': 'https://cdn.wherein.mobi/nutbox/v2/1645760918196',
    'NUT': "https://cdn.wherein.mobi/nutbox-v2/token/logo/nutcoin1.png",
    'WIN': 'https://cdn.wherein.mobi/nutbox/v2/1650853172818',
    'WNULS': 'https://cdn.wherein.mobi/wormhole3/logo/nuls-token.png',
    'NULS': 'https://cdn.wherein.mobi/wormhole3/logo/nuls-token.png',
    'USDTN': 'https://cdn.wherein.mobi/wormhole3/logo/usdt.png',
    'USDCN': 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d/logo.png',
    'AVAX': 'http://nassets.oss-us-west-1.aliyuncs.com/AVAX_9.png',
    'HT': "http://nassets.oss-us-west-1.aliyuncs.com/HT_9.png",
    'OKT': "http://nassets.oss-us-west-1.aliyuncs.com/OKT.png",
    'ONE': "http://nassets.oss-us-west-1.aliyuncs.com/ONE_9.png",
    'FTM': "http://nassets.oss-us-west-1.aliyuncs.com/FTM_9.png",
    'KCS': "http://nassets.oss-us-west-1.aliyuncs.com/KCS_9.png",
    'TRX': "http://nassets.oss-us-west-1.aliyuncs.com/TRX_9.png",
    'IOTX': "http://nassets.oss-us-west-1.aliyuncs.com/IOTX_9.png",
    'CRO': "http://nassets.oss-us-west-1.aliyuncs.com/CRO.png",
    'METIS': "http://nassets.oss-us-west-1.aliyuncs.com/METIS.png",
    'KLAY': "http://nassets.oss-us-west-1.aliyuncs.com/KLAY.png",
    'NABOX': "http://nassets.oss-us-west-1.aliyuncs.com/NABOX_1.png",
    'NVT': "http://nassets.oss-us-west-1.aliyuncs.com/NVT_9.png",
    'ARB': "https://cdn.wherein.mobi/wormhole3/logo/ZjT_zBAS_400x400.png"
}

export const TokenName = {
    'ETH': 'Ethereum',
    'BNB': 'BSC Token',
    'WBNB': 'Wrapped BNB',
    'USDT': 'Tether USD',
    'USDC': 'USD Coin',
    'UNI': 'Uniswap',
    'BUSD': 'BSC USD',
    'MATIC': 'Polygon',
    'TEST-U': 'TEST USDT',
    'WMATIC': 'Wrapped Matic',
    'DAI': 'Dai Stablecoin',
    'FRAX': 'Frax',
    'NEAR': 'Near',
    'AURORA': 'Aurora',
    'GLMR': 'GLMR',
    'WGLMR': 'Wrapped GLMR',
    'PNUT': 'Peanut',
    'WNULS': 'Wrapped NULS',
    'NULS': 'NULS',
    'USDTN': 'USDTN',
    'USDCN': 'USDCN',
    'AVAX': 'AVAX',
    'HT': 'HT',
    'OKT': 'OKT',
    'ONE': 'ONE',
    'FTM': 'FTM',
    'KCS': 'KCS',
    'TRX': 'TRX',
    'IOTX': 'IOTX',
    'CRO': 'CRO',
    'KAVA': 'KAVA',
    'METIS': 'METIS',
    'KLAY': 'KLAY',
    'NABOX': 'Nabox_Token',
    'NVT': 'NVT',
    'ARB': 'Arbitrum'
}

export const isWrappedToken = {
    '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c': true,
    '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270': true,
    '0x217dffF57E3b855803CE88a1374C90759Ea071bD': true,
    '0xAcc15dC74880C9944775448304B263D191c6077F': true
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
    'BNB Smart Chain': {
        // rpc:'https://bsc-dataseed.binance.org/',
        rpc: 'https://bsc.publicnode.com',
        scan: 'https://bscscan.com/',
        tokenScan: 'https://pancakeswap.finance/info/tokens/',
        id: 56,
        main: {
            name: 'BNB',
            symbol: 'BNB',
            icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
            decimals: 18
        },
        assets: {
            // WETH: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
            WBNB: {symbol: 'WBNB', name: 'Wrapped BNB', address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', decimals: 18, icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png'},
            BUSD: {symbol: 'BUSD', name: 'BSC USD', address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', decimals: 18, icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4687.png'},
            USDT: {symbol: 'USDT', name: 'Tether USD', address: '0x55d398326f99059fF775485246999027B3197955', decimals: 18, icon: 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x55d398326f99059fF775485246999027B3197955/logo.png'},
            USDC: {symbol: 'USDC', name: 'USD Coin', address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', decimals: 18, icon: 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d/logo.png'},
            PNUT: {symbol: 'PNUT', name: 'Peanut', address: '0x705931A83C9b22fB29985f28Aee3337Aa10EFE11', decimals: 18}
        },
        Multi_Config: {
            rpcUrl: 'https://bsc.publicnode.com',
            multicallAddress: '0x41263cba59eb80dc200f3e2544eda4ed6a90e76c',
            interval: 3000,
        },
        curation: '0x4695c30907E95A2153486D7a6372f3FBc2a89056',
        popup: '0x7f50F5b0393E60D9c3cafdf652C1a900F5973AEB',
        oracle: '0xfbD61B037C325b959c0F6A7e69D8f37770C2c550'
    },
    Polygon: {
        rpc: 'https://polygon-rpc.com',
        scan: 'https://polygonscan.com/',
        tokenScan: 'https://app.uniswap.org/#/tokens/polygon/',
        id: 137,
        main: {
            name: 'Polygon',
            symbol: 'MATIC',
            icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
            decimals: 18
        },
        assets: {
            WMATIC: {symbol: 'WMATIC', name: 'Wrapped Matic', address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', decimals: 18, icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png'},
            USDT: {symbol: 'USDT', name: 'Tether USD', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6, icon: 'https://cdn.wherein.mobi/wormhole3/logo/usdt.png'},
            USDC: {symbol: 'USDC', name: 'USD Coin', address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', decimals: 6, icon: 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d/logo.png'},
            DAI: {symbol: 'DAI', name: 'Dai Stablecoin', address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', decimals: 18, icon: 'https://polygonscan.com/token/images/mcdDai_32.png'},
            // "TEST-U":{symbol: 'TEST-U', name: 'TEST USDT', address: '0x4cF89A27A27425d81C49c0B345e58A18De8A7273', decimals: 18, icon: 'https://cdn.wherein.mobi/wormhole3/logo/t-usdt.png'},
        },
        Multi_Config: {
            rpcUrl: 'https://polygon-rpc.com',
            multicallAddress: '0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507',
            interval: 3000,
        },
        curation: '0x20eD66fD8da443128cd8E4E128BD02Da887dAe55',
        popup: '0x9A6Dc03ceF711926155EFd010AaeF3BDD27be4f4',
        oracle: '0x7F069df72b7A39bCE9806e3AfaF579E54D8CF2b9'
    },

    Arbitrum: {
        rpc: 'https://arb1.arbitrum.io/rpc',
        scan: 'https://arbiscan.io/',
        tokenScan: 'https://arbiscan.io/token/',
        id: 42161,
        main: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
            icon: 'https://cdn.wherein.mobi/wormhole3/logo/ZjT_zBAS_400x400.png'
        },
        assets: {
          ARB: {symbol: 'ARB', name: 'Arbitrum', address: '0x912CE59144191C1204E64559FE8253a0e49E6548', decimals: 18},
          USDC: {symbol: 'USDC', name: 'USD Coin', address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', decimals: 6},
          USDT: {symbol: 'USDT', name: 'Tether USD', address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', decimals: 6},
          DAI: {symbol: 'DAI', name: 'Dai Stablecoin', address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', decimals: 18},
        },
        Multi_Config: {
            rpcUrl: 'https://arb1.arbitrum.io/rpc',
            multicallAddress: '0x4B6EF997DbF23D320a6616ADf6499f4cdC00AB7c',
            interval: 3000
        },
        curation: '',
        popup: '',
        oracle: '0x735247fb0a604c0adC6cab38ACE16D0DbA31295F'
    },
    'ENULS': {
        rpc: 'https://evmapi.nuls.io',
        scan: 'https://evmscan.nuls.io',
        tokenScan: 'https://evmscan.nuls.io/token/',
        id: 119,
        main: {
            name: 'NULS',
            symbol: 'NULS',
            decimals: 18,
            icon: 'https://cdn.wherein.mobi/wormhole3/logo/ENULS.png'
        },
        assets: {
            WNULS: {symbol: 'WNULS', name: 'Wrapped NULS', address: '0x217dffF57E3b855803CE88a1374C90759Ea071bD',decimals: 18, icon: 'https://cdn.wherein.mobi/wormhole3/logo/nuls-token.png'},

            USDTN: {symbol: 'USDTN', name: 'USDTN', address:  '0x9e5d124cd49671f3f7b54d4aef43b3930bcf6de7', decimals: 18, icon: ''},
            
            USDCN: {symbol: 'USDCN', name:'USDCN', address: '0xb13bb925d62adc0ea0da95f70e7f7a09effd4f9e', decimals: 18, icon: ''}, 
            
            ETH: {symbol: 'ETH', name: 'ETH', address: '0xf573632c60de84f30486555e5199911fbd00835d', decimals: 18, icon: ''},
            
            BNB: {symbol: 'BNB', name: 'BNB', address: '0x70a07c8dce789d9cc249b3f816bdacd2bbed66cc', decimals: 18, icon: ''},
            
            AVAX: {symbol: 'AVAX', name: 'AVAX', address: '0x275f8b996dca35bca02cf2edb0f883d83decabf0', decimals: 18, icon: ''},
            
            HT: {symbol: 'HT', name: 'HT', address: '0x1853f95c1e21d6f43a667dd01f174bdf7828d4af', decimals: 18, icon: ''},
            
            OKT: {symbol: 'OKT', name: 'OKT', address: '0x3a5b9a4fd8fcac2cf2b09bb69f15f0c4a2a34b10', decimals: 18, icon: ''},
            
            ONE: {symbol: 'ONE', name: 'ONE', address: '0x6770b3ada065fe3e33d93de76ad22ead07d8c8d5', decimals: 18, icon: ''},
            
            MATIC: {symbol: 'MATIC', name: 'MATIC', address: '0x39f36e05630ac18cd4cbc4a787f58fa280066208', decimals: 18, icon: ''},
            
            FTM: {symbol: 'FTM', name: 'FTM', address: '0x21cd8e25a5504c55c26d0c2b84adffd3607e6d17', decimals: 18, icon: ''}, 
            
            KCS: {symbol: 'KCS', name: 'KCS', address: '0x5ec1c7d67ab36532ecafa8464717a7b282a909b3', decimals: 18, icon: ''}, 
            
            TRX: {symbol: 'TRX', name: 'TRX', address: '0x6949e317f000e07496654dc68fe252739ffcbc10', decimals: 6, icon: ''}, 
            
            IOTX: {symbol: 'IOTX', name: 'IOTX', address: '0x3e1c9a9e67d00fc55c5e2be28ea00dadc15cc065', decimals: 18, icon: ''}, 
            
            CRO: {symbol: 'CRO', name: 'CRO', address: '0x4ced4e629a0a314d5bae83f93edf80df5c2f13a1', decimals: 18, icon: ''}, 
            
            KAVA: {symbol: 'KAVA', name: 'KAVA', address: '0xc27956fd894d7192892bfe8d215a5b25dc893da0', decimals: 18, icon: ''}, 
            
            METIS: {symbol: 'METIS', name: 'METIS', address: '0x15be367243896393c097660e9c7a693ff3d9dedd', decimals: 18, icon: ''}, 
            
            KLAY: {symbol: 'KLAY', name: 'KLAY', address: '0x518111b3d78a11ff076f23f24fda1fae93f1c32f', decimals: 18, icon: ''}, 
            
            NABOX: {symbol: 'NABOX', name: 'Nabox_Token', address: '0xd9bea2dff06366c84ac2654308c5be9cb8750889', decimals: 18, icon: ''}, 
            
            NVT: {symbol: 'NVT', name: 'NVT', address: '0xCBE315d0163E372A82436F67C64097d6634394a9', decimals: 8, icon: ''},  
        },
        Multi_Config: {
            rpcUrl: 'https://evmapi.nuls.io',
            multicallAddress: '0x383870Ae4E834155192cEce2fb5B0528CE0790E9',
            interval: 3000
        },
        curation: '0xb9D14987De32606572F856FE747F89E6e7f86B9B',
        popup: '0xA55deCFdcc7B57f67f4E60DfF6a8226A4cEcC268'
    },
    // Aurora: {
    //     rpc: 'https://mainnet.aurora.dev/7KXu6cZRhGEzuyy3XbPd5UMo5tZYSpgX8h5VPc8BM58',
    //     scan: 'https://aurorascan.dev/',
    //     id: 1313161554,
    //     main: {
    //         name: 'Ethereum',
    //         symbol: 'ETH',
    //         decimals: 18,
    //         icon: 'https://cdn.wherein.mobi/wormhole3/logo/aurora-dev.jpg'
    //     },
    //     assets: {
    //         FRAX: {name: 'Frax',symbol: 'FRAX',dicimals: 18,address: '0xE4B9e004389d91e4134a28F19BD833cBA1d994B6'},
    //         AURORA: {name: 'Aurora',symbol: 'AURORA',dicimals: 18,address: '0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79'},
    //         NEAR: { name: 'NEAR',symbol: 'NEAR',decimals: 24,address: '0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d'}
    //     },
    //     Multi_Config: {
    //         rpcUrl: 'https://mainnet.aurora.dev/7KXu6cZRhGEzuyy3XbPd5UMo5tZYSpgX8h5VPc8BM58',
    //         multicallAddress: '0x930e8aB7b759BFFb2c73c276608b9CCF52Bb5c1e',
    //         interval: 3000
    //     }
    // },
    Moonbeam: {
        rpc: 'https://rpc.api.moonbeam.network',
        scan: 'https://moonbeam.moonscan.io/',
        tokenScan: 'https://moonbeam.moonscan.io/token/',
        id: 1284,
        main: {
            name: 'GLMR',
            symbol: 'GLMR',
            decimals: 18,
            icon: 'https://cdn.wherein.mobi/wormhole3/logo/moonbeam.png'
        },
        assets: {
          WGLMR: {symbol: 'WGLMR', name: 'Wrapped GLMR', address: '0xAcc15dC74880C9944775448304B263D191c6077F', decimals: 18},
          USDC: {symbol: 'USDC', name: 'USD Coin', address: '0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b', decimals: 6},
          USDT: {symbol: 'USDT', name: 'Tether USD', address: '0xeFAeeE334F0Fd1712f9a8cc375f427D9Cdd40d73', decimals: 6},
          DAI: {symbol: 'DAI', name: 'Dai Stablecoin', address: '0x765277EebeCA2e31912C9946eAe1021199B39C61', decimals: 18},
        },
        Multi_Config: {
            rpcUrl: 'https://rpc.api.moonbeam.network',
            multicallAddress: '0xc3035058E5c81349d881267DeC610B4D4A983a76',
            interval: 3000
        },
        curation: '0x38A096b9cF4Cfb881BaB778Ee8B5437d2A412214',
        popup: '0xF3d821614AD0ECC0AcA83D4b137D2Fde7de51434'
    }
    // 'BSC Testnet': {
    //     rpc: 'https://data-seed-prebsc-2-s3.binance.org:8545',
    //     scan: '',
    //     id: 97,
    //     main: {
    //         name: 'BNB',
    //         symbol: 'BNB',
    //         decimals: 18,
    //         icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png'
    //     },
    //     assets: {
    //       USDT: {symbol: 'USDT', name: 'Tether USD', address: '0xc2358F9255d2b31dc05cEC4249C612CA6FA9179a', decimals: 18}
    //     },
    //     Multi_Config: {
    //         rpcUrl: 'https://data-seed-prebsc-2-s3.binance.org:8545',
    //         multicallAddress: '0xae11C5B5f29A6a25e955F0CB8ddCc416f522AF5C',
    //         interval: 3000
    //     },
    //     curation: '',
    //     popup: ''
    // },
}

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
    '1180358936249032704',
    '1485658668259770370',
    '1443781057703145473',
    '903140569685270528'
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
    POST: 30,
    QUOTE: 20,
    RETWEET: 15,
    LIKE: 5,
    TIP: 10
});
// rc consume
export const RC_CONSUME = Object.freeze({
    POST: 200,
    QUOTE: 20,
    RETWEET: 15,
    COMMENT: 15,
    LIKE: 5,
    TIP: 10,
    FOLLOW: 5
});

export const MAX_VP = 100;
export const VP_RECOVER_DAY = 1;

export const MAX_RC = 1000;
export const RC_RECOVER_DAY = 1;