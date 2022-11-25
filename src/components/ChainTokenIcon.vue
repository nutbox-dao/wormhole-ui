<template>
  <div class="flex items-end relative" :style="{height: height, width: width}">
    <img class="w-full h-full" src="~@/assets/token-usdt.svg" alt="">
    <img class="absolute bottom-0 right-0 w-1/3 h-1/3" src="~@/assets/icon-eth-white.svg" alt="">
  </div>
</template>

<script>
export default {
  name: "ChainTokenIcon",
  props: {
    width: {
      type: String,
      default: '4rem'
    },
    height: {
      type: String,
      default: '4rem'
    }
  }
}
</script>

<style scoped>

</style>
