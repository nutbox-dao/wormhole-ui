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
      <!-- <button class="h-full px-5px 2md:px-10px whitespace-nowrap"
              :class="tabIndex===1?'c-active-tab text-color62':'text-color7D'"
              @click="tabIndex=1">
        Tweet & Promote
      </button> -->
    </div>
    <div class="container mx-auto max-w-50rem flex-1 overflow-auto no-scroll-bar">
      <CreatePost/>
      <!-- <CreateRecommend v-if="tabIndex===1"/> -->
    </div>
  </div>
</template>

<script>
import CreateRecommend from "@/views/create/CreateRecommend.vue";
import CreatePost from "@/views/create/CreatePost.vue";
import { mapState, mapGetters } from 'vuex'
import { getCommunities } from '@/api/api'

export default {
  name: "CreateView",
  components: {CreateRecommend, CreatePost},
  data() {
    return {
      tabIndex: 0
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo']),
    ...mapState('community', ['communities'])
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

    if (!this.communities || this.communities.length === 0) {
      getCommunities(this.getAccountInfo?.twitterId).then(coms => {
        if (coms && coms.length > 0) {
          this.$store.commit('community/saveCommunities', coms);
        }
      }).catch(e => {
        console.log('get all communities fail', e);
      })
    }
  },
}
</script>

<style scoped>

</style>
