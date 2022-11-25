import { ethers } from  'ethers'
import { u8arryToHex } from './helper'
import { getEthWeb } from "./web3/web3";
import { waitForTx } from './ethers'
import { CURATION_CONTRACT, errCode, EVM_CHAINS, RPC_NODE } from '@/config'
import { checkAccessToken } from '@/utils/account'
import { newCuration as nc, newCurationWithTweet as ncwt, tipEVM as te } from '@/api/api'

const abi = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "taskIds",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "endTime",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "topCount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "maxCount",
          "type": "uint256"
        }
      ],
      "name": "newTask",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_limit",
          "type": "uint256"
        }
      ],
      "name": "distribute",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "taskInfo",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "token",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "enum Task.TaskState",
              "name": "taskState",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "currentIndex",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "topCount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maxCount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "feedTotal",
              "type": "uint256"
            }
          ],
          "internalType": "struct Task.TaskInfo",
          "name": "task",
          "type": "tuple"
        },
        {
          "internalType": "uint256",
          "name": "userCount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

  /**
   * 
   * @param {*} curation
   *    uint256 curationId,
        uint256 endtime,
        address token,
        uint256 amount,
        uint256 topCount,
        uint256 maxCount 
   */
export const creteNewCuration = async (chainName, curation) => {
    return new Promise(async (resolve, reject) => {
        try{
            const curationContract = EVM_CHAINS[chainName].curation
            const metamask = await getEthWeb()
            const provider = new ethers.providers.Web3Provider(metamask)
            let contract = new ethers.Contract(curationContract, abi, provider)
            contract = contract.connect(provider.getSigner())
            const {curationId, endtime, token, amount, maxCount} = curation
            const tx = await contract.newTask(ethers.BigNumber.from('0x' + curationId), endtime, token, amount, 30, maxCount)
            await waitForTx(provider, tx.hash)
            resolve(tx.hash)
        }catch(e) {
            console.log('create new curation fail:', e);
            reject(errCode.TRANSACTION_FAIL)
        }
    })
}

export const getCurationInfo = async (chainName, curationId) => {
  try {
    const curationContract = EVM_CHAINS[chainName].curation
    curationId = ethers.BigNumber.from('0x' + curationId);
    const provider = new ethers.providers.JsonRpcProvider(RPC_NODE)
    let contract = new ethers.Contract(curationContract, abi, provider)
    const info = await contract.taskInfo(curationId);
    return info;
  } catch (error) {
    console.log('Get curation info from chain fail:', error);
  }
}

export const claimReward = async (curationId) => {
  try {
    const metamask = await getEthWeb()
    const provider = new ethers.providers.Web3Provider(metamask)
    let contract = new ethers.Contract(CURATION_CONTRACT, abi, provider)
    contract = contract.connect(provider.getSigner())

    const tx = await contract.distribute(ethers.BigNumber.from('0x' + curationId), 300)
    await waitForTx(provider, tx.hash);
    
  } catch(err) {

  }
}

export const randomCurationId = () => {
    let id = ethers.utils.randomBytes(6)
    id = u8arryToHex(id);
    return id;
}

/**
 * 
 * @param {*} curation {twitterId, curationId, creatorETH, content, token, amount, maxCount, endtime, transHash,
 * tweetId, authorId, chainId, curationType, tasks, spaceId, hostIds, speakerIds, title,
 * startedAt, scheduledStart, endedAt, tweetContent, endTime,retweetInfo, retweetId, pageInfo, createdAt}
 * @returns 
 */
export const newCurationWithTweet = async (curation) => {
  await checkAccessToken();
  const tweets = await ncwt(curation)
  return tweets;
}

/**
 * 
 * @param {*} curation {twitterId, curationId, creatorETH, content, token, amount, maxCount, endtime, transHash, chainId, tasks}
 * @returns 
 */
export const newCuration = async (curation) => {
  await checkAccessToken();
  const tweets = await nc(curation)
  return tweets;
}

export const tipEVM = async (tip) => {
  await checkAccessToken();
  const result = await te(tip)
  return result;
}