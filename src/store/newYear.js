
export default {
    namespaced: true,
    state: {
        collectBlessAbi: [],
    },
    mutations: {
        saveCollectBlessAbi: (state, collectBlessAbi) => {
            state.collectBlessAbi = collectBlessAbi
        }
    }
}