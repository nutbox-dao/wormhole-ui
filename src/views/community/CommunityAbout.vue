<template>
  <div class="px-15px sm:px-0 py-20px">
    <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
           v-if="loadingToken">
        <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
      </div>
    <div v-else-if="!loadingToken && !loadingPool && (!specifyDistributionEras || specifyDistributionEras.length === 0)" class="py-2rem">
      <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
      <div class="text-color8B light:text-color7D text-12px mt-15px">{{$t('common.none')}}</div>
    </div>
    <div v-show="specifyDistributionEras.length > 0" class="">
      <div class="text-14px font-bold mb-10px text-left">{{$t('community.disStrategy')}}</div>
      <AboutProgress :progress-data="specifyDistributionEras"></AboutProgress>
    </div>
    <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
           v-if="loadingPool">
        <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
      </div>
    <div class="mt-30px" v-else-if="poolsData && (poolsData.length > 0)">
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
import { EVM_CHAINS_ID } from "@/config";

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
    while ((!this.showingCommunity || !this.showingCommunity.communityId || !this.configs[this.showingCommunity.communityId]) && count++ < 30) {
      await sleep(0.2)
    }
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
        getSpecifyCommunityInfoFromTheGraph(EVM_CHAINS_ID[this.showingCommunity.chainId], nutboxContract).then(res => {
        }).catch(e => {
          console.log(3, e)
        }).finally(() => {
          this.loadingPool = false
        })
        getBlockNum(this.showingCommunity.chainId).catch(e => {
          console.log('Update block num fail:', e);
        })
      }else {
        this.loadingPool = false;
        this.loadingToken = false;
      }
    }
  },
  mounted () {
  },
}
</script>

<style scoped>

</style>
