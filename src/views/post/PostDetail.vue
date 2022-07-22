<template>
  <div class="container mx-auto max-w-49rem pb-2rem">
    <div class="px-0.725rem relative h-3.5rem flex items-center justify-center mb-1rem">
      <img class="absolute left-1rem top-0.5rem transform rotate-180 w-2.5rem cursor-pointer"
           @click="$router.back()"
           src="~@/assets/icon-forward-circle.svg" alt="">
      <div class="c-text-bold text-1.4rem">Post</div>
    </div>
    <van-list :loading="listLoading"
              :finished="listFinished"
              :immediate-check="false"
              :finished-text="'没有更多了'"
              @load="onLoad">
      <Blog :post="testData"/>
      <div class="px-1.5rem pt-1rem border-t-1 border-white/20">
        <div class="c-text-bold text-left">Comments ( 32 )</div>
        <div class="mt-1rem" v-for="i of list" :key="i">
          <Comment class="py-0.5rem"/>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
import Blog from "@/components/Blog";
import Comment from '@/views/user/components/Comment'
export default {
  name: "PostDetail",
  components: {Blog, Comment},
  data() {
    return {
      listLoading: false,
      listFinished: false,
      refreshing: false,
      list: [1,2,3,4],
      testData: {
        children: 0,
        content: "Siguniang mountain, here we are。 （ by https://t.co/ybMGq2pJM9）  https://t.co/549D352xTw\nhttps://pbs.twimg.com/media/FWd8DdiX0AAwfEN.jpg\nhttps://pbs.twimg.com/media/FWd8GByWAAAKHT1.jpg\nhttps://pbs.twimg.com/media/FWd8GCDXgAACfL4.jpg\nhttps://pbs.twimg.com/media/FWd8GCtWIAA-4pp.jpg",
        curatorPayoutValue: "0.574 SBD",
        name: "terry3t.eth",
        pendingPayoutValue: "0.000 SBD",
        postId: "1542338002818666496",
        postTime: "2022-06-30T02:43:29.000Z",
        steemId: "terry3t1493",
        tags: "[\"wormhole3\"]",
        totalPayoutValue: "0.574 SBD",
        username: "terry3t1",
        votes: 1
      }
    }
  },
  mounted() {
    this.onLoad()
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
    async onLoad() {
      if(this.listLoading || this.listFinished) return
      this.listLoading = true
      const res = await this.getData()
      if(this.refreshing) this.list = []
      this.listLoading = false
      this.refreshing = false
      this.list = this.list.concat(res)
      // 加载完成
      if (this.list.length >= 10) this.listFinished = true
    },
    onRefresh() {
      this.listFinished = false
      this.onLoad()
    }
  }
}
</script>

<style scoped>

</style>
