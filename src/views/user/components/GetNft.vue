<template>
  <div class="bg-text2C text-white">
    <div class="bg-color1E relative celebration-bg">
      <div class="relative z-2 py-2rem">
        <img class="absolute right-1rem top-1rem w-1rem cursor-pointer"
             @click="$emit('close')"
             src="~@/assets/icon-close-white.svg" alt="">
        <img class="w-12rem h-12rem rounded-full border-3px gradient-border mx-auto mb-2rem"
             src="~@/assets/icon-default-avatar.svg" alt="">
        <div class="c-text-bold text-1.4rem">Twitter Reputation NFT</div>
        <div class="mt-0.5rem">from @wormhole3 official</div>
      </div>

    </div>
    <div class="bg-text2C px-2.5rem py-1.5rem relative z-2">
      <div class="mb-1rem text-1.2rem leading-2rem">A NFT that shows your social influence on Twitter</div>
      <button class="h-2.5rem px-1rem min-w-10rem border-1 border-white/20 rounded-full font-700 text-1.4rem" @click="$emit('close')">Got it</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "GetNft",
  data() {
    return {
      showAnimation: true
    }
  }
}
</script>

<style scoped lang="scss">
</style>
