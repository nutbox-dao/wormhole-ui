import axios from 'axios'
import store from '@/store'
import { COLLECT_BLESS_CONTRACT, NEW_YEAR_CARD_CONTRACT, Multi_Config } from '@/config'
import { ethers } from 'ethers';
import { getEthWeb } from "./web3/web3";
import { waitForTx } from './ethers'

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
    let ids = [1,2,3,4,5]
    let call = ids.map(id => ({
        target: NEW_YEAR_CARD_CONTRACT,
        call: [
            'balanceOf(address,uint256)(uint256)',
            address,
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
    return balances
}

export async function getUserBlindBox(ethAddress) {
    if (!ethers.utils.isAddress(ethAddress)) {
        return;
    }
    const provider = new ethers.providers.JsonRpcProvider(RPC_NODE)
    const abi = await getAbi();
    let contract = new ethers.Contract(COLLECT_BLESS_CONTRACT, abi, provider)

    const boxes = await contract.getUserOpendBox(ethAddress);
    return boxes;
}
