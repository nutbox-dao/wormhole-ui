
export default {
    namespaced: true,
    state: {
        collectBlessAbi: [],
        blessCardBalance: [],
        blindBoxBalance: [],
        usdtBalance: 0,
        approvedUSDT: 0,
        userActivityInfo: {},
        blindBoxInfo: [],
        mintedBoxCache: localStorage.getItem('new-year-mintedBoxCache'),
    },
    mutations: {
        saveCollectBlessAbi: (state, collectBlessAbi) => {
            state.collectBlessAbi = collectBlessAbi
        },
        saveBlessCardBalance: (state, blessCardBalance) => {
            state.blessCardBalance = blessCardBalance
        },
        saveBlindBoxBalance: (state, blindBoxBalance) => {
            state.blindBoxBalance = blindBoxBalance
        },
        saveUsdtBalance: (state, usdtBalance) => {
            state.usdtBalance = usdtBalance
        },
        saveApprovedUSDT: (state, approvedUSDT) => {
            state.approvedUSDT = approvedUSDT
        },
        saveUserActivityInfo: (state, userActivityInfo) => {
            state.userActivityInfo = userActivityInfo
        },
        saveBlindBoxInfo: (state, blindBoxInfo) => {
            state.blindBoxInfo = blindBoxInfo
        },
        saveMintedBoxCache: (state, mintedBoxCache) => {
            if (mintedBoxCache && Object.keys(mintedBoxCache).length > 0) {
                state.mintedBoxCache = JSON.stringify(mintedBoxCache)
                localStorage.setItem('new-year-mintedBoxCache', state.mintedBoxCache)
            }else {
                state.mintedBoxCache = null;
                localStorage.removeItem('new-year-mintedBoxCache')
            }
        }
    },
    getters: {
        getMintedBoxCache: (state) => {
            let mintedBoxCache = state.mintedBoxCache;
            if (mintedBoxCache) {
                if (typeof(mintedBoxCache) === 'string') {
                    return JSON.parse(mintedBoxCache)
                }
                return mintedBoxCache;
            }else {
                mintedBoxCache = localStorage.getItem('new-year-mintedBoxCache')
                if (mintedBoxCache)
                return JSON.parse(mintedBoxCache)
                return null
            }
        },
    }
}