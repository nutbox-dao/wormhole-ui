<template>
  <div class="pb-2rem">
    <div class="flex justify-between items-center my-0.8rem">
      <div class="flex items-center">
        <img class="w-5rem h-5rem rounded-full border-1px border-dark-400"
             src="https://cdn.wherein.mobi/nutbox/token/logo/steem.png" alt="">
        <div class="text-left ml-1rem">
          <div class="c-text-black text-1.4rem">Steem</div>
          <div class="text-text8F">{{ steemBalance }} STEEM</div>
        </div>
      </div>
      <div class="text-1.8rem c-text-medium font-bold gradient-text gradient-text-bottom">{{ steemValue }}</div>
    </div>
    <div class="flex justify-between items-center my-0.8rem" v-for="i of 10" :key="i">
      <div class="flex items-center">
        <img class="w-5rem h-5rem rounded-full border-1px border-dark-400"
             src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png" alt="">
        <div class="text-left ml-1rem">
          <div class="c-text-black text-1.4rem">Solana</div>
          <div class="text-text8F">0 SOL</div>
        </div>
      </div>
      <div class="text-1.8rem c-text-medium font-bold gradient-text gradient-text-bottom">$0.00</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { formatBalance, formatUserAddress, formatPrice, formatAmount } from '@/utils/helper'

export default {
  name: "Token",
  data() {
    return {

    }
  },
  computed: {
    ...mapState(['steemBalance', 'prices']),
    steemValue() {
      if (this.prices['steem'] && this.steemBalance){
        return formatPrice(this.prices['steem'] * this.steemBalance)
      }
      return formatPrice(0)
    }
  },
}
</script>

<style scoped>

</style>
