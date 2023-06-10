import {
    gql
  } from 'graphql-request'
  import {
    client
  } from './index';
  import store from '@/store'
import { ethers } from 'ethers';

export async function getSpecifyCommunityInfoFromTheGraph(community) {
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
  try {
    const data = await client.request(query, {
      id: community.toLowerCase()
    })
    if (data && data.community) {
      const community = data.community
      store.commit('community/saveNutboxCommunityInfo', community)
      store.commit('community/savePoolsData', community.pools.filter(p => p.status === 'OPENED'))
      return community
    }
  } catch (e) {
    console.log('Get community from graph fail:', e);
  } finally {
  }
}
