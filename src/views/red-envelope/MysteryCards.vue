<template>
  <div class="pb-2rem relative px-15px">
    <div class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-1rem py-1rem">
      <div class="col-span-1 ">
        <div class="border-1 border-color8B/30 light:border-colorF4 text-left p-12px
                    rounded-12px bg-glass light:bg-card-gradient">
          <div>{{$t('ny.yourPower')}}: {{ userActivityInfo.userWeights }}</div>
          <div>{{$t('ny.totalPower')}}: {{ userActivityInfo.totalWeights }}</div>
        </div>
      </div>
      <div class="col-span-1 ">
        <div v-if="!isOver"
             class="border-1 border-color8B/30 light:border-colorF4 p-12px
                    rounded-12px bg-glass light:bg-card-gradient">
          <div>{{$t('ny.poolRewards')}}</div>
          <div class="c-text-black">${{ userActivityInfo.prizeTotalAmount }}</div>
        </div>
        <div v-else class="bg-tag-gradient p-12px rounded-12px text-white cursor-pointer">
          <div class="font-bold">{{$t('ny.claimReward')}}</div>
          <div class="c-text-black">${{ userActivityInfo.alreadyReceived }}</div>
        </div>
      </div>
      <div class="col-span-1 xs:col-span-2 sm:col-start-4">
        <div v-if="!isOver"
             class="p-12px text-white rounded-12px bg-tag-gradient cursor-pointer cursor-pointer"
             @click="makeCardVisible=true">
          <div class="font-bold">{{$t('ny.makeCard')}}</div>
          <div>{{ userActivityInfo.openBoxCounts }} / {{ userActivityInfo.mintBoxCounts }} {{$t('ny.opened')}}</div>
        </div>
        <div v-else
             class="p-12px text-white rounded-12px bg-tag-gradient cursor-pointer cursor-pointer"
             @click="redeemCardVisible=true">
          <div class="font-bold">{{$t('ny.redeemCards')}}</div>
          <div>{{ userActivityInfo.openBoxCounts }} / {{ userActivityInfo.mintBoxCounts }} {{$t('ny.opened')}}</div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 xs:grid-cols-4 gap-x-1rem xs:gap-x-2.5rem gap-y-1rem py-1rem">
      <div class="relative text-14px leading-18px 2xl:text-1rem 2xl:leading-1.2rem text-white cursor-pointer"
           v-for="(card, index) of cards" :key="index"
           @click="selectedCard=card, cardDetailVisible=true">
        <img class="w-full cursor-pointer" src="~@/assets/red-envelope/mystery-card-back.png" alt="">
        <img class="w-4/5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-12px"
             src="~@/assets/red-envelope/mystery-logo.png" alt="">
        <div class="absolute top-10px right-10px font-bold text-shadow-lg opacity-70">
          + {{card.amount}} {{card.tokenName}}
        </div>
        <div class="absolute bottom-10px left-10px text-shadow-lg font-bold opacity-70">
          <div class="flex flex-col items-start">
            <div class="flex items-center justify-center gap-4px">
              <img v-for="star of card.power" :key="star"
                   class="text-shadow-lg w-12px"
                   src="~@/assets/red-envelope/icon-star.svg" alt="">
            </div>
            <div class="c-text-black text-shadow-lg">{{card.power}} {{$t('ny.power')}}</div>
          </div>
        </div>
        <div class="absolute bottom-10px right-10px text-shadow-lg font-bold opacity-70">
          {{card.brandName}}
        </div>
      </div>
    </div>
    <el-dialog v-model="cardDetailVisible"
               destroy-on-close
               :show-close="false"
               :close-on-click-modal="true"
               class="c-dialog c-dialog-center max-w-500px bg-glass border-1 border-color84/30 rounded-1.6rem">
      <MysteryCardDetailModal :card-detail="selectedCard"
                              @close="cardDetailVisible=false"/>
    </el-dialog>
    <el-dialog v-model="makeCardVisible"
               destroy-on-close
               :show-close="false"
               :close-on-click-modal="true"
               class="c-dialog c-dialog-center max-w-500px bg-glass border-1 border-color84/30 rounded-1.6rem">
      <MakeMysteryCard @close="makeCardVisible=false"/>
    </el-dialog>
    <el-dialog v-model="redeemCardVisible"
               destroy-on-close
               :show-close="false"
               :close-on-click-modal="true"
               class="c-dialog c-dialog-center max-w-500px bg-glass border-1 border-color84/30 rounded-1.6rem">
      <RedeemCardModal @close="redeemCardVisible=false"/>
    </el-dialog>
  </div>
</template>

<script>
import MysteryCardDetailModal from "@/views/red-envelope/MysteryCardDetailModal";
import MakeMysteryCard from "@/views/red-envelope/MakeMysteryCard";
import RedeemCardModal from "@/views/red-envelope/RedeemCardModal";
import CardLogo from '@/assets/red-envelope/mystery-logo.png'
import { getUserActivityInfo, getUserBlindBox } from '@/utils/new-year'
import { mapGetters, mapState } from "vuex";


export default {
  name: "MysteryCards",
  components: {MysteryCardDetailModal, MakeMysteryCard, RedeemCardModal},
  computed: {
    ...mapState('newYear', ['blessCardBalance', 'getUSDTBalance', 'approvedUSDT', 'usdtBalance', 'userActivityInfo', 'blindBoxBalance']),
    ...mapState('web3', ['chainId', 'account']),
    ...mapGetters(['getAccountInfo']),
    isOver() {
      return (new Date().getTime() / 1000) > this.userActivityInfo.eventEndTime
    }
  },
  data() {
    return {
      cards: [
        { amount: 0.5, tokenName: 'UNI', tokenAddress: '', power: 4, logo: CardLogo, brandName: 'Uniswap', count: 2, desc: 'xxxx'},
        { amount: 0.3, tokenName: 'NFT', tokenAddress: '', power: 3, logo: CardLogo, brandName: 'Uniswap', count: 2, desc: 'xxxx'},
        { amount: 0.2, tokenName: 'UNI', tokenAddress: '', power: 2, logo: CardLogo, brandName: 'Uniswap', count: 2, desc: 'xxxx'},
        { amount: 0.1, tokenName: 'UNI', tokenAddress: '', power: 1, logo: CardLogo, brandName: 'Uniswap', count: 2, desc: 'xxxx'}
      ],
      cardDetailVisible: false,
      selectedCard: {},
      makeCardVisible: false,
      redeemCardVisible: false
    }
  },
  mounted() {
    const account = this.getAccountInfo?.ethAddress;
    if (!account) return;
    getUserActivityInfo(account).catch();
    getUserBlindBox(account).then(res => {

    }).catch()
    this.selectedCard = this.cards[0]
  }
}
</script>

<style scoped>

</style>
