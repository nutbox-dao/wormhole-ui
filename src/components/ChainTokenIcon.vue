<template>
  <div class="w-min rounded-full cursor-pointer" @click.stop="gotoToken">
    <el-tooltip popper-class="c-popper" effect="light" :auto-close="5000"
                :show-after="1000"
                ref="tokenTipRef" placement="bottom-end">
      <div class="flex items-center" @click="hideTip">
        <div class="flex items-end relative min-w-12px min-h-12px"
             :style="{height: height, width: width}">
          <img v-if="icon" class="w-full h-full rounded-full" :src="icon" alt="">
          <img v-else class="w-full h-full rounded-full" src="~@/assets/icon-token-default.svg" alt="">
          <img v-if="chainIcon"
               class="absolute bottom-0 right-0 w-3/5 min-w-3/5 h-3/5 min-h-3/5 border-1 border-primaryColor/20 rounded-full"
               :src="chainIcon" alt="">
        </div>
        <slot name="amount"></slot>
      </div>
      <template #content>
        <div class="flex items-center cursor-pointer bg-color62 text-color46 h-36px rounded-6px px-15px"
             @click="copyAddress(token.address)">
          <span class="text-white light:text-blueDark">{{formatAddress(token.address)}}</span>
          <i class="w-14px h-14px icon-copy ml-4px"></i>
        </div>
      </template>
    </el-tooltip>
  </div>
</template>

<script>
import { EVM_CHAINS } from "@/chain-config"
import { TokenIcon } from "@/chain-config";
import {formatAddress, copyAddress} from "@/utils/tool";
import {useTimer} from "@/utils/hooks";
import steemImg from '@/assets/steem.png'

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
  setup() {
    const { setTimer } = useTimer()
    return {setTimer}
  },
  computed: {
    icon() {
      if (this.chain.toLowerCase() === 'steem') {
        return  steemImg
      }
      return TokenIcon[this.token.symbol] ?? this.token.icon;
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
  data() {
    return {
      visible: false
    }
  },
  methods: {
    formatAddress,
    copyAddress,
    hideTip() {
      this.setTimer(() => {
        this.$refs.tokenTipRef.onClose()
      }, 3000)
    },
    gotoToken() {
      window.open(EVM_CHAINS[this.chain].tokenScan + this.token.address, '__blank')
    }
  }
}
</script>

<style scoped>

</style>
