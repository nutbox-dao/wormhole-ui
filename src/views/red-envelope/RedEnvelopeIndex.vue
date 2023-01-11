<template>
  <div class="text-14px leading-20px 2xl:text-0.8rem 2xl:leading-1.2rem">
    <div class="md:border-b-1 border-dividerColor light:border-colorF4 mb-1rem">
      <div class="relative container mx-auto max-w-50rem md:px-1rem px-15px flex items-center md:justify-start justify-center h-2.8rem">
        <div class="c-text-black text-1.5rem md:text-1rem mx-1.9rem light:text-blueDark">{{$t('ny.springFestival')}}</div>
      </div>
    </div>
    <div class="container mx-auto max-w-50rem md:px-1rem px-15px">
      <div v-if="tabIndex===0"
           class="min-h-120px gradient-bg gradient-bg-color3 text-left rounded-8px py-1rem px-15px sm:px-2rem text-white">
        Blessing cards activity description. Blessing cards activity description. <br>
        Blessing cards activity description. <br>
        Blessing cards activity description. <br>
      </div>
      <div v-if="tabIndex===1"
           class="min-h-120px gradient-bg gradient-bg-color3 text-left rounded-8px py-1rem px-15px sm:px-2rem text-white
                  grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-y-1rem sm:gap-x-2rem">
        <div class="col-span-2 xl:col-span-3">
          Mystery cards activity description. Mystery cards activity.
          Mystery cards activity description.
          Mystery cards activity description.
        </div>
        <div class="col-span-1">
          <div class="flex items-center justify-between sm:flex-col sm:items-start gap-5px">
            <span class="font-bold opacity-80">{{$t('ny.poolRewards')}}: </span>
            <span class="c-text-black text-16px">${{ userActivityInfo.prizeTotalAmount }}</span>
          </div>
          <div class="flex items-center justify-between sm:flex-col sm:items-start gap-5px mt-10px">
            <span class="font-bold opacity-80">{{$t('ny.endTime')}}: </span>
            <span class="c-text-black text-16px">{{ endTime }}</span>
          </div>
        </div>
      </div>
      <div class="bg-blockBg light:bg-white light:border-1 light:border-colorF4 rounded-8px mt-1rem mb-2rem">
        <div class="flex gap-x-10px justify-center p-1rem border-b-1 border-color8B/30 light:border-colorF4">
          <button class="px-20px rounded-full h-30px flex items-center justify-center"
                  :class="tabIndex===0?'bg-tag-gradient text-white':'border-1 border-color8B/30'"
                  @click="tabIndex=0">
            <img class="h-20px mr-4px" src="~@/assets/red-envelope/tab-tag.png" alt="">
            {{$t('ny.blessingCards')}}
          </button>
          <button class="px-20px rounded-full h-30px flex items-center justify-center"
                  :class="tabIndex===1?'bg-tag-gradient text-white':'border-1 border-color8B/30'"
                  @click="tabIndex=1">
            <img class="h-20px mr-4px" src="~@/assets/red-envelope/tab-tag.png" alt="">
            {{$t('ny.mysteryCards')}}
          </button>
        </div>
        <div class="">
          <BlessingCards v-if="tabIndex===0" @gotoBlind="tabIndex=1"/>
          <MysteryCards v-if="tabIndex===1"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BlessingCards from "@/views/red-envelope/BlessingCards";
import MysteryCards from "@/views/red-envelope/MysteryCards";
import { mapGetters, mapState } from 'vuex'
import { chainChanged } from '@/utils/web3/web3'
import { getUserActivityInfo } from '@/utils/new-year'
import { parseTimestampToUppercase } from '@/utils/helper'

export default {
  name: "RedEnvelopeIndex",
  components: {BlessingCards, MysteryCards},
  data() {
    return {
      tabIndex: 0
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo']),
    ...mapState('newYear', ['blessCardBalance', 'getUSDTBalance', 'approvedUSDT', 'usdtBalance', 'userActivityInfo', 'blindBoxBalance']),
    endTime() {
      return parseTimestampToUppercase(this.userActivityInfo.eventEndTime)
    }
  },
  mounted () {
    if (!this.getAccountInfo || !this.getAccountInfo.ethAddress) {
      this.$router.replace('/')
    }
    chainChanged().catch()
    getUserActivityInfo(this.getAccountInfo.ethAddress).catch();
  },
}
</script>

<style scoped>

</style>
