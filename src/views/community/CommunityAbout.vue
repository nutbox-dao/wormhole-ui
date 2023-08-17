<template>
  <div class="px-15px sm:px-0 py-20px">
    <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
           v-if="loadingToken">
        <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
      </div>
    <div v-else-if="!loadingToken && !loadingPool && (!specifyDistributionEras || specifyDistributionEras.length === 0)">
      <!-- <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
      <div class="text-color8B light:text-color7D text-12px mt-15px">{{$t('common.none')}}</div> -->
    </div>
    <template v-else>
      <div class="mb-15px bg-primaryBg light:bg-white light:shadow-color1A p-15px rounded-12px">
        <div class="text-14px font-bold mb-10px text-left">{{ $t('community.token') }}</div>
        <div class="grid gird-cols-1 sm:grid-cols-2 xl:grid-cols-5">
          <div class="col-span-1 xl:col-span-2 flex items-center">
            <img class="w-50px h-50px mr-10px border-0.5px border-color8B/30 rounded-full"
                 :src="showingCommunity && showingCommunity.icon" alt=""/>
            <div class="flex-1 flex flex-col items-start gap-5px">
              <span class="text-16px">{{ showingCommunity['rewardTokenSymbol'] || '--' }}</span>
              <div class="flex items-center gap-6px">
                <div class="token-address text-12px text-color8B light:text-color7D"
                     @click="copyAddress(showingCommunity['rewardToken'])">
                  {{ showingCommunity['rewardTokenName'] || '--' }}
                </div>
                <button class="" @click="copyAddress(showingCommunity['rewardToken'])">
                  <img class="w-14px" src="~@/assets/icon-copy-gray.svg" alt="">
                </button>
                <button class="" @click="gotoToken">
                  <img class="w-14px" src="~@/assets/icon-link-gray.svg" alt="">
                </button>
              </div>
            </div>
          </div>
          <div class="col-span-1 xl:col-span-3 flex flex-col gap-8px 2md:border-l-0.5px border-color8B/30 pl-15px">
            <div class="flex items-center justify-between">
              <div class="text-color8B light:text-color7D text-12px">{{ $t('community.price') }}</div>
              <div class="text-14px font-bold">{{ showingCommunity.rewardPrice }}</div>
            </div>
            <div class="flex items-center justify-between">
              <div class="text-color8B light:text-color7D text-12px">{{ $t('community.totalSupply') }}</div>
              <div class="text-14px font-bold">{{ supply }}</div>
            </div>
            <div class="flex items-center justify-between">
              <div class="text-color8B light:text-color7D text-12px">{{ $t('community.cap') }}</div>
              <div class="text-14px font-bold">{{ cap }}</div>
            </div>
          </div>
        </div>
      </div>

      <div v-show="specifyDistributionEras.length > 0"
           class="mb-15px bg-primaryBg light:bg-white light:shadow-color1A p-15px rounded-12px">
        <div class="text-14px font-bold mb-10px text-left">{{$t('community.disStrategy')}}</div>
        <div class="overflow-auto no-scroll-bar">
          <AboutProgress :progress-data="specifyDistributionEras"></AboutProgress>
        </div>
      </div>
      <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
           v-if="loadingPool">
        <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
      </div>
      <div v-else-if="poolsData && (poolsData.length > 0)">
        <div class="mb-15px bg-primaryBg light:bg-white light:shadow-color1A p-15px rounded-12px">
          <div class="text-14px font-bold mb-15px text-left">{{$t('community.tokenDistribution')}}</div>
          <PoolRatio :animation='false' :pools-data="tokenDistribution" :canvas-id="'token-distribution-pie-' + communityId"/>
        </div>
        <div class="mb-15px bg-primaryBg light:bg-white light:shadow-color1A p-15px rounded-12px">
          <div class="text-14px font-bold mb-15px text-left">{{$t('community.pool')}}</div>
          <PoolRatio :animation='false' :pools-data="poolsData"/>
        </div>
      </div>
    </template>
    <template v-if="!loadingAsset">
      <div class="mb-15px bg-primaryBg light:bg-white light:shadow-color1A p-15px rounded-12px">
        <div class="text-14px font-bold mb-15px text-left">Tweet Pool</div>
        <PoolRatio :animation='false' :pools-data="tweetPool" :canvas-id="'tweet-pie-' + communityId"/>
      </div>
      <div class="mb-15px bg-primaryBg light:bg-white light:shadow-color1A p-15px rounded-12px">
        <div class="text-14px font-bold text-left mb-15px">{{$t('community.communityAsset')}}</div>
        <div class="flex flex-col xs:flex-row items-center text-14px mt-10px">
          <div class="w-full xs:w-3/10 text-left mb-4px xs:mb-0">
            {{$t('community.pendingReward')}}
          </div>
          <div class="w-full xs:w-7/10 flex justify-between items-center px-15px border-1 bg-black/40 border-1 border-color8B/30
                    light:bg-white light:border-colorE3 hover:border-primaryColor
                    rounded-8px h-40px">
            <input class="bg-transparent h-full w-full" disabled
                    :value="formatAmount(communityContractInfo?.balance?.toString() / (10 ** showingCommunity.rewardTokenDecimals))" type="text">
            <span class="">{{ showingCommunity.rewardTokenSymbol }}</span>
          </div>
        </div>
        <div class="flex flex-col xs:flex-row items-center text-14px mt-10px">
          <div class="w-full xs:w-3/10 text-left mb-4px xs:mb-0">
            {{$t('community.fundAddress')}}
          </div>
          <div class="w-full xs:w-7/10 flex justify-between items-center px-15px border-1 bg-black/40 border-1 border-color8B/30
                    light:bg-white light:border-colorE3 hover:border-primaryColor
                    rounded-8px h-40px">
            <input class="bg-transparent h-full w-full" disabled
                    :value="communityContractInfo.storageAddr" type="text">
          </div>
        </div>
      </div>
    </template>
      <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
           v-else="loadingAsset">
        <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
      </div>
  </div>
</template>

<script>
import PoolRatio from "@/components/community/PoolRatio.vue";
import AboutProgress from "@/components/community/AboutProgress.vue";
import { getSpecifyDistributionEras } from '@/utils/community'
import { getTokenSupply } from '@/utils/asset'
import { mapState } from "vuex";
import { sleep, formatAmount, formatPrice } from '@/utils/helper'
import { getSpecifyCommunityInfoFromTheGraph } from '@/utils/graphql/community'
import { getBlockNum } from '@/utils/web3/web3'
import { EVM_CHAINS_ID, EVM_CHAINS } from "@/config";
import {copyAddress} from "@/utils/tool";
import i18n from "@/lang";

export default {
  name: "CommunityAbout",
  components: {PoolRatio, AboutProgress},
  data() {
    return {
      communityId: '',
      loadingToken: true,
      loadingPool: true,
      loadingAsset: true,
      tokenDistribution: [
        {name: i18n.global.t('community.communityPool'), ratio: 10*100 },
        {name: i18n.global.t('community.communityAsset'), ratio: 90*100 }
      ],
      supply: 0,
      cap: 0
    }
  },
  computed: {
    ...mapState('community', ['showingCommunity', 'configs', 'specifyDistributionEras', 'poolsData', 'communityContractInfo', 'nutboxCommunityInfo']),
    tweetPool() {
      if (this.showingCommunity) {
        const reward = this.showingCommunity.rewardPerDay / (10 ** this.showingCommunity.rewardTokenDecimals)
        const ann = this.showingCommunity.annRewardPerDay / (10 ** this.showingCommunity.rewardTokenDecimals)
        const space = this.showingCommunity.spaceRewardPerDay / (10 ** this.showingCommunity.rewardTokenDecimals)
        const total = reward + ann + space
        return [
          {name: i18n.global.t('community.normalTweet'), ratio: parseFloat((reward / total)*10000).toFixed(0), value: reward },
          {name: i18n.global.t('community.announcement'), ratio: parseFloat((ann / total)*10000).toFixed(0), value: ann },
          {name: 'Space', ratio: parseFloat((space / total)*10000).toFixed(0), value: space },
        ]
      }
      return []
    }
  },
  async activated() {
    let count = 0;
    this.loadingAsset = true;
    while ((!this.showingCommunity || !this.showingCommunity.configs || !this.configs[this.showingCommunity.communityId]) && count++ < 30) {
      await sleep(0.2)
    }
    this.loadingAsset = false
    if (this.communityId !== this.showingCommunity.communityId) {
      this.communityId = this.showingCommunity.communityId
    }
    this.refresh()
  },
  methods: {
    copyAddress,
    formatAmount,
    gotoToken() {
      window.open(EVM_CHAINS[EVM_CHAINS_ID[this.showingCommunity.chainId]].tokenScan + this.showingCommunity['rewardToken'], '__blank')
    },
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
        getTokenSupply(EVM_CHAINS_ID[this.showingCommunity.chainId], this.showingCommunity.rewardToken).then(supply => {
          this.supply = formatAmount(supply)
          this.cap = formatPrice(supply * this.showingCommunity.rewardPrice)
        })
        getSpecifyCommunityInfoFromTheGraph(EVM_CHAINS_ID[this.showingCommunity.chainId], nutboxContract).then(res => {
          this.tokenDistribution = [
          {name: i18n.global.t('community.communityPool'), ratio: 10000 - res.feeRatio },
          {name: i18n.global.t('community.communityAsset'), ratio: res.feeRatio }
          ]
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
