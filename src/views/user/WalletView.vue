<template>
  <div class="w-full sm:max-w-600px lg:max-w-35rem mx-auto p-15px mx-auto flex flex-col">
    <div v-if="getAccountInfo && getAccountInfo.ethAddress"
         class="gradient-bg gradient-bg-color3 rounded-12px overflow-hidden mb-20px">
      <div class="px-17px py-12px mb-1rem flex items-center justify-between cursor-pointer">
        <span class="c-text-black text-white text-14px 2xl:text-0.8rem">{{$t('profileView.ethWallet')}}</span>
      </div>
      <div class="border-1 gradient-border light:gradient-border-colorCB
                        overflow-hidden rounded-5px mx-0.4rem mb-1rem min-h-30px">
        <div class="bg-color62/20 light:bg-white p-5px
                          font-700 text-0.8rem leading-1.4rem light:text-blueDark
                          break-all flex items-center justify-between">
          <span class="sm:hidden">{{ getAccountInfo ? formatAddress(getAccountInfo.ethAddress, 16, 16) : '' }}</span>
          <span class="hidden sm:block">{{ getAccountInfo ? getAccountInfo.ethAddress : ' ' }}</span>
          <i class="w-20px h-20px ml-5px cursor-pointer icon-copy"
             @click="copy(getAccountInfo.ethAddress)"></i>
        </div>
      </div>
    </div>
    <div class="bg-blockBg light:bg-white light:shadow-color1A rounded-12px relative">
      <div class="px-15px text-14px w-min flex gap-1rem mt-1rem font-bold tag">
        <router-link :to="`/wallet/${$route.params.user}/wallet`"
                     class="flex items-center rounded-full
                     border-1 border-white/20 leading-14px text-14px py-10px px-24px
                     light:bg-colorF2 light:text-color7D whitespace-nowrap">{{$t('common.token')}}</router-link>
        <router-link :to="`/wallet/${$route.params.user}/wallet/nft`"
                     class="flex items-center rounded-full
                     border-1 border-white/20 leading-14px text-14px py-10px px-24px
                     light:bg-colorF2 light:text-color7D">{{$t('common.nft')}}</router-link>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {ethers} from "ethers";
import {notify} from "@/utils/notify";
import {formatAddress} from "@/utils/tool";

export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo'])
  },
  methods: {
    formatAddress,
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
    }
  },
  mounted () {
    if (!this.getAccountInfo || !this.getAccountInfo.twitterId) {
      this.$router.replace('/')
    }
  },
}
</script>

<style scoped>
.tag .router-link-exact-active {
  background: linear-gradient(135.53deg, #917AFD 2.61%, #6246EA 96.58%);
  color: white!important;
  border: none;
}
</style>
