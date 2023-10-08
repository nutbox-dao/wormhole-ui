
import { getEthWeb } from "../web3/web3";
import { contracts } from "@/nutbox-config"
import { ethers } from 'ethers'
import { abis } from './abis'
import { errCode } from "@/config";
import store from '@/store'
import { utf8ToHex } from "./utils"

/**
 * Create Community Staking Factory Contracts
 * @param {*} form contract params
 */
export const createCommunity = async (chainName, form, progress) => {
    return new Promise(async (resolve, reject) => {

        const fatoryAddress = contracts[chainName]['CommunityFactory']
        const pointFactoryAddress = contracts[chainName]['PointFactory']
        const metamask = await getEthWeb()
        const provider = new ethers.providers.Web3Provider(metamask)
        let contract = new ethers.Contract(fatoryAddress, abis['CommunityFactory'], provider)
        contract = contract.connect(provider.getSigner())
    
  
      try {
        // make params
        const account = store.getters.getAccountInfo.ethAddress;
        
        let distributionStr =
          "0x" +
          ethers.utils
            .hexZeroPad(ethers.utils.hexlify(progress.length), 1)
            .substring(2);
        for (let dis of progress) {
          distributionStr +=
            ethers.utils
              .hexZeroPad(
                ethers.BigNumber.from(dis.startHeight).toHexString(),
                32
              )
              .substring(2) +
            ethers.utils
              .hexZeroPad(ethers.BigNumber.from(dis.stopHeight).toHexString(), 32)
              .substring(2) +
            ethers.utils
              .hexZeroPad(
                ethers.utils
                  .parseUnits(dis.amount.toString(), 18)
                  .toHexString(),
                32
              )
              .substring(2);
        }
        contract.on('CommunityCreated', async (user, community, token) => {
          if (account.toLowerCase() === user.toLowerCase()){
            console.log('Create new staking feast', community, 'ctoken:', token);
            contract.removeAllListeners('CommunityCreated');
            const communityInfo = {
              id: ethers.utils.getAddress(community),
              cToken: ethers.utils.getAddress(token),
              firstBlock: progress[0].startHeight,
              daofund: user,
              retainedRevenue: 0,
              feeRatio: 0,
              owner: {
                id: user
              },
              pools:[]
            }
            // Created a new community
            store.commit('community/myCreatedNutboxCommunity', communityInfo);
            resolve(communityInfo)
          }
        })
        // call contract 
        const res = await contract.createCommunity(
          true,
          ethers.constants.AddressZero,
          pointFactoryAddress,
          makeSimpleMintableERC20Metadata(form.tokenName, form.tokenSymbol, 0, account, parseInt(form.startTime / 1000)),
          contracts[chainName]["LinearCalculator"],
          distributionStr);
        await waitForTx(res.hash);
      } catch (e) {
        console.log("Create Staking Feast Failed", e);
        reject(errCode.BLOCK_CHAIN_ERR);
        return;
      }
    });
  };

  function makeSimpleMintableERC20Metadata(name, symbol, supply, recipient, beginTime) {
    const meta = '0x' + ethers.utils.hexZeroPad(ethers.utils.hexlify(name.length), 1).substring(2)
     + utf8ToHex(name)
     + ethers.utils.hexZeroPad(ethers.utils.hexlify(symbol.length), 1).substring(2)
     + utf8ToHex(symbol)
     + ethers.utils.hexZeroPad(ethers.utils.parseUnits(beginTime.toString(), 0), 32).substring(2)
     + ethers.utils.hexZeroPad(ethers.utils.parseUnits(supply.toString(), 18), 32).substring(2)
     + recipient.substring(2)
     return meta
  }