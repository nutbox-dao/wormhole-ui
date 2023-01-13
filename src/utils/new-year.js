import axios from 'axios'
import store from '@/store'
import { COLLECT_BLESS_CONTRACT, NEW_YEAR_CARD_CONTRACT, USDT_CONTRACT, Multi_Config, RPC_NODE, CHAIN_NAME } from '@/ny-config'
import { ethers } from 'ethers';
import { getEthWeb } from "./web3/web3";
import { waitForTx } from './ethers'
import { aggregate } from '@makerdao/multicall/dist/multicall.cjs';
import { getERC20TokenBalance, getApprovement, approve, approveERC1155, approveERC721 } from './asset'
import { getBlindCardsByIds as gbcbi } from '@/api/api'

async function getAbi() {
    let abi = store.state.newYear?.collectBlessAbi;
    if (abi && Object.keys(abi).length > 0) {
        return abi;
    }
    abi = await axios.get('/CollectBless.json');
    abi = abi.data.abi;
    store.commit('newYear/saveCollectBlessAbi', abi);
    return abi;
}

export async function getUserNYCards(ethAddress) {
    if (!ethers.utils.isAddress(ethAddress)) {
        return;
    }

    let ids = [1,2,3,4,5]
    let call = ids.map(id => ({
        target: NEW_YEAR_CARD_CONTRACT,
        call: [
            'balanceOf(address,uint256)(uint256)',
            ethAddress,
            id
        ],
        returns: [
            [id, val => parseInt(val)]
        ]
    }));
    const res = await aggregate(call, Multi_Config);
    const infos = res.results.transformed;
    store.commit('newYear/saveBlessCardBalance', infos)
    return infos
}

export async function getUserBlindBox(ethAddress, start, end) {
    if (!ethers.utils.isAddress(ethAddress)) {
        return;
    }
    const provider = new ethers.providers.JsonRpcProvider(RPC_NODE)
    const abi = await getAbi();
    let contract = new ethers.Contract(COLLECT_BLESS_CONTRACT, abi, provider)

    let [boxIds, boxes, weights] = await contract.getUserOpendBox(ethAddress, start, end);
    if (boxIds.length === 0) return [];
    const boxInfo = await gbcbi(boxIds.map(id => id / 1));
    boxes = boxes.map((box, idx) => ({
        ...box,
        weights: weights[idx],
        ...boxInfo[idx],
    }));
    return boxes;
}

export async function getBlindBoxByIds(ids) {
    const provider = new ethers.providers.JsonRpcBatchProvider(RPC_NODE);
    const abi = await getAbi();
    let contract = new ethers.Contract(COLLECT_BLESS_CONTRACT, abi, provider);
    let [[boxes, weights], boxInfo] = await Promise.all([ contract.getBoxsByIds(ids), gbcbi(ids)]);
    boxInfo = boxInfo ?? {}
    console.log(boxes, weights);
    if (boxes.length === 0) {
        return []
    }
    boxes = boxes.map((box, idx) => ({
        ...box,
        weights: weights[idx],
        ...boxInfo[idx]
    }));
    return boxes;
}

export async function getUserActivityInfo(ethAddress) {
    if (!ethers.utils.isAddress(ethAddress)) {
        return;
    }
    let calls = [
        {
            target: COLLECT_BLESS_CONTRACT,
            call: [
                'totalWeights()(uint256)'
            ],
            returns: [
                ['totalWeights', val => val / 1]
            ]
        },
        {
            target: COLLECT_BLESS_CONTRACT,
            call: [
                'userWeights(address)(uint256)',
                ethAddress
            ],
            returns:[
                ['userWeights', val => val / 1]
            ]
        },
        {
            target: COLLECT_BLESS_CONTRACT,
            call: [
                'prizePoolAmount()(uint256)'
            ],
            returns: [
                ['prizeTotalAmount', val => val.toString() / (10**18)]
            ]
        },
        {
            target: COLLECT_BLESS_CONTRACT,
            call: [
                'mintBoxCounts(address)(uint256)',
                ethAddress
            ],
            returns: [
                ['mintBoxCounts', val => val / 1]
            ]
        },
        {
            target: COLLECT_BLESS_CONTRACT,
            call: [
                'openBoxCounts(address)(uint256)',
                ethAddress
            ],
            returns: [
                ['openBoxCounts', val  => val / 1]
            ]
        },
        {
            target: COLLECT_BLESS_CONTRACT,
            call: [
                'eventEndTime()(uint256)'
            ],
            returns: [
                ['eventEndTime', val => val / 1]
            ]
        },
        {
            target: COLLECT_BLESS_CONTRACT,
            call: [
                'alreadyReceived(address)(uint256)',
                ethAddress
            ],
            returns: [
                ['alreadyReceived', val => val.toString() / 1e18]
            ]
        }
    ]
    const res = await aggregate(calls, Multi_Config);
    const info = res.results.transformed
    store.commit('newYear/saveUserActivityInfo', info)
    return info;
}

export async function buyRareCard(counts, account) {
    const abi = await getAbi();
    console.log(677, counts, account);
    const metamask = await getEthWeb()
    const provider = new ethers.providers.Web3Provider(metamask)
    let contract = new ethers.Contract(COLLECT_BLESS_CONTRACT, abi, provider)
    contract = contract.connect(provider.getSigner())

    const tx = await contract.mintRareCard(counts, account);
    await waitForTx(provider, tx.hash)
    return true;
}

export async function mintBlindBox(account, rewardToken, type, id, counts, totalAmount) {
    return new Promise(async (resolve, reject) => {
        try {
            const abi = await getAbi();
            const metamask = await getEthWeb()
            const provider = new ethers.providers.Web3Provider(metamask)
            let contract = new ethers.Contract(COLLECT_BLESS_CONTRACT, abi, provider)
            contract = contract.connect(provider.getSigner())

            let hash;

            contract.on('MintBox', async (creator, ids) => {
                if (creator.toLowerCase() == account.toLowerCase()) {
                    contract.removeAllListeners('MintBox')
                    resolve([ids.map(val => val / 1), hash]);
                }
            })
            
            let tx;
            if (type === 'erc20') {
                tx = await contract.mintBox(rewardToken, counts, totalAmount);
            }else if(type === 'erc1155') {
                tx = await contract.mintBoxNFT1155(rewardToken, id, counts);
            }else if(type === 'erc721') {
                tx = await contract.mintBoxNFT721(rewardToken, id);
            }else if(type === 'none') {
                tx = await contract.mintWhitelistNFT(counts);
            }
            hash = tx.hash
            await waitForTx(provider, tx.hash)
        } catch (e) {
            console.log('mint box fail:',e );
            reject(e)
        }
    })
}

export async function openBox(account, count = 1) {
    return new Promise(async (resolve, reject)=>{
        try {
            const abi = await getAbi();
            const metamask = await getEthWeb()
            const provider = new ethers.providers.Web3Provider(metamask)
            let contract = new ethers.Contract(COLLECT_BLESS_CONTRACT, abi, provider)
            contract = contract.connect(provider.getSigner())

            contract.on('OpenBox', async (user, ids) => {
                if (user.toLowerCase() == account.toLowerCase()) {
                    contract.removeAllListeners('OpenBox')
                    try {
                        if (ids && ids.length > 0){
                            let box = await getBlindBoxByIds(ids.map(id => id / 1));
                            resolve(box);
                        }else {
                            resolve();
                        }
                    }catch(e) {
                        console.log('get boxes fail:', e);
                        resolve();
                    }
                }
            })

            let tx = await contract.openBox(count);
            await waitForTx(provider, tx.hash);
        } catch (e) {
            reject(e)
        }
    })
}

export async function claimPrize() {
    try {
        const abi = await getAbi();
        const metamask = await getEthWeb()
        const provider = new ethers.providers.Web3Provider(metamask)
        let contract = new ethers.Contract(COLLECT_BLESS_CONTRACT, abi, provider)
        contract = contract.connect(provider.getSigner())

        let tx = await contract.cashPrize();
        await waitForTx(provider, tx.hash)
        return tx.hash;
    } catch (e) {
        console.log('claimPrice fail:', e);
        return false;
    }
    
}

export async function getUSDTBalance(account) {
    const balance = await getERC20TokenBalance(CHAIN_NAME, USDT_CONTRACT, account);
    store.commit('newYear/saveUsdtBalance', balance)
    return balance
}

export async function checkUSDTApproved(account) {
    try {
        const res = await getApprovement(CHAIN_NAME, USDT_CONTRACT, account, COLLECT_BLESS_CONTRACT)
        store.commit('newYear/saveApprovedUSDT', res)
    } catch (e) {
        console.log('get approved usdt to card fail:', e);
    }
}

export async function approveUSDTToCollect(account) {
    const res = await approve(USDT_CONTRACT, account, COLLECT_BLESS_CONTRACT)
    if(res) {
        await checkUSDTApproved(account)
    }
}

export async function approve1155ToCollect(token, account) {
    const res = await approveERC1155(token, account, COLLECT_BLESS_CONTRACT)
    return res;
}

export async function approve721ToCollect(account) {
    const res = await(approveERC721(token, account, COLLECT_BLESS_CONTRACT))
}