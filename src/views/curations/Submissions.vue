<template>
  <div>
    <div class="md:border-b-1 border-dividerColor mb-1rem">
      <div class="relative container mx-auto max-w-50rem md:px-1rem px-15px flex items-center md:justify-start justify-center h-2.8rem">
        <div class="c-text-black text-1.5rem md:text-1rem mx-1.9rem">
          #1  Submissions  500
        </div>
      </div>
    </div>
    <div class="container mx-auto max-w-600px xl:max-w-30rem bg-blockBg rounded-20px mb-2rem py-2rem">
      <div class="flex justify-between items-center py-1rem px-1.5rem text-left border-b-1 border-color8B/30"
           v-for="i of 10" :key="i">
        <div class="flex items-center">
          <img class="w-40px h-40px 2xl:w-2rem 2xl:h-2rem rounded-full"
               src="~@/assets/icon-default-avatar.svg" alt="">
          <div class="text-12px leading-18px 2xl:text-0.7rem 2xl:leading-1rem ml-15px">
            <div>shiney.eth </div>
            <div class="text-color8B">about 1 hour ago </div>
          </div>
        </div>
        <div class="flex items-center">
          <span class="font-700 text-15px leading-18px 2xl:text-0.75rem 2xl:leading-1rem">0.02ETH </span>
          <img class="w-15px h-15px 2xl:w-0.75rem 2xl:h-0.75rem ml-5px"
               src="~@/assets/icon-question-white.svg" alt="">
        </div>
      </div>
      <button class="flex items-center justify-center gradient-btn gradient-btn-shadow
                     h-2.7rem px-1rem rounded-full c-text-black text-1.2rem
                     absolute bottom-2rem left-1/2 transform -translate-x-1/2 z-2"
              @click="modalVisible=true">
        Confirm Reward
      </button>
    </div>
    <van-popup class="c-tip-drawer 2xl:w-2/5"
               :close-on-click-overlay="false"
               v-model:show="modalVisible"
               :position="position">
      <div v-loading="connectLoading"
           class="modal-bg w-full md:max-w-560px 2xl:max-w-28rem max-h-80vh 2xl:max-h-28rem overflow-auto
                  flex flex-col rounded-t-1.5rem md:rounded-b-1.5rem pt-1rem md:py-2rem md:px-4rem">
        <div v-if="position === 'bottom'"
             @click="modalVisible=false"
             class="w-6rem h-8px bg-color73 rounded-full mx-auto mb-1rem"></div>
        <div class="flex-1 overflow-auto px-1.5rem no-scroll-bar">
          <ConfirmRewardTip class="py-2rem sm:py-0"
                            @onConnect="connectLoading=true"
                            @close="modalVisible=false"/>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import ConfirmRewardTip from "@/components/ConfirmRewardTip";
export default {
  name: "Submissions",
  components: {ConfirmRewardTip},
  data() {
    return {
      position: document.body.clientWidth < 768?'bottom':'center',
      modalVisible: false,
      connectLoading: false
    }
  }
}
</script>

<style scoped>

</style>
