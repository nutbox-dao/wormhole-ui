import { ethers } from  'ethers'
import { u8arryToHex } from './helper'
import { getEthWeb } from "./web3/web3";
import { waitForTx } from './ethers'
import { errCode, AutoCurationContract } from '@/config'
import { EVM_CHAINS } from '@/chain-config'
import { checkAccessToken, logout } from '@/utils/account'
import { newCuration as nc, newCurationWithTweet as ncwt, tipEVM as te, newPopup as npp, getClaimParas as gcp,
        likeCuration as lc, followCuration as fc, checkMyCurationRecord as ccr, checkMyPopupRecord as cpr,
        retweetCuration as retc, quoteCuration as qc, replyCuration as rc, 
        preNewCuration as pnc, getInvitorsOfUser as giou, getClaimRewardsParas as gcrp,
        setInvitationRewardClaimed as sirc } from '@/api/api'
import { aggregate } from '@makerdao/multicall';

const abi = [
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
          "name": "curationId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "popupTweetId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "endTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "winnerCount",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "bonus",
          "type": "uint256"
        }
      ],
      "name": "createPopup",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "twitterId",
          "type": "uint256"
        },
        {
          "internalType": "uint256[]",
          "name": "curationIds",
          "type": "uint256[]"
        }
      ],
      "name": "checkClaim",
      "outputs": [
        {
          "internalType": "bool[]",
          "name": "",
          "type": "bool[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "twitterId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "addr",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "curationIds",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        },
        {
          "internalType": "bytes",
          "name": "sign",
          "type": "bytes"
        }
      ],
      "name": "claimPrize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "chainId",
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
              "internalType": "uint256",
              "name": "claimedAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maxCount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "userCount",
              "type": "uint256"
            }
          ],
          "internalType": "struct Curation.TaskInfo",
          "name": "task",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "cid",
          "type": "uint256"
        }
      ],
      "name": "getCommunityInfo",
      "outputs": [
        {
          "internalType": "address",
          "name": "communityAddr",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "prizeToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "balance",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "signAddr",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "storageAddr",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
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
            const tx = await contract.newTask(ethers.BigNumber.from('0x' + curationId), endtime, token, amount, maxCount)
            await waitForTx(provider, tx.hash)
            resolve(tx.hash)
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

export const createPopup = async (chainName, popup) => {
  return new Promise(async (resolve, reject) => {
    try{
        const popupContract = EVM_CHAINS[chainName].popup
        const metamask = await getEthWeb()
        const provider = new ethers.providers.Web3Provider(metamask)
        let contract = new ethers.Contract(popupContract, abi, provider)
        contract = contract.connect(provider.getSigner())
        const {curationId, popupTweetId, endTime, winnerCount, token, bonus} = popup
        const tx = await contract.createPopup(ethers.BigNumber.from('0x' + curationId), ethers.BigNumber.from(popupTweetId), endTime, winnerCount, token, bonus)
        await waitForTx(provider, tx.hash)
        resolve(tx.hash)
    }catch(e) {
        console.log('create new popup fail:', e);
        reject(errCode.TRANSACTION_FAIL)
    }
  })
}

export const checkCurationRewards = async (chainName, twitterId, ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      const curationContract = EVM_CHAINS[chainName].curation;
      const provider = new ethers.providers.JsonRpcProvider(EVM_CHAINS[chainName].rpc);
      let contract = new ethers.Contract(curationContract, abi, provider);
      const results = await contract.checkClaim(twitterId, ids.map(id => ethers.BigNumber.from('0x' + id)));
      resolve(results);
    } catch (e) {
      console.log('chech curation rewards fail:', e);
      reject(errCode.BLOCK_CHAIN_ERR)
    }
  })
}

export const checkCommunityRewards = async (chainName, twitterId, rewards) => {
  try {
    const contract = EVM_CHAINS[chainName].communityCuration
    const multiConfig = EVM_CHAINS[chainName].Multi_Config
    let call = rewards.map(re => ({
      target: contract,
      call: [
        'alreadyClaimed(uint256,uint256)(bool)',
        twitterId,
        ethers.BigNumber.from('0x' + re.communityId + re.curationId)
      ],
      returns: [
        [re.curationId]
      ]
    }))
    const result = await aggregate(call, multiConfig)
    return result.results.transformed
  }catch(e) {
    console.log('check community curation rewards fail:', e);
    throw errCode.BLOCK_CHAIN_ERR
  }
}

export const checkAutoCurationRewards = async (twitterId, ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(EVM_CHAINS['BNB Smart Chain'].rpc);
      let contract = new ethers.Contract(AutoCurationContract, abi, provider);
      const results = await contract.checkClaim(twitterId, ids.map(id => ethers.BigNumber.from('0x' + id)));
      resolve(results);
    } catch (e) {
      console.log('chech auto curation rewards fail:', e);
      reject(errCode.BLOCK_CHAIN_ERR)
    }
  })
}

export const getClaimParas = async (chainName, twitterId, ids) => {
  await checkAccessToken();
  return await gcp(twitterId, EVM_CHAINS[chainName].id, ids);
}

export const claimRewards = async (chainName, twitterId, ethAddress, ids, amount, sig) => {
  return new Promise(async (resolve, reject) => {
    try{
        const curationContract = EVM_CHAINS[chainName].curation
        const metamask = await getEthWeb()
        const provider = new ethers.providers.Web3Provider(metamask)
        let contract = new ethers.Contract(curationContract, abi, provider)
        contract = contract.connect(provider.getSigner())
        const tx = await contract.claimPrize(twitterId, ethAddress, ids, amount, sig)
        await waitForTx(provider, tx.hash)
        resolve(tx.hash)
    }catch(e) {
        console.log('claim rewards fail:', e);
        reject(errCode.TRANSACTION_FAIL)
    }
  })
}

export const getCommunityContractInfo = async (chainName, communityId) => {
  try {
    const curationContract = EVM_CHAINS[chainName].communityCuration;
    let provider = new ethers.providers.JsonRpcProvider(EVM_CHAINS[chainName].rpc);
    let contract = new ethers.Contract(curationContract, abi, provider); 
    const community = await contract.getCommunityInfo(ethers.BigNumber.from('0x' + communityId));
    return community;
  } catch (e) {
    console.log('get community contract info fail:', e)
  }
}

export const claimCommunityRewards = async (chainName, twitterId, ethAddress, communityId, ids, amount, sig) => {
  try {
    const curationContract = EVM_CHAINS[chainName].communityCuration;
    let provider = new ethers.providers.JsonRpcProvider(EVM_CHAINS[chainName].rpc);
    let contract = new ethers.Contract(curationContract, abi, provider); 
    const community = await contract.getCommunityInfo(ethers.BigNumber.from('0x' + communityId));

    const claimAbi = [{
      "inputs": [
        {
          "internalType": "uint256",
          "name": "twitterId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "addr",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "curationIds",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "sign",
          "type": "bytes"
        }
      ],
      "name": "claimPrize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }]
    const metamask = await getEthWeb()
    provider = new ethers.providers.Web3Provider(metamask)
    contract = new ethers.Contract(community.communityAddr, claimAbi, provider);
    contract = contract.connect(provider.getSigner());
    const result = await contract.claimPrize(twitterId, ethAddress, ids, amount, sig);
    return result.hash;
  } catch (e) {
    console.log('claim rewards fail:', e);
    throw errCode.TRANSACTION_FAIL
  }
}

export const claimPromotionCurationRewards = async (chainName, twitterId, ethAddress, ids, amounts, sig) => {
  return new Promise(async (resolve, reject) => {
    try {
      const metamask = await getEthWeb()
      const provider = new ethers.providers.Web3Provider(metamask);
      const abi = [{
        "inputs": [
          {
            "internalType": "uint256",
            "name": "twitterId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "addr",
            "type": "address"
          },
          {
            "internalType": "uint256[]",
            "name": "curationIds",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "sign",
            "type": "bytes"
          }
        ],
        "name": "claimPrize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }]
      let contract = new ethers.Contract(AutoCurationContract, abi, provider)
      contract = contract.connect(provider.getSigner());
      const tx = await contract.claimPrize(twitterId, ethAddress, ids, amounts, sig)
      await waitForTx(provider, tx.hash);
      resolve(tx.hash)
    } catch (e) {
      console.log('claim rewards fail:', e);
        reject(errCode.TRANSACTION_FAIL)
    }
  })
}

export const getChainIdOfCurationContract = async (chainName) => {
  try {
    const curationContract = EVM_CHAINS[chainName].curation
    const provider = new ethers.providers.JsonRpcProvider(EVM_CHAINS[chainName].rpc)
    let contract = new ethers.Contract(curationContract, abi, provider)
    const res = await contract.chainId();
    console.log('chain id:', chainName, res);
  } catch (e) {
      console.log(90, e);
  }
}

export const getCurationDetail = async (chainName, curationId) => {
  try {
    const curationContract = EVM_CHAINS[chainName].curation
    const provider = new ethers.providers.JsonRpcProvider(EVM_CHAINS[chainName].rpc)
    let contract = new ethers.Contract(curationContract, abi, provider)
    const res = await contract.taskInfo(ethers.BigNumber.from('0x' + curationId));
  } catch (e) {
      console.log(91, e);
  }
}

export const getSingerOfCuration = async (chainName) => {
  try {
    let calls = [
      {
        target: EVM_CHAINS[chainName].curation,
        call: [
          'signAddress()(address)',
        ],
        returns: [
          ['address']
        ]
      }
    ]

    const res = await aggregate(calls, EVM_CHAINS[chainName].Multi_Config);
    console.log('singer:', res.results.transformed.address);
    return res.results.transformed.address
  } catch (e) {
      console.log(92, e);
  }
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

export const newPopups = async (popup) => {
  await checkAccessToken();
  const res = await npp(popup);
  return res;
}

export const preNewCuration = async (curation) => {
  await checkAccessToken();
  return await pnc(curation)
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

/**
 * 
 * @param {*} curation {twitterId, tweetId, curationId} 
 */
export const likeCuration = async (curation) => {
  await checkAccessToken();
  const { twitterId, tweetId, curationId } = curation
  try {
    const res = await lc(twitterId, tweetId, curationId)
    return res
  }catch(e) {
    if (e === 401) {
      await logout(twitterId)
      throw 'log out'
    }
    throw e
  }
}

/**
 * 
 * @param {*} curation {twitterId, authorId, curationId}
 */
export const followCuration = async (curation) => {
  await checkAccessToken();
  const { twitterId, authorId, curationId } = curation
  try {
    const res = await fc(twitterId, authorId, curationId)
    return res
  }catch(e) {
    if (e === 401) {
      await logout(twitterId)
      throw 'log out'
    }
    throw e
  }
}

export const quoteCuration = async (twitterId, userInfo, content, curationId) => {
  await checkAccessToken();
  try {
    const res = await qc(twitterId, userInfo, content, curationId);
    return res;
  } catch (e) {
    if (e === 401) {
      await logout(twitterId)
      throw 'log out'
    }
    if (e === 303) {
      throw 303
    }
    throw e
  }
}
export const replyCuration = async (twitterId, userInfo, content, curationId) => {
  await checkAccessToken();
  try {
    const res = await rc(twitterId, userInfo, content, curationId);
    return res;
  } catch (e) {
    if (e === 401) {
      await logout(twitterId)
      throw 'log out'
    }
    if (e === 303) {
      throw 303
    }
    throw e
  }
}

export const retweetCuration = async (twitterId, curationId) => {
  await checkAccessToken();
  try {
    const res = await retc(twitterId, curationId);
    return res;
  } catch (e) {
    if (e === 401) {
      await logout(twitterId)
      throw 'log out'
    }
    throw e
  }
}

export const checkMyCurationRecord = async (twitterId, curationId) => {
   await checkAccessToken();
   try {
      const res = await ccr(twitterId, curationId);
      return res;
   } catch (e) {
      if (e === 401) {
        await logout(twitterId);
        throw 'log out'
      }
   }
}

export const checkMyPopupRecord = async (twitterId, popupId) =>  {
  await checkAccessToken();
  try {
    const res = await cpr(twitterId, popupId);
    return res;
  }catch(e) {
    if (e === 401) {
      await logout(twitterId);
      throw 'log out'
    }
  }
}


/****************************************  Invitation  ***********************************************/
export const getInvitorsOfUser = async (twitterId, pageSize, pageIndex) => {
    // await checkAccessToken();
    try {
      const res = await giou(twitterId, pageSize, pageIndex);
      return res;
    } catch (e) {
      if (e === 401) {
        await logout(twitterId);
        throw 'log out'
      }
      throw e
    }
}

export const getClaimRewardsParas = async (communityId, twitterId) => {
  try {
    const res = await gcrp(communityId, twitterId);
    return res;
  } catch (e) {
    if (e === 401) {
      await logout(twitterId);
      throw 'log out'
    }
    throw e
  }
}

export const setInvitationRewardClaimed = async (orderId, communityId, twitterId, transHash) => {
  try {
    return await sirc(orderId, communityId, twitterId, transHash)
  } catch (e) {
    if (e === 401) {
      await logout(twitterId);
      throw 'log out'
    }
    throw e
  }
}