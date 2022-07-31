<template>
  <div class="container mx-auto max-w-50rem pb-2rem md:px-1rem">
    <template v-if="currentShowingDetail">
      <div class="px-0.725rem relative h-3.5rem flex items-center justify-center mb-1rem">
        <img class="absolute left-1rem top-1/2 transform -translate-y-1/2 rotate-180 md:w-2.5rem w-2rem cursor-pointer"
             @click="$router.back()"
             src="~@/assets/icon-forward-circle.svg" alt="">
        <div class="c-text-bold text-1.2rem">Post</div>
      </div>
      <div class="md:bg-blockBg rounded-12px">
        <van-list :loading="listLoading"
                  :finished="listFinished"
                  :immediate-check="false"
                  :finished-text="'没有更多了'"
                  @load="onLoad">
          <Blog :post="currentShowingDetail" :isDetail='true'/>
          <div v-if="comments && comments.length > 0" class="px-1.5rem pt-1rem border-t-1 border-white/20 md:border-listBgBorder">
            <div class="c-text-bold text-left text-1.2rem">Comments ( {{ comments ? comments.length : 0 }} )</div>
            <div class="mt-1rem" v-for="c of (comments || [])" :key="c.commentId">
              <Comment class="py-0.5rem" :comment="c"/>
            </div>
          </div>
        </van-list>
      </div>
    </template>

  </div>
</template>

<script>
import Blog from "@/components/Blog";
import Comment from '@/views/user/components/Comment'
import { mapState, mapGetters } from 'vuex'
import { getPostById, getCommentsByPostid } from '@/api/api'
import { getPosts } from '@/utils/steem'

export default {
  name: "PostDetail",
  components: {Blog, Comment},
  computed: {
    ...mapState('postsModule', ['currentShowingDetail']),
    ...mapGetters(['getAccountInfo'])
  },
  data() {
    return {
      listLoading: false,
      listFinished: false,
      refreshing: false,
      list: [1,2,3,4],
      comments: []
    }
  },
  mounted() {
    const postId = this.$route.params.postId
    // this.onLoad()
    if (!this.currentShowingDetail) {
      // get post
      getPostById(postId).then(async (p) => {
        const posts = await getPosts([p])
        this.$store.commit('postsModule/saveCurrentShowingDetail', posts[0])
        getCommentsByPostid(postId).then(async comments => {
          this.comments = await getPosts(comments.map(c => ({
            ...c,
            postId: c.commentId
          })))
        })
      })
    }else {
      getCommentsByPostid(postId).then(async comments => {
        this.comments = await getPosts(comments.map(c => ({
            ...c,
            postId: c.commentId
          })))
      })
    }
  },
  methods: {
    getData() {
      return new Promise(resolve => {
        const list = []
        setTimeout(() => {
          for (let i = 0; i < 4; i++) {
            list.push(list.length + 1);
          }
          resolve(list)
        }, 3000);
      })
    },

    // async onLoad() {
    //   if(this.listLoading || this.listFinished) return
    //   this.listLoading = true
    //   const res = await this.getData()
    //   if(this.refreshing) this.list = []
    //   this.listLoading = false
    //   this.refreshing = false
    //   this.list = this.list.concat(res)
    //   // 加载完成
    //   if (this.list.length >= 10) this.listFinished = true
    // },
    // onRefresh() {
    //   this.listFinished = false
    //   this.onLoad()
    // }
  },
  beforeDestroy () {
    this.$store.commit('postsModule/saveCurrentShowingDetail', null)
  },
}
</script>

<style scoped>

</style>
