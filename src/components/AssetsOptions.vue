<template>
  <div>
    <div class="mt-1.8rem">
      <div class="mb-6px">{{$t('curation.chain')}}</div>
      <div class="w-full border-1 bg-black/40 border-1 border-color8B/30
                  flex items-center justify-between
                  light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                  rounded-12px h-40px 2xl:h-2rem">
        <el-select v-model="selectedChainName" class="w-full" size="large"
                   @change="connectWallet(selectedChainName)">
          <el-option label="Steem" value="steem"></el-option>
          <div class="w-full h-1px bg-color8B/30 my-0.5rem"></div>
          <el-option
              v-for="item of Object.keys(EVM_CHAINS)"
              :disabled="false"
              :key="item"
              :label="item"
              :value="item"
          />
        </el-select>
      </div>
    </div>
    <div class="mt-1.8rem" v-if="selectedChainName!=='steem'">
      <div class="mb-6px">{{$t('curation.connectWallet')}}</div>
      <div class="relative border-1 gradient-border gradient-border-color3 rounded-12px overflow-hidden">
        <button class="w-full bg-black/30 light:bg-gradient-btn-purple light:bg-white h-50px 2xl:h-2.5rem
                      flex justify-center items-center cursor-pointer"
                :disabled="!selectedChainName"
                @click="connectWallet">
            <span class="font-600 text-15px 2xl:text-0.75rem
                         light:bg-gradient-text-light
                         gradient-text gradient-text-purple-white">
              {{walletAddress ? formatAddress(walletAddress, 12, 12) : $t('common.connectMetamask')}}
            </span>
          <img class="absolute h-32px right-20px" src="~@/assets/icon-metamask.png" alt="">
          <div v-if="connectLoading"
               class="absolute bg-black/70 light:bg-white/40 w-full h-full rounded-12px flex justify-center items-center">
            <img class="w-3rem" src="~@/assets/loading-points.svg" alt="">
          </div>
        </button>
      </div>
    </div>
    <div class="mt-1.8rem">
      <div class="mb-6px">{{$t('curation.rewardsAmount')}}</div>
      <div class="flex items-center flex-col sm:flex-row">
        <div ref="tokenPopper"
             class="w-full sm:w-4/7 border-1 bg-black/40 border-1 border-color8B/30
                       light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                        rounded-12px h-40px 2xl:h-2rem">
          <slot name="amount"></slot>
        </div>
        <div class="w-full sm:w-3/7 mt-10px sm:pl-1.5rem sm:mt-0">
          <div v-if="chain==='steem'"
               class="w-full border-1 bg-black/40 border-1 border-color8B/30
                      light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                      flex items-center px-15px
                      rounded-12px h-40px 2xl:h-2rem">
            <img class="h-22px mr-15px rounded-full" src="~@/assets/icon-eth-white.svg" alt="">
            <span class="text-color8B text-15px">Steem</span>
          </div>
          <button v-else class="w-full border-1 bg-black/40 border-1 border-color8B/30
                          light:bg-colorF2 light:border-colorE3 hover:border-primaryColor disabled:border-color8B/30
                          rounded-12px h-40px 2xl:h-2rem" :disabled="!walletAddress">
            <el-popover popper-class="c-popper" placement="top" :width="popperWidth"
                        :disabled="!walletAddress"
                        trigger="click" ref="elPopover">
              <template #reference>
                <button class="h-full w-full flex justify-between items-center cursor-pointer px-15px"
                        :disabled="!walletAddress">
                  <span class="flex items-center">
                    <img v-if="TokenIcon[selectedToken.symbol]" class="h-22px mr-15px rounded-full"
                         :src="TokenIcon[selectedToken.symbol]" alt="">
                    <img v-else class="h-22px mr-15px rounded-full" src="~@/assets/icon-eth-white.svg" alt="">
                    <span class="text-color8B text-15px">{{ selectedToken.symbol }}</span>
                  </span>
                  <img class="w-1rem" src="~@/assets/icon-select-arrow.svg" alt="">
                </button>
              </template>
              <template #default>
                <div class="border-1 border-color8B/30 bg-blockBg
                                light:bg-white light:border-colorE3 hover:border-primaryColor
                                rounded-12px py-10px overflow-x-hidden">
                  <div class="px-10px mb-10px">
                    <div class="w-full border-1 bg-black/40 border-1 border-color8B/30
                                    light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                                    rounded-12px h-40px 2xl:h-2rem">
                      <input class="bg-transparent h-full w-full px-0.5rem"
                             v-model="searchToken"
                             @input="updateToken"
                             type="text" :placeholder="$t('curation.inputErc20')">
                    </div>
                  </div>
                  <div v-if="customToken"
                       class="h-full w-full flex items-center cursor-pointer border-b-1 border-color8B/10 py-3 px-10px
                           overflow-x-hidden hover:bg-black/30 light:hover:bg-black/10">
                    <img class="h-34px mr-15px" src="~@/assets/icon-eth-white.svg" alt="">
                    <div class="flex-1 flex flex-col text-color8B light:text-blueDark overflow-x-hidden"
                         @click="updateSelectBalance(customToken);selectedToken = customToken;$refs.elPopover.hide()">
                      <span class="text-15px">{{customToken.symbol}}</span>
                      <span class="text-12px whitespace-nowrap overflow-hidden overflow-ellipsis">
                            {{customToken.address}}
                          </span>
                    </div>
                  </div>
                  <div v-for="token of tokenList" :key="token.address"
                       @click="updateSelectBalance(token);selectedToken=token;$refs.elPopover.hide()"
                       class="h-full w-full flex items-center cursor-pointer border-b-1 border-color8B/10 py-3 px-10px
                           overflow-x-hidden hover:bg-black/30 light:hover:bg-black/10">
                    <img class="h-34px mr-15px rounded-full" :src="TokenIcon[token.symbol]" alt="">
                    <div class="flex-1 flex flex-col text-color8B light:text-blueDark overflow-x-hidden">
                      <span class="text-15px">{{token.symbol}}</span>
                      <span class="text-12px whitespace-nowrap overflow-hidden overflow-ellipsis">
                            {{token.address}}
                          </span>
                    </div>
                  </div>
                </div>
              </template>
            </el-popover>
          </button>
        </div>
      </div>
    </div>
    <div class="mt-0.4rem text-right font-400 flex justify-end items-center">
      <div>{{$t('common.balance')}}: </div>
      <div class="font-bold ml-5px">{{ formatAmount(selectBalance) }}</div>
    </div>
  </div>

</template>

<script>
import {EVM_CHAINS} from "@/config";
import {setupNetwork} from "@/utils/web3/web3";
import {accountChanged, getAccounts} from "@/utils/web3/account";
import {notify} from "@/utils/notify";
import {getERC20TokenBalance, getTokenInfo} from "@/utils/asset";
import {TokenIcon} from "@/config";
import {formatAddress} from "@/utils/tool";
import {formatAmount} from "@/utils/helper";
import {ethers} from "ethers";

export default {
  name: "ChainOptions",
  props: {
    chain: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    token: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      EVM_CHAINS,
      TokenIcon,
      connectLoading: false,
      popperWidth: 200,
      selectedChainName: '',
      walletAddress: '',
      selectedToken: {},
      selectBalance: 0,
      customToken: null,
      searchToken: ''
    }
  },
  mounted() {
    this.selectedChainName = this.chain
    this.walletAddress = this.address
    this.searchToken = this.token
    accountChanged(address => {
      if (this.selectedChainName) {
        this.walletAddress = address
        this.updateSelectBalance(this.selectedToken)
      }else {
        this.walletAddress = null
      }
    })
  },
  watch: {
    selectedChainName(val) {
      if(!val) this.selectedToken = {}, this.selectBalance = 0
    }
  },
  computed: {
    tokenList() {
      return this.selectedChainName && this.selectedChainName!=='steem'?
          Object.values(this.EVM_CHAINS[this.selectedChainName].assets):[]
    }
  },
  methods: {
    formatAddress,
    formatAmount,
    onNext() {
      this.$nextTick(() => {
        this.popperWidth = this.$refs.tokenPopper.clientWidth
      })
    },
    async connectWallet(chain) {
      this.$emit('chainChange', chain)
      if(chain==='steem') return
      this.connectLoading = true
      try{
        const connected = await setupNetwork(chain)
        if (connected) {
          this.walletAddress = await getAccounts(true);
          this.selectedToken = Object.values(EVM_CHAINS[chain].assets)[0];
          await this.updateSelectBalance(this.selectedToken)
        }else {
          this.selectedChainName = null;
          this.walletAddress = null;
        }
      } catch (e) {
        this.selectedChainName = null
        this.walletAddress = null
        notify({message: 'Connect metamask fail', duration: 5000, type: 'error'})
      } finally {
        this.connectLoading = false
      }
    },
    async updateSelectBalance(token) {
      if (!token) return;
      this.selectBalance = await getERC20TokenBalance(this.selectedChainName, token.address, this.walletAddress)
      this.$emit('tokenChange', this.selectedToken)
    },
    async updateToken() {
      if (!ethers.utils.isAddress(this.searchToken)) {
        this.customToken = null;
        return;
      }
      try {
        const res = await getTokenInfo(this.selectedChainName, this.searchToken)
        console.log(53, res);
        this.customToken = {...res, address: this.searchToken}
        this.selectedToken = this.customToken
        await this.updateSelectBalance(this.customToken)
      }catch(e) {
        console.log(63, e);
      }
    },
  }
}
</script>

<style scoped>

</style>
