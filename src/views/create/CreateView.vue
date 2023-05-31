<template>
  <div class="text-14px xl:text-0.8rem h-full flex flex-col">
    <div class="flex items-center justify-center gap-30px h-48px text-14px 2md:text-18px font-bold
                  border-b-0.5px border-color8B/30 light:border-color7F
                  px-15px w-min min-w-full">
      <button class="h-full px-5px 2md:px-10px whitespace-nowrap"
              :class="tabIndex===0?'c-active-tab text-color62':'text-color7D'"
              @click="tabIndex=0">
        Tweet on-chain
      </button>
      <button class="h-full px-5px 2md:px-10px whitespace-nowrap"
              :class="tabIndex===1?'c-active-tab text-color62':'text-color7D'"
              @click="tabIndex=1">
        Tweet & Promote
      </button>
    </div>
    <div class="container mx-auto max-w-50rem flex-1 overflow-auto no-scroll-bar">
      <CreatePost v-if="tabIndex===0"/>
      <!-- <CreateCuration v-if="tabIndex===1"/> -->
      <CreateRecommend v-if="tabIndex===1"/>
    </div>
  </div>
</template>

<script>
import CreateRecommend from "@/views/curations/CreateRecommend.vue";
import CreatePost from "@/components/CreatePost.vue";
import CreateCuration from "@/views/curations/CreateCuration.vue";
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
      this.tabIndex = 1
      return;
    }
    const { communityId, promoteUrl } = this.$route.query;
    if (communityId && promoteUrl) {
      this.tabIndex = 1;
    }
  },
}
</script>

<style scoped>

</style>
