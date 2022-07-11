<template>
  <div class="pb-2rem">

    <div class="flex justify-between items-center my-2.5rem" v-if="erc20Balances && erc20Balances.ETH" v-for="erc20 of Object.keys(erc20Balances.ETH)" :key="erc20 + 'eth'">
      <div class="flex items-center">
        <img class="w-4rem h-4rem rounded-full border-3px gradient-border"
             :src="icons[erc20]" alt="">
        <div class="text-left ml-1rem">
          <div class="c-text-black text-1.4rem">{{names[erc20]}}</div>
          <div class="text-text8F text-1rem font-bold mt-0.5rem">{{ formatAmount(erc20Balances.ETH[erc20]) }} {{erc20}}</div>
        </div>
      </div>
      <div class="flex flex-col items-end justify-end">
        <div class="text-1.6rem c-text-bold">${{formatAmount(erc20Balances.ETH[erc20] * prices[erc20.toLowerCase()])}}</div>
        <!-- <button class="gradient-btn c-text-bold px-10px mt-8px" @click="sendToken(erc20, 'ETH')">Send</button> -->
      </div>
    </div>

    <div class="flex justify-between items-center my-2.5rem" v-if="erc20Balances && erc20Balances.BNB" v-for="erc20 of Object.keys(erc20Balances.BNB)" :key="erc20 + 'eth'">
      <div class="flex items-center">
        <img class="w-4rem h-4rem rounded-full border-3px gradient-border"
             :src="icons[erc20]" alt="">
        <div class="text-left ml-1rem">
          <div class="c-text-black text-1.4rem">{{names[erc20]}}(BSC)</div>
          <div class="text-text8F text-1rem font-bold mt-0.5rem">{{ formatAmount(erc20Balances.BNB[erc20]) }} {{erc20}}</div>
        </div>
      </div>
      <div class="flex flex-col items-end justify-end">
        <div class="text-1.6rem c-text-bold">${{formatAmount(erc20Balances.BNB[erc20] * prices[erc20.toLowerCase()])}}</div>
        <!-- <button class="gradient-btn c-text-bold px-10px mt-8px" @click="sendToken(erc20, 'BNB')">Send</button> -->
      </div>
    </div>

    <div class="flex justify-between items-center my-2.5rem" v-if="erc20Balances && erc20Balances.MATIC" v-for="erc20 of Object.keys(erc20Balances.MATIC)" :key="erc20 + 'eth'">
      <div class="flex items-center">
        <img class="w-4rem h-4rem rounded-full border-3px gradient-border"
             :src="icons[erc20]" alt="">
        <div class="text-left ml-1rem">
          <div class="c-text-black text-1.4rem">{{names[erc20]}}(Polygon)</div>
          <div class="text-text8F text-1rem font-bold mt-0.5rem">{{ formatAmount(erc20Balances.MATIC[erc20]) }} {{erc20}}</div>
        </div>
      </div>
      <div class="flex flex-col items-end justify-end">
        <div class="text-1.6rem c-text-bold">${{formatAmount(erc20Balances.MATIC[erc20] * prices[erc20.toLowerCase()])}}</div>
        <!-- <button class="gradient-btn c-text-bold px-10px mt-8px" @click="sendToken(erc20, 'MATIC')">Send</button> -->
      </div>
    </div>

    <div class="flex justify-between items-center my-2.5rem">
        <div class="flex items-center">
          <img class="w-4rem h-4rem rounded-full border-3px gradient-border"
              src="https://cdn.wherein.mobi/nutbox/token/logo/steem.png" alt="">
          <div class="text-left ml-1rem">
            <div class="c-text-black text-1.4rem">Steem</div>
            <div class="text-text8F text-1rem font-bold mt-0.5rem">{{ formatAmount(steemBalance) }} STEEM</div>
          </div>
        </div>
        <div class="flex flex-col items-end justify-end">
          <div class="text-1.6rem c-text-bold">{{ steemValue }}</div>
          <button class="gradient-btn c-text-bold px-10px mt-8px" @click="sendSteem">Send</button>
        </div>
      </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { formatBalance, formatUserAddress, formatPrice, formatAmount, sleep } from '@/utils/helper'
import { getTokenBalance } from '@/utils/asset'
import { ERC20List, MainToken, TWITTER_MONITOR_RULE, TokenIcon, TokenName } from '@/config'
import { getSteemBalance } from '@/utils/steem'

export default {
  name: "Token",
  data() {
    return {
      mainToken: MainToken,
      ethBalanceInterval: null,
      monitor: null,
      icons: TokenIcon,
      names: TokenName
    }
  },
  computed: {
    ...mapState(['steemBalance', 'prices', 'ethBalance', 'erc20Balances', 'accountInfo']),
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
  },
  methods: {
    formatAmount(a) {
      return formatAmount(a)
    },
    sendSteem() {
      window.open('https://twitter.com/intent/tweet?text=' + TWITTER_MONITOR_RULE + ' !send  STEEM to', '__blank')
    },
    sendToken(token, chain) {
      window.open(`https://twitter.com/intent/tweet?text=${TWITTER_MONITOR_RULE} !send  ${token}${token === chain ? '' : ('('+chain +')')} to`, '__blank')
    }
  },
  async mounted () {
    this.monitor = setInterval(() => {
      if (this.accountInfo) {
        const { steemId, ethAddress, web25ETH } = this.accountInfo

        if (steemId) {
          // get steem balance
          getSteemBalance(steemId).then(balance => {
              this.$store.commit('saveSteemBalance', balance.steemBalance)
              this.$store.commit('saveSbdBalance', balance.sbdBalance)
            })
              .catch(err => console.log('get steem balance fail:', err))
        }else {
          this.$store.commit('saveSteemBalance', 0)
        }

        //get eth balances
        if (ethAddress) {
          getTokenBalance(ethAddress)
        }
      }
    }, 15000)
  },
  beforeMount () {
    window.clearInterval(this.monitor);
  },
}
</script>

<style scoped>

</style>
