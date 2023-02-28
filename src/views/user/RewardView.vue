<template>
  <div class="absolute left-0 right-0 bottom-0 top-0 flex flex-col text-14px xl:text-0.8rem">
    <div class="flex-1">
      <div class="border-b-1 border-color84/30 light:border-colorF4 sticky -top-1 z-2 bg-primaryBg light:bg-white top-level">
        <div class="px-1.5rem pt-25px sm:px-0 container mx-auto sm:max-w-600px lg:max-w-35rem">
          <div class="flex overflow-hidden text-16px xl:text-0.9rem font-bold ">
            <router-link v-if="getAccountInfo && getAccountInfo.isRegistry === 1"
                         :to="`/profile/${$route.params.user}/wallet`" v-slot="{isActive}"
                         class="flex-1 cursor-pointer">
              <div class="w-full h-40px xl:h-2.4rem flex items-center justify-center border-b-2 md:border-b-4"
                   :class="isActive?'text-color62 border-color62':'text-color7D border-transparent'">
                {{$t('myWallet')}}
              </div>
            </router-link>
            <router-link :to="`/profile/${$route.params.user}/reward`" v-slot="{isActive}"
                         class="flex-1 cursor-pointer">
              <div class="w-full h-40px xl:h-2.4rem flex items-center justify-center border-b-2 md:border-b-4"
                   :class="isActive?'text-color62 border-color62':'text-color7D border-transparent'">
                {{$t('myReward')}}
              </div>
            </router-link>
          </div>
        </div>
      </div>
      <van-pull-refresh v-model="loading[chainTab]" @refresh="onRefresh"
                      loading-text="Loading"
                      pulling-text="Pull to refresh data"
                      loosing-text="Release to refresh">
        <div class="md:pb-4rem sm:max-w-600px lg:max-w-35rem mx-auto flex flex-col">
          <div class="py-1rem mx-1.5rem sm:mx-0 relative">
            <div class="px-16px relative min-h-30px overflow-hidden">
              <div class="flex tabs overflow-x-auto no-scroll-bar" ref="tabsRef">
                <button class="tab h-30px text-12px sm:text-14px"
                        :class="chainTab===index?'active':''"
                        @click="selectTab(index)"
                        v-for="(name, index) of chainNames" :key="name">
                  {{ name }}
                </button>
              </div>
            </div>
            <div class="gradient-bg gradient-bg-color3 reward-box rounded-12px overflow-hidden px-17px pt-12px pb-20px">
              <div class="mb-1rem flex items-center justify-between cursor-pointer">
                <span class="c-text-black text-white text-16px 2xl:text-0.8rem mx-15px">{{$t('common.summary')}}</span>
              </div>
              <div v-if="summaryList.length > 0" class="text-left flex flex-col gap-y-10px font-bold text-12px 2xl:text-0.75rem
                            bg-primaryColor rounded-12px p-15px">
                <div v-for="reward of summaryList" :key="reward.token">
                  <ChainTokenIcon height="30px" width="30px" class=" p-2px"
                    :token="{symbol: reward.tokenSymbol, address: reward.token}"
                    :chainName="chainNames[chainTab]">
                    <template #amount>
                      <span class="px-8px c-text-black whitespace-nowrap flex items-right text-14px 2xl:text-0.8rem">
                        {{ formatAmount(reward.amount) + ' ' + reward.tokenSymbol + `($${formatAmount(reward.amount * (this.prices[chainTab] ? this.prices[chainTab][reward.token] : 0))})` }}
                      </span>
                    </template>
                  </ChainTokenIcon>
                </div>
                <button v-if="chainId !== chainIds[chainTab]" class="ny-gradient-btn gradient-btn-disabled-grey
                              flex items-center justify-center min-w-10rem px-20px
                              rounded-full h-44px 2xl:h-2.2rem text-white font-bold" @click="connect">
                  {{ $t('common.connectMetamask') }}
                  <c-spinner v-show="connecting" class="w-16px h-16px 2xl:w-1rem 2xl:h-1rem ml-0.5rem"></c-spinner>
                </button>
                <button v-else class="flex items-center justify-center bg-ny-btn-gradient
                       h-30px px-15px rounded-full mr-0.8rem"
                       :disabled="claiming || accountMismatch"
                       @click="claimReward">
                      {{ $t('curation.claimReward') }}
                  <c-spinner v-show="claiming" class="w-16px h-16px 2xl:w-1rem 2xl:h-1rem ml-0.5rem"></c-spinner>
                </button>
                <div v-if="accountMismatch" class="text-redColor">
                  {{ $t('ny.accountMismatch') }}
                </div>
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
            <RewardCuration :rewards="showingList" :chain-name="chainNames[chainTab]"/>
            <!-- <RewardPost v-show="tabIndex===1"/> -->
          </div>
          <div v-else-if="loading[chainTab]" class="c-text-black text-1.8rem mb-3rem min-h-1rem">
            <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
          </div>
          <div v-else class="px-1.5rem rounded-12px min-h-160px flex justify-center items-center">
            <div class="c-text-black text-color7D text-2rem mb-2rem">{{$t('walletView.claimedAllRewards')}}</div>
          </div>
        </div>
    </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import {ethers} from "ethers";
import {notify} from "@/utils/notify";
import {formatAddress} from "@/utils/tool";
import RewardCuration from "@/views/user/RewardCuration";
import RewardPost from "@/views/user/RewardPost";

import { getCurationRewardList } from "@/utils/account"
import { getPriceFromOracle } from '@/utils/asset'
import { EVM_CHAINS } from '@/config';
import { checkCurationRewards, checkAutoCurationRewards, getClaimParas, claimRewards, getPromotionCurationClaimParas,
   getChainIdOfCurationContract, getSingerOfCuration, claimPromotionCurationRewards,
   getCurationDetail } from '@/utils/curation'
import ChainTokenIcon from '@/components/ChainTokenIcon'
import { formatAmount } from '@/utils/helper'
import {accountChanged, getAccounts} from "@/utils/web3/account";
import { setupNetwork } from '@/utils/web3/web3'
import { setCurationIsFeed } from '@/api/api'

export default {
  components: {RewardCuration, RewardPost, ChainTokenIcon},
  data() {
    return {
      tabIndex: 0,
      chainTab: 0,
      loading: [false, false, false],
      claiming: false,
      connecting: false,
      prices: []
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo']),
    ...mapState('web3', ['chainId', 'account']),
    ...mapState('curation', ['rewardLists']),
    chainNames() {
      return Object.keys(EVM_CHAINS)
    },
    chainIds() {
      return Object.values(EVM_CHAINS).map(c => c.id)
    },
    showingList() {
      return this.rewardLists[this.chainTab]
    },
    summaryList() {
      if (this.rewardLists[this.chainTab].length > 0) {
        let result = {}
        for (let reward of this.rewardLists[this.chainTab]) {
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
      this.getRecords()
    },
    onRefresh() {
      this.getRecords(true);
    },
    async getRecords(force = false) {
      const index = this.chainTab;
      try{
        const currentList = this.rewardLists[index];
        if (currentList.length > 0 && !force) {
          return;
        }
        this.loading[index] = true
        const records = await getCurationRewardList(this.getAccountInfo.twitterId, this.chainIds[index]);
        if (records && records.length > 0) {
          const claimed = await checkCurationRewards(this.chainNames[index], this.getAccountInfo.twitterId, records.map(r => r.curationId));
          let result = [];
          for (let i = 0; i < claimed.length; i++) {
            if (!claimed[i]) {
              result.push(records[i])
              getCurationDetail(this.chainNames[index], records[i].curationId)
            }
          }
          this.rewardLists[index] = result
          this.$store.commit('curation/saveRewardLists', this.rewardLists)
          getPriceFromOracle(this.chainNames[index], result).then(res => {
              this.prices[index] = res;
            })
        }else {
          this.rewardLists[index] = [];
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
    async claimReward() {
      try{
        const index = this.chainTab
        const chainName = this.chainNames[index]
        this.claiming = true
        const ids = this.showingList.map(r => r.curationId);
        const { chainId, amounts, curationIds, ethAddress, sig, twitterId } = await getClaimParas(chainName, this.getAccountInfo.twitterId, ids)
        const hash = await claimRewards(chainName, twitterId, ethAddress, curationIds, amounts, sig);
        await setCurationIsFeed(twitterId, ids);
        this.rewardLists[index] = [];
        this.$store.commit('curation/saveRewardLists', this.rewardLists);
        this.getRecords();
      } catch(e) {
        if (e === 'log out') {
          this.$store.commit('saveShowLogin', true)
          this.$route.push('/')
          return;
        }
        console.log('Claim failed:', e);
        notify({message: this.$t('err.transErr'), type: 'error'})
      } finally {
        this.claiming = false
      }
    },
    async connect() {
      try {
        const connected = await setupNetwork(this.chainNames[this.chainTab])
        if (connected) {

        }else {

        }
      } catch (e) {
        console.log('connect wallet fail:', e);
      }
    }
  },
  mounted () {
    this.getRecords(true);
    accountChanged().catch()
    getAccounts(true).then(wallet => {
      this.account = wallet
    }).catch();
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
.tab:nth-child(1) {
  z-index: 9;
}
.tab:nth-child(2) {
  z-index: 8;
}
.tab:nth-child(3) {
  z-index: 7;
}
.tab.active {
  z-index: 99;
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
