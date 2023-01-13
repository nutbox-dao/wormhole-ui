<template>
  <div class="relative text-left pb-3rem flex flex-col text-14px 2xl:text-0.8rem text-blueDark
              overflow-auto bg-white rounded-20px">
    <button class="absolute right-20px top-20px"
            @click="$emit('close')">
      <img class="w-26px h-26px min-w-26px" src="~@/assets/red-envelope/icon-close.svg" alt="">
    </button>
    <div class="mx-auto c-text-black text-20px xl:text-1.2rem mt-3rem mb-2rem">
      {{$t('ny.mysteryCards')}}
    </div>
    <div class="flex flex-col justify-center items-center relative">
      <div class="relative text-white w-220px" :class="`ny-power-${cardDetail.weights}`">
        <img class="w-full cursor-pointer"
             :src="require(`@/assets/red-envelope/mystery-power-${cardDetail.weights || 10}.png`)"
             alt="">
        <img v-if="cardDetail?.logo"
             class="w-3/10 max-w-3/10 absolute top-16/100 left-1/2 transform -translate-x-1/2 rounded-12px"
             :src="cardDetail.logo" alt="">
        <img v-else
             class="w-3/10 max-w-3/10 absolute top-16/100 left-1/2 transform -translate-x-1/2 rounded-12px"
             src="~@/assets/red-envelope/mystery-logo.png" alt="">
        <div class="absolute top-40/100 left-1/2 transform -translate-x-1/2 brand-name
                          text-14px lg:text-16px font-bold">
          {{cardDetail.brandName || 'Wormhole3'}}
        </div>
        <div v-if="!cardDetail.brandName || (!cardDetail.tokenSymbol && cardDetail.nftId === 0)"
              class="absolute top-53/100 left-1/2 transform -translate-x-1/2
              font-bold text-12px xl:text-14px">
          Congrats!<br>
          Power Up!
        </div>
        <div v-else-if="cardDetail.prizeType === 1"
              class="absolute top-55/100 left-1/2 transform -translate-x-1/2
              font-bold text-12px xl:text-14px">
        + {{ cardDetail.amount }} {{ cardDetail.tokenSymbol }}
        </div>
        <div v-else-if="cardDetail.prizeType === 2"
              class="absolute top-55/100 left-1/2 transform -translate-x-1/2 amount
              font-bold text-12px xl:text-14px">
          + 1 NFT
        </div>
        <div v-else-if="cardDetail.prizeType === 3"
              class="absolute top-55/100 left-1/2 transform -translate-x-1/2 amount
              font-bold text-12px xl:text-14px">
          + {{ cardDetail.amount  }} NFT
        </div>
      </div>
      <div class="px-15px sm:px-1/10 whitespace-pre-line leading-20px mt-1rem">
        {{cardDetail.brandDesc}}
      </div>
      <button class="bg-colorBlue gradient-btn-disabled-grey mt-1.5rem mx-auto
                     flex items-center justify-center whitespace-nowrap px-20px
                     min-w-10rem rounded-full h-44px 2xl:h-2.2rem text-white font-bold"
              @click="onShare">
        <img class="w-20px mr-10px" src="~@/assets/icon-twitter-white.svg" alt="">
        {{$t('ny.shareTweet')}}
        <c-spinner v-show="shareLoading" class="w-16px h-16px 2xl:w-1rem 2xl:h-1rem ml-0.5rem"></c-spinner>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "MysteryCardDetailModal",
  props: {
    cardDetail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      flipCard: true,
      shareLoading: false
    }
  },
  methods: {
    onShare() {
      window.open(`https://twitter.com/intent/tweet?text=I opened a ${this.cardDetail.weights}X mystery card in the @wormhole_3 Lunar New Year campaign, Come join us here: https://alpha.wormhole3.io.`)
      this.$emit('close')
    },
  }
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

</style>
