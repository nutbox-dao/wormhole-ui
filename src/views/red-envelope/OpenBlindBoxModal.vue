<template>
  <div class="relative text-left pb-3rem sm:pb-1.5rem text-14px 2xl:text-0.8rem h-max">
    <button class="absolute right-20px top-20px"
            @click="$emit('close')">
      <i class="w-18px h-18px 2xl:w-1rem 2xl:h-1rem icon-close"></i>
    </button>
    <div v-if="step===0" class="mt-4rem text-center px-15px sm:px-1/10">
      <div class="grid grid-cols-2 gap-1rem relative">
        <div class="relative w-4/5 sm:2/3 mx-auto text-white" v-for="(item, index) of cards.slice(1)" :key="index">
          <img class="w-full" :src="item.img" alt="">
          <div class="absolute top-15px left-10px font-bold text-shadow-lg opacity-70">{{item.label}}</div>
          <div class="absolute bottom-20px right-15px text-shadow-lg font-bold opacity-70 text-white">
            {{$t('common.balance')}}: {{item.balance}}
          </div>
        </div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/5 sm:1/3 mx-auto text-white">
          <img class="w-full" :src="cards[0].img" alt="">
          <div class="absolute top-15px left-10px font-bold text-shadow-lg opacity-70">{{cards[0].label}}</div>
          <div class="absolute bottom-20px right-15px text-shadow-lg font-bold opacity-70 text-white">
            {{$t('common.balance')}}: {{cards[0].balance}}
          </div>
        </div>
      </div>
      <div class="opacity-40">动画待制作</div>
      <div class="mt-2rem">{{$t('ny.chanceTip', {count: 1})}}</div>
      <button class="bg-tag-gradient gradient-btn-disabled-grey mt-2rem mx-auto
                     flex items-center justify-center
                     min-w-10rem px-20px rounded-12px h-44px 2xl:h-2.2rem text-white font-bold"
              @click="onDrawCard">
        {{$t('ny.drawCard')}}
      </button>
    </div>
    <template v-if="step===1">
      <div class="gradient-text gradient-text-right mx-auto c-text-black text-20px xl:text-1.2rem my-3rem">
        {{$t('ny.congratulations')}}
      </div>
      <div class="flex flex-col justify-center items-center relative">
        <div class="card-container w-28vh h-45vh min-w-200px min-h-300px max-h-380px relative">
          <div class="mystery-card cursor-pointer w-full h-full"
               :class="flipCard?'flipped':''"
               @click="flipCard=!flipCard">
            <div class="front absolute">
              <div class="relative text-white">
                <img class="w-full cursor-pointer" src="~@/assets/red-envelope/mystery-card.png" alt="">
                <div class="absolute top-20px left-20px text-20px font-bold text-shadow-lg opacity-70 text-white">
                  {{$t('ny.mysteryCard')}}
                </div>
                <div class="absolute text-60px top-1/2 left-1/2 opacity-70
                      transform -translate-x-1/2 -translate-y-1/2 text-shadow-lg">
                  <div class="flex flex-col items-center">
                    <div class="flex items-center justify-center gap-4px">
                      <img v-for="i of starNum" :key="i"
                           class="text-shadow-lg"
                           src="~@/assets/red-envelope/icon-star.svg" alt="">
                    </div>
                    <div class="c-text-black text-120px text-shadow-lg">{{starNum}}</div>
                    <div class="c-text-black text-20px text-shadow-lg">Power</div>
                  </div>
                </div>
                <button class="absolute bottom-15px left-20px">
                  <img class="w-30px" src="~@/assets/red-envelope/icon-reverse.png" alt="">
                </button>
                <div class="absolute bottom-20px right-20px text-16px text-shadow-lg font-bold opacity-70 text-white">
                  Wormhole3
                </div>
              </div>
            </div>
            <div class="back absolute">
              <div class="relative text-white">
                <img class="w-full cursor-pointer" src="~@/assets/red-envelope/mystery-card-back.png" alt="">
                <img class="w-4/5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-12px"
                     src="~@/assets/red-envelope/mystery-logo.png" alt="">
                <div class="absolute top-20px right-20px text-20px font-bold text-shadow-lg opacity-70 text-white">
                  + 0.5 UNI
                </div>
                <button class="absolute bottom-15px left-20px">
                  <img class="w-30px" src="~@/assets/red-envelope/icon-reverse.png" alt="">
                </button>
                <div class="absolute bottom-20px right-20px text-16px text-shadow-lg font-bold opacity-70 text-white">
                  Uniswap
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="px-15px sm:px-1/10 whitespace-pre-line leading-20px">
          {{$t('ny.projectDesc')}}
        </div>
        <button class="bg-tag-gradient gradient-btn-disabled-grey mt-2rem mx-auto
                     flex items-center justify-center
                     min-w-10rem px-20px rounded-12px h-44px 2xl:h-2.2rem text-white font-bold"
                @click="$emit('close')">
          {{$t('ny.get')}}
        </button>
        <button class="underline mt-20px font-bold" @click="$emit('close')">
          {{$t('ny.checkCollections')}}
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

export default {
  name: "OpenBlindBoxModal",
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
      flipCard: false
    }
  },
  methods: {
    onDrawCard() {
      this.step=1
    }
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
