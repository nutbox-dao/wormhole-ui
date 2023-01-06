<template>
  <div class="p-2rem">
    <div class="c-text-black text-1.6rem">Tips</div>
    <div class="text-15px leading-1.5rem text-left xl:text-0.75rem text-color8B light:text-color7D my-1.5rem">
      提示内容：xxx
    </div>
    <button class="gradient-btn w-full h-44px 2xl:h-2.2rem rounded-full c-text-black text-18px 2xl:text-0.9rem"
            @click="$emit('onPost')">
      Post
    </button>
    <div class="underline mt-1.5rem c-text-black text-15px 2xl:text-0.75rem cursor-pointer"
         @click="$emit('close')">Cancel</div>
  </div>
</template>

<script>
export default {
  name: "CreatedTipModal"
}
</script>

<style scoped>

</style>
