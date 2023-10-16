import axios from 'axios'
import store from '@/store'
import {
  setupNetwork,
  isUnlocked,
  connectMetamask
} from '@/utils/web3/web3'
import {
  getProvider,
  getReadonlyProvider
} from '@/utils/ethers'
import {
  ethers
} from 'ethers'
import {
  getAccounts
} from './account'
import {
  errCode
} from '../../config'
import { abis } from './abis'


// Get contract
export const getContract = async function (contractName, address, onlyRead = false) {
    return new Promise(async (resolve, reject) => {
      // await connectMetamask()
      // wheather metamask is locked
      if (!(await isUnlocked()) && !onlyRead) {
        console.log('metamask locked');
        try {
          await connectMetamask()
        } catch (e) {
          reject(errCode.NOT_CONNECT_METAMASK);
          return;
        }
      }
      // wheather get account
      const account = await getAccounts();
      if (!account && !onlyRead) {
        console.log('Please unlock wallet');
        reject(errCode.UNLOCK_METAMASK)
        return
      }

  
      const abi = abis[contractName]
      if (!onlyRead) {
        const metamask = await getEthWeb()
        const provider = new ethers.providers.Web3Provider(metamask)
        
        if (!provider || !abi) {
          reject(500);
          return;
        };
        // construct contract
        const contract = new ethers.Contract(contractAddress[contractName] || address, abi.abi, provider)
        // inject metamask
        resolve(contract.connect(provider.getSigner()))
      } else {
        const provider = getReadonlyProvider()
        const contract = new ethers.Contract(contractAddress[contractName] || address, abi.abi, provider)
        resolve(contract)
      }
    })
  }
  