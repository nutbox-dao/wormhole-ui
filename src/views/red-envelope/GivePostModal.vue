<template>
  <div class="relative text-left pb-3rem sm:pb-1.5rem  flex flex-col text-14px 2xl:text-0.8rem h-max">
    <button class="absolute right-20px top-20px"
            @click="$emit('close')">
      <i class="w-18px h-18px 2xl:w-1rem 2xl:h-1rem icon-close"></i>
    </button>
    <div class="mx-auto c-text-black text-20px xl:text-1.2rem mt-3rem mb-2rem">

    </div>
  </div>
</template>

<script>
export default {
  name: "GivePostModal"
}
</script>

<style scoped>

</style>
