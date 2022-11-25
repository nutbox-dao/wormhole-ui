<template>
  <div class="container mx-auto sm:max-w-600px lg:max-w-35rem px-1rem pb-2rem">
    <div class="text-15px flex gap-1rem mt-1.2rem">
      <div class="leading-27px whitespace-nowrap px-0.8rem rounded-full font-500 h-27px cursor-pointer"
          :class="selectIndex===0?'gradient-bg text-white':'border-1 border-white/40 light:border-colorE3 text-color84 light:text-color7D light:bg-colorF2'"
          >{{$t('transactionView.recentTip')}}</div>
    </div>
    <div class="bg-blockBg light:bg-white rounded-1rem mt-1rem">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh"
                loading-text="Loading"
                pulling-text="Pull to refresh data"
                loosing-text="Release to refresh">
        <van-list :loading="loading"
                  :finished="finished"
                  :immediate-check="false"
                  :loosing-text="$t('common.pullRefresh')"
                  :loading-text="$t('common.loading')"
                  :finished-text="$t('common.noMore')"
                  @load="onLoad">
          <!-- <div class="text-left p-1rem c-text-black md:text-1.2rem text-1.5rem">{{$t('transactionView.recentTransaction')}}</div> -->

          <div class="border-b-1px border-listBgBorder p-1rem"
               v-for="(item, index) of showingList" :key="index">
            <div class="flex justify-between">
              <div class="flex-1 flex items-center">
                <img v-if="!isReceive(item)" class="w-2.2rem"
                     src="~@/assets/icon-up-arrow.svg" alt="">
                <img v-else class="w-2.2rem"
                     src="~@/assets/icon-down-arrow.svg" alt="">
                <div class="text-text8F flex flex-col items-start sm:ml-1rem ml-0.5rem">
                  <div class="text-1.1rem md:text-0.8rem leading-1.2rem text-left text-color8B light:text-color7D">
                    <strong class="c-text-black text-white light:text-blueDark">
                      {{ isReceive(item) ? $t('transactionView.receiveFrom') : $t('transactionView.sendTo') }}</strong>
                    {{ getTargetAccount(item) }}
                  </div>
                  <div class="text-0.7rem mt-0.5rem text-color8B">{{ parseTime(item.postTime) }}</div>
                </div>
              </div>
              <div class="flex flex-col items-end">
                <div class="c-text-black text-0.8rem leading-1.2rem whitespace-nowrap">
                  {{ isReceive(item) ? '+' : '-' }} {{ item.amount }} {{ item.asset }}
                </div>
                <div class="c-text-medium text-0.7rem mt-0.5rem text-color8B">{{ getValue(item) }}</div>
              </div>
            </div>
            <div class="text-right mt-1rem c-text-medium text-0.6rem">
              <a v-if="item.tipResult === 0"
                 class="text-white rounded-full border-1 border-white/20 py-4px px-0.7rem
                        light:text-blueDark light:bg-colorF2 light:border-colorE3 light:text-color7D"
                 :href="hashLink(item)" target="_blank">{{$t('transactionView.viewBlockchain')}}</a>
              <el-tooltip v-else-if="item.sendStatus!==0">
                <template #content>{{failResult(item)}}</template>
                <button class="text-redColor rounded-full border-1 border-redColor py-4px px-0.7rem">{{$t('transactionView.fail')}}</button>
              </el-tooltip>
              <span v-if="item.returnStatus === 1" class="text-primaryColor rounded-full border-1 border-primaryColor py-4px px-0.7rem">{{$t('transactionView.returned')}}</span>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { EVM_CHAINS, SteemScan } from '@/config'
import { sleep, formatAmount } from '@/utils/helper'
import { ethers } from 'ethers'
import { getUsersTips } from '@/utils/account'

export default {
  name: "Transaction",
  data() {
    return {
      refreshing: true,
      loading: false,
      finished: false,
      selectIndex: 0,
      pageSize: 16,
      pageIndex: 0,
      chains: EVM_CHAINS
    }
  },
  computed: {
    ...mapState(['accountInfo', 'transactions', 'prices', 'tips']),
    ...mapGetters(['getAccountInfo']),
    showingList() {
      return this.tips
    }
  },
  methods: {
    isReceive(trans) {
      return trans.twitterId !== this.getAccountInfo.twitterId
    },
    failResult(trans) {
      switch(trans.tipResult) {
        case 0:
          return 'Success'
        case 1:
          return 'Insufficient balance'
        case 2:
          return 'Insufficient gas fee'
        case 3:
          return 'Transaction fail'
        case 4:
          return 'Target account not exist'
      }
    },
    hashLink(trans) {
      if (trans.chainName === 'STEEM') {
        return SteemScan + 'tx/' + trans.hash
      }else {
        const chain = Object.values(EVM_CHAINS).find(c => c.id === parseInt(trans.chainName));
        if (chain) {
          return chain.scan + 'tx/' + trans.hash
        }
      }
    },  
    getValue(trans) {
      const amount = parseFloat(trans.amount)
      const symbol = trans.symbol.toLowerCase()
      return '$' + formatAmount(amount * this.prices[symbol])
    },
    formatAmount(a) {
      return formatAmount(a)
    },
    getTargetAccount(trans) {
      if (this.isReceive(trans)){
        return '@' + trans.username
      }else {
        if (ethers.utils.isAddress(trans.targetUsername)) {
          return trans.targetUsername.substring(0, 10) + '......'
        }else {
          return '@' + trans.targetUsername
        }
      }
    },
    select(index) {
      this.selectIndex = index
      this.finished = false
      this.onRefresh()
    },
    onRefresh() {
      this.refreshing = true
      let time;
      if (this.tips && this.tips.length > 0) {
        time = this.tips[0].postTime
      }
      getUsersTips({twitterId: this.getAccountInfo.twitterId,
            pageSize: this.pageSize,
            time,
            newTips: true}).then(res => {
        console.log(53, res);
        this.$store.commit('saveTips', res)
        this.refreshing = false
      }).catch(e => {
        console.log(33, e);
        if (e === 'log out') {
            this.$router.go('/')
          }
        this.refreshing = false
      })
    },
    onLoad() {
      console.log('load more')
      if (this.finished || this.loading) return;
      let time;
      if (this.tips && this.tips.length > 0) {
        this.loading = true
        time = this.tips[this.tips.length - 1].postTime
        getUsersTips({twitterId: this.getAccountInfo.twitterId,
              pageSize: this.pageSize,
               time, 
               newTips: false}).then(res => {
          this.$store.commit('saveTips', this.tips.concat(res))
          if (res.length < this.pageSize) {
            this.finished = true
          }
          this.loading = false
        }).catch(e => {
          console.log(22, e);
          if (e === 'log out') {
            this.$router.go('/')
          }
          this.loading = false
          this.finished = true
        })
      }
    },
    parseTime(d) {
      const date = new Date(d)
      return date.toLocaleTimeString([], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute:'2-digit',
        second: '2-digit'
      })
    }
  },
  async mounted () {
    while(!this.getAccountInfo || !this.getAccountInfo.twitterUsername){
      await sleep(1)
    }
    this.onRefresh()
  },
}
</script>

<style scoped>

</style>
