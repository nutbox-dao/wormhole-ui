<template>
  <van-pull-refresh v-model="isRefresh" @refresh="onRefresh"
                    class="h-full"
                    :loading-text="$t('common.loading')"
                    pulling-text="Pull to refresh data"
                    loosing-text="Release to refresh">
    <div class="h-full overflow-auto">
      <div class="sm:max-w-600px lg:max-w-35rem mx-auto px-15px">
        <div class="mt-30px">
          <div class="text-16px c-text-black active-tab w-max">{{$t('walletView.communityReward')}}</div>
          <img v-if="loadingCommunityRewards && getRewardCommunityInfo.length===0"
               class="w-5rem mx-auto" src="~@/assets/profile-loading.gif" alt="" />
          <div v-else-if="(!getRewardCommunityInfo || getRewardCommunityInfo.length === 0)" class="py-2rem">
            <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
            <div class="text-color8B light:text-color7D text-12px mt-15px">{{$t('common.none')}}</div>
          </div>
          <CommunityRewardItem v-else v-for="communityId of getRewardCommunityInfo" :key="communityId"
                               :community-id="communityId"></CommunityRewardItem>
        </div>
      </div>
    </div>
  </van-pull-refresh>
</template>
<!-- this is for promotion reward -->
<script>
import { mapGetters, mapState } from 'vuex'
import {ethers} from "ethers";
import {notify} from "@/utils/notify";
import {formatAddress} from "@/utils/tool";
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
  components: { ChainTokenIcon, CommunityRewardItem, RewardHistoryList},
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
      collapseNames: [],
      isRefresh: false
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
      // this.getRecords()
    },
    onRefresh() {
      this.isRefresh = true
      // this.getRecords(true);
      this.getCommunityRewardsM(true);
      this.isRefresh = false
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
    // this.getRecords(true);
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
