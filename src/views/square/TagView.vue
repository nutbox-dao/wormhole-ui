<template>
  <div class="container mx-auto max-w-960px pb-2rem">
    <van-list :loading="listLoading"
              :finished="listFinished"
              :immediate-check="false"
              :finished-text="'没有更多了'"
              @load="onLoad">
      <div class="px-1.5rem">
        <img class="transform rotate-180 w-3rem mt-1rem cursor-pointer"
             @click="$router.back()"
             src="~@/assets/icon-forward-circle.svg" alt="">
        <div class="mt-1rem text-2rem leading-2.4rem c-text-bold text-left">
          <span class="text-primaryColor mr-0.5rem">#</span>
          <span class="">dutopian</span>
        </div>
        <div class="text-white/40 mt-10px text-left">
          Utopianism, some argue, is essential for the improvement of the human condition.
        </div>
      </div>
      <div class="border-b-1px border-white/20 px-1.5rem py-0.8rem text-14px flex flex-wrap gap-x-1.5rem gap-y-0.8rem ">
      <span v-for="(tag, index) of subTagList" :key="index"
            class="leading-30px whitespace-nowrap px-0.6rem rounded-full font-500 h-30px"
            :class="subActiveTagIndex===index?'bg-primaryColor':'border-1 border-white/40'"
            @click="subActiveTagIndex=index">{{tag}}</span>
      </div>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <div class="" v-for="p of list" :key="p.postId">
          <Blog :post="p"/>
        </div>
      </van-pull-refresh>
    </van-list>
  </div>
</template>

<script>
import Blog from "@/components/Blog";
import { mapState } from 'vuex'

export default {
  components: {Blog},
  data() {
    return {
      tagList: ['All'],
      activeTagIndex: 0,
      subTagList: ['Trending', 'New'],
      subActiveTagIndex: 0,
      listLoading: false,
      listFinished: false,
      refreshing: false,
      list: [],
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
  computed: {
    ...mapState('postsModule', ['tagsAggregation'])
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
            list.push(this.testData);
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
