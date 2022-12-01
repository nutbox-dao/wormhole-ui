<template>
  <div class="w-min rounded-full cursor-pointer">
    <el-tooltip class="shadow-md" effect="light">
      <div class="flex items-center" @click.stop>
        <div class="flex items-end relative min-w-12px min-h-12px" :style="{height: height, width: width}">
          <img v-if="icon" class="w-full h-full rounded-full" :src="icon" alt="">
          <img v-else class="w-full h-full rounded-full" src="~@/assets/icon-token-default.svg" alt="">
          <img v-if="chainIcon"
               class="absolute -bottom-3px right-0 w-3/5 min-w-3/5 h-3/5 min-h-3/5 border-1 border-primaryColor/20 rounded-full"
               :src="chainIcon" alt="">
        </div>
        <slot name="amount"></slot>
      </div>
      <template #content>
        <div class="flex items-center cursor-pointer" @click="copyAddress(token.address)">
          <span class="text-white light:text-blueDark">{{formatAddress(token.address)}}</span>
          <i class="w-14px h-14px 2xl:w-1.2rem 2xl:h-1.2rem icon-copy ml-4px"></i>
        </div>
      </template>
    </el-tooltip>
  </div>
</template>

<script>
import { TokenIcon, EVM_CHAINS } from "@/config"
import {formatAddress, copyAddress} from "@/utils/tool";

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
      if (this.chain === 'steem') {
        return require('@/assets/steem.png')
      }
      return TokenIcon[this.token.symbol];
    },
    chain() {
      if (!this.chainName) {
        return 'Polygon'
      }
      const num = this.chainName.toString().match(/^[0-9]+$/)
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
    chainIcon() {
      return EVM_CHAINS[this.chain]?.main.icon
    },
    isFake() {
      const t = EVM_CHAINS[this.chain].assets[this.token.symbol]
      if (t && t.address  === this.token.address) {
        return false;
      }
      return true
    }
  },
  methods: {
    formatAddress,
    copyAddress
  }
}
</script>

<style scoped>

</style>
