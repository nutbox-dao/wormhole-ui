<template>
  <div>
    <div class="md:border-b-1 border-dividerColor mb-1rem">
      <div class="relative container mx-auto max-w-50rem md:px-1rem px-15px flex items-center md:justify-start justify-center h-2.8rem">
        <div class="c-text-black text-1.5rem md:text-1rem mx-1.9rem">
          {{$t('curation.claimReward')}}
        </div>
      </div>
    </div>
    <div class="container mx-auto max-w-600px xl:max-w-30rem bg-blockBg rounded-20px px-2rem sm:px-4.5rem py-2rem mb-2rem text-left">
      <div class="italic text-12px leading-24px 2xl:text-0.6rem 2xl:leading-1.2rem">
        {{$t('curation.claimRewardTip')}}
      </div>
      <div class="mt-2rem">
        <div class="mb-6px">{{$t('common.connectMetamask')}}</div>
        <div class="relative border-1 gradient-border gradient-border-color3 rounded-12px h-50px 2xl:2.5rem
                    flex justify-center items-center cursor-pointer"
             @click="connectLoading=true">
          <span class="font-600 text-15px 2xl:text-0.75rem gradient-text gradient-text-purple-white">{{$t('common.connectMetamask')}}</span>
          <img class="absolute h-32px right-20px" src="~@/assets/icon-metamask.png" alt="">
          <div v-if="connectLoading"
               class="absolute bg-black/70 w-full h-full rounded-12px flex justify-center items-center">
            <img class="w-3rem" src="~@/assets/loading-points.svg" alt="">
          </div>
        </div>
      </div>
      <div class="border-1 border-color8B/30 rounded-15px mt-1rem text-left mt-1.5rem overflow-hidden">
        <div class="px-1rem py-0.5rem">
          <div class="text-primaryColor mb-10px text-15px 2xl:text-0.75rem">{{$t('curation.pendingClaim')}}  {{lastId}}</div>
          <div class="flex justify-between items-center py-6px" v-for="i of 3" :key="i">
            <div class="flex items-center">
              <img class="w-34px h-34px 2xl:w-1.7rem 2xl:h-1.7rem rounded-full"
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
          <div class="text-right mt-0.6rem cursor-pointer" @click="$router.push('/submissions/500')">
            {{$t('curation.viewAll')}}  >
          </div>
        </div>
        <div class="bg-color8B/30 h-34px 2xl:h-1.7rem text-15px 2xl:text-0.75rem flex justify-center items-center text-color8B font-600">
          {{$t('curation.claim')}}
        </div>
      </div>
      <div class="border-1 border-color8B/30 rounded-15px mt-1rem text-left mt-1.5rem overflow-hidden">
        <div class="px-1rem py-0.5rem">
          <div class="text-primaryColor mb-10px text-15px 2xl:text-0.75rem">{{$t('curation.claimed')}}  {{issuedRecords}}</div>
          <div class="flex justify-between items-center py-6px" v-for="i of 3" :key="i">
            <div class="flex items-center">
              <img class="w-34px h-34px 2xl:w-1.7rem 2xl:h-1.7rem rounded-full"
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
          <div class="text-right mt-0.6rem cursor-pointer">
            {{$t('curation.viewAll')}}  >
          </div>
        </div>
        <div class="gradient-bg gradient-bg-opacity-80 h-34px 2xl:h-1.7rem text-15px 2xl:text-0.75rem flex justify-center items-center font-600">
          {{$t('curation.claimed')}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getRefreshCurationRecord } from '@/api/api'
import { getCurationInfo } from '@/utils/curation'
import { mapState, mapGetters } from 'vuex'

export default {
  name: "ConfirmReward",
  computed: {
    ...mapState('curation', ['detailCuration']),
    ...mapGetters(['getAccountInfo'])
  },
  data() {
    return {
      connectLoading: false,
      totalRecords: 0,
      issuedRecords: 0,
      lastId: 0,
      pendingList: [],
      issuedList: []
    }
  },
  async mounted() {
    if (!this.getAccountInfo || !this.getAccountInfo.twitterId){
      this.$router.replace('/')
    }
    if (this.detailCuration && this.detailCuration.curationId) {
      console.log(43, this.detailCuration);
      const info = await getCurationInfo(this.detailCuration.curationId)
      const lastId = parseInt(info.task.currentIndex);
      const totalCount = parseInt(info.userCount)
      this.totalRecords = totalCount;
      this.issuedRecords = totalCount - lastId;
      this.lastId = lastId
      [this.pendingList, this.issuedList] = await Promise.all([getRefreshCurationRecord(this.detailCuration.curationId, 0),
      getRefreshCurationRecord(this.detailCuration.curationId, lastId)]);

    }
  }
}
</script>

<style scoped>

</style>
