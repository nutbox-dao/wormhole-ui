<template>
  <div class="pb-2rem">
    <div class="flex justify-between items-center my-2.5rem">
      <div class="flex items-center">
        <img class="w-4rem h-4rem rounded-full border-3px gradient-border"
             :src="mainToken.icon" alt="">
        <div class="text-left ml-1rem">
          <div class="c-text-black text-1.4rem">{{ mainToken.name }}</div>
          <div class="text-text8F text-1rem font-bold mt-0.5rem">{{ formatAmount(ethBalance) }} {{ mainToken.symbol }}</div>
        </div>
      </div>
      <div class="text-1.6rem c-text-bold">{{ ethValue }}</div>
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
      <div class="flex flex-col items-end">
        <div class="text-1.6rem c-text-bold">{{ steemValue }}</div>
        <button class="gradient-btn c-text-bold px-10px mt-8px" @click="sendSteem">Send</button>
      </div>
    </div>

    <div class="flex justify-between items-center my-2.5rem" v-for="erc20 in erc20List" :key="erc20.address">
      <div class="flex items-center">
        <img class="w-4rem h-4rem rounded-full border-3px gradient-border"
             :src="erc20.icon" alt="">
        <div class="text-left ml-1rem">
          <div class="c-text-black text-1.4rem">{{erc20.name}}</div>
          <div class="text-text8F text-1rem font-bold mt-0.5rem">{{ erc20.amount }} {{erc20.symbol}}</div>
        </div>
      </div>
      <div>
        <div class="text-1.6rem c-text-bold">{{erc20.value}}</div>
<!--        <button class="gradient-btn c-text-bold px-10px mt-8px">Send</button>-->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { formatBalance, formatUserAddress, formatPrice, formatAmount, sleep } from '@/utils/helper'
import { getTokenBalance, getMainChainBalance } from '@/utils/asset'
import { ERC20List, MainToken, TWITTER_MONITOR_RULE } from '@/config'
import { getSteemBalance } from '@/utils/steem'

export default {
  name: "Token",
  data() {
    return {
      mainToken: MainToken
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
      if (this.prices['eth'] && this.ethBalance){
        return formatPrice(this.prices['eth'] * this.ethBalance)
      }
      return formatPrice(0)
    },
    erc20List() {
      let ls = []
      if (this.erc20Balances && Object.keys(this.erc20Balances).length > 0 && this.prices['eth'] > 0) {
        for (let erc20 of ERC20List) {
          ls.push({
            ...erc20,
            amount: formatAmount(this.erc20Balances[erc20.symbol]),
            value: formatPrice(this.erc20Balances[erc20.symbol] * this.prices[erc20.symbol.toLowerCase()])
          })
        }
      }
      return ls
    }
  },
  methods: {
    formatAmount(a) {
      return formatAmount(a)
    },
    sendSteem() {
      window.open('https://twitter.com/intent/tweet?text=' + TWITTER_MONITOR_RULE + ' !send ', '__blank')
    }
  },
  async mounted () {
    let count = 0
    while(true) {
      if (this.accountInfo && this.accountInfo.steemId) {
        break;
      }
      if (count++ > 10) {
        break;
      }
      await sleep(1)
    }
    const { steemId, ethAddress, web25ETH } = this.accountInfo
    if (steemId) {
        // get steem balance
        getSteemBalance(steemId).then(balance => this.$store.commit('saveSteemBalance', balance))
            .catch(err => console.log('get steem balance fail:', err))
    }else {
      this.$store.commit('saveSteemBalance', 0)
    }
    //get eth balances
    getTokenBalance(web25ETH)
    getMainChainBalance(web25ETH)
  },
}
</script>

<style scoped>

</style>
