<template>
  <div class="p-2rem">
    <div class="c-text-black text-1.6rem">Reply to the tweet</div>
    <div class="text-15px leading-1.5rem text-left xl:text-0.75rem text-color8B light:text-color7D my-1.5rem">
      Reply to this tweet to notify the author that you have create a curation for it. 
    </div>
    <button class="gradient-btn w-full h-44px 2xl:h-2.2rem rounded-full
                   flex items-center justify-center
                   c-text-black text-18px 2xl:text-0.9rem"
          :disabled="isRepling"
          @click="isRepling=true; $emit('onPost')">
      Send
      <c-spinner v-show="isRepling" class="w-16px h-16px 2xl:w-1rem 2xl:h-1rem ml-0.5rem"></c-spinner>
    </button>
    <div class="underline mt-1.5rem c-text-black text-15px 2xl:text-0.75rem cursor-pointer"
        :disabled="isRepling"
         @click="$emit('close')">Cancel</div>
  </div>
</template>

<script>
export default {
  name: "CreatedTipModal",
  data() {
    return {
      isRepling: true
    }
  },
}
</script>

<style scoped>

</style>
