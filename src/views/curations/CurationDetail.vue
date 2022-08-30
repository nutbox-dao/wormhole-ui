<template>
  <div>
    <div class="md:border-b-1 border-dividerColor mb-1rem">
      <div class="relative container mx-auto max-w-50rem
                  md:px-1rem px-15px flex items-center
                  md:justify-start justify-center h-2.8rem">
        <div class="c-text-black text-1.5rem md:text-1rem mx-1.9rem">Curation Detail</div>
      </div>
    </div>
    <div class="container mx-auto max-w-50rem pb-2rem px-15px">
      <div class="grid grid-cols-3 gap-1.5rem">
        <div class="col-span-3 xl:col-span-2 md:bg-blockBg rounded-15px py-1.5rem text-left">
          <div class="px-1.5rem">
            <div class="c-text-black text-1.5rem sm:text-24px">
              Retweet a post to earn USDTs
            </div>
            <div class="flex items-center flex-wrap gap-1rem mt-1rem">
            <span class="px-10px py-6px bg-white/10 rounded-full text-12px lg:text-0.7rem leading-18px">
              Ongoing
            </span>
              <span class="px-10px py-6px bg-white/10 rounded-full text-12px lg:text-0.7rem leading-18px">
              2022-08-12 20:30 ~ 2022-08-14 20:30
            </span>
            </div>
          </div>
          <div class="px-1.5rem mt-2rem">
            <div class="flex ">
              <img class="w-2.5rem h-2.5rem md:w-3.6rem md:h-3.6rem md:mr-1.5rem sm:mr-1.4rem mr-0.8rem rounded-full "
                   src="@/assets/icon-default-avatar.svg" alt="">
              <div class="flex-1 flex justify-between items-center cursor-pointer">
                <a class="c-text-black text-left mr-3 text-1rem leading-1.5rem">Ian Yin </a>
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-3 xl:col-span-1">
          <div class="gradient-bg gradient-bg-opacity-80 rounded-15px py-0.5rem px-1.5rem">
            <div class="flex justify-between items-center">
              <span>Reward</span>
              <div class="flex items-center">
                <span class="text-primaryColor font-500">PosW</span>
                <img class="w-20px 2xl:w-1rem ml-0.5rem" src="~@/assets/icon-question-purple.svg" alt="">
              </div>
            </div>
            <div class="w-full h-1px bg-white mt-0.8rem mb-1.6rem"></div>
            <div class="flex justify-between items-center mb-2rem">
              <span>Token</span>
              <div class="flex items-center">
                <img class="w-1.5rem mr-0.6rem" src="~@/assets/icon-eth-white.svg" alt="">
                <span class="font-700 gradient-text gradient-text-purple-white text-1.4rem">100 ETH</span>
              </div>
            </div>
            <div class="text-primaryColor text-12px 2xl:text-0.6rem">Rewards on Ethereum</div>
          </div>
          <div class="border-1 border-color8B/30 rounded-15px p-2 mt-1rem text-left">
            <div class="text-primaryColor mb-10px">#1  Submissions  12</div>
            <div class="flex items-center py-6px" v-for="i of 3" :key="i">
              <img class="w-34px h-34px 2xl:w-1.7rem 2xl:h-1.7rem rounded-full"
                   src="~@/assets/icon-default-avatar.svg" alt="">
              <div class="text-12px leading-18px 2xl:text-0.7rem 2xl:leading-1rem ml-15px">
                <div>shiney.eth </div>
                <div class="text-color8B">about 1 hour ago </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button class="flex items-center justify-center gradient-btn
                   gradient-btn-shadow h-2.7rem px-1rem
                   rounded-full c-text-black text-1.2rem
                   absolute bottom-2rem left-1/2 transform -translate-x-1/2 z-2">
      Tweet action tips
    </button>
    <van-popup class="c-tip-drawer 2xl:w-2/5"
               v-model:show="modalVisible"
               :position="position">
      <div class="modal-bg w-full md:max-w-560px 2xl:max-w-28rem
      max-h-80vh 2xl:max-h-28rem overflow-auto flex flex-col
      rounded-t-1.5rem md:rounded-b-1.5rem pt-1rem md:py-2rem">
        <div v-if="position === 'bottom'"
             @click="modalVisible=false"
             class="w-6rem h-8px bg-color73 rounded-full mx-auto mb-1rem"></div>
        <div class="flex-1 overflow-auto px-1.5rem no-scroll-bar">

        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>

export default {
  name: "CurationDetail",
  data() {
    return {
      position: document.body.clientWidth < 768?'bottom':'center',
      modalVisible: false
    }
  }
}
</script>

<style scoped>

</style>
