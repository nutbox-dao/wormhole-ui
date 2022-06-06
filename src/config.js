

export const SendPwdServerPubKey = '12e7373d2ca385d952365e86e27194a28bdfee37e5014ac422212577879c3d7b'
export const ParseKeyNonce = '111111111111111111111111111111111111111111111111'
export const BEARER_TOKEN = process.env.VUE_APP_BEARER_TOKEN

export const TWITTER_MONITOR_ACCOUNT = '@NutboxDao'

// export const BACKEND_API_URL = 'https://api-test.nutbox.app'
export const BACKEND_API_URL = 'http://localhost:3100'

// bsc net
export const RPC_NODE = 'https://bsc-dataseed.binance.org'
export const MultiAddress = "0x41263cba59eb80dc200f3e2544eda4ed6a90e76c"

export const ERC20List = [
    {'usdt': ''},
    {}
]

export const Multi_Config = {
    rpcUrl: RPC_NODE,
    multicallAddress: MultiAddress,
    interval: 3000,
}