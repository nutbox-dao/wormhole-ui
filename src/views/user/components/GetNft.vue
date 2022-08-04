<template>
  <div class="bg-black border-1 border-dividerColor rounded-12px text-white md:max-w-28rem mx-auto">
    <div class="box-view relative celebration-bg">
      <div class="relative z-2 py-2rem">
        <img class="absolute right-1rem top-1rem w-1rem cursor-pointer"
             @click="$emit('close')"
             src="~@/assets/icon-close-white.svg" alt="">
        <img class="w-14rem h-14rem rounded-full border-0.35rem gradient-border mx-auto mb-1.5rem"
             src="~@/assets/icon-default-avatar.svg" alt="">
        <div class="c-text-bold text-1.4rem">Twitter Reputation NFT</div>
        <div class="mt-0.5rem">from @wormhole3 official</div>
      </div>

    </div>
    <div class="bg-text2C px-2.5rem py-1.5rem relative z-2">
      <div class="mb-1rem text-1rem leading-2rem text-color8B">A NFT that shows your social influence on Twitter</div>
      <button class="h-2.8rem px-1rem w-full gradient-btn gradient-btn-purple rounded-full font-700 text-1.4rem" @click="$emit('close')">Got it</button>
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
.box-view {
  background-image: url("~@/assets/modal-bg1.svg"), linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.11) 100%);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
</style>
