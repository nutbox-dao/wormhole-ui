<template>
  <van-pull-refresh v-model="loading[chainTab]" @refresh="onRefresh"
                    class=""
                    :loading-text="$t('common.loading')"
                    pulling-text="Pull to refresh data"
                    loosing-text="Release to refresh">
    <div class="h-full overflow-auto">


      <div class="sm:max-w-600px lg:max-w-35rem mx-auto px-15px">
        <div class="mt-30px">
          <div class="text-16px c-text-black active-tab w-max">{{$t('walletView.communityReward')}}</div>
          <div v-if="(!getRewardCommunityInfo || getRewardCommunityInfo.length === 0)" class="py-2rem">
            <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
            <div class="text-color8B light:text-color7D text-12px mt-15px">{{$t('common.none')}}</div>
          </div>
          <CommunityRewardItem v-else v-for="communityId of getRewardCommunityInfo" :key="communityId"
                               :community-id="communityId"></CommunityRewardItem>
        </div>

        <div class="text-16px c-text-black active-tab w-max mt-30px">{{$t('walletView.promotionReward')}}</div>
        <div class="flex gap-25px tabs overflow-x-auto no-scroll-bar pt-20px">
          <button class="tab h-30px whitespace-nowrap "
                  :class="chainTab===index?'active-tab c-text-black text-16px':'text-color7D text-14px'"
                  @click="selectTab(index)"
                  v-for="(name, index) of chainNames" :key="name">
            {{ name }}
          </button>
        </div>
      </div>
      <div class="md:pb-4rem sm:max-w-600px lg:max-w-35rem mx-auto flex flex-col px-15px pb-20px">
        <div class="bg-blockBg light:bg-colorF7F2/50 light:shadow-md p-15px rounded-12px mt-15px">
          <div class="bg-color62/10 light:bg-colorEF reward-box rounded-12px overflow-hidden p-15px
                      2md:flex-1">
            <div v-if="summaryList.length > 0"
                 class="text-left flex flex-col font-bold text-12px 2xl:text-14px">
              <el-collapse v-model="collapseNames" class="c-collapse" accordion>
                <el-collapse-item v-for="reward of summaryList" :key="reward.token" :name="reward.token">
                  <template #title>
                    <div class="flex items-center">
                      <button class="w-16px h-16px min-w-16px min-h-16px rounded-full
                                     border-1 border-color62 bg-primaryBg light:bg-white mr-15px"
                              @click.stop="checkboxGroupChange(reward.token)">
                        <img v-if="checkRewardList.indexOf(reward.token)>=0" class="w-full h-full"
                             src="~@/assets/icon-selected-primary.svg" alt="">
                      </button>
                      <ChainTokenIcon height="30px" width="30px"
                                      :token="{symbol: reward.tokenSymbol, address: reward.token}"
                                      :chainName="chainTab >= chainNames.length ? 'BNB Smart Chain' : chainNames[chainTab]">
                        <template #amount>
                          <div class="text-white light:text-color1A flex flex-col whitespace-nowrap px-8px">
                            <span class="text-14px c-text-black ">
                              {{ formatAmount(reward.amount) + ' ' + reward.tokenSymbol }}
                            </span>
                            <span class="text-12px mt-6px">
                              $({{formatAmount(reward.amount * (this.prices[chainTab] ? this.prices[chainTab][reward.token] : 0))}})
                            </span>
                          </div>
                        </template>
                      </ChainTokenIcon>
                    </div>
                  </template>
                  <div class="py-8px px-10px bg-primaryBg light:bg-colorFB rounded-8px">
                    <div v-if="showingList.length > 0"
                         class="">
                      <RewardCuration :rewards="showingList.filter(r => r.token === reward.token)"
                                      :token="reward.token"
                                      :chain-name="chainNames[chainTab]"
                                      @fold="collapseNames = []"/>
                    </div>
                    <div v-else-if="loading[chainTab]" class="py-15px">
                      <img class="w-5rem mx-auto" src="~@/assets/profile-loading.gif" alt="" />
                    </div>
                    <div v-else class="py-15px text-center text-color7D text-14px">
                      {{$t('walletView.claimedAllRewards')}}
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
              <button v-if="(chainId !== chainIds[chainTab])"
                      class="ny-gradient-btn gradient-btn-disabled-grey
                              flex items-center justify-center min-w-10rem px-20px
                              rounded-full h-40px text-white font-bold text-14px" @click="connect">
                {{ $t('common.connectMetamask') }}
                <c-spinner v-show="connecting" class="w-16px h-16px ml-8px"></c-spinner>
              </button>
              <button v-else class="flex items-center justify-center bg-ny-btn-gradient
                       h-40px px-15px rounded-full text-white text-14px"
                      :disabled="claiming || accountMismatch"
                      @click="claimReward">
                {{ $t('curation.claimReward') }}
                <c-spinner v-show="claiming" class="w-16px h-16px ml-8px"></c-spinner>
              </button>
              <div v-if="accountMismatch" class="text-redColor mt-6px text-center">
                {{ $t('walletView.accountMismatch', {account: formatAddress(getAccountInfo.ethAddress) + `(@${getAccountInfo.twitterUsername})`}) }}
              </div>
            </div>
            <div v-else-if="loading[chainTab]" class="c-text-black text-1.8rem min-h-1rem">
              <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
            </div>
            <div v-else class="px-1.5rem rounded-12px min-h-160px flex justify-center items-center">
              <div class="c-text-black text-16px">{{$t('walletView.claimedAllRewards')}}</div>
            </div>
          </div>
          <div class="text-center mt-10px">
            <button class="text-color8B flex items-center justify-center mx-auto text-14px"
                    @click="historyModalVisible=true">
              <span>{{$t('walletView.historyRecord')}}</span>
              <img class="w-12px transform -rotate-90 ml-10px"
                   src="~@/assets/icon-select-arrow.svg" alt="">
            </button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="historyModalVisible"
               class="c-dialog c-dialog-lg c-dialog-center c-dialog-no-bg c-dialog-no-shadow">
      <RewardHistoryList
        :chain-id="chainIds[chainTab]"
        :type="'promotion'"
          class="max-h-70vh overflow-hidden bg-blockBg light:bg-white p-15px rounded-12px"></RewardHistoryList>
    </el-dialog>
  </van-pull-refresh>
</template>
<!-- this is for promotion reward -->
<script>
import { mapGetters, mapState } from 'vuex'
import {ethers} from "ethers";
import {notify} from "@/utils/notify";
import {formatAddress} from "@/utils/tool";
import RewardCuration from "@/views/user/RewardCuration";
import RewardPost from "@/views/user/RewardPost";
import { getCurationRewardList } from "@/utils/account"
import { getPriceFromOracle } from '@/utils/asset'
import { EVM_CHAINS, EVM_CHAINS_ID } from '@/config';
import { checkCurationRewards, checkCommunityRewards, getClaimParas, claimRewards } from '@/utils/curation'
import ChainTokenIcon from '@/components/ChainTokenIcon'
import { formatAmount } from '@/utils/helper'
import {accountChanged, getAccounts} from "@/utils/web3/account";
import { setupNetwork } from '@/utils/web3/web3'
import { setCurationIsFeed,
  getCommunityPendingRewards, getCommunityAuthorPendingRewards, setCommunityRewardClaimed,
  setCommunityAuthorRewardClaimed } from '@/api/api'
import {TokenIcon} from "@/config";
import {useWindowSize} from "@vant/use";
import CommunityRewardItem from "@/components/community/CommunityRewardItem";
import RewardHistoryList from "@/components/RewardHistoryList";

export default {
  components: {RewardCuration, RewardPost, ChainTokenIcon, CommunityRewardItem, RewardHistoryList},
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
      TokenIcon,
      historyModalVisible: false,
      loadingCommunityRewards: false,
      collapseNames: []
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo']),
    ...mapGetters('curation', ['getRewardCommunityInfo', 'getCommunityRewards', 'getCommunityAuthorRewards']),
    ...mapState('web3', ['chainId', 'account']),
    ...mapState('curation', ['rewardLists', 'communityRewards', 'communityAuthorRewards']),
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
      this.checkRewardList = []
      this.getRecords()
    },
    onRefresh() {
      this.getRecords(true);
      this.getCommunityRewardsM(true);
    },
    async getRecords(force = false) {
      const index = this.chainTab;
      try{
        const currentList = this.rewardLists[index];
        if (currentList && currentList.length > 0 && !force) {
          return;
        }
        this.loading[index] = true

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
    async getCommunityRewardsM(force = false) {
      try{
        if (this.loadingCommunityRewards) return;
        this.loadingCommunityRewards = true;
        const currentList = this.communityRewards;
        if (currentList && currentList.length > 0 && !force) {
          return;
        }
        let [rewards, authorRewards] =
          await Promise.all([
            getCommunityPendingRewards(this.getAccountInfo.twitterId),
            getCommunityAuthorPendingRewards(this.getAccountInfo.twitterId)])

          // check claimed
        let allRewards = rewards.concat(authorRewards);
        if (allRewards.length === 0) return;
        let allRewardsByChain = {};
        for (let r of allRewards) {
          if (!allRewardsByChain[r.chainId]){
            allRewardsByChain[r.chainId] = []
          }
          allRewardsByChain[r.chainId].push(r)
        }
        let results = await Promise.all(Object.keys(allRewardsByChain).map(chainId =>
                        checkCommunityRewards(EVM_CHAINS_ID[chainId],
                        this.getAccountInfo?.twitterId,
                        allRewardsByChain[chainId])))
        results = results.reduce((r, t) => ({...r, ...t}), {})
        let allReadyClaimedReward = {};
        Object.keys(results).filter(key => results[key]).forEach(key => {
          allReadyClaimedReward[key] = results[key]
        })
        const claimedIds = Object.keys(allReadyClaimedReward)
        // set Claimed
        if (claimedIds.length > 0) {
          let claimedCuration = rewards.filter(r => claimedIds.find(c => c === r.curationId));
          let claimedAuthorCuration = authorRewards.filter(r => claimedIds.find(c => c === r.curationId));
          await Promise.all([setCommunityRewardClaimed(this.getAccountInfo?.twitterId, claimedCuration.map(r => r.curationId)),
          setCommunityAuthorRewardClaimed(this.getAccountInfo?.twitterId, claimedAuthorCuration.map(r => r.curationId))]).catch(e => {
            console.log('set curation distribute fail', e)
          })
          rewards = rewards.filter(r => claimedIds.find(c => c !== r.curationId));
          authorRewards = authorRewards.filter(r => claimedIds.find(c => c !== r.curationId));
        }
        if (rewards && rewards.length > 0) {
          this.$store.commit('curation/saveCommunityRewards', rewards)
        }
        if (authorRewards && authorRewards.length > 0) {
          this.$store.commit('curation/saveCommunityAuthorRewards', authorRewards)
        }
      } catch (e) {
        if (e === 'log out') {
          this.$store.commit('saveShowLogin', true)
        }
        console.log('error', e);
      } finally {
        this.loadingCommunityRewards = false
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
    checkboxGroupChange(token) {
      const index = this.checkRewardList.indexOf(token)
      if(index>=0) {
        this.checkRewardList.splice(index, 1)
      } else {
        this.checkRewardList.push(token)
      }
    }
  },
  mounted () {
    if (this.twitterId && !this.getAccountInfo) {
      this.needLogin = true
    }
    this.getRecords(true);
    this.getCommunityRewardsM(true);
    accountChanged().catch()
    getAccounts(true).then(wallet => {
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
