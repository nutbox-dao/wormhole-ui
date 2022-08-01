import { getUserInfo as gui, getNftReceivedState, readNft } from '@/api/api'
import store from '@/store'
import { sleep } from '@/utils/helper'

/**
 * Fetch account info from backend
 * This define the status of account
 */
export const FetchingStatus = {
    NOT_REGISTED: 0,
    MATCH_TICKETS: 1,
    REGISTERING: 2,
    MATCH_ACCOUNT: 3,
    NOT_SEND_TWITTER: 4
}

const GetTicketTimes = 1
const GetRegisterTimes = 5
const GetTicketInterval = 1;
const GetRegisterInterval = 5;

// login
export const login = async (username, ethAddress, callback) => {
    return new Promise(async (resolve, reject) => {
        // store.commit('saveAccountInfo', {})
        let account = await gui(username, ethAddress)
        let getTicketTimes = 0;
        let getAccountTimes = 0;
        if (account && account.code === FetchingStatus.MATCH_ACCOUNT) {
            store.commit('saveAccountInfo', account.account)
            monitorNFTReceiveState(account.account)
            resolve(true)
            return;
        }
        while (true) {
            if (account) {
                if(account.code === FetchingStatus.MATCH_TICKETS) {
                    await sleep(GetTicketInterval)
                    account = await gui(username, ethAddress)
                    getTicketTimes++;
                } else if(account.code === FetchingStatus.REGISTERING) {
                    await sleep(GetRegisterInterval)
                    account = await gui(username, ethAddress)
                    getAccountTimes++;
                }

                if (account.code === FetchingStatus.NOT_REGISTED) {
                    resolve(false)
                    return;
                } else if(account.code === FetchingStatus.MATCH_ACCOUNT) {
                    store.commit('saveAccountInfo', account.account)
                    monitorNFTReceiveState(account.account)
                    resolve(true)
                    return;
                }
                if (getTicketTimes > GetTicketTimes) {
                    callback(FetchingStatus.NOT_SEND_TWITTER)
                    resolve(false)
                    return;
                }
                if (getAccountTimes > GetRegisterTimes) {
                    resolve(false)
                    return;
                } 
                callback(account.code)
            }else {
                reject(500)
                return;
            }
        }
    })
}

function getReceivedState(accountInfo) {
    getNftReceivedState(accountInfo.twitterId).then(res => {
        const { hasReceivedNft, reputation, hasMintedRP } = res;
        if (hasReceivedNft) {
            stopMonitorNFTReceiveState()
            store.commit('saveHasReceivedNft', true)
        }else{
            if (hasMintedRP) {
                stopMonitorNFTReceiveState()
                accountInfo.reputation = reputation;
                store.commit('saveAccountInfo', accountInfo)
                store.commit('saveHasReceivedNft', false)
            }
        }
    }).catch(err => {})
}

export const monitorNFTReceiveState = async (accountInfo) => {
    stopMonitorNFTReceiveState()
    if (accountInfo.hasMintedRP) return
    getReceivedState(accountInfo)
    const monitorInserval = setInterval(() => {
        getReceivedState(accountInfo)
    }, 10000);
    store.commit('saveMonitorNftInserval', monitorInserval)
}

export const stopMonitorNFTReceiveState = async () => {
    try{
        clearInterval(store.state.monitorNftInserval)
    }catch(e){}
}

export const getUserInfo = async (username) => {
    return new Promise(async (resolve, reject) => {
        let account = await gui(username)
        if (account && account.code === FetchingStatus.MATCH_ACCOUNT) {
            resolve(account.account)
        }else {
            reject(500)
        }
    })
}