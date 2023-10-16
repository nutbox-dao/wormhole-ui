import {
  gql
} from 'graphql-request'
import {
  getClient
} from './index';
import store from '@/store'
import { ethers } from 'ethers';

// get a community info from nutbox contract with community id
export async function getSpecifyCommunityInfoFromTheGraph(chainName, community) {
  
  try {
    const client = getClient(chainName);
    if (client.useTheGraph) {
      const query = gql `
          query Community($id: String!) {
              community(id: $id) {
                  id
                  createdAt
                  feeRatio
                  cToken
                  daoFund
                  retainedRevenue
                  owner{
                      id
                  }
                  pools {
                      id
                      status
                      name
                      asset
                      poolFactory
                      totalAmount
                      ratio
                      chainId
                      stakers(first: 10){
                          id
                      }
                      stakersCount
                      community{
                          id
                      }
                      hasCreateGauge
                      votedAmount
                      voters(first: 10){
                          id
                      }
                      votersCount
                  }
                  users {
                      id
                      createdAt
                      address
                      operationCount
                  }
                  operationCount
                  operationHistory(first: 60, orderBy: timestamp, orderDirection: desc) {
                    id
                    type
                    timestamp
                    poolFactory
                    pool{
                        id
                        name
                    }
                    user
                    chainId
                    asset
                    amount
                    timestamp
                    tx
                  }
              }
          }
      `
      const data = await client.client.request(query, {
        id: community.toLowerCase()
      })
      if (data && data.community) {
        const community = data.community
        store.commit('community/saveNutboxCommunityInfo', community)
        store.commit('community/savePoolsData', community.pools.filter(p => p.status === 'OPENED'))
        return community
      }
    }else {
      community = ethers.utils.getAddress(community);
      const query = `
          {
            community(id: "${community}") {
              id
              createdAt
              feeRatio
              cToken
              daoFund
              retainedRevenue
              owner{
                  id
              }
              pools {
                  edges{
                      node{
                          id
                          status
                          name
                          asset
                          poolFactory
                          totalAmount
                          ratio
                          chainId
                          stakers(first: 10){
                              edges{
                                  node{
                                      id
                                  }
                              }
                          }
                          stakersCount
                          community{
                              id
                          }
                          hasCreateGauge
                          votedAmount
                          voters(first: 10){
                              edges{
                                  node{
                                      id
                                  }
                              }
                          }
                          votersCount
                      }
                  }
              }
              users {
                edges{
                  node{
                    id
                    createdAt
                    address
                    operationCount
                  }
                }
              }
              operationCount
            }
          }
        `
      let data = await client.client.request(query);
      data = JSON.parse(data.value).community;
      data.pools = data.pools.edges.map(p => {
        let pool = p.node;
        return pool;
      })
      store.commit('community/saveNutboxCommunityInfo', data)
      store.commit('community/savePoolsData', data.pools.filter(p => p.status === 'OPENED'))
      return data
    }
    
  } catch (e) {
    console.log('Get community from graph fail:', e);
  } finally {
  }
}

export async function getMyCreatedCommunityInfoFromTheGraph(chainName, account) {
  try {
    const client = getClient(chainName);
    if (client.useTheGraph) {
      const query = gql`
      query getUser($id: String!) {
          user(id: $id) {
              inCommunities {
                  id
                  owner{
                      id
                  }
                  feeRatio
                  cToken
                  activedPoolCount
                  pools {
                    id
                    status
                    asset
                    poolFactory
                  }
              }
          }
      }
  `
      const userInfo = await client.client.request(query, {
        id: account.toLowerCase()
      })
      if (userInfo && userInfo.user && userInfo.user.inCommunities) {
        const joinedCommunity = userInfo.user.inCommunities;
        for (let i = 0; i < joinedCommunity.length; i++){
          if (joinedCommunity[i].owner.id.toLowerCase() === account.toLowerCase()){
            const stakingFactoryId = joinedCommunity[i].id;
            return stakingFactoryId;
          }
        }
      }
      return;
    }else {
      community = ethers.utils.getAddress(community);
      const query = `{
        user(id:"${account}") {
            createdAt
            inCommunities {
                edges{
                    node{
                        id
                        owner{
                            id
                        }
                        feeRatio
                        cToken
                        usersCount
                        poolsCount
                        activedPoolCount
                        pools {
                          edges{
                            node{
                              id
                              status
                              asset
                              poolFactory
                            }
                          }
                        }
                    }
                }
            }
        }
    }`
      let data = await client.client.request(query);
      data = JSON.parse(data.value).user
        if (data){
            const joinedCommunity = data.inCommunities.edges.map(c => c.node)
            for (let i = 0; i < joinedCommunity.length; i++){
              if (joinedCommunity[i].owner.id.toLowerCase() === account.toLowerCase()){
                const stakingFactoryId = joinedCommunity[i].id;
                return stakingFactoryId;
              }
            }
        }
    }
    
  } catch (e) {
    console.log('Get community from graph fail:', e);
  } finally {
  }
}