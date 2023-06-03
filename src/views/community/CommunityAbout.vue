<template>
  <div class="px-15px sm:px-0 py-20px">
    <div class="">
      <div class="text-14px font-bold mb-10px text-left">{{$t('community.disStrategy')}}</div>
      <AboutProgress :progress-data="progressData"></AboutProgress>
    </div>
    <div class="mt-30px">
      <div class="text-14px font-bold mb-15px text-left">{{$t('community.pool')}}</div>
      <PoolRatio :animation='false' :pools-data="poolsData"/>
    </div>
  </div>
</template>

<script>
import PoolRatio from "@/components/community/PoolRatio.vue";
import AboutProgress from "@/components/community/AboutProgress.vue";
export default {
  name: "CommunityAbout",
  components: {PoolRatio, AboutProgress},
  data() {
    return {
      progressData: [
        {
          amount: 5.5,
          background: "rgba(98, 70, 234, 0.3333333333333333)",
          percentage: 5446945,
          startHeight:"15999000",
          stopHeight: "21445945",
        },
        {
          amount: 2.75,
          background: "rgba(98, 70, 234, 0.6666666666666666)",
          percentage: 10000000,
          startHeight: "21445946",
          stopHeight: "31445946"
        },
        {
          amount: 1.375,
          background: "rgba(98, 70, 234, 1)",
          percentage: 8857442941,
          startHeight: "31445947",
          stopHeight: "8888888888"
        }
      ],
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
