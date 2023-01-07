<template>
  <div class="relative text-left pb-3rem sm:pb-1.5rem  flex flex-col text-14px 2xl:text-0.8rem overflow-auto">
    <button class="absolute right-20px top-20px"
            @click="$emit('close')">
      <i class="w-18px h-18px 2xl:w-1rem 2xl:h-1rem icon-close"></i>
    </button>
    <div class="mx-auto c-text-black text-20px xl:text-1.2rem mt-3rem">
      {{$t('ny.buyCard')}}
    </div>
    <div class="w-240px mx-auto mt-3rem">
      <div class="relative">
        <img class="w-full" src="~@/assets/red-envelope/card0.png" alt="">
        <div class="absolute top-15px left-20px font-bold text-shadow-lg opacity-70 text-white">Leek Rabbit</div>
        <div class="absolute bottom-30px right-30px text-shadow-lg font-bold text-white opacity-70">
          Balance: 0
        </div>
      </div>
      <div class="flex justify-between items-center mt-1rem px-15px">
        <div class="w-1/2">
          <el-input-number class="c-number-input w-full" v-model="buyNum" :step="1" step-strictly/>
        </div>
        <div>{{buyAmount}} USDT</div>
      </div>
    </div>
    <div class="text-center my-2rem">
      <button class="gradient-bg gradient-btn-disabled-grey w-10rem h-44px 2xl:h-2.2rem
                     text-white rounded-12px font-bold">
        {{$t('ny.buy')}}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "BuyCardModal",
  computed: {
    buyAmount () {
      return (this.buyNum * 0.1).toFixed(1)
    }
  },
  data() {
    return {
      buyNum: 1
    }
  }
}
</script>

<style scoped>

</style>
