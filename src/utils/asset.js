import { aggregate } from "@makerdao/multicall";
import { Multi_Config, ERC20List, EVM_CHAINS } from "@/config";
import store from '@/store'
import { ethers } from 'ethers'

export const getTokenBalance = async (address) => {
    return new Promise(async (resolve, reject) => {
        try{
            if (ethers.utils.isAddress(address)){
                let balances = await Promise.all(Object.values(EVM_CHAINS).map(chain=>multicallBalances(address, chain)))
                let result = {}
                for (let i = 0; i < Object.values(EVM_CHAINS).length; i++) {
                    const key = Object.keys(EVM_CHAINS)[i]
                    const value = balances[i]
                    if (value) {
                        result[key] = value
                    }
                }
                store.commit('saveERC20Balances', result)
                resolve(balances)
            }else {
                let balances = {}
                store.commit('saveERC20Balances', balances)
            }
        }catch(e) {
            console.log('Get erc20 balances fail:', e);
            reject(e)
        }
    })
}

async function multicallBalances(address, chain) {
    if (!chain.assets) return;
    const ERC20List = Object.values(chain.assets)
    let calls = [{
        call: [
            'getEthBalance(address)(uint256)',
            address
        ],
        returns:[
            [chain.main.symbol.toUpperCase(), val => val / 10 ** 18]
        ]
    }]
    calls = calls.concat(ERC20List.map(e => ({
        target: e.address,
        call: [
            'balanceOf(address)(uint256)',
            address
        ],
        returns: [
            [e.symbol, val => val.toString() / (10 ** e.decimals)]
        ]
    })))
    const res = await aggregate(calls, chain.Multi_Config)
    const balances = res.results.transformed
    return balances
}