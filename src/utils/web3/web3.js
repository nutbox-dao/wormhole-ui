import {
  sleep
} from "../helper"
import {
  CHAIN_ID,
  RPC_NODE,
  CHAIN_NAME,
  MainToken,
  BLOCK_CHAIN_BROWER,
  EVM_CHAINS
} from '@/config'
import store from '@/store'
import { ethers, providers } from 'ethers'

import { UniPassPopupSDK } from "@unipasswallet/popup-sdk"
import { UniPassProvider } from "@unipasswallet/ethereum-provider"

export const runTestUpProvider = async (message) => {
  try{
  const upProvider = new UniPassProvider({
    chainId: 137,
    returnEmail: false,
    appSettings: {
      appName: 'wormhole3',
      appIcon: ''
    },
    rpcUrls: {
      mainnet: "your eth mainnet rpc url",
      polygon: "https://polygon-rpc.com",
      bscMainnet: "your bsc mainnet rpc url",
      rangersMainnet: "your rangers mainnet rpc url",
      arbitrumMainnet: "your arbitrum mainnet rpc url",

      polygonMumbai: "your polygon testnet rpc url",
      goerli: "your goerli testnet rpc url",
      bscTestnet: "your bsc testnet rpc url",
      rangersRobin: "your rangers testnet rpc url",
      arbitrumTestnet: "your arbitrum testnet rpc url",
    },
  });

  await upProvider.connect();
  const provider = new ethers.providers.Web3Provider(upProvider, 'any');
  const signer = provider.getSigner();

  const address = await signer.getAddress();
  console.log(1111, address);
  const sig = signer.signMessage(message);
  return sig;
}catch(e) {
  console.log(333, e);
}
}

export const getUnipass = () => {
  const upWallet = new UniPassPopupSDK({
    env: 'test',
    chainType: 'polygon',
    storageType: 'sessionStorage',
    appSettings: {
      theme: 'dark',
      appName: 'wormhole3',
      appIcon: ''
    }
  })
  return upWallet
}

export const connectUnipass = async () => {
  try {
    console.log(1);
    const upWallet = getUnipass();
    console.log(2);
    const account = await upWallet.login({
      email: true,
      connectType: 'both'
    })
    const  {address, email} = account;
    console.log(5, address, email);
  } catch (e) {
    console.log(6, e);
  }
}

export const signMessageByUP = async (message) => {
  const upWallet = getUnipass();
  const sig = await upWallet.signMessage(message, {isEIP191Prefix: false, onAuthChain: true});
  return sig;
}

/**
 * Add bsc to metamask
 * @returns 
 */
export const setupNetwork = async (chainName) => {
  await connectMetamask();
  const { id, rpc, scan, main } = EVM_CHAINS[chainName]
  const eth = await getEthWeb()
  try {
    const res = await eth.request({
      method: 'wallet_switchEthereumChain',
      params: [{
        chainId: `0x${id.toString(16)}`
      }],
    })
    store.commit('web3/saveChainId', parseInt(id))
    return true
  } catch (error) {
    if (error.code === 4001) return;
    if (error.code === -32002) return;
    try{
      const n = await eth.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${id.toString(16)}`,
          chainName,
          rpcUrls:[rpc],
          nativeCurrency: main,
          blockExplorerUrls: [scan]
        }],
      })
      store.commit('web3/saveChainId', parseInt(id))
      return true
    }catch(error){
      console.log('connect wallet fail', error);
      store.commit('web3/saveAccount', null)
      return false
    }
  }
}

export const signMessage = async (message, address) => {
  const metamask = await getEthWeb()
  const provider = new ethers.providers.Web3Provider(metamask)
  const signer = provider.getSigner();
  if (await signer.getAddress() === address) {
    return await signer.signMessage(message)
  }
}

/**
 * Get metamask eth
 */
export const getEthWeb = async () => {
  if (typeof window.ethereum !== 'undefined') {
    if (!window.ethereum.isMetaMask) {
      console.log('Not metamask wallet');
    }
    if (window.ethereum.overrideIsMetaMask) {
      return window.ethereum.selectedProvider ?? window.ethereum.providers.find(p => p.isMetaMask)
    }
    return window.ethereum
  }
  var metamask = window.ethereum
  for (let i = 0; i < 10; i++) {
    if (typeof window.ethereum !== 'undefined') {
      if (window.ethereum.overrideIsMetaMask) {
        return window.ethereum.selectedProvider ?? window.ethereum.providers.find(p => p.isMetaMask)
      }
      return window.ethereum
    }
    await sleep(0.5)
  }
  
  return metamask
}

/**
 * Connect to Metamask
 */
export const connectMetamask = async () => {
  const metamask = await getEthWeb()
  const accounts = await metamask.request({
    method: 'eth_requestAccounts'
  });
  return accounts
}

/**
 * User changed chain
 */
export const chainChanged = async (refresh) => {
  const metamask = await getEthWeb()
  metamask.on('chainChanged', async(chainId) => {
    console.log('Changed to new chain', parseInt(chainId));
    store.commit('web3/saveChainId', parseInt(chainId))
    if (refresh)
      refresh();
  })
}

/**
 * Is metamask unlocked
 * @returns bool
 */
export const isUnlocked = async () => {
  const metamask = await getEthWeb()
  return await metamask._metamask.isUnlocked()
}

/**
 * Monitor metamask lock state
 * @param {*} refresh 
 */
export const lockStatusChanged = async (refresh) => {
  while(true) {
    await sleep(3)
    if (await isUnlocked()){
    }else{
      store.commit('saveMetamaskConnected', false)
      if(!store.state.web3.account) continue;
      store.commit('web3/saveAccount', null)
      refresh()
      break;
    }
  }
}

/**
 * Add asset to metamask
 */
 export const addAssetToWallet = async (address, symbol, decimals, image) => {
  const metamask = await getEthWeb()
  metamask.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address,
        symbol,
        decimals,
        image
      }
    }
  }).then((success) => {
    if (success) {
      console.log(symbol, 'successfully added to wallet!');
    } else {
      console.log('Add asset faild');
    }
  }).catch(console.log)
}