import { aggregate } from "@makerdao/multicall";
import { Multi_Config, ERC20List, EVM_CHAINS, REPUTATION_NFT, CURATION_FUND_CONTRACT,
     STELLAR_TREK_NFT, LIQUIDATION_NFT, WC2022_NFT, Christmas_NFT } from "@/config";
import store from '@/store'
import { getLiquidationMetaBy as getLiqMeta } from '@/api/api'
import { ethers } from 'ethers'
import { getEthWeb } from "./web3/web3";
import { waitForTx } from './ethers'
import axios from "axios";

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

export async function getTokenInfo(chainName, token) {
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
    const res = await aggregate(calls, EVM_CHAINS[chainName].Multi_Config)
    const infos = res.results.transformed;
    return infos
}

export async function checkNFTType(chainName, token) {
    if(!ethers.utils.isAddress(token)){
        return false;
    }
    let calls = [{
        target: token,
        call: [
            'supportsInterface(bytes4)(bool)',
            '0x80ac58cd'
        ],
        returns:[
            ['isERC721']
        ]
    }, {
        target: token,
        call: [
            'supportsInterface(bytes4)(bool)',
            '0xd9b67a26'
        ],
        returns: [
            ['isERC1155']
        ]
    }]

    const res = await aggregate(calls, EVM_CHAINS[chainName].Multi_Config);
    const typeInfo = res.results.transformed;
    if (typeInfo.isERC721) {
        return 'ERC721'
    }
    if (typeInfo.isERC1155) {
        return 'ERC1155'
    }
    return false;
}

export async function getERC20TokenBalance(chainName, token, account) {
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
    const res = await aggregate(calls,  EVM_CHAINS[chainName].Multi_Config)
    const infos = res.results.transformed;
    return infos.balance.toString() / (10 ** infos.decimals)
}

export async function getERC1155TokenBalance(chainName, token, id, account) {
    if (!ethers.utils.isAddress(token) || !ethers.utils.isAddress(account)){
        return null
    }
    let calls = [{
        target: token,
        call: [
            'balanceOf(address,uint256)(uint256)',
            account, id
        ],
        returns: [
            ['balance']
        ]
    }]
    const res = await aggregate(calls, EVM_CHAINS[chainName].Multi_Config)
    const infos = res.results.transformed;
    return infos.balance;
}

export async function getERC721Balance(chainName, token, account) {
    if (!ethers.utils.isAddress(token) || !ethers.utils.isAddress(account)){
        return null
    }
    let calls = [{
        target: token,
        call: [
            'balanceOf(adderss)(uint256)',
            account
        ],
        returns: [
            ['balance']
        ]
    }]
    const res = await aggregate(calls, EVM_CHAINS[chainName].Multi_Config)
    const infos = res.results.transformed;
    return infos.balance;
}

export async function getUserOwnERC721Id(chainName, token, id, account) {
    if (!ethers.utils.isAddress(token) || !ethers.utils.isAddress(account)){
        return null
    }
    let calls = [{
        target: token,
        call: [
            'ownerOf(uint256)(address)',
            id
        ],
        returns: [
            ['address']
        ]
    }]
    const res = await aggregate(calls, EVM_CHAINS[chainName].Multi_Config);
    const infos = res.results.transformed;
    const address = infos.address;
    if (account.toLowerCase() == address.toLowerCase()) {
        return true;
    }
    return false;
}

export async function getApprovement(chainName, token, account, spender) {
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
    const res = await aggregate(calls, EVM_CHAINS[chainName].Multi_Config)
    const infos = res.results.transformed;
    return infos.allowance.toString() / (10 ** infos.decimals)
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

    const tx = await contract.approve(spender, ethers.constants.MaxUint256, {gasLimit: 90000});
    await waitForTx(provider, tx.hash)
    return true;
}

export async function getERC1155Approvment(chainName, token, account, spender) {
    if (!ethers.utils.isAddress(token) || !ethers.utils.isAddress(account) || !ethers.utils.isAddress(spender)){
        return null
    }
    let calls = [{
        target: token,
        call: [
            'isApprovedForAll(address,address)(bool)',
            account,
            spender
        ],
        returns: [
            ['approvement']
        ]
    }]
    const res = await aggregate(calls, EVM_CHAINS[chainName].Multi_Config);
    return res.results.transformed.approvement;
}

export async function approveERC1155(token, account, spender) {
    if (!ethers.utils.isAddress(token) || !ethers.utils.isAddress(account) || !ethers.utils.isAddress(spender)){
        return null
    }
    const abi = [{
        "inputs": [
          {
            "internalType": "address",
            "name": "operator",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "approved",
            "type": "bool"
          }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }]

      const metamask = await getEthWeb();
      const provider = new ethers.providers.Web3Provider(metamask);
      let contract = new ethers.Contract(token, abi, provider);
      contract = contract.connect(provider.getSigner());

      const tx = await contract.setApprovalForAll(spender, true);
      await waitForTx(provider, tx.hash);
      return true;
}

export async function getERC721Approvement(chainName, token, account, spender) {
    if (!ethers.utils.isAddress(token) || !ethers.utils.isAddress(account) || !ethers.utils.isAddress(spender)){
        return null
    }
    let calls = [{
        target: token,
        call: [
            'isApprovedForAll(address,address)(bool)',
            account,
            spender
        ],
        returns:[
            ['approvement']
        ]
    }]
    const res = await aggregate(calls, EVM_CHAINS[chainName].Multi_Config);
    return res.results.transformed.approvement;
}

export async function approveERC721(token, account, spender) {
    if (!ethers.utils.isAddress(token) || !ethers.utils.isAddress(account) || !ethers.utils.isAddress(spender)){
        return null
    }
    const abi = [{
        "inputs": [
          {
            "internalType": "address",
            "name": "operator",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "approved",
            "type": "bool"
          }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }];
    const metamask = await getEthWeb();
    const provider = new ethers.providers.Web3Provider(metamask);
    let contract = new ethers.Contract(token, abi, provider);
    contract = contract.connect(provider.getSigner());

    const tx = await contract.setApprovalForAll(spender, true);
    await waitForTx(provider, tx.hash);
    return true;
}

export async function sendTokenToUser(token, amount, to) {
    const abi = [{
        "inputs": [
          {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "transfer",
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
    const provider = new ethers.providers.Web3Provider(metamask);
    let contract = new ethers.Contract(token.address, abi, provider);
    contract = contract.connect(provider.getSigner())

    const tx = await contract.transfer(to, ethers.utils.parseUnits(amount.toString(), token.decimals));
    await waitForTx(provider, tx.hash);
    return tx.hash;
}

export async function send11155ToUser(token, id, amount, from, to) {
    const abi = [{
        "inputs": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }]
    const metamask = await getEthWeb()
    const provider = new ethers.providers.Web3Provider(metamask);
    let contract = new ethers.Contract(token, abi, provider);
    contract = contract.connect(provider.getSigner())

    const tx = await contract.safeTransferFrom(from, to, id, amount, 0x00);
    await waitForTx(provider, tx.hash);
    return tx.hash;
}

export async function getStellarTreks(address) {
    if (!ethers.utils.isAddress(address)) {
        return;
    }
    let ids = STELLAR_TREK_NFT.map((s, i) => i + 21)
    let call = ids.map(id => ({
        target: REPUTATION_NFT,
        call: [
            'balanceOf(address,uint256)(uint256)',
            address,
            id
        ],
        returns: [
            [id-21, val => parseInt(val)]
        ]
    }));
    const res = await aggregate(call, Multi_Config);
    const infos = res.results.transformed;
    let balances = {}
    for (let b in infos) {
        if (infos[b] > 0) {
            balances[b] = infos[b]
        }
    }
    return balances
}

export async function getWc2022(address) {
    if (!ethers.utils.isAddress(address)) {
        return;
    }
    let ids = WC2022_NFT.map((s, i) => i + 31)
    let call = ids.map(id => ({
        target: REPUTATION_NFT,
        call: [
            'balanceOf(address,uint256)(uint256)',
            address,
            id
        ],
        returns: [
            [id-31, val => parseInt(val)]
        ]
    }));
    const res = await aggregate(call, Multi_Config);
    const infos = res.results.transformed;
    let balances = {}
    for (let b in infos) {
        if (infos[b] > 0) {
            balances[b] = infos[b]
        }
    }
    return balances
}

export async function getChritmasNFT(address) {
    if (!ethers.utils.isAddress(address)) {
        return;
    }
    let ids = Christmas_NFT.map((s, i) => i + 50)
    let call = ids.map(id => ({
        target: REPUTATION_NFT,
        call: [
            'balanceOf(address,uint256)(uint256)',
            address,
            id
        ],
        returns: [
            [id-50, val => parseInt(val)]
        ]
    }));
    const res = await aggregate(call, Multi_Config);
    const infos = res.results.transformed;
    let balances = {}
    for (let b in infos) {
        if (infos[b] > 0) {
            balances[b] = infos[b]
        }
    }
    return balances
}

export async function getLiquidationNft(address) {
    if (!ethers.utils.isAddress(address)) {
        return;
    }
    try {
        let calls = [
            {
                target: LIQUIDATION_NFT,
                call: [
                    'tokensOf(address,uint256,uint256)(uint256[])',
                    address,
                    0,
                    0
                ],
                returns:[
                    ['ids']
                ]
            }
        ]
        const res = await aggregate(calls, Multi_Config)
        const infos = res.results.transformed.ids;
        if (infos.length > 0) {
            calls = infos.map(id => ({
                target: LIQUIDATION_NFT,
                call: [
                    'tokenURI(uint256)(string)',
                    id.toString()
                ],
                returns:[
                    [id]
                ]
            }))
            let metas = await aggregate(calls, Multi_Config)
            metas = metas.results.transformed;
            let results = await Promise.all(Object.values(metas).map(url => getLiqMeta(url)))
            return results[0]
        }else {
            return {}
        }
    }catch(e) {
        console.log('get liquidation fail:', e);
        return {}
    }
}

export async function getLiquidationMetaBy(tokenId) {

}

export async function getUserTokensFromCuration(twitterId) {
    try {
        const res = await aggregate([{
            target: CURATION_FUND_CONTRACT,
            call: [
                'getUserTokens(uint256)(address[],uint256[])',
                twitterId
            ],
            returns: [
                ['tokens'],
                ['amounts']
            ]
        }], Multi_Config);
        return res.results.transformed;
    }catch(e) {
        console.log('get user token from curation fail', e);
        return false
    }
}

export async function depositWrappedToken(tokenInfo, amount) {
    const abi = [
        {
            "constant":false,
            "inputs":[
                {
                    "name":"wad",
                    "type":"uint256"
                }
            ],
            "name":"withdraw",
            "outputs":[
    
            ],
            "payable":false,
            "stateMutability":"nonpayable",
            "type":"function"
        },{
            "constant":false,
            "inputs":[
    
            ],
            "name":"deposit",
            "outputs":[
    
            ],
            "payable":true,
            "stateMutability":"payable",
            "type":"function"
        }
    ]
    const metamask = await getEthWeb()
    const provider = new ethers.providers.Web3Provider(metamask);
    const token = EVM_CHAINS[tokenInfo[0]]
    const decimals = token.main.decimals
    let contract = new ethers.Contract(token.assets[tokenInfo[1]].address, abi, provider);
    contract = contract.connect(provider.getSigner())
    const tx = await contract.deposit({
        value: ethers.utils.parseUnits(amount.toString(), decimals)
    });
    await waitForTx(provider, tx.hash);
    return tx.hash;
}

export async function getPriceFromOracle(chainName, tokens) {
    try {
        if (!tokens || tokens.length === 0) return 
        if (chainName === 'ENULS') {
            let api = 'https://assets.nabox.io/api/price/list/';
            const ts = Array.from(new Set(tokens.map(t => t.token)));
            api = api + ts.reduce((s, t) => s + t + ',', '') + 'nuls'
            let balance = await axios.get(api);
            balance = balance.data
            balance['0x217dffF57E3b855803CE88a1374C90759Ea071bD'] = balance.nuls
            return balance
        }else {
            let oracle = EVM_CHAINS[chainName].oracle
            if (!oracle) return;
            let call = tokens.filter(t => t.token != EVM_CHAINS[chainName].assets.USDT.address).map(t => ({
                target: oracle,
                call: [
                    'getRate(address,address,bool)(uint256)',
                    t.token,
                    EVM_CHAINS[chainName].assets.USDT.address,
                    true
                ],
                returns: [
                    [t.token, val => val.toString() / (10 ** (EVM_CHAINS[chainName].assets.USDT.decimals * 2 - t.decimals))]
                ]
            }))
            const results = await aggregate(call, EVM_CHAINS[chainName].Multi_Config);
            let balances = results.results.transformed;
            balances[EVM_CHAINS[chainName].assets.USDT.address] = 1
            return balances
        }
    } catch (e) {
        console.log('Get prices fail:', e);
    }
}