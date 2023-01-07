<template>
  <div class="pb-2rem relative">
    <div class="grid grid-cols-2 xs:grid-cols-4 gap-1rem py-1rem">
      <div class="col-span-1" v-for="(item, index) of cards" :key="index">
        <div class="relative">
          <img class="w-full" src="~@/assets/red-envelope/card-default.png" alt="">
          <div class="absolute top-5px left-10px font-bold text-shadow-lg opacity-70">{{item.label}}</div>
          <div class="absolute text-60px top-1/2 left-1/2 opacity-70
                      transform -translate-x-1/2 -translate-y-1/2 text-shadow-lg">?</div>
          <div class="absolute bottom-10px right-15px text-shadow-lg font-bold opacity-70">
            Balance: {{item.balance}}
          </div>
        </div>
        <div class="flex gap-5px mx-10px">
          <button class="flex-1 h-24px border-1 border-color8B/30 rounded-4px">Give</button>
          <button class="flex-1 h-24px border-1 border-color8B/30 rounded-4px">Ask</button>
        </div>
      </div>
    </div>
    <div class="flex justify-center">
      <div class="w-1/2 xs:w-1/4 px-0.5rem">
        <div class="relative">
          <img class="w-full" src="~@/assets/red-envelope/card0.png" alt="">
          <div class="absolute top-5px left-20px font-bold text-shadow-lg opacity-70">Leek Rabbit</div>
          <div class="absolute text-60px top-1/2 left-1/2 opacity-70
                      transform -translate-x-1/2 -translate-y-1/2 text-shadow-lg">?</div>
          <div class="absolute bottom-15px right-25px text-shadow-lg font-bold opacity-70">
            Balance: 0
          </div>
        </div>
        <div class="flex gap-5px mx-10px">
          <button class="flex-1 h-24px border-1 border-color8B/30 rounded-4px">Give</button>
          <button class="flex-1 h-24px border-1 border-color8B/30 rounded-4px">Buy</button>
        </div>
      </div>
    </div>
    <button class="absolute right-20px bottom-2rem">
      <img class="w-40px " src="~@/assets/red-envelope/icon-box.png" alt="">
    </button>
  </div>
</template>

<script>
export default {
  name: "BlessingCards",
  data() {
    return {
      cards: [
        {label: 'SBF Rabbit', balance: 0},
        {label: 'MashiMaro', balance: 0},
        {label: 'BTC Rabbit', balance: 0},
        {label: 'Rabbit Trader', balance: 0},
      ]
    }
  }
}
</script>

<style scoped>

</style>
