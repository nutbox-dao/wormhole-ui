import { aggregate } from "@makerdao/multicall";
import { Multi_Config, ERC20List, EVM_CHAINS } from "@/config";
import store from '@/store'
import { ethers } from 'ethers'
import { getEthWeb } from "./web3/web3";
import { waitForTx } from './ethers'

/**
 * get all tokens balance
 * @param {*} address 
 * @param {*} isHost 
 * @returns 
 */
export const getTokenBalance = async (address, isHost = true) => {
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
                if (isHost) {
                    store.commit('saveERC20Balances', result)
                }
                resolve(result)
            }else {
                let balances = {}
                if (isHost) {
                    store.commit('saveERC20Balances', balances)
                }
                resolve(balances)
            }
        }catch(e) {
            console.log('Get erc20 balances fail:', e);
            resolve({})
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

export async function getTokenInfo(token) {
    if (!ethers.utils.isAddress(token)){
        return null
    }
    let calls = [
        {
            target: token,
            call:[
                'name()(string)'
            ],
            returns:[
                ['name']
            ]
        },
        {
            target: token,
            call:[
                'symbol()(string)'
            ],
            returns: [
                ['symbol']
            ]
        },
        {
            target: token,
            call:[
                'decimals()(uint8)'
            ],
            returns: [
                ['decimals']
            ]
        }
    ]
    const res = await aggregate(calls, Multi_Config)
    const infos = res.results.transformed;
    return infos
}

export async function getERC20TokenBalance(token, account) {
    if (!ethers.utils.isAddress(token) || !ethers.utils.isAddress(account)){
        return null
    }
    let calls = [
        {
            target: token,
            call:[
                'balanceOf(address)(uint256)',
                account
            ],
            returns:[
                ['balance']
            ]
        },
        {
            target: token,
            call:[
                'decimals()(uint8)'
            ],
            returns: [
                ['decimals']
            ]
        }
    ]
    const res = await aggregate(calls, Multi_Config)
    const infos = res.results.transformed;
    return infos.balance.toString() / (10 ** infos.decimals)
}

export async function getApprovement(token, account, spender) {
    if (!ethers.utils.isAddress(token) || !ethers.utils.isAddress(account) || !ethers.utils.isAddress(spender)){
        return null
    }
    let calls = [
        {
            target: token,
            call:[
                'allowance(address,address)(uint256)',
                account,
                spender
            ],
            returns:[
                ['allowance']
            ]
        },
        {
            target: token,
            call:[
                'decimals()(uint8)'
            ],
            returns: [
                ['decimals']
            ]
        }
    ]
    const res = await aggregate(calls, Multi_Config)
    const infos = res.results.transformed;
    return infos.allowance.toString() / (10 ** infos.decimals) > 1e12
}

export async function approve(token, account, spender) {
    if (!ethers.utils.isAddress(token) || !ethers.utils.isAddress(account) || !ethers.utils.isAddress(spender)){
        return null
    }
    const abi = [{
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      }]
    const metamask = await getEthWeb()
    const provider = new ethers.providers.Web3Provider(metamask)
    let contract = new ethers.Contract(token, abi, provider)
    contract = contract.connect(provider.getSigner())

    const tx = await contract.approve(spender, ethers.constants.MaxUint256);
    await waitForTx(provider, tx.hash)
}