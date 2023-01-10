
export default {
    namespaced: true,
    state: {
        collectBlessAbi: [],
        blessCardBalance: [],
        blindBoxBalance: [],
        usdtBalance: 0,
        approvedUSDT: 0
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

    }
}