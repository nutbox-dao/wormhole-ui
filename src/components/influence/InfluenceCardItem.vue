<template>
  <div class="relative bg-color27 rounded-16px overflow-hidden">
    <div class="influence-card w-full h-200px rounded-14px relative pt-30px pb-20px px-15px
                flex flex-col justify-between items-start">
      <div class="flex items-center">
        <img class="w-48px h-48px min-w-48px border-2 border-colorF7/36 rounded-full shadow-color72"
             :src="community.icon" alt="">
        <span class="text-white text-20px leading-26px c-text-black ml-10px">{{community.name}}</span>
      </div>
      <div class="w-full">
        <div class="flex items-end">
        <span class="text-32px leading-32px c-text-black text-white mr-4px">
          {{community.influence}}
        </span>
          <el-popover :width="200" trigger="hover">
            <template #reference>
              <img class="w-14px h-14px min-w-16px min-h-16px opacity-75 mb-5px"
                   src="~@/assets/icon-warning-white.svg" alt="">
            </template>
            <div>规则描述</div>
          </el-popover>
        </div>
        <div class="flex items-center">
          <el-progress class="c-progress-gradient flex-1 w-full"
                       :text-inside="false"
                       :stroke-width="10"
                       :show-text="false"
                       :percentage="80"/>
          <button class="bg-white/20 w-20px h-20px rounded-full flex justify-center items-center ml-10px"
                  @click="isFold=!isFold">
            <img class="w-16px transform spin-slow"
                 :class="isFold?'rotate-0':'-rotate-180'"
                 src="~@/assets/icon-select-white.svg" alt="">
          </button>
        </div>
        <div class="text-12px text-white/80 text-left">
          {{$t('community.influenceTip', {percent: 80})}}
        </div>
      </div>
    </div>
    <el-collapse-transition>
      <div v-show="!isFold" class="pl-15px pr-45px pt-17px pb-30px">
        <div class="text-14px text-white/60 text-left mb-4px">RC: 873</div>
        <el-progress class="c-progress-green flex-1 w-full"
                     color="#68E796"
                     :text-inside="false"
                     :stroke-width="6"
                     :show-text="false"
                     :percentage="80"/>
        <div class="text-14px text-white/60 text-left mt-15px mb-4px">
          {{$t('community.twitterInfluence')}}: 873
        </div>
        <el-progress class="c-progress-purple flex-1 w-full"
                     color="#7700E0"
                     :text-inside="false"
                     :stroke-width="6"
                     :show-text="false"
                     :percentage="80"/>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
export default {
  name: "InfluenceCardItem",
  data() {
    return {
      isFold: true,
      community: {
        poster: 'https://cdn.wherein.mobi/nutbox/v2/1661235326512',
        icon: 'https://cdn.wherein.mobi/nutbox/v2/1661235173292',
        tags: ['太空探索', '宇宙', '航天飞行'],
        name: 'SpaceX',
        chain: 'Polygon',
        symbol: 'MATIC',
        tokenAddress: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
        members: 35,
        desc: '太空探索技术公司，即美国太空探索技术公司，是一家由PayPal早期投资人埃隆·马斯克2002年6月建立的美国太空运输公司。',
        influence: 18000
      }
    }
  }
}
</script>

<style scoped lang="scss">
.influence-card {
  background-image: linear-gradient(135deg, #AE88FE 0%, #923CFF 45%, #00B2FF 100%);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
</style>
