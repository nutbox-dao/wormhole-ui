<template>
  <div class="py-15px px-15px">
    <InfluenceCardItem v-if="community.joined" :community="communityCCscore"
                       class="cursor-pointer bg-primaryBg light:bg-color27"></InfluenceCardItem>

    <div class="py-10px">
    <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
         v-if="refreshing && (!members || members.length === 0)">
      <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
    </div>
    <div v-else-if="!refreshing && (!members || members.length === 0)" class="py-2rem">
      <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
      <div class="text-color8B light:text-color7D text-12px mt-15px">{{$t('common.none')}}</div>
    </div>
    <van-list v-else
              :loading="listLoading"
              :finished="listFinished"
              :immediate-check="false"
              :loading-text="$t('common.loading')"
              :finished-text="members.length!==0?$t('common.noMore'):''"
              @load="onLoad">
      <div class="flex justify-between items-center px-15px c-text-black text-14px py-10px gap-5px">
        <span class="w-40px text-12px text-left"></span>
        <span class="flex-1 text-left">{{$t('community.member')}}</span>
        <span class="flex-1 text-right">{{$t('community.curationCredit')}}</span>
        <!-- <span class="flex-1 text-right">{{$t('community.communityTokenBalance')}}</span> -->
      </div>
      <div class="flex justify-between items-center px-15px py-10px gap-5px"
           v-for="(item, index) of members" :key="index">
        <div class="w-40px text-12px text-left text-color8B font-bold">{{index+1}}</div>
        <div class="flex items-center flex-1 truncate">
          <div class="flex items-center">
            <Avatar :profile-img="item.profileImg || defaultAvatar"
                    :name="item.name"
                    :username="item.username"
                    :steem-id="item.steemId"
                    :eth-address="item.ethAddress"
                    :reputation="item.reputation"
                    @gotoUserPage="$router.push({path : '/account-info/@' + item.username})">
              <template #avatar-img>
                <img class="w-32px min-w-32px h-32px rounded-full mr-5px border-0.5px border-color62/20"
                     @click.stop="$router.push({path : '/account-info/@' + item.username})"
                     :src="item.profileImg || defaultAvatar" alt="">
              </template>
            </Avatar>
            <span class="truncate text-14px">{{item.username}}</span>
          </div>
        </div>
        <span class="flex-1 text-right text-12px">{{ item.ccPower }}</span>
        <!-- <span class="flex-1 text-right text-12px">{{ item.showingBalance }}</span> -->
      </div>
    </van-list>
  </div>
  </div>
</template>

<script>
import InfluenceCardItem from "@/components/influence/InfluenceCardItem.vue";
import { mapGetters, mapState } from "vuex";
import { getJoinCommunityState } from '@/utils/community'

import defaultAvatar from '@/assets/icon-default-avatar.svg'
import { getCommunityMembers } from '@/api/api'
import { sleep, formatAmount, formatPrice, parseTimestamp } from '@/utils/helper'
import { notify } from '@/utils/notify'
import { getTokenBalancesOfUsers } from '@/utils/asset'
import { EVM_CHAINS, EVM_CHAINS_ID } from '@/chain-config'
import Avatar from "@/components/Avatar.vue";

export default {
  name: "CommunityCredit",
  components: {InfluenceCardItem, Avatar},
  props: {
    community: {
      type: Object,
      default: ()=>{}
    }
  },
  data() {
    return {
      refreshing: false,
      defaultAvatar,
      refreshing: true,
      listLoading: false,
      listFinished: false,
      communityId: ''
    }
  },
  computed: {
    ...mapState('community', ['communityCC', 'members', 'showingCommunity']),
    ...mapGetters(['getAccountInfo']),
    communityCCscore() {
      if (this.communityCC) {
        const cc = this.communityCC.find(c => c.communityId == this.community.communityId)
        return {...this.community, ...cc}
      }
      return this.community
    },
    chainName() {
      if (this.showingCommunity) {
        for (let chainName of Object.keys(EVM_CHAINS)){
          if (EVM_CHAINS[chainName].id === this.showingCommunity.chainId) {
            return chainName;
          }
        }
      }
      return false;
    }
  },
  async activated() {
    let count = 0;
    while (!this.showingCommunity || !this.showingCommunity.communityId || count++ < 30) {
      this.refreshing = true;
      await sleep(0.2)
    }
    if (this.members.length === 0 && this.communityId !== this.showingCommunity.communityId) {
      this.communityId = this.showingCommunity.communityId
      this.$store.commit('community/saveMembers', []);
      this.listFinished = false;
      this.refresh()
    }
    if (this.communityCCscore?.userIndex > -1){
      return;
    }
    try{
      const res  = await getJoinCommunityState(this.getAccountInfo.twitterId)
      this.$store.commit('community/saveCommunityCC', res)
    } catch (e) {
      console.log(3, e)
    } finally {
      this.refreshing = false
    }
  },
  methods: {
    parseTimestamp,
    async onLoad() {
      if (this.listFinished || this.finished || this.members.length === 0) return;
      try {
        this.listLoading = true;
        let members = await getCommunityMembers(this.showingCommunity.communityId, 20, parseInt((this.members.length -1) / 20) + 1);
        if (members.length > 0) {
          // members = await this.getBalances(members)
          this.$store.commit('community/saveMembers', this.members.concat(members ?? []));
        }else {
          this.finished = true
        }
      } catch (e) {
        notify({message: e, type: 'error'})
      }finally{
        this.listLoading = false
      }
    },
    async refresh() {
      try {
        this.listLoading = true;
        this.refreshing = true;
        let members = await getCommunityMembers(this.showingCommunity.communityId);
        this.$store.commit('community/saveMembers', members ?? []);
        // members = await this.getBalances(members)
        this.$store.commit('community/saveMembers', members ?? []);
        if (members.length === 0) {
          this.finished = true
        }
      } catch (e) {
        notify({message: e, type: 'error'})
      }finally{
        this.refreshing = false
        this.listLoading = false
      }
    },
    async getBalances(mem){
      const balances = await getTokenBalancesOfUsers(EVM_CHAINS_ID[this.showingCommunity.chainId], this.showingCommunity.rewardToken, mem.map(m => m.ethAddress))
      mem = mem.map(m => {
        let balance = balances[m.ethAddress]
        balance = balance ? balance.toString() / (10 ** this.showingCommunity.rewardTokenDecimals) : 0;
        const price = formatPrice(balance * this.showingCommunity.rewardPrice)
        balance = formatAmount(balance);
        return {
          ...m,
          showingBalance: `${balance}/${price}`
        }
      })
      return mem
    }
  },
  async mounted () {

  },
}
</script>

<style scoped>

</style>
