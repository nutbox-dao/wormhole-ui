<template>
  <div class="pb-2rem">
    <div class="flex justify-between items-center my-2.5rem">
      <div class="flex items-center">
        <img class="w-4rem h-4rem rounded-full border-3px gradient-border"
             :src="mainToken.icon" alt="">
        <div class="text-left ml-1rem">
          <div class="c-text-black text-1.4rem">{{ mainToken.name }}</div>
          <div class="text-text8F text-1rem font-bold mt-0.5rem">{{ ethBalance }} {{ mainToken.symbol }}</div>
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
          <div class="text-text8F text-1rem font-bold mt-0.5rem">{{ steemBalance }} STEEM</div>
        </div>
      </div>
      <div class="text-1.6rem c-text-bold">{{ steemValue }}</div>
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
      <div class="text-1.6rem c-text-bold">{{erc20.value}}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { formatBalance, formatUserAddress, formatPrice, formatAmount } from '@/utils/helper'
import { getMainChainBalance } from '@/utils/asset'
import { ERC20List, MainToken } from '@/config'

export default {
  name: "Token",
  data() {
    return {
      mainToken: MainToken
    }
  },
  computed: {
    ...mapState(['steemBalance', 'prices', 'ethBalance', 'erc20Balances']),
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
  mounted () {
    // getMainChainBalance(this.accountInfo?.ethAddress);
  },
}
</script>

<style scoped>

</style>
