import { getEthWeb } from './web3.js'
import store from '@/store'
import { ethers } from 'ethers'
import { updateUserInfo as uui, getSomeUsers, getAllUsers } from '@/apis/api'
import { sleep } from '../helper.js'
import { errCode, BSC_CHAIN_ID } from '@/config.js'
import { signMessage } from './utils'

/**
 * Get metamask accounts
 * @returns all accounts
 */
export const getAccounts = async (update=false) => {
    const metamask = await getEthWeb()
    const unlock = await metamask._metamask.isUnlocked()
    if (!unlock) {
        store.commit('web3/saveAccount', null);
        return
    }
    while(true) {
        if (parseInt(store.state.web3.chainId) > 0){
             break;
        }
        await sleep(0.3)
    }
    if (parseInt(store.state.web3.chainId !== parseInt(BSC_CHAIN_ID))) {
        store.commit('web3/saveAccount', null)
        return;
    }
    if (store.state.web3.account && !update) {
        return store.state.web3.account;
    }
    const accounts = await metamask.request({ method: 'eth_requestAccounts' })
    let account = accounts[0]
    account = ethers.utils.getAddress(account)
    store.commit('web3/saveAccount', account)
    store.commit('web3/saveAllAccounts', accounts)
    console.log(accounts[0]);
    return accounts[0]
}

/**
 * Monitor BSC account change event
 */
export const accountChanged = async (refresh) => {
    const metamask = await getEthWeb()
    metamask.on('accountsChanged', (accounts) => {
        console.log('Changed accounts', accounts);
        store.commit('web3/saveAccount', ethers.utils.getAddress(accounts[0]))
        refresh();
    })
}

/**
 * Get User's nonce
 * @param {*} update
 */
 export const getNonce = async (update = false) => {
    let nonce = store.state.web3.nonce;
    const account = await getAccounts();
    if (!update && nonce) {
      return nonce;
    }
    nonce = await gn(account);
    store.commit("web3/saveNonce", nonce);
    return nonce;
  };
