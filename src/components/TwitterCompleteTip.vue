<template>
  <div class="px-2rem">
    <div class="c-text-black text-1.6rem">Tips</div>
    <div class="text-15px leading-1.5rem text-left xl:text-0.75rem text-color8B my-1.5rem">
      Curation will start after the server completes the successful verification of the tweeted content.
    </div>
    <button class="gradient-btn w-full h-55px 2xl:h-2.8rem max-w-300px rounded-full c-text-black text-18px 2xl:text-0.9rem"
            @click="$emit('confirmComplete')">
      Tweet completed
    </button>
    <div class="underline mt-1.5rem c-text-black text-15px 2xl:text-0.75rem"
         @click="$emit('close')">Tweet later</div>
  </div>
</template>

<script>
export default {
  name: "TwitterCompleteTip"
}
</script>

<style scoped>

</style>
