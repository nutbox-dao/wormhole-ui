import { ethers } from 'ethers'
import store from '@/store'
import { RPC_NODE } from '@/config'
import { u8arryToHex, hexToString } from '@/utils/helper'
import { sha256 } from 'js-sha256'

export const getReadOnlyProvider = () => {
    // if (store.state.ethers && Object.keys(store.state.ethers).length > 0) {
    //     return store.state.ethers
    // }
    const provider = new ethers.providers.JsonRpcProvider(RPC_NODE)
    // store.commit('saveEthers', provider)
    return provider
}

export const generateEth = (username, pwd) => {
    const pass = pwd
    var seed = username + 'owner' + pass;
	var brainKey = seed.trim().split(/[\t\n\v\f\r ]+/).join(' ');
	var privateKey = sha256(brainKey);
    const wallet = new ethers.Wallet(privateKey)
    console.log(555, `${username}\n${pwd}\n${brainKey}\n${privateKey}`);
    return {eth: wallet.address, ethPrivateKey: privateKey}
}