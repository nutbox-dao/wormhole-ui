import axios from 'axios'
import store from '@/store'
import { COLLECT_BLESS_CONTRACT, NEW_YEAR_CARD_CONTRACT, Multi_Config, RPC_NODE } from '@/config'
import { ethers } from 'ethers';
import { getEthWeb } from "./web3/web3";
import { waitForTx } from './ethers'
import { aggregate } from '@makerdao/multicall/dist/multicall.cjs';

async function getAbi() {
    let abi = store.state.newYear.collectBlessAbi;
    if (abi.length > 0) {
        return abi;
    }
    abi = await axios.get('/CollectBless.json');
    abi = abi.abi;
    store.commit('newYear/saveCollectBlessAbi', abi);
    return abi;
}

export async function getUserNYCards(ethAddress) {
    if (!ethers.utils.isAddress(ethAddress)) {
        return;
    }
    store.commit('newYear/saveBlessCardBalance', {
        1: 2,
        2:4,
        3: 5,
        4:87,
        5:23
    })
    return;
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
    let balances = {}
    for (let b in infos) {
        if (infos[b] > 0) {
            balances[b] = infos[b]
        }
    }
    store.commit('newYear/saveBlessCardBalance', balances)
    return balances
}

export async function getUserBlindBox(ethAddress) {
    if (!ethers.utils.isAddress(ethAddress)) {
        return;
    }
    const provider = new ethers.providers.JsonRpcProvider(RPC_NODE)
    const abi = await getAbi();
    let contract = new ethers.Contract(COLLECT_BLESS_CONTRACT, abi, provider)

    const boxes = await contract.getUserOpendBox(ethAddress, 0, 500);
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
                ['totalWeights']
            ]
        },
        {
            target: COLLECT_BLESS_CONTRACT,
            call: [
                'userWeights(address)(uint256)',
                ethAddress
            ],
            returns:[
                ['userWeights']
            ]
        },
        {
            target: COLLECT_BLESS_CONTRACT,
            call: [
                'prizePoolAmount()(uint256)'
            ],
            returns: [
                ['prizeTotalAmount']
            ]
        },
        {
            target: COLLECT_BLESS_CONTRACT,
            call: [
                'mintBoxCounts(address)(uint256)',
                ethAddress
            ],
            returns: [
                ['mintBoxCounts']
            ]
        },
        {
            target: COLLECT_BLESS_CONTRACT,
            call: [
                'openBoxCounts(address)(uint256)',
                ethAddress
            ],
            returns: [
                ['openBoxCounts']
            ]
        },
        {
            target: COLLECT_BLESS_CONTRACT,
            call: [
                'eventEndTime()(uint256)'
            ],
            returns: [
                ['eventEndTime']
            ]
        }
    ]
    const res = await aggregate(calls, Multi_Config);
    return res.results.transformed;
}

export async function buyRareCard(counts, account) {
    const abi = await getAbi();
    const metamask = await getEthWeb()
    const provider = new ethers.providers.Web3Provider(metamask)
    let contract = new ethers.Contract(COLLECT_BLESS_CONTRACT, abi, provider)
    contract = contract.connect(provider.getSigner())

    const tx = await contract.mintRareCard(counts, account);
    await waitForTx(provider, tx.hash)
    return true;
}

export async function mintBlindBox(rewardToken, type, id, counts, totalAmount) {
    return new Promise(async (resolve, reject) => {
        try {
            const abi = await getAbi();
            const metamask = await getEthWeb()
            const provider = new ethers.providers.Web3Provider(metamask)
            let contract = new ethers.Contract(COLLECT_BLESS_CONTRACT, abi, provider)
            contract = contract.connect(provider.getSigner())

            contract.on('MintBox', async (creator, ids) => {
                if (creator.toLowerCase() == account.toLowerCase()) {
                    contract.removeAllListeners('MintBox')
                    resolve(ids);
                }
            })

            let tx;
            if (type === 'ERC20') {
                tx = await contract.mintBox(rewardToken, counts, totalAmount);
            }else if(type === 'ERC1155') {
                tx = await contract.mintBoxNFT1155(rewardToken, id, counts);
            }else if(type === 'ERC721') {
                tx = await contract.mintBoxNFT721(rewardToken, id);
            }
            await waitForTx(provider, tx.hash)
        } catch (e) {
            console.log('mint box fail:',e );
            reject(e)
        }
    })
}

export async function openBox(account, count) {
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
                    resolve(ids);
                }
            })

            let tx = await contract.openBox(count);
            await waitForTx(provider, tx.hash);
        } catch (e) {
            console.log('Open box fail:', e);
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