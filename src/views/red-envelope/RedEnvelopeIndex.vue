<template>
  <div class="text-14px leading-20px 2xl:text-0.8rem 2xl:leading-1.2rem">
    <div class="container mx-auto max-w-50rem md:px-1rem px-15px">
      <div class="py-1.5rem flex flex-col lg:flex-row lg:items-center">
        <div class="text-left">
          <div class="text-20px xl:text-24px 2xl:text-1.2rem c-text-black xs:whitespace-nowrap">{{$t('ny.p1')}}</div>
          <div class="text-color8B light:text-color7D mt-4px">{{$t('ny.p2')}}</div>
        </div>
        <div class="flex-1 flex flex-col xs:flex-row lg:justify-end gap-x-20px gap-y-10px">
          <div class="flex data-box">
            <img class="w-45px mr-10px" src="~@/assets/red-envelope/icon-time.svg" alt="">
            <div class="flex flex-col items-start justify-between">
              <div class="text-color8C">{{$t('ny.endTime')}}</div>
              <van-count-down class="text-color7D"
                              :time="endTime">
                <template #default="timeData">
                <span class="flex items-center font-bold">
                  <span class="time-bg">{{ timeData.days }}</span><span class="text-color8C mx-4px">D</span>
                  <span class="time-bg">{{ timeData.hours }}</span><span class="text-color8C mx-4px">H</span>
                  <span class="time-bg">{{ timeData.minutes }}</span><span class="text-color8C mx-4px">M</span>
                  <span class="time-bg">{{ timeData.seconds }}</span><span class="text-color8C mx-4px">S</span>
                </span>
                </template>
              </van-count-down>
            </div>
          </div>
          <div class="flex data-box">
            <img class="w-45px mr-10px" src="~@/assets/red-envelope/icon-coin.svg" alt="">
            <div class="flex flex-col items-start justify-between">
              <div class="text-color8C whitespace-nowrap">{{$t('ny.poolRewards')}}</div>
              <span class="c-text-black text-18px">${{ userActivityInfo.prizeTotalAmount }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="tabIndex===0"
           class="min-h-120px ny-banner-bg text-left rounded-20px py-1rem px-15px sm:p-2rem ny-color36">
           The five lucky cards are combined with 4 Common cards and 1 Rare card. <br>
            How to obtain the lucky cards?<br>
            <b>Interaction</b> - You will get a chance to win the Five Lucky Cards by using Wormhole3 during the campaign period <br>
            <b>Participation</b> - Participate in the project's tasks during the event <br>
            <b>Trading/Giving</b> - All cards can be traded and gifted <br>
            <b>Recommendation</b> - Refer 1 new user with more than 30 reputations (Rare only)<br>
            <b>Mint</b> - Per price at 0.2 $USDT (Rare only)
      </div>
      <div v-if="tabIndex===1"
           class="min-h-120px ny-banner-bg text-left rounded-20px py-1rem px-15px sm:p-2rem ny-color36">
           Mystery box cards have 5 levels, each level represents weight 1, 2, 3, 5, 10. The ultimate reward is determined by the sum of the mystery box card levels held.<br>
            How to obtain the mystery box card? <br>
            <b>Combination</b> - A mystery box card combined with 4 normal luck cards and 1 rare luck card <br>
            How to promote me or my project through mystery box cards? <br>
            <b>Mint</b> - You can promote your project by inserting prizes and project information into the mystery box card, which costs 1 $USDT per card mint.
      </div>
      <div class="card-box mt-1rem mb-2rem">
        <div class="flex justify-start gap-x-10px pt-10px px-1/10
                    border-b-1 border-color8B/30 light:border-color62/10 font-bold">
          <button class="h-50px flex items-center justify-center mr-20px"
                  :class="tabIndex===0?'active-tab':''"
                  @click="tabIndex=0">
            {{$t('ny.blessingCards')}}
          </button>
          <button class="h-50px flex items-center justify-center"
                  :class="tabIndex===1?'active-tab':''"
                  @click="tabIndex=1">
            {{$t('ny.mysteryCards')}}
          </button>
        </div>
        <div class="">
          <BlessingCards v-if="tabIndex===0" @gotoBlind="tabIndex=1"/>
          <MysteryCards v-if="tabIndex===1"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BlessingCards from "@/views/red-envelope/BlessingCards";
import MysteryCards from "@/views/red-envelope/MysteryCards";
import { mapGetters, mapState } from 'vuex'
import { chainChanged } from '@/utils/web3/web3'
import { getUserActivityInfo } from '@/utils/new-year'
import { parseTimestampToUppercase } from '@/utils/helper'
import {isNumeric} from "@/utils/tool";

export default {
  name: "RedEnvelopeIndex",
  components: {BlessingCards, MysteryCards},
  data() {
    return {
      tabIndex: 0
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo']),
    ...mapState('newYear', ['blessCardBalance', 'getUSDTBalance', 'approvedUSDT', 'usdtBalance', 'userActivityInfo', 'blindBoxBalance']),
    endTime() {
      // return parseTimestampToUppercase(this.userActivityInfo.eventEndTime)
      if(!this.userActivityInfo.eventEndTime || !isNumeric(this.userActivityInfo.eventEndTime)) return 0
      return this.userActivityInfo.eventEndTime*1000 - new Date().getTime()
    }
  },
  mounted () {
    if (!this.getAccountInfo || !this.getAccountInfo.ethAddress) {
      this.$router.replace('/')
      return;
    }
    chainChanged().catch()
    getUserActivityInfo(this.getAccountInfo.ethAddress).catch();
  }
}
</script>

<style scoped lang="scss">
.text-color8C {
  color: #8C89B4
}
.text-colorC9 {
  color: #C9CDD4
}
.time-bg {
  background: #F2EEFF;
  color: #362473;
  width: 28px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-weight: bold;
}
.data-box {
  border: 1px solid rgba(120, 81, 255, 0.3);
  background: #161B22;
  border-radius: 20px;
  padding: 13px 16px;
}
.card-box {
  border: 1px solid rgba(138, 104, 255, 0.4);
  background: #161B22;
  border-radius: 20px;
}
.light .time-bg {
  background: white;
}
.light .data-box{
  background: #F2EEFF;
}
.light .card-box {
  background: #F2EEFF;
}
.active-tab {
  position: relative;
  overflow: hidden;
  &::after {
    content: '';
    position: absolute;
    height: 14px;
    width: 100%;
    background: #7850FF;
    border-radius: 14px;
    bottom: -7px;
  }
}
</style>
