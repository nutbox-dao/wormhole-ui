<template>
  <div>
    <div class="text-center c-text-black md:text-2rem md:leading-3.6rem text-1.8rem leading-2.4rem w-full">
      Tweet a post
    </div>
    <div class="top-box rounded-2rem mt-1.5rem mb-1rem overflow-hidden ">
      <div class="gradient-bg gradient-bg-color3 text-1rem px-1rem py-0.8rem flex items-center justify-between">
        <span class="text-black c-text-bold">Social token</span>
        <div class="c-text-bold flex-1 flex justify-end items-center">
          <span class="text-text2C/60 mr-1rem">{{steemBalance}} STEEM</span>
          <span class="text-white">{{ steemValue }}</span>
        </div>
      </div>
      <div class="mt-2.5rem mb-1.5rem px-1rem">
        <div class="flex justify-between items-center mb-0.8rem">
          <div class="flex items-center justify-center">
            <span class="text-primaryColor text-1rem font-bold">Resource Credits</span>
            <el-tooltip>
              <template #content>
                <div class="max-w-14rem">
                  Every your post upload to the blockchain will cost you resource credits(RC), so your post can't be synced to blockchain if the RC is too lower. The RC will recover 20% every day.
                </div>
              </template>
              <button>
                <img class="w-1.2rem ml-0.5rem" src="~@/assets/icon-warning-primary.svg" alt="">
              </button>
            </el-tooltip>
          </div>
          <span class="c-text-black text-primaryColor text-1.2rem">{{rcPercent}}%</span>
        </div>
        <el-progress class="c-progress" :text-inside="false" :stroke-width="20"
                     :show-text="false"
                     :percentage="Number(rcPercent)" />
      </div>
    </div>
    <div class="bg-black/40 rounded-1rem h-min-10rem p-1rem mt-0.8rem relative">
      <div class="text-left break-all">
        <span class="text-primaryColor">#wormhole3 !post </span>
        <span class="text-text8F">{content}</span>
      </div>
      <button class="text-text53 flex items-center justify-center border-1px border-text53 rounded-full h-2.45rem px-1.7rem absolute bottom-1rem right-1rem">
        <img class="w-1rem h-1rem mr-1rem" src="~@/assets/icon-twitter.svg" alt="">
        <span class="text-white">Go tweet</span>
      </button>
    </div>
    <div class="text-white text-0.8rem leading-1rem mt-0.5rem italic">
      Tips: <br>   Replace {***} to real content.
    </div>
    <!--    <button v-else @click="tipDrawer=false"-->
<!--            class="w-4rem h-2.5rem absolute transform top-1rem left-1/2 -translate-x-1/2">-->
<!--      <img class="w-2rem mx-auto" src="~@/assets/icon-drawer-arrow-white.svg" alt="">-->
<!--    </button>-->
  </div>
</template>

<script>
import {mapState, mapGetters} from "vuex";
import { formatPrice } from '@/utils/helper'

export default {
  name: "PostTip",
  computed: {
    ...mapState(['accountInfo', 'posts', 'rcPercent', 'steemBalance', 'prices']),
    ...mapGetters(['getAccountInfo']),
    steemValue() {
      return formatPrice(this.steemBalance * this.prices['steem'])
    }
  },
}
</script>

<style scoped>
.top-box {
  background: linear-gradient(99.28deg, rgba(83, 83, 83, 0.8) 0.41%, rgba(78, 72, 61, 0.8) 75.78%);
  border: 1px solid #323436;
  border-radius: 12px;
}

</style>
