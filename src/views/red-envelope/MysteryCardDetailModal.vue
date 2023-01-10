<template>
  <div class="relative text-left pb-3rem flex flex-col text-14px 2xl:text-0.8rem">
    <button class="absolute right-20px top-20px"
            @click="$emit('close')">
      <i class="w-18px h-18px 2xl:w-1rem 2xl:h-1rem icon-close"></i>
    </button>
    <div class="mx-auto c-text-black text-20px xl:text-1.2rem my-3rem">
      {{$t('ny.mysteryCards')}}
    </div>
    <div class="flex flex-col justify-center items-center relative">
      <div class="card-container w-28vh h-45vh min-w-200px min-h-300px max-h-380px relative">
        <div class="mystery-card cursor-pointer w-full h-full flipped">
          <div class="back absolute">
            <div class="relative text-white">
              <img class="w-full cursor-pointer" src="~@/assets/red-envelope/mystery-card-back.png" alt="">
              <img class="w-4/5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-12px"
                   src="~@/assets/red-envelope/mystery-logo.png" alt="">
              <div class="absolute top-20px right-20px text-20px font-bold text-shadow-lg opacity-70 text-white">
                + {{cardDetail.amount}} {{cardDetail.tokenName}}
              </div>
              <div class="absolute bottom-20px left-15px text-shadow-lg font-bold opacity-70">
                <div class="flex flex-col items-start">
                  <div class="flex items-center justify-center gap-4px">
                    <img v-for="star of cardDetail.power" :key="star"
                         class="text-shadow-lg w-14px"
                         src="~@/assets/red-envelope/icon-star.svg" alt="">
                  </div>
                  <div class="c-text-black text-shadow-lg text-16px">{{cardDetail.power}} {{$t('ny.power')}}</div>
                </div>
              </div>
              <div class="absolute bottom-20px right-20px text-16px text-shadow-lg font-bold opacity-70 text-white">
                {{cardDetail.brandName}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="px-15px sm:px-1/10 whitespace-pre-line leading-20px">
        {{cardDetail.desc}}
      </div>
      <button class="underline mt-20px font-bold" @click="$emit('close')">
        <img src="~@/assets/icon-twitter-blue.svg" alt="">
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
      flipCard: true
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
