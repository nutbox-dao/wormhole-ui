<template>
  <van-pull-refresh v-model="loading[chainTab]" @refresh="onRefresh"
                    loading-text="Loading"
                    pulling-text="Pull to refresh data"
                    loosing-text="Release to refresh">
    <div class="md:pb-4rem sm:max-w-600px lg:max-w-35rem mx-auto flex flex-col">
      <div class="py-1rem px-15px sm:px-0 relative">
        <div class="px-16px relative min-h-30px overflow-hidden">
          <div class="flex tabs overflow-x-auto no-scroll-bar" ref="tabsRef">
            <button class="tab h-30px text-12px sm:text-14px"
                    :class="chainTab===index?'active':''"
                    @click="selectTab(index)"
                    v-for="(name, index) of chainNames" :key="name">
              {{ name }}
            </button>
            <button class="tab h-30px text-12px sm:text-14px"
                    :class="chainTab===chainNames.length?'active':''"
                    @click="selectTab(chainNames.length)">
              {{ $t('common.curation') }}
            </button>
            <button class="tab h-30px text-12px sm:text-14px"
                    :class="chainTab===chainNames.length + 1?'active':''"
                    @click="selectTab(chainNames.length + 1)">
              {{ $t('common.author') }}
            </button>
          </div>
        </div>
        <div class="gradient-bg gradient-bg-color3 reward-box rounded-12px overflow-hidden px-17px pt-12px pb-20px">
          <div class="mb-1rem flex items-center justify-between cursor-pointer">
            <span class="c-text-black text-white text-16px 2xl:text-0.8rem mx-15px">{{$t('common.summary')}}</span>
          </div>
          <div v-if="summaryList.length > 0" class="text-left flex flex-col gap-y-10px font-bold text-12px 2xl:text-0.75rem
                            bg-primaryColor rounded-12px p-15px">
            <el-checkbox-group class="c-checkbox-group"
                               v-model="checkRewardList" @change="checkboxGroupChange">
              <el-checkbox class="hover:bg-white/10 p-5px " v-for="reward of summaryList" :key="reward.token"
                           :label="reward.token">
                <ChainTokenIcon height="30px" width="30px" class=" p-2px"
                                :token="{symbol: reward.tokenSymbol, address: reward.token}"
                                :chainName="chainTab >= chainNames.length ? 'BNB Smart Chain' : chainNames[chainTab]">
                  <template #amount>
                      <span class="px-8px c-text-black text-white whitespace-nowrap flex items-right text-14px 2xl:text-0.8rem">
                        {{ formatAmount(reward.amount) + ' ' + reward.tokenSymbol + `($${formatAmount(reward.amount * (this.prices[chainTab] ? this.prices[chainTab][reward.token] : 0))})` }}
                      </span>
                  </template>
                </ChainTokenIcon>
              </el-checkbox>
            </el-checkbox-group>
            <button
                    class="ny-gradient-btn gradient-btn-disabled-grey
                              flex items-center justify-center min-w-10rem px-20px
                              rounded-full h-44px 2xl:h-2.2rem text-white font-bold" @click="login">
              {{ $t('signIn') }}
              <c-spinner v-show="false" class="w-16px h-16px 2xl:w-1rem 2xl:h-1rem ml-0.5rem"></c-spinner>
            </button>
          </div>
          <div v-else-if="loading[chainTab]" class="c-text-black text-1.8rem min-h-1rem">
            <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
          </div>
          <div v-else class="px-1.5rem rounded-12px min-h-160px flex justify-center items-center">
            <div class="c-text-black text-white/50 text-1.3rem mb-2rem">{{$t('walletView.claimedAllRewards')}}</div>
          </div>
        </div>
      </div>
      <div class="text-12px sm:text-14px text-left mb-6px p-15px sm:p-0">
        {{ $t('curation.details') }}
      </div>
      <div v-if="showingList.length > 0" class="bg-blockBg light:bg-white rounded-12px basis-full md:basis-auto relative ml-15px mr-15px sm:m-0">
        <!-- <div class="px-1.5rem text-14px w-min flex gap-1rem mt-1rem font-bold">
          <button class="flex items-center rounded-full
                  border-1 border-white/20 leading-14px text-14px py-10px px-24px
                  light:bg-colorF2 light:text-color7D"
                  :class="tabIndex===0?'active-tab':''"
                  @click="tabIndex=0">{{$t('curations')}}</button>
          <button class="flex items-center rounded-full
                  border-1 border-white/20 leading-14px text-14px py-10px px-24px
                  light:bg-colorF2 light:text-color7D"
                  :class="tabIndex===1?'active-tab':''"
                  @click="tabIndex=1">{{$t('common.post')}}</button>
        </div> -->
        <RewardCuration :rewards="showingList" :chain-name="chainTab >= chainNames.length ? 'BNB Smart Chain' : chainNames[chainTab]"/>
      </div>
      <div v-else-if="loading[chainTab]" class="c-text-black text-1.8rem mb-3rem min-h-1rem">
        <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
      </div>
      <div v-else class="px-1.5rem rounded-12px min-h-160px flex justify-center items-center">
        <div class="c-text-black text-color7D text-2rem mb-2rem">{{$t('walletView.claimedAllRewards')}}</div>
      </div>
    </div>
  </van-pull-refresh>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import {formatAddress} from "@/utils/tool";
import RewardCuration from "@/views/user/RewardCuration";
import { getCurationRewardList, autoCurationRewardList, autoCurationAuthorRewardList } from "@/utils/account"
import { getPriceFromOracle } from '@/utils/asset'
import { EVM_CHAINS } from '@/chain-config';
import { checkCurationRewards, checkAutoCurationRewards } from '@/utils/curation'
import ChainTokenIcon from '@/components/ChainTokenIcon'
import { formatAmount } from '@/utils/helper'
import { setCurationIsFeed } from '@/api/api'

export default {
  components: {RewardCuration, ChainTokenIcon},
  props: {
    twitterId: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      tabIndex: 0,
      chainTab: 0,
      loading: [false, false, false, false, false, false],
      claiming: false,
      connecting: false,
      prices: [],
      checkRewardList: [],
      needLogin: false
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo']),
    ...mapState('web3', ['chainId', 'account']),
    ...mapState('curation', ['customRewardLists']),
    chainNames() {
      return Object.keys(EVM_CHAINS)
    },
    chainIds() {
      return Object.values(EVM_CHAINS).map(c => c.id).concat([56, 56])
    },
    showingList() {
      return this.customRewardLists[this.chainTab]
    },
    summaryList() {
      if (this.customRewardLists[this.chainTab].length > 0) {
        let result = {}
        for (let reward of this.customRewardLists[this.chainTab]) {
          const sum = (result[reward.token]?.amount ?? 0)
          result[reward.token] = {
            ...reward,
            amount: sum + (reward.amount.toString() / (10 ** reward.decimals))
          }
        }
        return Object.values(result)
      }
      return []
    },
    accountMismatch() {
      return this.getAccountInfo.ethAddress !== this.account
    }
  },
  methods: {
    formatAddress,
    formatAmount,
    selectTab(index) {
      this.chainTab = index;
      this.checkRewardList = []
      this.getRecords()
    },
    onRefresh() {
      this.getRecords(true);
    },
    async getRecords(force = false) {
      const index = this.chainTab;
      try{
        const currentList = this.customRewardLists[index];
        if (currentList && currentList.length > 0 && !force) {
          return;
        }
        this.loading[index] = true
        if (index === this.chainNames.length) {
          const records = await autoCurationRewardList(this.twitterId);
          if (records && records.length > 0) {
            const claimed = await checkAutoCurationRewards(this.twitterId, records.map(r => r.curationId));

            let result = [];
            let claimedIds = [];
            for (let i = 0; i < claimed.length; i++) {
              if (!claimed[i]) {
                result.push(records[i]);
              }else {
                claimedIds.push(records[i].curationId)
              }
            }
            this.customRewardLists[index] = result;
            this.$store.commit('curation/saveCustomRewardLists', this.customRewardLists)
            getPriceFromOracle('BNB Smart Chain', result).then(res => {
              this.prices[index] = res;
            })
          }else {
            this.customRewardLists[index] = [];
            this.$store.commit('curation/saveCustomRewardLists', this.customRewardLists)
          }
        }else if (index === this.chainNames.length + 1) {
          const records = await autoCurationAuthorRewardList(this.twitterId);
          
          if (records && records.length > 0) {
            const claimed = await checkAutoCurationRewards(this.twitterId, records.map(r => r.curationId));

            let result = [];
            let claimdIds = [];
            for(let i = 0; i < claimed.length; i++) {
              if (!claimed[i]) {
                result.push(records[i])
              }else {
                claimdIds.push(records[i].curationId)
              }
            }
            this.customRewardLists[index] = result;
            this.$store.commit('curation/saveCustomRewardLists', this.customRewardLists)
            getPriceFromOracle('BNB Smart Chain', result).then(res => {
              this.prices[index] = res;
            })
          }else{
            this.customRewardLists[index] = [];
            this.$store.commit('curation/saveCustomRewardLists', this.customRewardLists)
          }
        }else {
          const records = await getCurationRewardList(this.twitterId, this.chainIds[index]);
          if (records && records.length > 0) {
            const claimed = await checkCurationRewards(this.chainNames[index], this.twitterId, records.map(r => r.curationId));
            let result = [];
            let claimedIds = [];
            for (let i = 0; i < claimed.length; i++) {
              if (!claimed[i]) {
                result.push(records[i])
                // getCurationDetail(this.chainNames[index], records[i].curationId)
              }else {
                claimedIds.push(records[i].curationId)
              }
            }
            if (claimedIds.length > 0) {
              setCurationIsFeed(this.twitterId, claimedIds).then().catch(e => {
                console.error('set auto curation feed fail:', e)
              });
            }
            this.customRewardLists[index] = result
            this.$store.commit('curation/saveCustomRewardLists', this.customRewardLists)
            getPriceFromOracle(this.chainNames[index], result).then(res => {
              this.prices[index] = res;
            })

          }else {
            this.customRewardLists[index] = [];
            this.$store.commit('curation/saveCustomRewardLists', this.customRewardLists)
          }
        }
      } catch(e) {
        if (e === 'log out') {
          this.$store.commit('saveShowLogin', true)
        }
        console.log('error', e);
      } finally {
        this.loading[index] = false
      }
    },
    login() {
      this.$store.commit('saveShowLogin', true);
      this.$router.push('/')
    },
    checkboxGroupChange() {
      console.log(Object.values(this.checkRewardList))
    }
  },
  mounted () {
    this.$store.commit('curation/saveCustomRewardLists', [[],[],[],[],[],[],[],[],[]])
    this.getRecords(true);
  },
}
</script>

<style scoped lang="scss">
.active-tab {
  background: linear-gradient(135.53deg, #917AFD 2.61%, #6246EA 96.58%);
  color: white!important;
  border: none;
}
.tabs {
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
}
.tab {
  scroll-snap-align: center;
  // text-transform: uppercase;
  display: inline-block;
  filter: opacity(0.2);
  border: none;
  border-radius: 6px 6px 0 0;
  position: relative;
  background: var(--primary-custom);
  white-space: nowrap;
  cursor: pointer;
  font-weight: bold;
  min-width: fit-content;
  margin: 0 16px;
  padding: 0 12px;
  &.active {
    z-index: 1;
    position: relative;
    filter: opacity(1);
  }
  &::before{
    right: -8px;
    transform: skew(25deg);
    border-radius: 0 8px 0 0;
  }
  &::after{
    transform: skew(-25deg);
    left: -8px;
    border-radius: 8px 0 0 0;
  }
}
.tab:before, .tab:after {
  content: "";
  height: 100%;
  position: absolute;
  background: var(--primary-custom);
  border-radius: 8px 8px 0 0;
  width: 16px;
  min-width: 16px;
  top: 0;
}
.top-level {
  z-index: 100;
}
//@media (max-width: 580px) {
//  .tabs {
//    position: relative;
//  }
//  .tab:nth-child(1) {
//    position: absolute;
//    left: 0;
//  }
//  .tab:nth-child(2) {
//    position: absolute;
//    left: 47%;
//    transform: translateX(-50%);
//  }
//  .tab:nth-child(3) {
//    position: absolute;
//    right: 0;
//  }
//}
</style>