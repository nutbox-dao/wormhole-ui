<template>
  <div class="relative flex flex-col text-14px">
    <slot></slot>
    <div class="flex-1 overflow-auto pb-15px no-scroll-bar">
      <van-list :loading="listLoading"
                :finished="listFinished"
                :immediate-check="false"
                :loading-text="$t('common.loading')"
                @load="onLoad">
        <div class="flex justify-between items-center py-15px px-15px text-left border-b-0.5px border-color8B/30 gap-10px"
             v-for="record of (list ?? [])" :key="record.id">
          <div class="w-4/7 flex items-center cursor-pointer truncate"
               @click="$router.push('/account-info/@' + record.twitterUsername)">
            <Avatar :profile-img="record.profileImg"
                    :name="record.twitterName"
                    :username="record.twitterUsername"
                    :steem-id="record.steemId"
                    :eth-address="record.ethAddress"
                    :reputation="record.reputation"
                    :teleported="list.length<5"
                    @gotoUserPage="$router.push({path : '/account-info/@' + record.twitterUsername})">
              <template #avatar-img>
                <img class="w-30px min-w-30px h-30px rounded-full border-1 gradient-border cursor-pointer bg-color8B/10"
                     :src="record.profileImg" alt="">
              </template>
            </Avatar>
            <div class="text-12px leading-18px ml-8px truncate">
              {{record.twitterUsername}}
            </div>
            <div class="flex justify-between items-center gap-4px ml-8px">
              <el-tooltip v-if="record.votePower >= (space?space.voteThreshold:1000000)" placement="top-start">
                <i @click.stop class="w-16px h-16px min-w-16px btn-icon-vote-active"></i>
                <template #content>
                  <div class="text-white light:text-black">voter</div>
                </template>
              </el-tooltip>
              <el-tooltip v-if="(record.curationRewardType & 4) === 4" placement="top-start">
                <i @click.stop class="w-16px h-16px min-w-16px btn-icon-like-active"></i>
                <template #content>
                  <div class="text-white light:text-black">+3</div>
                </template>
              </el-tooltip>
              <el-tooltip v-if="(record.curationRewardType & 128) === 128" placement="top-start">
                <i @click.stop class="w-16px h-16px min-w-16px btn-icon-reply-active"></i>
                <template #content>
                  <div class="text-white light:text-black">+5</div>
                </template>
              </el-tooltip>
              <el-tooltip v-if="(record.curationRewardType & 2) === 2" placement="top-start">
                <i @click.stop class="w-16px h-16px min-w-16px btn-icon-retweet-active"></i>
                <template #content>
                  <div class="text-white light:text-black">+15</div>
                </template>
              </el-tooltip>
              <el-tooltip v-if="(record.curationRewardType & 1) === 1" placement="top-start">
                <i @click.stop class="w-16px h-16px min-w-16px btn-icon-quote-active"></i>
                <template #content>
                  <div class="text-white light:text-black">+20</div>
                </template>
              </el-tooltip>
            </div>
          </div>
          <!--已结束-->
         <div v-if="space && space.isCalc" class="w-3/7 text-right">{{ showingReward(record) }}</div>
          <!--未开始/进行中-->
          <div v-else class="w-3/7 text-right">{{ parseTimestamp(record.createAt) }}</div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import {parseTimestamp, formatAmount, formatPrice} from "@/utils/helper";
import ChainTokenIcon from "@/components/ChainTokenIcon";
import { spaceCurationRecord } from '@/api/api'
import {getPriceFromOracle} from "@/utils/asset";
import BlogReward from "@/components/BlogReward.vue";
import {isNumeric} from "@/utils/tool";
import { mapState } from "vuex";
import { EVM_CHAINS_ID } from '@/config'
import Avatar from "@/components/Avatar";

export default {
  name: "CurationAttendedList",
  components: {ChainTokenIcon, BlogReward, Avatar},
  props: {
    records: {
      type: Array,
      default: []
    },
    state: {
      type: Number,
      default: 0
    },
    curation: {
      type: Object,
      default: {}
    },
    space: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data() {
    return {
      price: 0,
      listLoading: false,
      listFinished: false,
      list: []
    }
  },
  computed: {
    ...mapState('community', ['showingCommunity']),
  },
  async mounted() {
    this.list = this.records;
    if (this.showingCommunity && this.showingCommunity.rewardPrice) {
      this.price = this.showingCommunity.rewardPrice
    }else {
      const prices = await getPriceFromOracle(EVM_CHAINS_ID[this.curation.chainId], [{token: this.curation.token, decimals: this.curation.decimals}])
      this.price = prices[this.curation.token]
    }
  },
  methods: {
    parseTimestamp,
    formatAmount,
    showingReward(reward) {
      let amount = 0;
      let p = 0;
      if (reward.curateAmount > 0) {
        amount = reward.curateAmount / (10 ** reward.decimals)
      }
      return `${formatAmount(amount)}(${formatPrice(amount * this.price)})`
    },
    onLoad() {
      if(this.listLoading || this.listFinished) return
      let time;
      if (this.list.length > 0) {
        time = this.list[this.list.length - 1].createAt
      }
      this.listLoading = true
      spaceCurationRecord(this.space.curationId, time).then(list => {
        this.listFinished = list.length<30
        this.list = this.list.concat(list)
      }).catch(console.log).finally(() => {
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
