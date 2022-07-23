<template>
  <div class="container mx-auto max-w-49rem pb-2rem">
    <div class="px-0.725rem relative h-3.5rem flex items-center justify-center mb-1rem">
      <img class="absolute left-1rem top-0.5rem transform rotate-180 w-2.5rem cursor-pointer"
           @click="$router.back()"
           src="~@/assets/icon-forward-circle.svg" alt="">
      <div class="c-text-bold text-1.4rem">More topics</div>
    </div>
    <div v-for="i of 8" :key="i" class="bg-blockBg rounded-1rem py-1rem px-1.5rem mb-1rem">
      <div class="flex justify-between items-center">
        <div class="text-1.2rem leading-1.6rem c-text-bold text-left">
          <span class="text-primaryColor mr-0.5rem">#</span>
          <span class="">dutopian</span>
        </div>
        <span class="text-primaryColor text-1.6rem c-text-bold">315</span>
      </div>
      <div class="flex justify-between items-center my-0.5rem">
        <div class="flex items-center text-1rem leading-1.4rem text-left">
          <img class="w-1.2rem mr-0.5rem" src="~@/assets/icon-coin-primary.svg" alt="">
          <span class="">$1,288.66</span>
        </div>
        <span class="text-primaryColor text-1.3rem">Posts</span>
      </div>
      <div class="text-left text-1rem leading-1.4rem">
        Utopianism, some argue, is essential for the improvement of the human condition.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TopicsView"
}
</script>

<style scoped>

</style>
