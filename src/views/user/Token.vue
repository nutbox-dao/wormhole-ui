<template>
  <div class="pb-2rem">
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
    <div class="flex justify-between items-center my-2.5rem" v-for="i in 10" :key="i">
      <div class="flex items-center">
        <img class="w-4rem h-4rem rounded-full border-3px gradient-border"
             src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png" alt="">
        <div class="text-left ml-1rem">
          <div class="c-text-black text-1.4rem">Solana</div>
          <div class="text-text8F text-1rem font-bold mt-0.5rem">0 SOL</div>
        </div>
      </div>
      <div class="text-1.6rem c-text-bold">$0.00</div>
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
