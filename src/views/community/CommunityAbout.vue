<template>
  <div class="px-15px sm:px-0 py-20px">
    <div class="">
      <div class="text-14px font-bold mb-15px text-left">{{$t('community.disStrategy')}}</div>
      <div class="grid grid-cols-2 sm:grid-cols-4 2md:grid-cols-2 xl:grid-cols-4 gap-15px">
        <div class="span-col-1 bg-blockBg light:bg-colorF7F9 p-15px rounded-8px">
          <div class="c-text-black text-16px mb-8px">72385750</div>
          <div class="text-12px">{{$t('community.currentBlock')}}</div>
        </div>
        <div class="span-col-1 bg-blockBg light:bg-colorF7F9 p-15px rounded-8px">
          <div class="c-text-black text-16px mb-8px">1.25</div>
          <div class="text-12px">{{$t('community.currentReward')}}</div>
        </div>
        <div class="span-col-1 bg-blockBg light:bg-colorF7F9 p-15px rounded-8px">
          <div class="c-text-black text-16px mb-8px">2022.3.23</div>
          <div class="text-12px">{{$t('community.lastHalvingTime')}}</div>
        </div>
        <div class="span-col-1 bg-blockBg light:bg-colorF7F9 p-15px rounded-8px">
          <div class="c-text-black text-16px mb-8px">2022.3.23</div>
          <div class="text-12px">{{$t('community.nextHalvingTime')}}</div>
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
