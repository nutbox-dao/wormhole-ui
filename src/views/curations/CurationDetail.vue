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
        <div v-loading="loading1" class="col-span-3 xl:col-span-2 bg-blockBg rounded-15px py-1.5rem text-left">
          <div class="px-1.25rem pb-2rem border-b-1 border-color8B/30">
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
          <div class="px-1.25rem pt-1rem">
            <div class="flex items-center">
              <img class="w-2.6rem md:h-2.6rem md:w-50px md:h-50px md:min-h-50px md:mr-30px mr-0.8rem rounded-full "
                   src="@/assets/icon-default-avatar.svg" alt="">
              <div class="flex md:flex-col md:justify-center md:items-start">
                <a class="c-text-black text-16px 2xl:text-0.8rem leading-24px 2xl:leading-1.2rem mr-0.8rem">Ian Yin </a>
                <span class="text-15px 2xl:text-0.75rem text-color8B leading-22px 2xl:leading-1.1rem">@guazi123</span>
              </div>
            </div>
            <div class="ml-3.4rem md:ml-80px mt-1.2rem">
              <div class="font-600 text-1rem mb-0.6rem">Description</div>
              <div class="text-14px 2xl:text-0.7rem leading-24px">
                <div class="font-600">Rewards:</div>
                <div class="text-color8B">
                  At the end of the task, the reward will be distributed to the participants according to the task contribution. 100 ETH in total.
                </div>
                <div class="font-600 mt-1rem">Claim Quest (Choose one of the ways below):</div>
                <div class="text-color8B">
                  ✅ Tweet on Twitter <br>

                  ✅  Quote Tweet on Twitter <br>
                  <br>
                  ①Visit the announcement quest tweet. <br>
                  ②Quote Tweet on Twitter. <br>
                  ③Tweet include hashtag and link below. <br>
                  <br>
                  Life3, Web3, Earn by Quest
                </div>
              </div>
            </div>
          </div>
          <div class="border-t-1 border-color8B/30 mt-3rem px-1.25rem">
            <div class="gradient-border border-1 rounded-12px mt-1rem overflow-hidden expand-box
                        flex flex-col"
                 :class="isExpand?'active max-h-300px':'max-h-50px'">
              <div class="flex items-center justify-center relative cursor-pointer h-50px min-h-50px"
                   @click="isExpand=!isExpand">
                <img class="w-26px 2xl:w-1.3rem mr-1rem"
                     src="~@/assets/icon-twitter-white.svg" alt="">
                <span class="gradient-text gradient-text-purple-white font-600 text-15px 2xl:text-0.75rem">
                  Quote Tweet on Twitter
                </span>
                <img class="absolute right-1rem"
                     src="~@/assets/icon-select-white.svg" alt="">
              </div>
              <div class="flex-1 bg-black border-t-1 border-color8B/30 overflow-auto">
                <div class="min-h-10rem">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-3 xl:col-span-1">
          <div v-loading="loading2" class="gradient-bg gradient-bg-opacity-80 rounded-15px py-0.5rem px-1.5rem min-h-4rem">
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
          <div v-loading="loading3" class="border-1 border-color8B/30 rounded-15px p-2 mt-1rem text-left min-h-8rem">
            <div class="text-primaryColor mb-10px">#1  Submissions  12</div>
            <div class="flex items-center py-6px" v-for="i of 3" :key="i">
              <img class="w-34px h-34px 2xl:w-1.7rem 2xl:h-1.7rem rounded-full"
                   src="~@/assets/icon-default-avatar.svg" alt="">
              <div class="text-12px leading-18px 2xl:text-0.7rem 2xl:leading-1rem ml-15px">
                <div>shiney.eth </div>
                <div class="text-color8B">about 1 hour ago </div>
              </div>
            </div>
            <div class="text-right mt-0.6rem cursor-pointer text-12px 2xl:text-0.6rem"
                 @click="$router.push('/submissions/12')">
              View All  >
            </div>
          </div>
          <div class="xl:mt-2rem px-6px">
            <button class="flex items-center justify-center gradient-btn
                   gradient-btn-shadow h-2.7rem px-1rem
                   rounded-full c-text-black text-1.2rem
                   xl:relative xl:bottom-0 xl:w-full
                   fixed bottom-2rem left-1/2 transform -translate-x-1/2 z-2001"
                    @click="modalVisible=true">
              Attend Curation
            </button>
          </div>
        </div>
      </div>
    </div>
    <van-popup class="c-tip-drawer 2xl:w-2/5"
               v-model:show="modalVisible"
               :position="position">
      <div class="modal-bg w-full md:w-560px 2xl:max-w-28rem
      max-h-80vh 2xl:max-h-28rem overflow-auto flex flex-col
      rounded-t-1.5rem md:rounded-b-1.5rem pt-1rem md:py-2rem">
        <div v-if="position === 'bottom'"
             @click="modalVisible=false"
             class="w-6rem h-8px bg-color73 rounded-full mx-auto mb-1rem"></div>
        <div class="flex-1 overflow-auto px-1rem xl:px-2.5rem no-scroll-bar">
          <TweetAttendTip class="py-2rem md:py-0"
                          @close="modalVisible=false"/>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import TweetAttendTip from "@/components/TweetAttendTip";
export default {
  name: "CurationDetail",
  components: {TweetAttendTip},
  data() {
    return {
      position: document.body.clientWidth < 768?'bottom':'center',
      modalVisible: false,
      isExpand: false,
      loading1: true,
      loading2: true,
      loading3: true
    }
  }
}
</script>

<style scoped lang="scss">
.expand-box {
  transition: max-height 500ms;
}

</style>
