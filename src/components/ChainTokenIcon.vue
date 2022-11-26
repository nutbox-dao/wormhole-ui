<template>
  <div class="flex items-center w-min rounded-full">
    <div class="flex items-end relative min-w-12px min-h-12px" :style="{height: height, width: width}">
      <template v-if="icon">
        <img class="w-full h-full" :src="icon" alt="">
        <img class="absolute -bottom-3px right-0 w-3/5 h-3/5 border-1 border-primaryColor/20 rounded-full"
             src="~@/assets/icon-eth-white.svg" alt="">
      </template>
      <img v-else class="w-full h-full" src="~@/assets/icon-token-default.svg" alt="">
    </div>
    <slot name="amount"></slot>
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
      default: () => {
        return {
          symbol: '',
          address: ''
        }
      }
    },
    chainName: {
      type: String,
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
