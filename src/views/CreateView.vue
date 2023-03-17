<template>
  <div class="text-14px xl:text-0.8rem">
    <div class="border-b-1 border-color84/30 light:border-colorF4 sticky -top-0 z-2 bg-primaryBg light:bg-white">
      <div class="relative container mx-auto max-w-50rem md:px-1rem px-15px pt-25px
                  flex items-center justify-between text-16px xl:text-0.9rem font-bold">
        <button class="flex-1 h-40px xl:h-2.4rem c-text-black border-b-4"
                :class="tabIndex===0?'border-color62 text-color62':'border-transparent'"
                @click="tabIndex=0">
          Post
        </button>
        <button class="flex-1 h-40px xl:h-2.4rem c-text-black border-b-4"
                :class="tabIndex===1?'border-color62 text-color62':'border-transparent'"
                @click="tabIndex=1">
          Curations
        </button>
        <button class="flex-1 h-40px xl:h-2.4rem c-text-black border-b-4"
                :class="tabIndex===2?'border-color62 text-color62':'border-transparent'"
                @click="tabIndex=2">
          Recommend
        </button>
      </div>
    </div>
    <div class="container mx-auto max-w-50rem">
      <CreatePost v-if="tabIndex===0"/>
      <CreateCuration v-if="tabIndex===1"/>
      <CreateRecommend v-if="tabIndex===2"/>
    </div>
  </div>
</template>

<script>
import CreateRecommend from "@/views/curations/CreateRecommend";
import CreatePost from "@/components/CreatePost";
import CreateCuration from "@/views/curations/CreateCuration";
export default {
  name: "CreateView",
  components: {CreateRecommend, CreatePost, CreateCuration},
  data() {
    return {
      tabIndex: 0
    }
  },
  mounted () {
    if(history.state.author && history.state.type === 'tweet') {
      this.tabIndex = 2
    }else if(history.state.author && history.state.type === 'curation') {
      this.tabIndex = 1
    }
  },
}
</script>

<style scoped>

</style>
