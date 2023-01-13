<template>
  <div class="relative text-left pb-3rem flex flex-col text-14px 2xl:text-0.8rem bg-white text-blueDark">
    <button class="absolute right-20px top-20px"
            @click="$emit('close')">
      <img class="w-26px h-26px min-w-26px" src="~@/assets/red-envelope/icon-close.svg" alt="">
    </button>
    <div class="mx-auto c-text-black text-20px xl:text-1.2rem mt-3rem mb-2rem">
      {{$t('ny.redeemCards')}}
    </div>
    <div class="px-20px xs:px-1/10 leading-20px">
      {{$t('ny.redeemCardDesc', {totalNum: '100', notOpenNum: '52'})}}
    </div>
    <button class="ny-gradient-btn gradient-btn-disabled-grey mt-2rem mx-auto
                   flex items-center justify-center px-20px
                   min-w-10rem rounded-full h-44px 2xl:h-2.2rem text-white font-bold"
            @click="onRedeem">
      {{$t('ny.redeem')}}
      <c-spinner v-show="loading" class="w-16px h-16px 2xl:w-1rem 2xl:h-1rem ml-0.5rem"></c-spinner>
    </button>
  </div>
</template>

<script>
export default {
  name: "RedeemCardModal",
  data() {
    return {
      loading: false
    }
  },
  methods: {
    onRedeem() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>

</style>
