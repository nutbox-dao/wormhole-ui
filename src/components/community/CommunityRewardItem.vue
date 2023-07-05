<template>
  <div class="bg-blockBg light:bg-colorF7F2/50 light:shadow-md p-15px rounded-12px mt-15px
              2md:flex 2md:gap-15px text-14px">
    <div class="flex-1 flex flex-col justify-between">
      <div class="flex items-center">
        <img class="bg-color62 rounded-full w-34px h-34px"
             :src="community.communityIcon" alt="">
        <span class="ml-10px c-text-black">{{ community.communityName }}</span>
      </div>
      <div class="flex overflow-hidden rounded-full border-1 border-color62 mt-20px">
        <button class="tab h-32px text-12px sm:text-14px flex-1"
                :class="tabIndex===0?'bg-color62 text-white':'bg-colorF1 text-color62'"
                :disabled="claiming"
                @click="tabIndex=0">
          {{ $t('common.curation') }}
        </button>
        <button class="tab h-32px text-12px sm:text-14px flex-1"
                :class="tabIndex===1?'bg-color62 text-white':'bg-colorF1 text-color62'"
                :disabled="claiming"
                @click="tabIndex=1">
          {{ $t('common.author') }}
        </button>
      </div>
      <div class="bg-color62/10 reward-box rounded-12px overflow-hidden p-15px mt-15px
                  flex flex-col justify-between items-center text-12px 2xl:text-14px font-bold">
        <div class="w-full flex items-center">
          <img class="w-40px h-40px rounded-full mr-10px" :src="TokenIcon[community.tokenSymbol]" alt="">
          <div class="flex flex-col items-start">
            <span class="font-bold mb-4px text-14px">{{ community.tokenSymbol }}</span>
            <span class="text-12px text-color7D">{{ formatAmount(totalReward) }}({{ formatPrice(totalReward * price) }})</span>
          </div>
        </div>
        <button v-if="(chainId !== community.chainId)"
                class="ny-gradient-btn gradient-btn-disabled-grey w-full
                        flex items-center justify-center min-w-10rem px-20px mt-5px text-14px
                        rounded-full h-40px text-white font-bold" @click="connect">
          {{ $t('common.connectMetamask') }}
          <c-spinner v-show="connecting" class="w-16px h-16px 2xl:w-1rem 2xl:h-1rem ml-0.5rem"></c-spinner>
        </button>
        <button v-else class="flex items-center justify-center bg-ny-btn-gradient mt-5px text-14px
                  h-40px px-20px rounded-full text-white w-full font-bold"
                :disabled="claiming || accountMismatch || list.length === 0"
                @click="claimReward">
          {{ $t('curation.claimReward') }}
          <c-spinner v-show="claiming" class="w-16px h-16px 2xl:w-1rem 2xl:h-1rem ml-0.5rem"></c-spinner>
        </button>
        <div v-if="accountMismatch" class="text-redColor mt-6px text-center">
          {{ $t('walletView.accountMismatch', {account: formatAddress(getAccountInfo.ethAddress) + `(@${getAccountInfo.twitterUsername})`}) }}
        </div>
      </div>
    </div>
    <div class="mt-15px 2md:mt-0 flex-1 flex flex-col overflow-hidden"
         :class="list.length>2?'2md:h-212px 2md:max-h-212px':''">
      <div class="flex justify-between items-center mb-8px">
        <span class="font-bold text-left text-16px">{{$t('walletView.record')}}</span>
        <button class="flex items-center text-14px" @click="historyModalVisible=true">
          <span class="light:opacity-40">{{$t('walletView.historyRecord')}}</span>
          <i class="icon-back w-12px h-12px transform -rotate-180 light:opacity-40"></i>
        </button>
      </div>
      <div v-if="list.length===0"
           class="px-1.5rem rounded-12px min-h-160px flex justify-center items-center">
        <div class="c-text-black text-color7D text-14px mb-2rem">{{$t('walletView.claimedAllRewards')}}</div>
      </div>
      <div v-else
           class="flex-1 no-scroll-bar 2md:overflow-auto reward-list"
           :class="isExpand?'expand':''">
        <div v-for="(item, index) of list" :key="index"
             class="border-b-1px border-listBgBorder py-15px flex justify-between items-center">
          <div class="flex-1 flex justify-between items-center">
            <ChainTokenIcon height="30px" width="30px"
                            :token="{symbol: item.tokenSymbol, address: item.token}"
                            :chainName="EVM_CHAINS_ID[community.chainId]">
              <template #amount>
                <span class="px-8px c-text-black whitespace-nowrap flex items-center text-14px 2xl:text-0.8rem">
                  {{ formatAmount(item.amount ? item.amount.toString() / ( 10 ** item.decimals) : 0) + ' ' + item.tokenSymbol }}
                </span>
              </template>
            </ChainTokenIcon>
            <span class="text-color8B text-12px font-500">
              {{ parseTimestamp(item.createAt) }}
            </span>
          </div>
          <button class="flex items-center"
                  @click="gotoDetail(item)">
            <img class="w-12px transform -rotate-90 ml-10px"
                 src="~@/assets/icon-select-arrow.svg" alt="">
          </button>
        </div>
      </div>
      <div class="2md:hidden pt-15px">
        <button class="text-color8B flex items-center justify-center mx-auto" @click="isExpand=!isExpand">
<!--          <span>{{$t('common.all')}}</span>-->
          <img class="w-12px transform spin-slow"
               :class="isExpand?'rotate-180':'rotate-0'"
               src="~@/assets/icon-select-arrow.svg" alt="">
        </button>
      </div>
    </div>
    <el-dialog v-model="historyModalVisible"
               class="c-dialog c-dialog-lg c-dialog-center c-dialog-no-bg c-dialog-no-shadow">
      <RewardHistoryList
        :community="community"
        :type="'curation'"
        :is-author="tabIndex === 1"
          class="max-h-70vh overflow-hidden bg-blockBg light:bg-white p-15px rounded-12px"></RewardHistoryList>
    </el-dialog>
  </div>
</template>

<script>
import {TokenIcon} from "@/config";
import ChainTokenIcon from "@/components/ChainTokenIcon";
import {useWindowSize} from "@vant/use";
import {parseTimestamp, formatAmount, formatPrice} from "@/utils/helper";
import { formatAddress } from '@/utils/tool'
import { mapGetters, mapState } from 'vuex'
import { EVM_CHAINS, EVM_CHAINS_ID } from "@/config";
import { getPriceFromOracle } from '@/utils/asset'
import RewardHistoryList from "@/components/RewardHistoryList";
import {accountChanged, getAccounts} from "@/utils/web3/account";
import { setupNetwork } from '@/utils/web3/web3'
import { notify } from "@/utils/notify";
import { getCommunityClaimRewardsParas, getCommunityClaimAuthorRewardsParas,
  setCommunityRewardClaimed, setCommunityAuthorRewardClaimed } from '@/utils/community'
import { claimCommunityRewards } from '@/utils/curation'

export default {
  name: "CommunityRewardItem",
  components: {ChainTokenIcon, RewardHistoryList},
  setup() {
    const {width} = useWindowSize()
    return {
      width
    }
  },
  props: {
    communityId: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      TokenIcon,
      tabIndex: 0,
      EVM_CHAINS_ID,
      EVM_CHAINS,
      price: {},
      isExpand: false,
      historyModalVisible: false,
      connecting: false,
      claiming: false
    }
  },
  computed: {
    ...mapGetters('curation', ['getRewardCommunityInfo', 'getCommunityRewards', 'getCommunityAuthorRewards']),
    ...mapState('web3', ['chainId', 'account']),
    ...mapGetters(['getAccountInfo']),
    ...mapState('curation', ['rewardLists', 'communityRewards', 'communityAuthorRewards']),
    community() {
      if (this.rewards && this.rewards.length > 0) {
        return this.rewards[0]
      }
      if (this.authorRewards && this.authorRewards.length > 0) {
        return this.authorRewards[0]
      }
      return {}
    },
    rewards() {
      if (this.communityId) {
        return this.getCommunityRewards(this.communityId) ?? [];
      }
      return []
    },
    authorRewards() {
      if (this.communityId) {
        return this.getCommunityAuthorRewards(this.communityId) ?? [];
      }
      return []
    },
    totalRewards() {
      if (this.rewards.length > 0) {
        return this.rewards.reduce((s, t) => s + t.amount / (10 ** t.decimals), 0)
      }
      return 0
    },
    totalAuthorReward() {
      if (this.authorRewards.length > 0) {
        return this.authorRewards.reduce((s, t) => s + t.amount / (10 ** t.decimals), 0)
      }
      return 0
    },
    totalReward() {
      if (this.tabIndex === 0) {
        return this.totalRewards;
      }else {
        return this.totalAuthorReward;
      }
    },
    list() {
      if (this.tabIndex === 0) {
        return (this.isExpand || this.width>=961) ? this.rewards : this.rewards.slice(0,3)
      }else {
        return (this.isExpand || this.width>=961) ? this.authorRewards : this.authorRewards.slice(0,3)
      }
    },
    accountMismatch() {
      return this.getAccountInfo?.ethAddress !== this.account
    }
  },
  methods: {
    formatAddress,
    parseTimestamp,
    formatAmount,
    formatPrice,
    gotoDetail(reward) {
      this.$router.push('/post-detail/' + reward.tweetId)
    },
    async connect() {
      try {
        this.connecting = true
        const chainName = EVM_CHAINS_ID[this.community.chainId]
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
    async claimReward() {
      if(this.claiming) return;
      try{
        this.claiming = true
        if(this.tabIndex === 0) { //curation
            const chainName = EVM_CHAINS_ID[this.community.chainId]
            this.claiming = true
            const ids = this.rewards.map(c => c.curationId)
            const { chainId, amount, curationIds, orderIds, ethAddress, sig, twitterId } = await getCommunityClaimRewardsParas(this.community.communityId, this.getAccountInfo.twitterId, ids)
            if (amount == '0') {
              notify({message: this.$t('community.noRewardCanClaim'), type: 'info'})
              const list = this.communityRewards.filter(r => r.communityId !== this.community.communityId);
              this.$store.commit('curation/saveCommunityRewards', list)
              return;
            }
            const transHash = await claimCommunityRewards(chainName, twitterId, ethAddress, this.community.communityId, orderIds, amount, sig);
            await setCommunityRewardClaimed(twitterId, ids, orderIds[0].hex.substring(14), transHash);
            const list = this.communityRewards.filter(r => r.communityId !== this.community.communityId);
            this.$store.commit('curation/saveCommunityRewards', list)
        }else { // author
          const chainName = EVM_CHAINS_ID[this.community.chainId]
            this.claiming = true
            const ids = this.authorRewards.map(c => c.curationId)
            const { chainId, amount, curationIds, orderIds, ethAddress, sig, twitterId } = await getCommunityClaimAuthorRewardsParas(this.community.communityId, this.getAccountInfo.twitterId, ids)
            if (amount == '0') {
              notify({message: this.$t('community.noRewardCanClaim'), type: 'info'})
              const list = this.communityAuthorRewards.filter(r => r.communityId !== this.community.communityId);
              this.$store.commit('curation/saveCommunityAuthorRewards', list)
              return;
            }
            const transHash = await claimCommunityRewards(chainName, twitterId, ethAddress, this.community.communityId, orderIds, amount, sig);
            await setCommunityAuthorRewardClaimed(twitterId, ids, orderIds[0].hex.substring(14), transHash);
            if (this.communityAuthorRewards) {
              const list = this.communityAuthorRewards.filter(r => r.communityId !== this.community.communityId);

              this.$store.commit('curation/saveCommunityAuthorRewards', list)
            }
        }
      } catch (e) {
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
    }
  },
  mounted() {
    getPriceFromOracle(EVM_CHAINS_ID[this.community.chainId], [
      this.community
    ]).then(res => {
      this.price = res[this.community.token];
    })
    accountChanged().catch()
      getAccounts(true).then(wallet => {
    }).catch();
  },
}
</script>

<style scoped lang="scss">
@media (max-width: 960px) {

  .reward-list {
    transition: max-height ease-in-out 0.5s;
    max-height: 183px;
    overflow: hidden;
    &.expand {
      max-height: 10000px;
    }
  }
}
</style>
