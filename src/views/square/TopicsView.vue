<template>
  <div class="container mx-auto max-w-50rem pb-2rem">
    <div class="px-0.725rem relative h-3.5rem flex items-center justify-center mb-1rem">
      <img class="absolute left-1rem top-1/2 transform -translate-y-1/2 rotate-180 md:w-2.5rem w-2rem cursor-pointer"
           @click="$router.back()"
           src="~@/assets/icon-forward-circle.svg" alt="">
      <div class="c-text-bold text-1.2rem">More topics</div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-1rem sm:px-1.5rem">
      <div v-for="(v,k,i) in tagsAggregation" :key="i" @click="choseIndex(i)"
           class="md:col-span-1 bg-blockBg rounded-1rem py-1rem px-1.5rem cursor-pointer transform hover:scale-105">
        <div class="flex justify-between items-center">
          <div class="text-1rem leading-1.5rem c-text-bold text-left">
            <span class="text-primaryColor mr-0.5rem">#</span>
            <span class="">{{k}}</span>
          </div>
          <span class="text-primaryColor text-1.2rem c-text-bold">{{v}}</span>
        </div>
        <div class="flex justify-between items-center my-0.5rem">
          <div class="flex items-center text-1rem leading-1.4rem text-left">
            <!-- <img class="w-1.2rem mr-0.5rem" src="~@/assets/icon-coin-primary.svg" alt="">
            <span class="">$1,288.66</span> -->
          </div>
          <span class="text-primaryColor text-0.8rem">Posts</span>
        </div>
        <div class="text-left text-0.7rem leading-1.2rem">
          Utopianism, some argue, is essential for the improvement of the human condition.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: "TopicsView",
  computed: {
    ...mapState('postsModule', ['tagsAggregation'])
  },
  methods: {
    choseIndex(i) {
      this.$store.commit('postsModule/saveCurrentTagIndex', i)
      this.$router.go(-1)
    }
  },
}
</script>

<style scoped>

</style>
