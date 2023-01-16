<template>
  <div class="relative" :class="startAnimation?'card-animation':''">
    <div class="step1 relative text-left pb-3rem text-14px 2xl:text-0.8rem h-max
                overflow-auto ny-modal-bg rounded-20px no-scroll-bar">
      <button class="fixed right-20px top-20px z-99"
              @click="$emit('close')">
        <img class="w-26px h-26px min-w-26px" src="~@/assets/red-envelope/icon-close.svg" alt="">
      </button>
      <div class="mt-4rem text-center px-15px sm:px-1/10 overflow-hidden">
        <div class="relative px-50px w-0 h-240px sm:h-310px mx-auto mb-40px">
          <div class="card-item"
               v-for="(item, index) of cards.slice(1)" :key="index">
            <div class="relative text-white transform">
              <img class="max-w-150px sm:max-w-200px" src="~@/assets/red-envelope/lucky-card.png" alt="">
              <div class="w-full h-full px-18px absolute top-0 pt-1/6 pb-1/9
                        flex flex-col justify-between items-center">
                <img class="w-full rounded-8px" :src="item.img" alt="">
                <div class="flex flex-col items-center">
                  <div class="flex items-center justify-between sm:px-10px mt-10px w-full">
                    <img src="~@/assets/red-envelope/icon-title-tag.svg" alt="">
                    <span class="text-12px xs:text-18px xs:whitespace-nowrap px-2px">
                  {{BLESS_CARD_NAME[index]}}
                </span>
                    <img class="transform rotate-180" src="~@/assets/red-envelope/icon-title-tag.svg" alt="">
                  </div>
                  <div class="bg-white/10 w-max px-12px py-2px text-14px leading-18px rounded-full mt-6px xs:mt-10px">
                    {{$t('common.balance')}}: {{blessCardBalance[index + 1]}}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-item">
            <div class="relative text-white">
              <img class="max-w-150px sm:max-w-200px" src="~@/assets/red-envelope/lucky-card.png" alt="">
              <div class="w-full h-full px-18px absolute top-0 pt-1/6 pb-1/9
                        flex flex-col justify-between items-center">
                <img class="w-full rounded-8px" :src="cards[0].img" alt="">
                <div class="flex flex-col items-center">
                  <div class="flex items-center justify-between sm:px-10px mt-10px w-full">
                    <img src="~@/assets/red-envelope/icon-title-tag.svg" alt="">
                    <span class="text-12px xs:text-18px xs:whitespace-nowrap px-2px">
                  {{BLESS_CARD_NAME[4]}}
                </span>
                    <img class="transform rotate-180" src="~@/assets/red-envelope/icon-title-tag.svg" alt="">
                  </div>
                  <div class="bg-white/10 w-max px-12px py-2px text-14px leading-18px rounded-full mt-6px xs:mt-10px">
                    {{$t('common.balance')}}: {{blessCardBalance[5]}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-2rem text-blueDark">{{$t('ny.chanceTip', {count: enableChange})}}</div>
        <!-- <button @click="approve">approve</button> -->
        <ConnectMainchainBTNVue class="mx-auto my-1rem" v-if="chainId !== CHAIN_ID"/>
        <button v-else
                class="ny-gradient-btn gradient-btn-disabled-grey my-1rem mx-auto
                       flex items-center justify-center
                       min-w-10rem px-20px rounded-12px h-44px 2xl:h-2.2rem text-white font-bold"
                :disabled="isDrawing || accountMismatch || !enableChange"
                @click="onDrawCard">
          {{$t('ny.drawCard')}}
          <c-spinner v-show="isDrawing" class="w-16px h-16px 2xl:w-1rem 2xl:h-1rem ml-0.5rem"></c-spinner>
        </button>
        <div v-if="accountMismatch" class="text-blueDark">
          {{ $t('ny.accountMismatch') }}
        </div>
      </div>
    </div>
    <div class="step2">
      <div class="relative text-left pb-3rem text-14px 2xl:text-0.8rem h-max
                overflow-auto ny-modal-bg rounded-20px no-scroll-bar">
        <button class="fixed right-20px top-20px z-99"
                @click="$emit('close')">
          <img class="w-26px h-26px min-w-26px" src="~@/assets/red-envelope/icon-close.svg" alt="">
        </button>
        <div class="relative h-100px min-h-100px flex items-center justify-center mt-1rem">
          <div class="ny-gradient-text italic mx-auto c-text-black text-36px xl:text-1.8rem">
            {{$t('ny.congratulations')}}
          </div>
          <img class="h-100px absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
               src="~@/assets/red-envelope/modal-title-bg.png" alt="">
        </div>
        <div class="flex flex-col justify-center items-center relative">
          <div class="relative text-white w-220px min-h-300px show-mystery-card" ref="mysteryCard"
               :class="[`ny-power-${drawedBoxInfo.weights || 10}`]">
            <img class="w-full cursor-pointer"
                 :src="require(`@/assets/red-envelope/mystery-power-${drawedBoxInfo.weights || 10}.png`)" alt="">
            <img v-if="drawedBoxInfo?.logo"
                 class="w-3/10 max-w-3/10 absolute top-15/100 left-1/2 transform -translate-x-1/2 rounded-12px"
                 :src="drawedBoxInfo.logo" alt="">
            <img v-else
                 class="w-3/10 max-w-3/10 absolute top-15/100 left-1/2 transform -translate-x-1/2 rounded-12px"
                 src="~@/assets/red-envelope/mystery-logo.png" alt="">
            <div class="absolute top-40/100 left-1/2 transform -translate-x-1/2 brand-name
                            text-16px font-bold">
              {{ drawedBoxInfo.brandName ?? 'Wormhole3' }}
            </div>
            <div v-if="!drawedBoxInfo.brandName || (drawedBoxInfo.amount === 0 && drawedBoxInfo.nftId === 0)"
                 class="absolute top-54/100 left-1/2 transform -translate-x-1/2
                            text-14px font-bold text-shadow-lg opacity-70 text-white">
              Congrats!<br>
              Power Up!
            </div>
            <div v-else-if="drawedBoxInfo.prizeType === 1"
                 class="absolute top-55/100 left-1/2 transform -translate-x-1/2
                            text-20px font-bold text-shadow-lg opacity-70 text-white">
              + {{ drawedBoxInfo.amount }} {{ drawedBoxInfo.tokenSymbol }}
            </div>
            <div v-else-if="drawedBoxInfo.prizeType === 2"
                 class="absolute top-55/100 left-1/2 transform -translate-x-1/2 amount
                            text-20px font-bold">
              + 1 NFT
            </div>
            <div v-else-if="drawedBoxInfo.prizeType === 3"
                 class="absolute top-55/100 left-1/2 transform -translate-x-1/2 amount
                            text-20px font-bold">
              + {{ drawedBoxInfo.amount  }} NFT
            </div>
          </div>
          <div class="px-15px sm:px-1/10 whitespace-pre-line leading-20px text-color4E my-1rem">
            {{ drawedBoxInfo.brandDesc ?? WormholeInfo }}
          </div>
        </div>
        <div class="px-15px sm:w-8/10 mx-auto text-center">
          <div class="flex gap-6px xs:gap-16px">
            <button class="flex-1 h-44px 2xl:h-2.2rem font-bold text-color62 rounded-full
                       border-1 border-color62"
                    @click="$emit('gotoBlind')">
              {{$t('ny.checkCollections')}}
            </button>
            <button class="flex-1 ny-gradient-btn rounded-full font-bold h-44px 2xl:h-2.2rem"
                    @click="get">
              {{$t('ny.get')}}
            </button>
          </div>
          <button class="flex justify-center items-center max-w mx-auto h-38px 2xl:h-1.8rem mt-10px
                     border-b-2px border-colorBlue"
                  @click="onShare">
            <img src="~@/assets/icon-twitter-blue.svg" alt="">
            <span class="text-colorBlue font-bold">{{$t('ny.shareTweet')}}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import card0 from "@/assets/red-envelope/card0.png";
import card1 from "@/assets/red-envelope/card1.png";
import card2 from "@/assets/red-envelope/card2.png";
import card3 from "@/assets/red-envelope/card3.png";
import card4 from "@/assets/red-envelope/card4.png";
import { mapState, mapGetters } from 'vuex'
import { getUserNYCards, approve1155ToCollect, openBox, getUserActivityInfo } from '@/utils/new-year'
import { notify } from '@/utils/notify'
import { formatAmount } from '@/utils/helper'
import { NEW_YEAR_CARD_CONTRACT, CHAIN_ID, BLESS_CARD_NAME, WormholeInfo} from '@/ny-config'
import ConnectMainchainBTNVue from './ConnectMainchainBTN.vue'
import {accountChanged, getAccounts} from "@/utils/web3/account";
import { getBlindCardsByIds } from '@/api/api'

export default {
  name: "OpenBlindBoxModal",
  components: {
    ConnectMainchainBTNVue,
  },
  data() {
    return {
      step: 0,
      cards: [
        {label: 'Leek Rabbit', balance: 0, img: card0},
        {label: 'SBF Rabbit', balance: 0, img: card1},
        {label: 'MashiMaro', balance: 0, img: card2},
        {label: 'BTC Rabbit', balance: 0, img: card3},
        {label: 'Rabbit Trader', balance: 0, img: card4},
      ],
      starNum: 3,
      BLESS_CARD_NAME,
      flipCard: false,
      CHAIN_ID,
      isDrawing: false,
      WormholeInfo,
      /**
       * id,
       * prizeType: 1: erc20, 2: erc721, 3: erc1155
       * token
       * creator
       * weights
       * amount
       * nftId
       */
      drawedBoxInfo: {},
      startAnimation: false
    }
  },
  computed: {
    ...mapState('newYear', ['blessCardBalance', 'getUSDTBalance', 'approvedUSDT', 'usdtBalance']),
    ...mapState('web3', ['chainId', 'account']),
    ...mapGetters(['getAccountInfo']),
    accountMismatch() {
      return this.getAccountInfo.ethAddress !== this.account
    },
    showingAmount() {
      if (this.drawedBoxInfo.id > 0) {
        return this.drawedBoxInfo.amount  / (10 ** this.drawedBoxInfo.tokenDecimals)
      }
      return 1
    },
    enableChange() {
      const bs = Object.values(this.blessCardBalance)
      let c = bs[0];
      for (let i = 0; i < bs.length; i++) {
        if (bs[i] < c) {
          c = bs[i]
        }
      }
      return c
    }
  },
  methods: {
    async approve() {
      const tx = await approve1155ToCollect(NEW_YEAR_CARD_CONTRACT, this.getAccountInfo.ethAddress)
      console.log(3, tx);
    },
    async onDrawCard() {
      try{
        this.isDrawing = true;
        const drawedBoxInfo = await openBox(this.getAccountInfo.ethAddress)
        if (drawedBoxInfo && drawedBoxInfo.length > 0) {
          this.drawedBoxInfo = drawedBoxInfo[0]
          getUserNYCards(this.getAccountInfo.ethAddress).catch()
          getUserActivityInfo(this.getAccountInfo.ethAddress).catch()
          this.step=1
          // 开始动画
          this.startAnimation = true
        }else {
          console.log('open box fail:');
          this.$emit('close');
          return;
        }
      } catch (e) {
        this.$refs.mysteryCard.style.animationDelay = '4000ms'
        console.log('open box fail:', e);
      } finally {
        this.isDrawing = false
      }
    },
    get() {
      if (this.enableChange) {
        this.step = 0
      }else {
        this.$emit('close')
      }
    },
    onShare() {
      window.open(`https://twitter.com/intent/tweet?text=I opened a ${this.drawedBoxInfo.weights}X mystery card in the @wormhole_3 Lunar New Year campaign, Come join us here: https://alpha.wormhole3.io.`)
      this.get();
    }
  },
  mounted () {
    if (!this.getAccountInfo || !this.getAccountInfo.twitterId) {
      return;
    }
    getAccounts(true).catch();
    accountChanged().catch()
  },
}
</script>

<style scoped lang="scss">
.text-color4E {
  color: #4E5969;
}
.card-container {
  -ms-perspective: 800px;
  perspective: 800px;
  border-radius: 4px;
}

.card-item {
  //margin-left: -170px;
  position: absolute;
  bottom: 0;
}
.card-item:nth-child(1) {
  left: 0;
  transform: translateX(-50%) rotate(-26deg);
}
.card-item:nth-child(2) {
  left: 25%;
  transform: translateX(-50%) rotate(-13deg);
}
.card-item:nth-child(3) {
  left: 50%;
  transform: translateX(-50%);
}
.card-item:nth-child(4) {
  left: 75%;
  transform: translateX(-50%) rotate(13deg);
}
.card-item:nth-child(5) {
  left: 100%;
  transform: translateX(-50%) rotate(26deg);
}
.card-animation .card-item {
  animation: rotateCard 1s forwards, moveCard .8s 1s forwards;
}
@keyframes rotateCard {
  100% {
    transform: translateX(-50%) rotate(0deg);
  }
}
@keyframes moveCard {
  100% {
    left: 50%;
  }
}
.card-animation .step1 {
  animation: step1Scale 1s 1.8s forwards, step1Hide 0.1s 2.8s forwards;
}
.step2 {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
}
.card-animation .step2 {
  animation: step2Show 0.1s 2.9s forwards, step2Scale 1s 3s forwards ease-in-out;
}
@keyframes step1Scale {
  100% {
    transform: scale(0);
  }
}
@keyframes step1Hide {
  100% {
    max-height: 0;
    overflow: hidden;
  }
}
@keyframes step2Show {
  100% {
    transform: scale(0);
    max-height: 100vh;
  }
}
@keyframes step2Scale {
  10% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.show-mystery-card {
  opacity: 0;
  animation: showMysteryCard 1s 5s forwards;
}
.card-animation .delay-show {
  opacity: 0;
}
@keyframes showMysteryCard {
  100% {
    opacity: 1;
  }
}
</style>
