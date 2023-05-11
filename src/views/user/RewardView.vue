<template>
  <van-pull-refresh v-model="loading[chainTab]" @refresh="onRefresh"
                    class=""
                    loading-text="Loading"
                    pulling-text="Pull to refresh data"
                    loosing-text="Release to refresh">
    <div class="h-full overflow-auto">
      <div class="md:pb-4rem sm:max-w-600px lg:max-w-35rem mx-auto px-15px">
        <div class="flex gap-25px tabs overflow-x-auto no-scroll-bar pt-20px">
          <button class="tab h-30px whitespace-nowrap "
                  :class="chainTab===index?'active-tab c-text-black text-24px':'text-color7D'"
                  @click="selectTab(index)"
                  v-for="(name, index) of chainNames" :key="name">
            {{ name }}
          </button>
        </div>
      </div>
      <div class="md:pb-4rem sm:max-w-600px lg:max-w-35rem mx-auto flex flex-col px-15px pb-20px">
        <div class="bg-blockBg light:bg-colorF7F9/50 p-15px rounded-12px mt-15px">
          <div class="bg-color62/10 reward-box rounded-12px overflow-hidden px-17px pt-12px pb-20px">
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
              <button v-if="(chainId !== chainIds[chainTab])"
                      class="ny-gradient-btn gradient-btn-disabled-grey
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
                {{ $t('walletView.accountMismatch') }}
              </div>
            </div>
            <div v-else-if="loading[chainTab]" class="c-text-black text-1.8rem min-h-1rem">
              <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
            </div>
            <div v-else class="px-1.5rem rounded-12px min-h-160px flex justify-center items-center">
              <div class="c-text-black text-16px">{{$t('walletView.claimedAllRewards')}}</div>
            </div>
          </div>
          <div class="mt-15px">
            <div class="flex justify-between items-center mb-8px">
              <span class="font-bold text-left text-16px">{{$t('walletView.record')}}</span>
              <button class="flex items-center text-14px">
                <span class="text-blueDark opacity-40">{{$t('walletView.historyRecord')}}</span>
                <img class="transform -rotate-90 opacity-20"
                     src="~@/assets/icon-arrow-black.svg" alt="">
              </button>
            </div>
            <div v-for="i of 3" :key="i" class="flex justify-between items-center py-8px">
              <div class="flex items-center">
                <img class="w-32px h-32px rounded-full mr-10px" :src="TokenIcon['MATIC']" alt="">
                <span class="text-16px font-bold text-color66">0.001</span>
              </div>
              <div class="flex items-center text-12px">
                <span class="text-blueDark opacity-40 mr-10px">05/11 00:00</span>
                <img class="transform -rotate-90 opacity-20"
                     src="~@/assets/icon-arrow-black.svg" alt="">
              </div>
            </div>
          </div>
        </div>
        <div class="mt-30px ">
          <div class="text-24px c-text-black active-tab w-max">{{$t('walletView.communityReward')}}</div>
          <div class="bg-blockBg light:bg-colorF7F9/50 p-15px rounded-12px mt-15px">
            <div class="flex items-center">
              <img class="bg-color62 rounded-12px w-34px h-34px"
                   src="~@/assets/icon-default-avatar.svg" alt="">
              <span class="ml-10px c-text-black">SpaceX</span>
            </div>
            <div class="flex overflow-hidden rounded-full border-1 border-color62 mt-20px">
              <button class="tab h-32px text-12px sm:text-14px flex-1"
                      :class="tabIndex===0?'bg-color62 text-white':'bg-colorF1 text-color62'"
                      @click="tabIndex=0">
                {{ $t('common.curation') }}
              </button>
              <button class="tab h-32px text-12px sm:text-14px flex-1"
                      :class="tabIndex===1?'bg-color62 text-white':'bg-colorF1 text-color62'"
                      @click="tabIndex=1">
                {{ $t('common.author') }}
              </button>
            </div>
            <div class="bg-color62/10 reward-box rounded-12px overflow-hidden p-15px mt-15px
                        flex justify-between items-center">
              <div class="flex items-center">
                <img class="w-40px h-40px rounded-full mr-10px" :src="TokenIcon['MATIC']" alt="">
                <div class="flex flex-col items-start">
                  <span class="font-bold mb-4px">MATIC</span>
                  <span class="text-14px text-color7D">0.001</span>
                </div>
              </div>
              <button class="gradient-btn gradient-bg-color3 rounded-full px-25px h-34px">
                {{$t('walletView.withdraw')}}
              </button>
            </div>
            <div class="mt-15px">
              <div class="flex justify-between items-center mb-8px">
                <span class="font-bold text-left text-16px">{{$t('walletView.record')}}</span>
                <button class="flex items-center text-14px">
                  <span class="text-blueDark opacity-40">{{$t('walletView.historyRecord')}}</span>
                  <img class="transform -rotate-90 opacity-20"
                       src="~@/assets/icon-arrow-black.svg" alt="">
                </button>
              </div>
              <div v-for="i of 3" :key="i" class="flex justify-between items-center py-8px">
                <div class="flex items-center">
                  <img class="w-32px h-32px rounded-full mr-10px" :src="TokenIcon['MATIC']" alt="">
                  <span class="text-16px font-bold text-color66">0.001</span>
                </div>
                <div class="flex items-center text-12px">
                  <span class="text-blueDark opacity-40 mr-10px">05/11 00:00</span>
                  <img class="transform -rotate-90 opacity-20"
                       src="~@/assets/icon-arrow-black.svg" alt="">
                </div>
              </div>
<!--              <div v-if="showingList.length > 0" class="bg-blockBg light:bg-white rounded-12px basis-full md:basis-auto relative ml-15px mr-15px sm:m-0">-->
<!--                <RewardCuration :rewards="showingList.slice(0,3)" :chain-name="chainTab >= chainNames.length ? 'BNB Smart Chain' : chainNames[chainTab]"/>-->
<!--                &lt;!&ndash; <RewardPost v-show="tabIndex===1"/> &ndash;&gt;-->
<!--              </div>-->
<!--              <div v-else-if="loading[chainTab]" class="c-text-black text-1.8rem mb-3rem min-h-1rem">-->
<!--                <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />-->
<!--              </div>-->
<!--              <div v-else class="px-1.5rem rounded-12px min-h-160px flex justify-center items-center">-->
<!--                <div class="c-text-black mb-2rem text-16px">{{$t('walletView.claimedAllRewards')}}</div>-->
<!--              </div>-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </van-pull-refresh>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import {ethers} from "ethers";
import {notify} from "@/utils/notify";
import {formatAddress} from "@/utils/tool";
import RewardCuration from "@/views/user/RewardCuration";
import RewardPost from "@/views/user/RewardPost";
import { getCurationRewardList, autoCurationRewardList, autoCurationAuthorRewardList } from "@/utils/account"
import { getPriceFromOracle } from '@/utils/asset'
import { EVM_CHAINS } from '@/config';
import { checkCurationRewards, checkAutoCurationRewards, getClaimParas, claimRewards, getPromotionCurationClaimParas,
   getChainIdOfCurationContract, getSingerOfCuration, claimPromotionCurationRewards, getAuthorRewardClaimParas,
   getCurationDetail } from '@/utils/curation'
import ChainTokenIcon from '@/components/ChainTokenIcon'
import { formatAmount } from '@/utils/helper'
import {accountChanged, getAccounts} from "@/utils/web3/account";
import { setupNetwork } from '@/utils/web3/web3'
import { setCurationIsFeed, setAutoCurationIsDistributed, setAutoCurationAuthorRewardIsDistributed } from '@/api/api'
import {TokenIcon} from "@/config";

export default {
  components: {RewardCuration, RewardPost, ChainTokenIcon},
  data() {
    return {
      tabIndex: 0,
      chainTab: 0,
      loading: [false, false, false, false, false, false],
      claiming: false,
      connecting: false,
      prices: [],
      checkRewardList: [],
      TokenIcon
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
      return Object.values(EVM_CHAINS).map(c => c.id).concat([56, 56])
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
      this.checkRewardList = []
      this.getRecords()
    },
    onRefresh() {
      this.getRecords(true);
    },
    async getRecords(force = false) {
      const index = this.chainTab;
      try{
        const currentList = this.rewardLists[index];
        if (currentList && currentList.length > 0 && !force) {
          return;
        }
        this.loading[index] = true
        if (index === this.chainNames.length) {
          const records = await autoCurationRewardList(this.getAccountInfo.twitterId);
          if (records && records.length > 0) {
            const claimed = await checkAutoCurationRewards(this.getAccountInfo.twitterId, records.map(r => r.curationId));

            let result = [];
            let claimedIds = [];
            for (let i = 0; i < claimed.length; i++) {
              if (!claimed[i]) {
                result.push(records[i]);
              }else {
                claimedIds.push(records[i].curationId)
              }
            }
            if (claimedIds.length > 0) {
              setAutoCurationIsDistributed(this.getAccountInfo.twitterId, claimedIds).then().catch(e => {
                console.error('set auto curation feed fail:', e)
              });
            }
            this.rewardLists[index] = result;
            this.$store.commit('curation/saveRewardLists', this.rewardLists)
            getPriceFromOracle('BNB Smart Chain', result).then(res => {
              this.prices[index] = res;
            })
          }else {
            this.rewardLists[index] = [];
            this.$store.commit('curation/saveRewardLists', this.rewardLists)
          }
        }else if (index === this.chainNames.length + 1) {
          const records = await autoCurationAuthorRewardList(this.getAccountInfo.twitterId);

          if (records && records.length > 0) {
            const claimed = await checkAutoCurationRewards(this.getAccountInfo.twitterId, records.map(r => r.curationId));

            let result = [];
            let claimdIds = [];
            for(let i = 0; i < claimed.length; i++) {
              if (!claimed[i]) {
                result.push(records[i])
              }else {
                claimdIds.push(records[i].curationId)
              }
            }
            if (claimdIds.length > 0) {
              setAutoCurationAuthorRewardIsDistributed(this.getAccountInfo.twitterId, claimdIds).then().catch(e => {
                console.error('set auto curation author reward feed fail:', e)
              })
            }
            this.rewardLists[index] = result;
            this.$store.commit('curation/saveRewardLists', this.rewardLists)
            getPriceFromOracle('BNB Smart Chain', result).then(res => {
              this.prices[index] = res;
            })
          }else{
            this.rewardLists[index] = [];
            this.$store.commit('curation/saveRewardLists', this.rewardLists)
          }
        }else {
          const records = await getCurationRewardList(this.getAccountInfo.twitterId, this.chainIds[index]);
          if (records && records.length > 0) {
            const claimed = await checkCurationRewards(this.chainNames[index], this.getAccountInfo.twitterId, records.map(r => r.curationId));
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
              setCurationIsFeed(this.getAccountInfo.twitterId, claimedIds).then().catch(e => {
                console.error('set auto curation feed fail:', e)
              });
            }
            this.rewardLists[index] = result
            this.$store.commit('curation/saveRewardLists', this.rewardLists)
            getPriceFromOracle(this.chainNames[index], result).then(res => {
              this.prices[index] = res;
            })

          }else {
            this.rewardLists[index] = [];
            this.$store.commit('curation/saveRewardLists', this.rewardLists)
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
    async claimReward() {
      try{
        const index = this.chainTab
        if (index === this.chainNames.length) {
          this.claiming = true
          const chainName = 'BNB Smart Chain'
          const selectTokens = Object.values(this.checkRewardList);
          if (selectTokens.length === 0) {
            return;
          }
          const ids = this.showingList.filter(r => selectTokens.indexOf(r.token) !== -1).map(r => r.curationId);
          if (ids.length === 0) return;
          const { amount, curationIds, ethAddress, sig, twitterId } = await getPromotionCurationClaimParas(chainName, this.getAccountInfo.twitterId, ids);
          const hash = await claimPromotionCurationRewards(chainName, twitterId, ethAddress, curationIds, amount, sig);
          await setAutoCurationIsDistributed(twitterId, ids);
          this.rewardLists[index] = []
          this.$store.commit('curation/saveRewardLists', this.rewardLists);
          this.getRecords();
        }else if (index === this.chainNames.length + 1) {
          this.claiming = true;
          const chainName = 'BNB Smart Chain';
          const selectTokens = Object.values(this.checkRewardList);
          if (selectTokens.length === 0) {
            return;
          }
          const ids = this.showingList.filter(r => selectTokens.indexOf(r.token) !== -1).map(r => r.curationId);
          if (ids.length === 0) return;
          const { amount, curationIds, ethAddress, sig, twitterId } = await getAuthorRewardClaimParas(chainName, this.getAccountInfo.twitterId, ids);
          const hash = await claimPromotionCurationRewards(chainName, twitterId, ethAddress, curationIds, amount, sig);
          await setAutoCurationAuthorRewardIsDistributed(twitterId, ids);
          this.rewardLists[index] = [];
          this.$store.commit('curation/saveRewardLists', this.rewardLists);
          this.getRecords();
        }else {
          const chainName = this.chainNames[index]
          const selectTokens = Object.values(this.checkRewardList);
          if (selectTokens.length === 0) {
            return;
          }
          this.claiming = true
          const ids = this.showingList.filter(r => selectTokens.indexOf(r.token) !== -1).map(r => r.curationId);
          const { chainId, amounts, curationIds, ethAddress, sig, twitterId } = await getClaimParas(chainName, this.getAccountInfo.twitterId, ids)
          const hash = await claimRewards(chainName, twitterId, ethAddress, curationIds, amounts, sig);
          await setCurationIsFeed(twitterId, ids);
          this.rewardLists[index] = [];
          this.$store.commit('curation/saveRewardLists', this.rewardLists);
          this.getRecords();
        }
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
        this.connecting = true
        const chainName = this.chainTab >= this.chainNames.length ? 'BNB Smart Chain' : this.chainNames[this.chainTab]
        const connected = await setupNetwork(chainName)
        if (connected) {

        }else {

        }
      } catch (e) {
        console.log('connect wallet fail:', e);
      } finally{
        this.connecting = false
      }
    },
    checkboxGroupChange() {
      console.log(Object.values(this.checkRewardList))
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
.tab {

}
.active-tab {
  position: relative;
  z-index: 1;
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    height: 6px;
    width: 100%;
    background: linear-gradient(270deg, #FFFFFF 0%, #9B7CF6 42%, #6246EA 100%);
    border-radius: 3px;
    z-index: -1;
  }
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
