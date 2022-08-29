<template>
  <div>
    <div class="c-text-black text-1.6rem">Send Tokens</div>
    <div class="text-15px leading-1.5rem text-left xl:text-0.75rem text-color8B my-1.5rem">
      Since the reward of this quest includes tokens, it is necessary to enter the tokens (100 ETH)
      into the bonus vault in advance. After the Quest ends,
      eligible questers will be able to claim the rewards.
    </div>
    <button class="gradient-btn w-full h-55px 2xl:h-2.8rem max-w-300px rounded-full c-text-black text-18px 2xl:text-0.9rem"
            @click="$emit('confirmApprove')">
      Approve Pool
    </button>
    <div class="underline mt-1.5rem c-text-black text-15px 2xl:text-0.75rem"
         @click="$emit('close')">Back to edit</div>
  </div>
</template>

<script>
export default {
  name: "SendTokenTip"
}
</script>

<style scoped>

</style>
