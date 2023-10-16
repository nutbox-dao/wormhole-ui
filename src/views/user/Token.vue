<template>
  <div class="pb-2rem pt-1rem px-1.5rem">

    <el-collapse :model-value="Object.keys(erc20Balances).concat('steem')" class="no-border-collapse border-0">
      <el-collapse-item :name="chain" v-for="(chain, idx) of Object.keys(erc20Balances)" :key="idx">
        <template #title>
          <div class="text-white light:text-blueDark c-text-black">{{ chain }}</div>
        </template>
        <div class="flex justify-between items-center py-15px border-b-0.5px border-listBgBorder c-list-item"
             v-for="erc20 of Object.keys(erc20Balances[chain])" :key="erc20 + idx">
          <div class="flex items-center">
            <img class="w-43px h-43px 2xl:w-2rem 2xl:h-2rem rounded-full border-1px gradient-border"
                 :src="icons[erc20]" alt="">
            <div class="text-left ml-15px">
              <div class="font-600 text-14px text-white light:text-blueDark">{{names[erc20]}}</div>
              <div class="text-color8B light:text-color7D text-12px mt-8px">{{ formatAmount(erc20Balances[chain][erc20]) }} {{erc20}}</div>
            </div>
          </div>
          <div class="flex flex-col items-end justify-end">
            <div class="text-16px text-primaryColor light:text-blueDark c-text-black">${{formatAmount(erc20Balances[chain][erc20] * prices[erc20.toLowerCase()])}}</div>
            <button v-show="names[erc20].startsWith('Wrapped')" class="c-text-bold mt-8px rounded-full text-color62" @click="showDepositModal([chain, erc20])">{{$t('common.get')}}</button>
          </div>
        </div>
      </el-collapse-item>

      <el-collapse-item title="Steem" name="steem">
        <template #title>
          <div class="text-white light:text-blueDark c-text-black">Steem</div>
        </template>
        <div class="flex justify-between items-center py-15px border-b-0.5px border-listBgBorder c-list-item">
          <div class="flex items-center">
            <img class="w-43px h-43px 2xl:w-2rem 2xl:h-2rem rounded-full border-1px gradient-border"
                 src="https://cdn.wherein.mobi/nutbox/token/logo/steem.png" alt="">
            <div class="text-left ml-15px">
              <div class="flex items-center">
                <div class="font-600 text-14px text-white light:text-blueDark">Steem</div>
                <el-tooltip popper-class="shadow-popper-tip">
                  <template #content>
                    <div class="max-w-14rem text-white light:text-blueDark">
                      {{$t('common.whatsSteem')}}
                    </div>
                  </template>
                  <button>
                    <img class="w-1rem ml-0.5rem" src="~@/assets/icon-warning-grey.svg" alt="">
                  </button>
                </el-tooltip>
              </div>
              <div class="text-color8B light:text-color7D text-12px mt-8px">{{ formatAmount(steemBalance) }} STEEM</div>
            </div>
          </div>
          <div class="flex flex-col items-end justify-end">
            <div class="text-16px text-primaryColor light:text-blueDark c-text-black">{{ steemValue }}</div>
            <button class="c-text-bold mt-8px rounded-full text-color62" @click="sendSteem">{{$t('common.send')}}</button>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <van-popup class="c-tip-drawer 2xl:w-2/5"
               v-model:show="showDeposit"
               :position="position">
      <div class="modal-bg w-full md:w-460px 2xl:max-w-25rem
      max-h-80vh 2xl:max-h-28rem overflow-auto flex flex-col
      rounded-t-1.5rem md:rounded-b-1.5rem pt-1rem md:py-2rem">
        <div class="flex-1 overflow-auto px-1rem xl:px-2.5rem no-scroll-bar">
          <button class="absolute right-20px top-20px"
                  @click="showDeposit=false">
            <i class="w-18px h-18px 2xl:w-1rem 2xl:h-1rem icon-close"></i>
          </button>
          <div class="text-left px-1.25rem pb-3rem sm:pb-1.5rem flex flex-col text-14px 2xl:text-0.8rem overflow-auto">
            <div class="text-20px 2xl:text-1rem c-text-black mb-1.5rem">Deposit</div>
<!--            <div class="text-right mb-4px text-redColor">{{$t('curation.insuffientBalance')}}</div>-->
            <div class="text-left mb-4px ml-10px" :class="insuffientBalance ? 'text-redColor' : ''">{{ symbol.substring(1) }}</div>
            <div class="bg-black border-1 border-color8B/30
                      light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                      rounded-full h-44px 2xl:h-2rem flex items-center relative">
              <input class="bg-transparent h-full w-full px-1.2rem"
                             v-model="amount"
                             type="number" :placeholder="$t('walletView.inputAmount')">
            </div>
            <div class="text-right mt-4px" :class="insuffientBalance ? 'text-redColor' : ''">{{$t('common.balance')}}: {{ formatAmount(balance) }}</div>
            <div class="flex justify-center items-center">
              <div class="w-40px min-w-40px h-40px min-h-40px rounded-full bg-color62 flex items-center justify-center">
                <img class="transform rotate-180 h-20px" src="~@/assets/icon-arrow-top.svg" alt="">
              </div>
            </div>
            <div class="text-left mb-4px ml-10px" :class="insuffientBalance ? 'text-redColor' : ''">{{ symbol}}</div>
            <div class="bg-black border-1 border-color8B/30 cursor-not-allowed
                      light:bg-colorF2 light:border-colorE3 opacity-50
                      rounded-full h-44px 2xl:h-2rem flex items-center relative">
              <input class="bg-transparent h-full w-full px-1.2rem cursor-not-allowed"
                     v-model="amount"
                     disabled
                     type="text">
            </div>
            <div>
              <ConnectMainchainBTNVue
                  :chain-name="depositTokenInfo && depositTokenInfo[0]"
                  class="ny-gradient-btn gradient-btn-disabled-grey mt-2rem mx-auto
                         flex items-center justify-center px-20px
                         min-w-10rem w-full rounded-full h-44px 2xl:h-2.2rem text-white font-bold"
                                      v-if="chainId !== selectedChainId"/>
              <button v-else
                      class="ny-gradient-btn gradient-btn-disabled-grey mt-2rem mx-auto
                            flex items-center justify-center px-20px
                            min-w-10rem w-full rounded-full h-44px 2xl:h-2.2rem text-white font-bold"
                      :disabled="isDepositing || accountMismatch || insuffientBalance"
                      @click="deposit">
                {{$t('common.confirm')}}
                <c-spinner v-show="isDepositing" class="w-16px h-16px 2xl:w-1rem 2xl:h-1rem ml-0.5rem"></c-spinner>
              </button>
            </div>
            <div v-if="accountMismatch" class="text-redColor mt-6px text-center">
              {{ $t('ny.accountMismatch') }}
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import ConnectMainchainBTNVue from '@/components/ConnectMainchainBTN.vue'
import { formatPrice, formatAmount, sleep } from '@/utils/helper'
import { getTokenBalance, getUserTokensFromCuration, depositWrappedToken } from '@/utils/asset'
import { chainChanged } from '@/utils/web3/web3'
import { TWITTER_MONITOR_RULE } from '@/config'
import { TokenIcon, TokenName, isWrappedToken, EVM_CHAINS } from "@/chain-config";
import { getSteemBalance } from '@/utils/steem'
import {ethers} from "ethers";
import {notify} from "@/utils/notify";
import { accountChanged } from '@/utils/web3/account'

export default {
  name: "Token",
  data() {
    return {
      position: document.body.clientWidth < 768?'bottom':'center',
      isWrappedToken,
      ethBalanceInterval: null,
      monitor: null,
      icons: TokenIcon,
      names: TokenName,
      showDeposit: false,
      depositTokenInfo: null,
      isDepositing: false,
      amount: null,
      balance: 0
    }
  },
  components: {
    ConnectMainchainBTNVue,
  },
  computed: {
    ...mapState(['steemBalance', 'prices', 'ethBalance', 'erc20Balances', 'accountInfo']),
    ...mapGetters(['getAccountInfo']),
    ...mapState('web3', ['chainId', 'account']),
    accountMismatch() {
      return this.getAccountInfo.ethAddress !== this.account
    },
    steemValue() {
      if (this.prices['steem'] && this.steemBalance){
        return formatPrice(this.prices['steem'] * this.steemBalance)
      }
      return formatPrice(0)
    },
    ethValue() {
      if (this.prices['eth'] && this.erc20Balances && this.erc20Balances.ETH){
        return formatPrice(this.prices['eth'] * this.erc20Balances['ETH'].ETH)
      }
      return formatPrice(0)
    },
    insuffientBalance() {
      if (this.balance <= this.amount){
        return true
      }
    },
    selectedChainId() {
      if (this.depositTokenInfo) {
        return EVM_CHAINS[this.depositTokenInfo[0]].id
      }else {
        return 0
      }
    },
    symbol() {
      if (this.depositTokenInfo) {
        return this.depositTokenInfo[1]
      }
      return ''
    }
  },
  methods: {
    formatAmount,
    sendSteem() {
      window.open('https://twitter.com/intent/tweet?text=' + TWITTER_MONITOR_RULE + ' !tip 1 STEEM to @', '__blank')
    },
    sendToken(token, chain) {
      window.open(`https://twitter.com/intent/tweet?text=${TWITTER_MONITOR_RULE} !send ${token}${token === chain ? '' : ('('+chain +')')} to `, '__blank')
    },
    copy(address) {
      if (ethers.utils.isAddress(address)) {
        navigator.clipboard.writeText(address).then(() => {
          notify({
            message: 'Copied address:'+address,
            duration: 5000,
            type: 'success'
          })
        }, (e) => {
          console.log(e)
        })
      }
    },
    showDepositModal(info) {
      this.showDeposit = true
      this.depositTokenInfo = info
      const [chain, token] = info
      const t = EVM_CHAINS[chain].assets[token]
      this.balance = this.erc20Balances[chain][token.substr(1)]
      console.log(this.balance)
    },
    async deposit() {
      try{
        this.isDepositing = true
        await depositWrappedToken(this.depositTokenInfo, this.amount)
        await getTokenBalance(this.getAccountInfo.ethAddress)
        this.showDeposit = false
      } catch (e) {
        console.log('deposit fail:', e);
        notify({message: e, type: 'error'})
      } finally {
        this.isDepositing = false
      }
    }
  },
  async mounted () {
      if (this.getAccountInfo) {
        const { steemId, ethAddress, steemAmount, isRegistry, twitterId } = this.getAccountInfo
        accountChanged().catch();
        chainChanged().catch()

        if (!isRegistry) {
          getUserTokensFromCuration(twitterId).then(res => {
            const {tokens, amounts} = res;
            const tempTokens = Object.values(EVM_CHAINS.MATIC.assets);
            let showingBalance = {MATIC: {}}
            for (let j = 0; j < tempTokens.length; j++) {
              for (let i = 0; i < tokens.length; i++) {
                if (tokens[i] === tempTokens[j].address) {
                  showingBalance.MATIC[tempTokens[j].symbol] = amounts[i].toString() / (10 ** tempTokens[j].decimals);
                  break;
                }
              }
              showingBalance.MATIC[tempTokens[j].symbol] = showingBalance.MATIC[tempTokens[j].symbol] ?? 0
            }
            this.$store.commit('saveERC20Balances', showingBalance)
          }).catch(e => {
            console.log(6878, e);
          })
        }

        if (steemId) {
          // get steem balance
          getSteemBalance(steemId).then(balance => {
              this.$store.commit('saveSteemBalance', balance.steemBalance)
              this.$store.commit('saveSbdBalance', balance.sbdBalance)
            })
              .catch(err => console.log('get steem balance fail:', err))
        }else {
          this.$store.commit('saveSteemBalance', steemAmount ?? 0)
        }

        //get eth balances
        if (ethAddress) {
          getTokenBalance(ethAddress)
        }
      }
  }
}
</script>

<style scoped>
.c-list-item:last-child {
  border: none;
}
</style>
