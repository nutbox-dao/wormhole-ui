<template>
  <div class="px-15px sm:px-0 py-20px">
    <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
           v-if="loadingToken">
        <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
      </div>
    <div v-show="specifyDistributionEras.length > 0" class="">
      <div class="text-14px font-bold mb-10px text-left">{{$t('community.disStrategy')}}</div>
      <AboutProgress :progress-data="specifyDistributionEras"></AboutProgress>
    </div>
    <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
           v-if="loadingPool">
        <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
      </div>
    <div class="mt-30px" v-if="poolsData && (poolsData.length > 0)">
      <div class="text-14px font-bold mb-15px text-left">{{$t('community.pool')}}</div>
      <PoolRatio :animation='false' :pools-data="poolsData"/>
    </div>
  </div>
</template>

<script>
import PoolRatio from "@/components/community/PoolRatio.vue";
import AboutProgress from "@/components/community/AboutProgress.vue";
import { getSpecifyDistributionEras } from '@/utils/community'
import { mapState } from "vuex";
import { sleep } from '@/utils/helper'
import { getSpecifyCommunityInfoFromTheGraph } from '@/utils/graphql/community'
import { getBlockNum } from '@/utils/web3/web3'

export default {
  name: "CommunityAbout",
  components: {PoolRatio, AboutProgress},
  data() {
    return {
      communtiyId: '',
      loadingToken: true,
      loadingPool: true
    }
  },
  computed: {
    ...mapState('community', ['showingCommunity', 'configs', 'specifyDistributionEras', 'poolsData'])
  },
  async activated() {
    let count = 0;
    while (!this.showingCommunity || !this.showingCommunity.communityId || !this.configs[this.showingCommunity.communityId] || count++ < 30) {
      await sleep(0.2)
    }
    await sleep(1)
    if (this.communityId !== this.showingCommunity.communityId) {
      this.communityId = this.showingCommunity.communityId
    }
      this.refresh()
  },
  methods: {
    async refresh() {
      const nutboxContract = this.configs[this.showingCommunity.communityId]['nutbox_contract']
      if (nutboxContract) {
        this.loadingPool = true;
        this.loadingToken = true;
        getSpecifyDistributionEras(this.showingCommunity, nutboxContract).then(res => {
        }).catch(e => {
          console.log(2, e)
        }).finally(() => {
          this.loadingToken = false
        })
        getSpecifyCommunityInfoFromTheGraph(nutboxContract).then(res => {
        }).catch(e => {
          console.log(3, e)
        }).finally(() => {
          this.loadingPool = false
        })
        getBlockNum(this.showingCommunity.chainId).catch(e => {
          console.log('Update block num fail:', e);
        })
      }
    }
  },
  mounted () {
  },
}
</script>

<style scoped>

</style>
