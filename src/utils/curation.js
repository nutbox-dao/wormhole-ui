import { ethers } from  'ethers'
import { u8arryToHex } from './helper'
import store from '@/store'
import { getEthWeb } from "./web3/web3";
import { waitForTx } from './ethers'
import { CURATION_CONTRACT, errCode } from '@/config'

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
   * uint256 id,
        uint256 endTime,
        address token,
        uint256 amount,
        uint256 topCount,
        uint256 maxCount 
   */
export const creteNewCuration = async (curation) => {
    return new Promise(async (resolve, reject) => {
        try{
            const metamask = await getEthWeb()
            const provider = new ethers.providers.Web3Provider(metamask)
            let contract = new ethers.Contract(CURATION_CONTRACT, abi, provider)
            contract = contract.connect(provider.getSigner())
            const {curationId, endTime, token, amount, maxCount} = curation
            const tx = await contract.newTask(curationId, endTime, token, amount, 30, maxCount)
            await waitForTx(provider, tx.hash)
            resolve()
        }catch(e) {
            console.log('create new curation fail:', e);
            reject(errCode.TRANSACTION_FAIL)
        }
    })
}
export const randomCurationId = () => {
    let id = ethers.utils.randomBytes(6)
    id = u8arryToHex(id);
    return id;
}