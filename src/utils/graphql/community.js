import {
    gql
  } from 'graphql-request'
  import {
    restClient
  } from './index';
  import store from '@/store'
import { ethers } from 'ethers';

export async function getSpecifyCommunityInfoFromOurService(community) {
    try {
      community = ethers.utils.getAddress(community)
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
    console.log(65342, restClient)
      let data = await restClient.request(query)
      data = JSON.parse(data.value).community
      data.pools = data.pools.edges.map(p => {
          let pool = p.node
          pool.stakers = pool.stakers.edges.map(s => s.node)
          pool.voters = pool.voters.edges.map(v => v.node)
          return pool
      })
      data.users = data.users.edges.map(u => u.node)
      store.commit('community/saveNutboxCommunityInfo', data)
      return data
    } catch (e) {
      console.log('Get community from our service fail:', e);
    } finally {
    }
  }
