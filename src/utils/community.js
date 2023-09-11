import store from '@/store'
import { checkAccessToken, logout } from '@/utils/account'
import { joinCommunity as jc, getCommunityPendingRewards as gcpr, getCommunityAuthorPendingRewards as gcapr,
    getCommunityClaimRewardsParas as gccrp, getCommunityClaimAuthorRewardsParas as gccarp, setCommunityRewardClaimed as scrc,
    setCommunityAuthorRewardClaimed as scarc, getCommunityHistoryRewards as gchr, getCommunityAuthorHistoryRewards as gcahr,
    getJoinCommunityState as gjcs, getCommunities as gcs, getSpaceClaimRewardsParas as gscrp,
    setSpaceRewardClaimed as ssrc } from '@/api/api'
import { EVM_CHAINS, EVM_CHAINS_ID, errCode } from '@/config';
import { aggregate } from '@makerdao/multicall/dist/multicall.cjs';

export const getCommunities = async () => {
    const coms = await gcs(store.getters.getAccountInfo?.twitterId);
    store.commit('community/saveCommunities', coms);
}

export const getCommunityClaimRewardsParas = async (communityId, twitterId, ids) => {
    await checkAccessToken();
    try {
        const params = await gccrp(communityId, twitterId, ids)
        return params;
    } catch (e) {
        if (e === 401) {
            await logout(twitterId)
            throw 'log out'
        }
        throw e
    }
}

export const getCommunityClaimAuthorRewardsParas = async (communityId, twitterId, ids) => {
    await checkAccessToken();
    try {
        const params = await gccarp(communityId, twitterId, ids)
        return params;
    } catch (e) {
        if (e === 401) {
            await logout(twitterId)
            throw 'log out'
        }
        throw e
    }
}

export const getSpaceClaimRewardsParas = async (communityId, twitterId, ids) => {
    await checkAccessToken();
    try {
        const params = await gscrp(communityId, twitterId, ids)
        return params;
    } catch (e) {
        if (e === 401) {
            await logout(twitterId)
            throw 'log out'
        }
        throw e
    }
}

export const setCommunityRewardClaimed = async (twitterId, ids, orderId, transHash) => {
    await checkAccessToken();
    try {
        const params = await scrc(twitterId, ids, orderId, transHash)
        return params;
    } catch (e) {
        if (e === 401) {
            await logout(twitterId)
            throw 'log out'
        }
        throw e
    }
}

export const setSpaceRewardClaimed = async (twitterId, ids, orderId, transHash) => {
    await checkAccessToken();
    try {
        return await ssrc(twitterId, ids, orderId, transHash)
    } catch (e) {
        if (e === 401) {
            await logout(twitterId)
            throw 'log out'
        }
        throw e
    }
}

export const setCommunityAuthorRewardClaimed = async (twitterId, ids, orderId, transHash) => {
    await checkAccessToken();
    try {
        const params = await scarc(twitterId, ids, orderId, transHash)
        return params;
    } catch (e) {
        if (e === 401) {
            await logout(twitterId)
            throw 'log out'
        }
        throw e
    }
}

export const getJoinCommunityState = async (twitterId) => {
    await checkAccessToken();
    try {
        return await gjcs(twitterId);
    } catch (e) {
        if (e === 401) {
            await logout(twitterId)
            throw 'log out'
        }
        throw e
    }
}

export const joinCommunity = async (communityId) => {
    await checkAccessToken();
    const twitterId = store.getters.getAccountInfo.twitterId;
    try {
       await jc(twitterId, communityId)
       const showingCommunity = store.state.community.showingCommunity;
       showingCommunity.joined = 1;
       const communities = store.state.community.communities;
       if (communities && communities.length > 0) {
            const community = communities.find(c => c.communityId === communityId)
            if (community) {
                community.joined = 1
            }
       }
    }catch(e) {
        if (e === 401) {
            await logout(twitterId)
            throw 'log out'
        }
        throw e
    }
}

export const getCommunityPolicyStake = async (chainName, ethAddress, policys) => {
    try {
        let call = []
        if (policys && policys.length > 0) {
            for (let p of policys) {
                if (p.type === 'stake') {
                    const target = p.contract
                    call.push({
                        target,
                        call: [
                            'getUserStakedAmount(address)(uint256)',
                            ethAddress
                        ],
                        returns: [
                            [p.name + ':user', val => val.toString() / (10 ** p.tokenDecimals)]
                        ]
                    });
                    call.push({
                        target,
                        call: [
                            'getTotalStakedAmount()(uint256)'
                        ],
                        returns: [
                            [p.name + ':total', val => val.toString() / (10 ** p.tokenDecimals)]
                        ]
                    })
                }
            }
            const res = await aggregate(call, EVM_CHAINS[chainName].Multi_Config);
            return res.results.transformed;
        }
        return {}
    } catch (e) {
        console.log('get stake fail:', e)
    }
}

export const getCommunityNFTHolding = async (chainName, ethAddress, policys) => {
    try {
        let call = []
        if (policys && policys.length > 0) {
            for (let p of policys) {
                if (p.type === 'nft-hold') {
                    const target = p.contract
                    call.push({
                        target,
                        call: [
                            'symbol()(string)'
                        ],
                        returns: [
                            [target + ':symbol']
                        ]
                    });
                    call.push({
                        target,
                        call: [
                            p.method,
                            ethAddress
                        ],
                        returns: [
                            [target + ':hold', val => val / 1]
                        ]
                    });
                    call.push({
                        target,
                        call: [
                            'totalSupply()(uint256)'
                        ],
                        returns: [
                            [target + ':supply', val => val / 1]
                        ]
                    })
                }
            }
            const res = await aggregate(call, EVM_CHAINS[chainName].Multi_Config);
            return res.results.transformed;
        }
        return {}
    } catch (e) {
        console.log('get nft holding fail:', e)
    }
}

/**
 * get community distribution eras
 * @param {*} communityId
 */
export const getSpecifyDistributionEras = async (community, nutboxContract) => {
    return new Promise(async (resolve, reject) => {
      const distribuitons = store.state.community.specifyDistributionEras;
      if (distribuitons && distribuitons.length > 0) {
        resolve(distribuitons);
        return;
      }
      const chainName = EVM_CHAINS_ID[community.chainId]
      let decimals = community.rewardTokenDecimals;
      const Multi_Config =  EVM_CHAINS[chainName].Multi_Config

      try {
        const rewardCalculatorAddress = EVM_CHAINS[chainName].rewardCalculatorAddress
        if (true) {
          let count = await aggregate([{
            target: rewardCalculatorAddress,
            call: [
              'distributionCountMap(address)(uint256)',
              nutboxContract
            ],
            returns: [
              ['count']
            ]
          }], Multi_Config)

          count = parseInt(count.results.transformed['count'])

          const calls = new Array(count).toString().split(',').map((item, i) => ({
            target: rewardCalculatorAddress,
            call: [
              'distributionErasMap(address,uint256)(uint256,uint256,uint256)',
              nutboxContract,
              i
            ],
            returns: [
              ['amount-'+i],
              ['startHeight-'+i],
              ['stopHeight-'+i]
            ]
          }))
          let distibution = await aggregate(calls, Multi_Config)
          distibution = distibution.results.transformed
          let distri = []
          for (let dis in distibution) {
            const [type, index] = dis.split('-');
            if (!distri[index]) {
              distri[index] = {}
            }
            distri[index][type] = distibution[dis]
          }
          distri = distri.map((item, i) => ({
            percentage: item.stopHeight - item.startHeight,
            amount: item.amount.toString() / 10 ** decimals,
            startHeight: item.startHeight.toString(),
            stopHeight: item.stopHeight.toString(),
            background: `rgba(98, 70, 234, ${(i + 1) * (1.0 / count)})`,
          }));
          store.commit("community/saveSpecifyDistributionEras", distri);
          resolve(distri);
        }
      } catch (e) {
        console.log("getSpecifyDistributionEras", e);
        reject(e);
        return;
      }
    })
  }
