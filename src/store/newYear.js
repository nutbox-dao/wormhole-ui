
export default {
    namespaced: true,
    state: {
        collectBlessAbi: [],
        blessCardBalance: [],
        blindBoxBalance: []
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
        }
    }
}