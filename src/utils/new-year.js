import axios from 'axios'
import store from '@/store'
import { COLLECT_BLESS_CONTRACT, NEW_YEAR_CARD_CONTRACT, USDT_CONTRACT, Multi_Config, RPC_NODE, CHAIN_NAME } from '@/ny-config'
import { ethers } from 'ethers';
import { getEthWeb } from "./web3/web3";
import { waitForTx } from './ethers'
import { aggregate } from '@makerdao/multicall/dist/multicall.cjs';
import { getERC20TokenBalance, getApprovement, approve, approveERC1155, approveERC721 } from './asset'
import { getBlindCardsByIds as gbcbi } from '@/api/api'
import { sleep } from './helper';

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
        ethAddress = ethers.constants.AddressZero;
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
    // store.commit('newYear/saveBlessCardBalance', infos)
    return infos
}

export async function getUserActivityInfo(ethAddress) {
    if (!ethers.utils.isAddress(ethAddress)) {
        ethAddress = ethers.constants.AddressZero;
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
                ['prizeTotalAmount', val => val.toString() / (10**6)]
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
                ['alreadyReceived', val => val.toString() / 1e6]
            ]
        }
    ]
    const res = await aggregate(calls, Multi_Config);
    const info = res.results.transformed
    store.commit('newYear/saveUserActivityInfo', info)
    return info;
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