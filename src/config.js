

export const SendPwdServerPubKey = '12e7373d2ca385d952365e86e27194a28bdfee37e5014ac422212577879c3d7b'
export const ParseKeyNonce = '111111111111111111111111111111111111111111111111'
export const BEARER_TOKEN = process.env.VUE_APP_BEARER_TOKEN

export const TWITTER_MONITOR_ACCOUNT = '@NutboxDao'
export const TWITTER_MONITOR_RULE = "%23wormhole3"

export const BACKEND_API_URL = 'https://api-test.web3id.pro'
// export const BACKEND_API_URL = 'http://localhost:3100'

// bsc net
// export const RPC_NODE = 'https://bsc-dataseed.binance.org'
// export const MultiAddress = "0x41263cba59eb80dc200f3e2544eda4ed6a90e76c"
// export const MainToken = {
//     name: 'BNB',
//     symbol: 'BNB',
//     icon: 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png'
// }

// eth
export const RPC_NODE = 'https://mainnet.infura.io/v3/0573c5d2e8c54ed79669b80cb3b78978'
export const MultiAddress = '0xeefba1e63905ef1d7acba5a8513c70307c1ce441'
export const MainToken = {
    name: 'Ethereum',
    symbol: 'ETH',
    icon: 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x2170Ed0880ac9A755fd29B2688956BD959F933F8/logo.png'
}

export const ERC20List = [
    {symbol: 'USDT', name: 'Tether USD', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, icon: 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x55d398326f99059fF775485246999027B3197955/logo.png'},
    {symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, icon: 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d/logo.png'},
    {symbol: 'UNI', name: "Uniswap", address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', decimals: 18, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png'}
]

export const TokenIcon = {
    'ETH': 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x2170Ed0880ac9A755fd29B2688956BD959F933F8/logo.png',
    'BNB': 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
    'USDT': 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x55d398326f99059fF775485246999027B3197955/logo.png',
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
    'MATIC': 'Polygon'
}

/**
 * EVM Chains
 */
export const EVM_CHAINS = {
    ETH: {
        rpc: "https://mainnet.infura.io/v3/0573c5d2e8c54ed79669b80cb3b78978",
        scan: 'https://etherscan.io/',
        main: {
            name: 'Ethereum',
            symbol: 'ETH',
            icon: 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x2170Ed0880ac9A755fd29B2688956BD959F933F8/logo.png'
        },
        assets: {
            USDT: {symbol: 'USDT', name: 'Tether USD', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, icon: 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x55d398326f99059fF775485246999027B3197955/logo.png'},
            USDC: {symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, icon: 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d/logo.png'},
            UNI:  {symbol: 'UNI', name: "Uniswap", address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', decimals: 18, icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png'}
        },
        Multi_Config: {
            rpcUrl: 'https://mainnet.infura.io/v3/0573c5d2e8c54ed79669b80cb3b78978',
            multicallAddress: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
            interval: 3000,
        }
    },
    BNB: {
        rpc:'https://bsc-dataseed.binance.org',
        scan: 'https://bscscan.com/',
        main: {
            name: 'BNB',
            symbol: 'BNB',
            icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png'
        },
        assets: {
            // WETH: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
            BUSD: {symbol: 'BUSD', name: 'BSC-USD', address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', decimals: 18, icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4687.png'},
            USDT: {symbol: 'USDT', name: 'Tether USD', address: '0x55d398326f99059fF775485246999027B3197955', decimals: 18, icon: 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x55d398326f99059fF775485246999027B3197955/logo.png'},
            USDC: {symbol: 'USDC', name: 'USD Coin', address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', decimals: 18, icon: 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d/logo.png'},
        },
        Multi_Config: {
            rpcUrl: 'https://bsc-dataseed.binance.org',
            multicallAddress: '0x41263cba59eb80dc200f3e2544eda4ed6a90e76c',
            interval: 3000,
        }
    },
    MATIC: {
        rpc: 'https://polygon-rpc.com',
        scan: 'https://polygonscan.com/',
        main: {
            name: 'Polygon',
            symbol: 'MATIC',
            icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png'
        },
        assets: {
            USDT: {symbol: 'USDT', name: 'Tether USD', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6, icon: 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x55d398326f99059fF775485246999027B3197955/logo.png'},
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

export const ERR_CODE = {
    501: "Server error"
}

export const Multi_Config = {
    rpcUrl: RPC_NODE,
    multicallAddress: MultiAddress,
    interval: 3000,
}