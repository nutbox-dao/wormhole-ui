import { getUserInfo as gui } from '@/api/api'
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

export const getUserInfo = async (username, ethAddress, callback) => {
    return new Promise(async (resolve, reject) => {
        store.commit('saveAccountInfo', {})
        let account = await gui(username, ethAddress)
        let getTicketTimes = 0;
        let getAccountTimes = 0;
        if (account && account.code === FetchingStatus.MATCH_ACCOUNT) {
            store.commit('saveAccountInfo', account.account)
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
                console.log(666, account);

                if (account.code === FetchingStatus.NOT_REGISTED) {
                    resolve(false)
                    return;
                } else if(account.code === FetchingStatus.MATCH_ACCOUNT) {
                    store.commit('saveAccountInfo', account.account)
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