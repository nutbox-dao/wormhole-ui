<template>
  <div class="w-full sm:max-w-600px lg:max-w-35rem mx-auto p-15px mx-auto flex flex-col">
    <div class="p-15px bg-color62/30 light:bg-white light:shadow-color1A mb-1rem
                flex items-center justify-between rounded-12px">
      <div class="flex-1 flex items-center overflow-hidden mr-20px">
        <div class="w-30px min-w-30px h-30px rounded-full bg-color62 flex justify-center items-center mr-10px">
          <img class="w-14px" src="~@/assets/icon-wallet.svg" alt="">
        </div>
        <div class="flex-1 flex justify-between items-center">
          <span class="sm:hidden text-color7D truncate text-14px">
            {{ getAccountInfo ? formatAddress(getAccountInfo.ethAddress, 16, 16) : '' }}
          </span>
          <span class="hidden sm:flex flex-1 text-left whitespace-nowrap text-color7D truncate text-14px">
            {{ getAccountInfo ? getAccountInfo.ethAddress : ' ' }}
          </span>
          <img class="w-14px min-w-14px ml-3px mr-8px"
               @click="copy(getAccountInfo.ethAddress)"
               src="~@/assets/icon-copy-primary.svg" alt="">
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
