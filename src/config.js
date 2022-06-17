

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

export const Multi_Config = {
    rpcUrl: RPC_NODE,
    multicallAddress: MultiAddress,
    interval: 3000,
}