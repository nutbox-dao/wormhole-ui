import { pendingBlockToStart } from '@/nutbox-config'
import { ethers } from "ethers"
import { getBlockNum } from '@/utils/web3/web3'
import { EVM_CHAINS } from "@/chain-config"

/**
 * Gegerate token distribution
 */
export async function getDistribution(chainName) {
    if (chainName === 'Arbitrum') {
        console.log(332, EVM_CHAINS)
        const chainId = EVM_CHAINS[chainName].id;
        const currentBlock = await getBlockNum(chainId)
        console.log(3, currentBlock)
        let progress = [];
        let startHeight = currentBlock + pendingBlockToStart[chainName];
        let stopHeight = startHeight + 12499999;
        progress.push({
            startHeight,
            stopHeight,
            amount: 800
        })

        startHeight = stopHeight + 1;
        stopHeight = stopHeight + 250000000;
        progress.push({
            startHeight,
            stopHeight,
            amount: 400
        })

        startHeight = stopHeight + 1;
        stopHeight = stopHeight + 250000000;
        progress.push({
            startHeight,
            stopHeight,
            amount: 200
        })

        startHeight = stopHeight + 1;
        stopHeight = stopHeight + 250000000;
        progress.push({
            startHeight,
            stopHeight,
            amount: 100
        })

        startHeight = stopHeight + 1;
        stopHeight = stopHeight + 250000000;
        progress.push({
            startHeight,
            stopHeight,
            amount: 50
        })

        startHeight = stopHeight + 1;
        stopHeight = stopHeight + 250000000;
        progress.push({
            startHeight,
            stopHeight,
            amount: 25
        })

        startHeight = stopHeight + 1;
        stopHeight = stopHeight + 250000000;
        progress.push({
            startHeight,
            stopHeight,
            amount: 12.5
        })

        startHeight = stopHeight + 1;
        stopHeight = stopHeight + 500000000;
        progress.push({
            startHeight,
            stopHeight,
            amount: 6.25
        })
        return progress
    }
}