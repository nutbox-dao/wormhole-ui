<template>
  <div class="rounded-16px overflow-hidden relative pt-50px pb-15px px-15px
              border-1 border-color8B/30 light:border-colorF2 bg-blockBg light:bg-white">
    <img class="w-full h-100px min-h-100px max-h-100px object-cover absolute top-0 left-0"
         :src="community.poster" alt="">
    <div class="relative">
      <div class="flex items-stretch">
        <img class="w-72px h-72px min-w-72px min-h-72px border-3 border-colorF7 rounded-9px bg-colorF7"
             :src="community.icon" alt="">
        <div class="flex-1 flex flex-col justify-between ml-15px">
          <div class="flex justify-between items-start">
            <div class="text-left">
              <div class="c-text-black text-24px text-white mb-8px">{{community.name}}</div>
              <div class="flex items-center text-white text-12px">
                <img class="w-14px h-14px min-w-14px rounded-full mr-4px"
                     :src="TokenIcon[community.symbol]" alt="">
                <span>{{community.chain}}</span>
                <div class="w-1px h-12px bg-white mx-8px"></div>
                <div>{{$t('community.peopleJoined', {num: community.members})}}</div>
              </div>
            </div>
            <!-- 小按钮版 -->
            <button class="h-34px rounded-full bg-white flex justify-center items-center px-15px">
              <img class="w-14px h-14px mr-4px" src="~@/assets/icon-add-black.svg" alt="">
              <span class="text-14px font-500 text-color46">{{$t('community.join')}}</span>
            </button>
          </div>
          <div class="flex flex-wrap gap-5px">
            <span v-for="(tag, tIndex) of community.tags" :key="tIndex"
                  class="border-1 border-color62 rounded-full bg-colorF1 text-color62 text-12px h-18px
                         px-8px flex justify-center items-center">{{tag}}</span>
          </div>
        </div>
      </div>
      <div class="text-left text-14px leading-20px mt-10px">{{community.desc}}</div>
<!--      大按钮版-->
<!--      <button class="h-40px rounded-full gradient-bg gradient-bg-color3 w-full mt-10px">-->
<!--        <span class="text-14px font-500 text-white">{{$t('community.join')}}</span>-->
<!--      </button>-->
    </div>
  </div>
</template>

<script>
import {TokenIcon} from "@/config";
export default {
  name: "CommunityItem",
  data() {
    return {
      TokenIcon,
      community: {
        poster: 'https://cdn.wherein.mobi/nutbox/v2/1661235326512',
        icon: 'https://cdn.wherein.mobi/nutbox/v2/1661235173292',
        tags: ['太空探索', '宇宙', '航天飞行'],
        name: 'SpaceX',
        chain: 'Polygon',
        symbol: 'MATIC',
        tokenAddress: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
        members: 35,
        desc: '太空探索技术公司，即美国太空探索技术公司，是一家由PayPal早期投资人埃隆·马斯克2002年6月建立的美国太空运输公司。'
      }
    }
  }
}
</script>

<style scoped>

</style>
