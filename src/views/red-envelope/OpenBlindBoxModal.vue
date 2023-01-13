<template>
  <div class="relative text-left pb-3rem text-14px 2xl:text-0.8rem h-max overflow-auto ny-modal-bg">
    <button class="absolute right-20px top-20px"
            @click="$emit('close')">
      <img class="w-26px h-26px min-w-26px" src="~@/assets/red-envelope/icon-close.svg" alt="">
    </button>
    <div v-if="step===0" class="mt-4rem text-center px-15px sm:px-1/10 overflow-hidden">
      <div class="flex justify-center relative py-20px px-50px">
        <div :class="index>0?'-ml-120px sm:-ml-170px':''" class="card-item"
             v-for="(item, index) of cards.slice(1)" :key="index">
          <div class="relative text-white transform">
            <img class="max-w-150px sm:max-w-200px" src="~@/assets/red-envelope/lucky-card.png" alt="">
            <div class="w-full h-full px-18px absolute top-0 pt-1/6 pb-1/9
                        flex flex-col justify-between items-center">
              <img class="w-full" :src="item.img" alt="">
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
        <div class="-ml-120px sm:-ml-170px card-item">
          <div class="relative text-white">
            <img class="max-w-150px sm:max-w-200px" src="~@/assets/red-envelope/lucky-card.png" alt="">
            <div class="w-full h-full px-18px absolute top-0 pt-1/6 pb-1/9
                        flex flex-col justify-between items-center">
              <img class="w-full" :src="cards[0].img" alt="">
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
                :disabled="isDrawing || accountMismatch"
                @click="onDrawCard">
          {{$t('ny.drawCard')}}
          <c-spinner v-show="isDrawing" class="w-16px h-16px 2xl:w-1rem 2xl:h-1rem ml-0.5rem"></c-spinner>
        </button>
        <div v-if="accountMismatch" class="text-blueDark">
          {{ $t('ny.accountMismatch') }}
        </div>
    </div>
    <template v-if="step===1">
      <div class="relative h-100px min-h-100px flex items-center justify-center mt-1rem">
        <div class="ny-gradient-text italic mx-auto c-text-black text-36px xl:text-1.8rem">
          {{$t('ny.congratulations')}}
        </div>
        <img class="h-100px absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
             src="~@/assets/red-envelope/modal-title-bg.png" alt="">
      </div>
      <div class="flex flex-col justify-center items-center relative">
        <div class="card-container w-28vh h-45vh min-w-200px min-h-300px max-h-380px relative">
          <div class="mystery-card cursor-pointer w-full h-full flipped">
            <div class="back absolute">
              <div class="relative text-white w-220px">
                <img class="w-full cursor-pointer"
                     :src="require(`@/assets/red-envelope/mystery-power-${drawedBoxInfo.weights || 10}.png`)" alt="">
                <img v-if="drawedBoxInfo?.logo"
                     class="w-3/10 max-w-3/10 absolute top-15/100 left-1/2 transform -translate-x-1/2 rounded-12px"
                     :src="drawedBoxInfo.logo" alt="">
                <img v-else
                     class="w-3/10 max-w-3/10 absolute top-15/100 left-1/2 transform -translate-x-1/2 rounded-12px"
                     src="~@/assets/red-envelope/mystery-logo.png" alt="">
                <div class="absolute top-40/100 left-1/2 transform -translate-x-1/2
                            text-16px text-shadow-lg font-bold opacity-70 text-white">
                  {{ drawedBoxInfo.brandName ?? 'Wormhole3' }}
                </div>
                <div v-if="drawedBoxInfo.prizeType === 1"
                     class="absolute top-55/100 left-1/2 transform -translate-x-1/2
                            text-20px font-bold text-shadow-lg opacity-70 text-white">
                + 1 {{ drawedBoxInfo.symbol }}
                </div>
                <div v-else-if="drawedBoxInfo.prizeType === 2"
                     class="absolute top-55/100 left-1/2 transform -translate-x-1/2
                            text-20px font-bold text-shadow-lg opacity-70 text-white">
                  + 1 NFT
                </div>
                <div v-else-if="drawedBoxInfo.prizeType === 3"
                     class="absolute top-55/100 left-1/2 transform -translate-x-1/2
                            text-20px font-bold text-shadow-lg opacity-70 text-white">
                  + {{ drawedBoxInfo.amount  }} NFT
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="px-15px sm:px-1/10 whitespace-pre-line leading-20px">
          {{ drawedBoxInfo.brandDesc ?? '' }}
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
                  @click="close">
            {{$t('ny.get')}}
          </button>
        </div>
        <button class="flex justify-center items-center max-w mx-auto h-38px 2xl:h-1.8rem mt-10px
                     border-b-2px border-colorBlue">
          <img src="~@/assets/icon-twitter-blue.svg" alt="">
          <span class="text-colorBlue font-bold">{{$t('ny.shareTweet')}}</span>
        </button>
      </div>
    </template>
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
import { NEW_YEAR_CARD_CONTRACT, CHAIN_ID, BLESS_CARD_NAME } from '@/ny-config'
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
      /**
       * id,
       * prizeType: 1: erc20, 2: erc721, 3: erc1155
       * token
       * creator
       * weights
       * amount
       * nftId
       */
      drawedBoxInfo: {}
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
          c = bs[b]
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
          this.drawedBoxInfo = drawedBoxInfo[0];
          console.log(35, this.drawedBoxInfo);
          getUserNYCards(this.getAccountInfo.ethAddress).catch()
          getUserActivityInfo(this.getAccountInfo.ethAddress).catch()
          this.step=1
        }else {
          console.log('open box fail:');
          this.$emit('close');
          return;
        }
      } catch (e) {
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
    }
  },
  mounted () {
    if (!this.getAccountInfo || !this.getAccountInfo.twitterId) {
      return;
    }
    accountChanged().catch()
    getAccounts(true).then(wallet => {
      this.account = wallet
    }).catch();
  },
}
</script>

<style scoped lang="scss">
.card-container {
  -ms-perspective: 800px;
  perspective: 800px;
  border-radius: 4px;
}
.mystery-card {
  transform-style: preserve-3d;
  transition: transform 0.8s;
}
.mystery-card .back, .mystery-card .front {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
.mystery-card .back {
  transform: rotateY(-180deg);
}
.mystery-card.flipped {
  transform: rotateY(-180deg);
}
.card-item:nth-child(1) {
  transform: rotate(-26deg)
}
.card-item:nth-child(2) {
  transform: rotate(-13deg)
}
.card-item:nth-child(3) {
  //transform: rotate(0deg)
}
.card-item:nth-child(4) {
  transform: rotate(13deg)
}
.card-item:nth-child(5) {
  transform: rotate(26deg)
}
</style>
