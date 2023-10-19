import {
  gql
} from 'graphql-request'
import {
  getClient
} from './index';
import store from '@/store'
import { ethers } from 'ethers';

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
