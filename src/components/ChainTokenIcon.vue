<template>
  <div class="flex items-end relative" :style="{height: height, width: width}">
    <img v-if="icon" class="w-full h-full" :src="icon" alt="">
    <img v-else class="w-full h-full" src="~@/assets/token-usdt.svg" alt="">
    <img class="absolute bottom-0 right-0 w-1/3 h-1/3" src="~@/assets/icon-eth-white.svg" alt="">
  </div>
</template>

<script>
import { TokenIcon, EVM_CHAINS } from "@/config"

export default {
  name: "ChainTokenIcon",
  props: {
    width: {
      type: String,
      default: '4rem'
    },
    height: {
      type: String,
      default: '4rem'
    },
    token: {
      type: Object,
      default: {}
    },
    chainName: {
      type: 'String',
      default: ''
    }
  },
  computed: {
    icon() {
      return TokenIcon[this.token.symbol];
    },
    chain() {
      const num = this.chainName.match(/^[0-9]+$/)
      let chain;
      if (num) {
        for (let c in EVM_CHAINS) {
          if (EVM_CHAINS[c].id === parseInt(this.chainName)) {
            chain = c;
            break;
          }
        }
      }else {
        chain = this.chainName
      }
      return chain;
    },
    isFake() {
      const t = EVM_CHAINS[this.chain].assets[this.token.symbol]
      if (t && t.address  === this.token.address) {
        return false;
      }
      return true
    }
  },
}
</script>

<style scoped>

</style>
