<template>
  <div>
    <div class="text-center c-text-black md:text-2rem md:leading-3.6rem text-1.2rem leading-1.6rem w-full">
      Tweet a post
    </div>
    <div class="bg-black rounded-15px px-1rem mt-1.5rem mb-1rem overflow-hidden ">
      <div class="text-1rem md:text-1.2rem px-1rem py-0.8rem border-b-1 border-dividerColor">
        <span class="">Social token</span>
      </div>
      <div class="mt-2rem md:mt-1rem mb-1.5rem">
        <div class="hidden md:block md:mb-1rem text-right">
          <div class="text-colorB5 mb-0.5rem">{{ steemBalance }} STEEM</div>
          <div class="text-1.6rem">{{ steemValue}} </div>
        </div>
        <div class="flex justify-between items-center mb-0.8rem">
          <div class="flex items-center justify-center">
            <span class="text-color8B text-0.8rem font-bold">Resource Credits</span>
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
          <span class="c-text-black text-1.2rem">{{rcPercent}}%</span>
        </div>
        <el-progress class="c-progress" :text-inside="false" :stroke-width="10"
                     :show-text="false"
                     :percentage="Number(rcPercent)" />
      </div>
    </div>
    <div class="bg-black/40 rounded-1rem h-min-10rem p-1rem mt-0.8rem relative">
      <div class="text-left break-all">
        <span class="text-text8F">{content}</span>
        <span class="text-primaryColor"> #iweb3</span>
      </div>
      <button class="text-color8B flex items-center justify-center border-1px border-color8B rounded-full h-2.45rem px-1.7rem absolute bottom-1rem right-1rem">
        <img class="w-1rem h-1rem mr-1rem" src="~@/assets/icon-twitter.svg" alt="">
        <span class="text-color8B" @click="gotoTweet">Go tweet</span>
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
import { getAccountRC } from '@/utils/steem'
import { TWITTER_POST_TAG } from '@/config'

export default {
  name: "PostTip",
  computed: {
    ...mapState(['accountInfo', 'posts', 'rcPercent', 'steemBalance', 'prices']),
    ...mapGetters(['getAccountInfo']),
    steemValue() {
      return formatPrice(this.steemBalance * this.prices['steem'])
    }
  },
  mounted () {
    getAccountRC(this.getAccountInfo.steemId).then(rc => {
      this.$store.commit('saveRcPercent', parseFloat(rc[0] / rc[1] * 100).toFixed(2))
    }).catch();
  },
  methods: {
    gotoTweet() {
      window.open(
        "https://twitter.com/intent/tweet?text=" +
          TWITTER_POST_TAG,
        "__blank"
      );
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
