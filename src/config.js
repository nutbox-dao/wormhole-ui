
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
    IDENTITY_HAS_USED: 112,
    BTC_AUTH_FAIL: 113,
    ENS_MISMATCH: 114,

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

export const GateFeeAddress = '0x06Deb72b2e156Ddd383651aC3d2dAb5892d9c048';

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
