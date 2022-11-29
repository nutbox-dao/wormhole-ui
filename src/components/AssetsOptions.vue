<template>
  <div ref="assetsOptionsRef">
    <div class="mt-1.8rem">
      <div class="font-bold mb-10px">{{$t('curation.network')}}</div>
      <div class="w-full bg-black/40 border-1 border-color8B/30
                  light:bg-white light:border-colorE3 flex items-center
                  rounded-8px overflow-hidden h-44px 2xl:h-2.1rem">
        <CustomSelect v-model="selectedChainName"
                      @change="connectWallet(selectedChainName)">
          <template #prefix>
            <!-- chain logo -->
            <img v-if="selectedChainName"
                 class="w-24px min-w-24px h-24px min-h-24px rounded-full mr-15px"
                 src="https://s2.coinmarketcap.com/static/img/coins/64x64/4687.png" alt="">
          </template>
          <template #options>
            <div class="bg-block light:bg-white border-1 border-color8B/30
                          light:border-colorE3 rounded-8px overflow-hidden">
              <template v-if="showsteem">
                <el-option value="steem" class="py-5px px-12px h-min">
                  <template #default>
                    <div class="flex items-center ">
                      <span class="min-w-24px min-h-24px">
                        <img class="w-24px h-24px rounded-full mr-15px"
                             src="https://s2.coinmarketcap.com/static/img/coins/64x64/4687.png" alt="">
                      </span>
                      <span>Steem</span>
                    </div>
                  </template>
                </el-option>
                <div class="w-full h-1px bg-color8B/30"></div>
                <div v-if="!showEvm" class="">
                  The target twitter user not register wormhole3
                </div>
              </template>
              <el-option v-for="item of Object.keys(EVM_CHAINS)" :key="item"
                         class="py-5px px-12px h-min"
                         :disabled="!showEvm"
                         :value="item">
                <template #default>
                  <div class="flex items-center ">
                    <span class="min-w-24px min-h-24px">
                      <img class="w-24px h-24px rounded-full mr-15px"
                           src="https://s2.coinmarketcap.com/static/img/coins/64x64/4687.png" alt="">
                    </span>
                    <span>{{item}}</span>
                  </div>
                </template>
              </el-option>
            </div>
          </template>
        </CustomSelect>
      </div>
    </div>
    <div v-if="selectedChainName==='steem'" class="text-color62 mt-6px font-bold text-right">
      {{$t('common.account')}}: {{getAccountInfo.steemId}}
    </div>
    <div v-else-if="formatAddress(walletAddress, 12, 12)" class="text-color62 mt-6px font-bold text-right">
      {{$t('common.address')}}: {{formatAddress(walletAddress, 12, 12) }}
    </div>
    <div class="mt-1.8rem">
      <div class="font-bold mb-10px">{{$t('curation.rewardsAmount')}}</div>
      <div class="flex items-center relative">
        <div ref="tokenPopper"
             class="w-1/2 bg-black/40 border-1 border-color8B/30 mr-5px
                    light:bg-white light:border-colorE3 flex items-center
                    rounded-8px overflow-hidden h-44px 2xl:h-2.1rem">
          <span v-if="selectedGift.img && selectedChainName === 'steem'"
               class="text-20px ml-12px">{{selectedGift.img}}</span>
          <slot name="amount"></slot>
          <el-popover popper-class="c-popper c-select-popper"
                      :width="popperWidth" :teleported="false"
                      trigger="click" ref="giftPopover">
            <template #reference>
              <div v-show="selectedChainName === 'steem'" class="px-10px">
                <img class="w-2.5rem cursor-pointer" src="~@/assets/icon-emoji-grey.svg" alt="">
              </div>
            </template>
            <template #default>
              <div class="border-1 border-color8B/30 bg-blockBg ml-13px sm:ml-16px
                          light:bg-white light:border-colorE3
                          rounded-12px p-10px grid grid-cols-4
                          gap-y-20px gap-x-2rem max-h-200px overflow-auto">
                <div class="flex flex-col justify-center items-center cursor-pointer"
                     v-for="(gift, index) of giftList" :key="index"
                     @click="selectGift(gift)">
                  <span class="text-48px">{{gift.img}}</span>
                  <div class="flex items-center">
                    <img class="w-12px h-12px rounded-full mr-3px" src="~@/assets/steem.png" alt="">
                    <span class="whitespace-nowrap">{{gift.value}}</span>
                  </div>
                </div>
              </div>
            </template>
          </el-popover>
        </div>
        <div class="w-1/2">
          <div v-if="selectedChainName==='steem'"
               class="w-full bg-black/40 border-1 border-color8B/30 px-12px
                      light:bg-white light:border-colorE3 flex items-center
                      rounded-8px overflow-hidden h-44px 2xl:h-2.1rem">
            <img class="h-22px mr-15px rounded-full" src="~@/assets/steem.png" alt="">
            <span class="text-color8B text-15px">Steem</span>
          </div>
          <button v-else
                  class="w-full bg-black/40 border-1 border-color8B/30
                         light:bg-white light:border-colorE3 flex items-center
                         rounded-8px overflow-hidden h-44px 2xl:h-2.1rem"
                  :disabled="!walletAddress">
            <el-popover popper-class="c-popper"
                        placement="top-end"
                        :width="popperWidth"
                        :disabled="!walletAddress"
                        trigger="click" ref="tokenPopover">
              <template #reference>
                <button class="h-full w-full flex justify-between items-center cursor-pointer px-12px"
                        :disabled="!walletAddress">
                  <span class="flex items-center">
                    <img v-if="TokenIcon[selectedToken.symbol]" class="h-22px mr-15px rounded-full"
                         :src="TokenIcon[selectedToken.symbol]" alt="">
                    <span v-else class="text-color8B/70">Please select</span>
                    <span class="text-color8B text-15px">{{ selectedToken.symbol }}</span>
                  </span>
                  <img class="w-16px" src="~@/assets/icon-select-arrow.svg" alt="">
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
                    <img v-if="TokenIcon[customToken.symbol]" class="h-34px mr-15px rounded-full" :src="TokenIcon[customToken.symbol]" alt="">
                    <img v-else class="h-34px mr-15px" src="~@/assets/icon-eth-white.svg" alt="">
                    <div class="flex-1 flex flex-col text-color8B light:text-blueDark overflow-x-hidden"
                         @click="selectedToken = customToken;$refs.tokenPopover.hide()">
                      <span class="text-15px">{{customToken.symbol}}</span>
                      <span class="text-12px whitespace-nowrap overflow-hidden overflow-ellipsis">
                            {{customToken.address}}
                          </span>
                    </div>
                  </div>
                  <div v-for="token of tokenList" :key="token.address"
                       @click="selectedToken=token;$refs.tokenPopover.hide()"
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
    <div class="mt-0.4rem text-right font-400 flex justify-end items-center text-color62">
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
import { mapGetters } from 'vuex'
import { getSteemBalance } from '@/utils/steem'
import CustomSelect from "@/components/CustomSelect";

export default {
  name: "ChainOptions",
  components: {CustomSelect},
  props: {
    chain: {
      type: String,
      default: ''
    },
    showEvm: {
      type: Boolean,
      default: true
    },
    address: {
      type: String,
      default: ''
    },
    token: {
      type: String,
      default: ''
    },
    amount: {
      type: Number,
      default: 0
    },
    showsteem: {
      type: Boolean,
      default: false
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
      searchToken: '',
      selectedGift: {},
      giftList: [
        {img: '✌️', value: 10, isLimit: false},
        {img: '🎈️', value: 10, isLimit: false},
        {img: '🍔️', value: 10, isLimit: false},
        {img: '🍻️', value: 10, isLimit: false},
        {img: '❤️️', value: 50, isLimit: false},
        {img: '🎃', value: 73, isLimit: true},
        {img: '🎄', value: 73, isLimit: true},
        {img: '🦃️', value: 73, isLimit: true},
        {img: '🧧', value: 88, isLimit: true},
        {img: '🥮', value: 88, isLimit: false},
        {img: '🇨🇳', value: 88, isLimit: false},
        {img: '🚀', value: 100, isLimit: false},
        {img: '🎂', value: 200, isLimit: false},
        {img: '🌹', value: 999, isLimit: false},
        {img: '🛳', value: 1000, isLimit: false}
      ]
    }
  },
  mounted() {
    this.selectedChainName = this.chain
    this.walletAddress = this.address
    this.searchToken = this.token
    if (this.showsteem) {
      this.connectWallet('steem')
    }
    accountChanged(address => {
      if (this.selectedChainName) {
        this.walletAddress = address
      }else {
        this.walletAddress = null
      }
    })
    this.popperWidth = this.$refs.assetsOptionsRef.clientWidth > 400 ?
        this.$refs.assetsOptionsRef.clientWidth/3*2:this.$refs.assetsOptionsRef.clientWidth
  },
  watch: {
    walletAddress(val) {
      this.$emit('addressChange', val);
      this.updateSelectBalance()
    },
    selectedToken(val) {
      this.$emit('tokenChagne', val);
      this.updateSelectBalance()
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo']),
    tokenList() {
      return this.selectedChainName && this.selectedChainName!=='steem'?
          Object.values(this.EVM_CHAINS[this.selectedChainName].assets):[]
    }
  },
  methods: {
    formatAddress,
    formatAmount,
    async connectWallet(chain) {
      if(chain==='steem') {
        this.$emit('chainChange', chain)
        this.selectBalance = (await getSteemBalance(this.getAccountInfo.steemId)).steemBalance;
        this.$emit('balanceChange', this.selectBalance)
        return
      }
      this.connectLoading = true
      try{
        const connected = await setupNetwork(chain)
        if (connected) {
          this.selectedToken = {}
          this.$emit('chainChange', chain)
          this.selectedChainName = chain;
          this.walletAddress = await getAccounts(true);
          this.selectedToken = Object.values(EVM_CHAINS[chain].assets)[0];
          this.customToken = null;
        }else {
          this.$emit('chainChange', null)
          this.selectedChainName = null;
          this.walletAddress = null;
          this.selectedToken = {}
        }
      } catch (e) {
        this.$emit('chainChange', null)
        this.selectedChainName = null
        this.walletAddress = null
        this.selectedToken = {}
        notify({message: 'Connect metamask fail', duration: 5000, type: 'error'})
      } finally {
        this.connectLoading = false
      }
    },
    async updateSelectBalance() {
      if (!this.selectedToken || !this.selectedChainName || !this.walletAddress) {
        this.selectBalance = 0
        this.$emit('balanceChange', 0)
        return
      };
      this.selectBalance = await getERC20TokenBalance(this.selectedChainName, this.selectedToken.address, this.walletAddress)
      this.$emit('balanceChange', this.selectBalance)
    },
    async updateToken() {
      if (!ethers.utils.isAddress(this.searchToken)) {
        this.customToken = null;
        return;
      }
      try {
        const res = await getTokenInfo(this.selectedChainName, this.searchToken)
        this.customToken = {...res, address: this.searchToken}
        this.selectedToken = this.customToken
      }catch(e) {
        console.log(63, e);
      }
    },
    selectGift(gift) {
      this.$refs.giftPopover.hide()
      this.selectedGift = gift
      this.$emit('selectGift', gift.value)
    }
  }
}
</script>

<style scoped>

</style>
