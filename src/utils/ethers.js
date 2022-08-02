import { ethers } from 'ethers'
import store from '@/store'
import { RPC_NODE, REPUTATION_NFT, REPUTATION_NFT_ID } from '@/config'
import { u8arryToHex, hexTou8array, hexToString, stringToHex } from '@/utils/helper'
import { sha256 } from 'js-sha256'
import base58 from 'bs58'

export const getReadOnlyProvider = () => {
    // if (store.state.ethers && Object.keys(store.state.ethers).length > 0) {
    //     return store.state.ethers
    // }
    const provider = new ethers.providers.JsonRpcProvider(RPC_NODE)
    // store.commit('saveEthers', provider)
    return provider
}

export const generateEth = (username, pwd) => {
    const pass = pwd
    var seed = username + 'owner' + pass;
	var brainKey = seed.trim().split(/[\t\n\v\f\r ]+/).join(' ');
	var privateKey = sha256(brainKey);
    const wallet = new ethers.Wallet(privateKey)
    return {eth: wallet.address, ethPrivateKey: privateKey}
}

export const randomEthAccount = () => {
    const key = ethers.utils.randomBytes(32);
    const wallet = new ethers.Wallet(key);
    return { ethAddress: wallet.address, privateKey: u8arryToHex(key)}
}

export const generateBrainKey = (key) => {
    key = '0x80' + key;
    var checksum = sha256(key)
    checksum = sha256(checksum)
    checksum = checksum.slice(0, 4)
    const private_wif = key + checksum;
    return stringToHex('P' + base58.encode(hexTou8array(private_wif)))
}

const balanceAbi = [{
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }]

export const getReputation = (ethAddress) => {
    
}