import { ethers } from 'ethers'
import store from '@/store'
import { RPC_NODE } from '@/config'

export const getReadOnlyProvider = () => {
    // if (store.state.ethers && Object.keys(store.state.ethers).length > 0) {
    //     return store.state.ethers
    // }
    const provider = new ethers.providers.JsonRpcProvider(RPC_NODE)
    // store.commit('saveEthers', provider)
    return provider
}