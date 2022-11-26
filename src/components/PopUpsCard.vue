<template>
  <div class="pop-up-bg h-min light:border-1 light:border-colorE3 rounded-12px text-left mt-1rem">
    <div class="w-full">
      <div class="title-bg flex-1 px-1.25rem py-8px flex justify-between items-center">
        <div class="text-white c-text-black italic text-orangeColor text-16px
                    flex-1 flex justify-between items-center truncate">
          Pop-Ups
        </div>
        <button class="w-1.2rem" @click.stop="createPopUpVisible=true">
          <img class="w-1.2rem" src="~@/assets/icon-add-yellow.svg" alt="">
        </button>
      </div>
    </div>
    <div class="collapse-box px-1.25rem mt-12px" :class="popUpsCollapse?'show':''">
      <div class="h-30px 2xl:h-1.5rem p-3px flex justify-between items-start mb-8px
                  border-1 border-colorEE rounded-full"
           v-for="i of ['going', 'going', 'ended']" :key="i">
        <div class="flex items-center h-full truncate">
          <div v-if="i==='going'"
               class="text-orangeColor rounded-full h-full bg-colorEE/25 whitespace-nowrap
                      font-bold min-w-4rem flex justify-center items-center relative">
            04:38
            <img v-if="isJoin"
                 class="w-14px h-14px absolute bottom-0 -right-5px"
                 src="~@/assets/icon-success-green.svg" alt="">
          </div>
          <div v-if="i==='ended'"
               class="text-white rounded-full h-full bg-colorD8 whitespace-nowrap
                      font-bold min-w-4rem flex justify-center items-center relative">
            Ended
            <img v-if="isJoin"
                 class="w-14px h-14px absolute bottom-0 -right-5px"
                 src="~@/assets/icon-success-green.svg" alt="">
          </div>
          <div class="flex-1 ml-1rem whitespace-nowrap truncate">
            NutBox first airdrop campaign
          </div>
        </div>
        <div class="flex items-center justify-end min-w-1/3">
          <ChainTokenIcon :class="[i==='going'?'bg-colorEE/25':'', i==='ended'?'bg-colorD8':'']"
                          height="20px" width="20px" chain-name="ETH">
            <template #amount>
            <span class="px-8px h-17px whitespace-nowrap
                         flex items-center text-12px 2xl:text-0.8rem font-bold"
                  :class="[i==='going'?'text-colorEE':'', i==='ended'?'text-white':'']">
              100 USDT
            </span>
            </template>
          </ChainTokenIcon>
        </div>
      </div>
    </div>
    <button class="w-full h-24px" @click="popUpsCollapse=!popUpsCollapse">
      <img class="mx-auto" :class="popUpsCollapse?'transform rotate-180':''" src="~@/assets/icon-arrow-yellow.svg" alt="">
    </button>
  </div>

</template>

<script>
import ChainTokenIcon from "@/components/ChainTokenIcon";
export default {
  name: "PopUpsCard",
  components: {ChainTokenIcon},
  data() {
    return {
      popUpsCollapse: false,
      isJoin: true
    }
  }
}
</script>

<style scoped lang="scss">
.pop-up-bg {
  background-image: linear-gradient(93.53deg, rgba(255, 168, 0, 0.22) 2.33%, rgba(255, 227, 182, 0) 91.45%);
  background-size: 70% 100%;
  background-repeat: no-repeat;
}
.title-bg {
  background: linear-gradient(93.53deg, rgba(255, 168, 0, 0.22) 2.33%, rgba(255, 227, 182, 0) 91.45%);
}
.collapse-box {
  max-height: 76px;
  min-height: 76px;
  overflow: hidden;
  transition: max-height ease 0.2s;
  &.show {
    max-height: 1500px;
    transition: max-height ease-in-out 0.5s;
  }
}
</style>
