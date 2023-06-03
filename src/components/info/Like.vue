<template>
  <div class="flex">
    <div class="w-32px h-32px min-w-32px min-h-32px flex items-center justify-center mr-8px mt-15px">
      <img class="w-20px h-20px min-w-20px" src="~@/assets/info-like.svg" alt="">
    </div>
    <div class="flex-1 flex flex-col items-start py-15px border-b-1 border-color8B/30 light:border-color7F">
      <div class="w-full flex items-center gap-5px">
        <img v-for="(item, i) of infoData.userList" :key="i"
             class="w-32px h-32px min-w-32px min-h-32px rounded-full"
             :src="item.profileImg" alt="">
      </div>
      <div class="w-full my-5px text-left text-14px leading-20px">
        <span class="font-bold">{{infoData.userList[0].twitterName}} </span>
        <span class=""> <span v-if="infoData.userList.length>1">等</span>点赞了你的策展 大头点赞了你的策展</span>
      </div>
      <div class="text-left text-color99 leading-18px multi-content">
        这里是具体推文内容
        例：
        这么多L2就只有ARB的TPS逼近以太坊了，大量的都还处在1以下没人用的状态，鬼城现象越来越严重，但依然还不断的在造新的L2，甚至L2上的L3，用户的屁股就是不愿意挪动，第一节车厢人挤人，但是后面10节车厢都没人坐，ARB的Defi生态为用户迁移L2做出了很大的贡献，ImmutableX的游戏生态一直没有起来
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Like",
  props: {
    infoData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
}
</script>

<style scoped>

</style>
