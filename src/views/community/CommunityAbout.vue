<template>
  <div class="px-15px sm:px-0 py-20px">
    <div class="">
      <div class="text-14px font-bold mb-10px text-left">{{$t('community.disStrategy')}}</div>
      <div class="grid grid-cols-2 sm:grid-cols-4 2md:grid-cols-2 xl:grid-cols-4 gap-y-20px
                  border-1px border-color8B/30 light:border-colorF7 rounded-12px py-20px shadow-color1A">
        <div class="col-span-1 relative">
          <div class="c-text-black text-24px leading-28px mb-8px light:text-color66">72385750</div>
          <div class="text-12px text-color99">{{$t('community.currentBlock')}}</div>
          <div class="h-30px w-0.5px bg-color99/30 absolute right-0 top-1/2 transform -translate-y-1/2"></div>
        </div>
        <div class="col-span-1">
          <div class="c-text-black text-24px leading mb-8px light:text-color66">1.25</div>
          <div class="text-12px text-color99">{{$t('community.currentReward')}}</div>
        </div>
        <div class="col-span-1 relative">
          <div class="c-text-black text-24px leading mb-8px light:text-color66">2022.3.23</div>
          <div class="text-12px text-color99">{{$t('community.lastHalvingTime')}}</div>
          <div class="h-30px w-0.5px bg-color99/30 absolute right-0 top-1/2 transform -translate-y-1/2"></div>
        </div>
        <div class="col-span-1">
          <div class="c-text-black text-24px leading mb-8px light:text-color66">2022.3.23</div>
          <div class="text-12px text-color99">{{$t('community.nextHalvingTime')}}</div>
        </div>
        <div class="col-span-2 px-15px">
          <div class="text-center text-20px text-color62 font-bold mb-6px">50%</div>
          <el-progress class="c-progress-gradient flex-1 w-full"
                       :text-inside="false"
                       :stroke-width="5"
                       :show-text="false"
                       :percentage="50"/>
          <div class="text-12px text-color99 text-center mt-6px">{{$t('community.currentProgress')}}</div>
        </div>
      </div>
    </div>
    <div class="mt-30px">
      <div class="text-14px font-bold mb-15px text-left">{{$t('community.pool')}}</div>
      <PoolRatio :animation='false' :pools-data="poolsData"/>
    </div>
  </div>
</template>

<script>
import PoolRatio from "@/components/community/PoolRatio.vue";
export default {
  name: "CommunityAbout",
  components: {PoolRatio},
  data() {
    return {
      poolsData: [
        {name: 'AAA', ratio: 123},
        {name: 'BBB', ratio: 123},
        {name: 'CCC', ratio: 123},
        {name: 'DDD', ratio: 123},
        {name: 'EEE', ratio: 123},
      ]
    }
  }
}
</script>

<style scoped>

</style>
