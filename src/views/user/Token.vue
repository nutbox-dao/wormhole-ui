<template>
  <div class="pb-2rem">
    <div class="flex justify-between items-center my-0.8rem" v-for="i of 10" :key="i">
      <div class="flex items-center">
        <img class="w-5rem h-5rem rounded-full border-1px border-dark-400"
             src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png" alt="">
        <div class="text-left ml-1rem">
          <div class="c-text-black text-1.4rem">Solana</div>
          <div class="text-text8F">0 SOL</div>
        </div>
      </div>
      <div class="text-1.8rem c-text-medium font-bold gradient-text gradient-text-bottom">$0.00</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Token",
  data() {
    return {

    }
  }
}
</script>

<style scoped>

</style>
