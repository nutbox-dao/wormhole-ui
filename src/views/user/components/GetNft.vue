<template>
  <div class="bg-black border-1 border-dividerColor rounded-20px text-white md:max-w-23rem mx-auto">
    <div class="box-view relative celebration-bg">
      <div class="relative z-2 py-12px 2xl:py-0.6rem">
        <img class="absolute right-1rem top-1rem w-1rem cursor-pointer"
             @click="$emit('close')"
             src="~@/assets/icon-close-white.svg" alt="">
        <img class="w-12rem h-12rem 2xl:w-15rem 2xl:h-15rem rounded-full border-0.35rem gradient-border mx-auto mb-1.5rem"
             src="~@/assets/icon-default-avatar.svg" alt="">
        <div class="c-text-bold text-18px 2md:text-1rem">Twitter Reputation NFT</div>
        <div class="mt-0.5rem">from @wormhole3 official</div>
      </div>

    </div>
    <div class="bg-text2C px-2.5rem py-1.5rem relative z-2">
      <div class="mb-1rem text-15px leading-24px 2xl:text-1rem 2xl:leading-1.6rem text-color8B break-words">
        {{$t('profileView.getNftP1')}}
      </div>
      <button class="h-2.8rem px-1rem w-full gradient-btn gradient-btn-purple rounded-full text-15px leading-24px 2xl:text-1rem 2xl:leading-1.6rem" @click="$emit('close')">Got it</button>
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
