import {
    GraphQLClient
  } from 'graphql-request';
import { EVM_CHAINS } from '@/config';

export function getClient(chainName) {
  if (EVM_CHAINS[chainName].walnutGraph.url)
    return new GraphQLClient(EVM_CHAINS[chainName].walnutGraph.url)
}
export  const client = new GraphQLClient('https://api.thegraph.com/subgraphs/name/terryyyyyy/walnutinbsc');
