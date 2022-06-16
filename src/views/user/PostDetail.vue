<template>
  <div>
    <div class="text-left mb-1.5rem flex items-center w-max cursor-pointer" @click="$router.back()">
      <img class="w-1.4rem"
           src="~@/assets/icon-back.svg" alt="">
      <span class="c-text-medium">返回</span>
    </div>
    <Blog/>
    <div class="mt-1rem" v-for="i of commentList" :key="i">
      <Comment/>
    </div>
    <c-spinner class="w-2.4rem h-2.4rem mx-auto" v-show="loading"></c-spinner>
    <button v-show="!loading && !finished"
            class="text-center my-1rem" v-if="!finished" @click="loadMore">加载更多</button>
  </div>
</template>

<script>
import Blog from "@/views/user/components/Blog";
import Comment from '@/views/user/components/Comment'
export default {
  name: "PostDetail",
  components: {Blog, Comment},
  data() {
    return {
      loading: false,
      finished: false,
      commentList: [1, 2, 3, 4]
    }
  },
  methods: {
    loadMore(){
      this.loading = true
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.commentList.push(this.commentList.length + 1);
        }
        this.loading = false
        if (this.commentList.length >= 40) {
          this.finished = true;
        }
      }, 2000);
    }
  }
}
</script>

<style scoped>

</style>
