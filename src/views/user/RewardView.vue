<template>
  <van-pull-refresh v-model="loading[chainTab]" @refresh="onRefresh"
                    class=""
                    loading-text="Loading"
                    pulling-text="Pull to refresh data"
                    loosing-text="Release to refresh">
    <div class="h-full overflow-auto">
      <div class="sm:max-w-600px lg:max-w-35rem mx-auto px-15px">
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
        <div class="bg-blockBg light:bg-colorF7F9/50 light:shadow-md p-15px rounded-12px mt-15px
                    2md:flex  2md:gap-15px">
          <div class="bg-color62/10 reward-box rounded-12px overflow-hidden p-15px
                      2md:flex-1">
            <div v-if="summaryList.length > 0"
                 class="text-left flex flex-col font-bold text-12px 2xl:text-14px">
              <el-checkbox-group class="c-checkbox-group"
                                 v-model="checkRewardList" @change="checkboxGroupChange">
                <el-checkbox class="hover:bg-white/10 py-8px 2md:py-15px"
                             v-for="reward of summaryList" :key="reward.token"
                             :label="reward.token">
                  <ChainTokenIcon height="30px" width="30px"
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
                       h-44px px-15px rounded-full"
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
          <div class="mt-15px 2md:mt-0 2md:flex-1 overflow-hidden flex flex-col"
               :style="width>960?{maxHeight: `${summaryList.length*63+88}px`, minHeight: `${showingList.length>3?220:0}px`}:{}">
            <div class="flex justify-between items-center mb-8px">
              <span class="font-bold text-left text-16px">{{$t('walletView.record')}}</span>
              <button class="flex items-center text-14px">
                <span class="light:opacity-40">{{$t('walletView.historyRecord')}}</span>
                <i class="icon-back w-12px h-12px transform -rotate-180 light:opacity-40"></i>
              </button>
            </div>
            <div v-if="showingList.length > 0"
                 class="bg-blockBg light:bg-white rounded-12px basis-full md:basis-auto relative ml-15px mr-15px sm:m-0
                        flex-1 overflow-auto no-scroll-bar">
              <RewardCuration :rewards="showingList"
                              :chain-name="chainTab >= chainNames.length ? 'BNB Smart Chain' : chainNames[chainTab]"/>
            </div>
            <div v-else-if="loading[chainTab]" class="c-text-black text-1.8rem mb-3rem min-h-1rem">
              <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
            </div>
            <div v-else class="px-1.5rem rounded-12px min-h-160px flex justify-center items-center">
              <div class="c-text-black text-color7D text-14px mb-2rem">{{$t('walletView.claimedAllRewards')}}</div>
            </div>
          </div>
        </div>
        <div class="mt-30px ">
          <div class="text-24px c-text-black active-tab w-max">{{$t('walletView.communityReward')}}</div>
          <CommunityRewardItem v-for="i of 3" :key="i"
                               :chain-name="chainTab >= chainNames.length ? 'BNB Smart Chain' : chainNames[chainTab]"
                               :rewards="showingList"></CommunityRewardItem>
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
import {useWindowSize} from "@vant/use";
import CommunityRewardItem from "@/components/community/CommunityRewardItem";

export default {
  components: {RewardCuration, RewardPost, ChainTokenIcon, CommunityRewardItem},
  setup() {
    const {width} = useWindowSize()
    return {
      width
    }
  },
  data() {
    return {
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
.active-tab {
  position: relative;
  z-index: 1;
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    height: 6px;
    width: 100%;
    background: linear-gradient(270deg, #000000 0%, #9B7CF6 42%, #6246EA 100%);
    border-radius: 3px;
    z-index: -1;
  }
}
.light .active-tab::before {
  background: linear-gradient(270deg, #FFFFFF 0%, #9B7CF6 42%, #6246EA 100%);
}
</style>
