<template>
  <div class="pb-4rem w-full">
    <div class="bg-blockBg md:py-1.5rem rounded-12px md:my-2rem my-1.5rem">
      <div class="px-1.5rem border-b-1px border-white/20 sm:border-b-0 py-0.8rem text-14px flex flex-wrap gap-x-1.5rem gap-y-0.8rem ">
              <span v-for="(tag, index) of subTagList" :key="index"
                    class="leading-30px whitespace-nowrap px-0.6rem rounded-full font-500 h-30px cursor-pointer"
                    :class="subActiveTagIndex===index?'bg-primaryColor':'border-1 border-white/40 text-color84'"
                    @click="subActiveTagIndex=index">{{tag}}</span>
      </div>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh"
                        loading-text="Loading"
                        pulling-text="Pull to refresh data"
                        loosing-text="Release to refresh">
        <van-list :loading="loading"
                  :finished="finished"
                  :immediate-check="false"
                  :finished-text="$t('common.noMore')"
                  @load="onLoad">

          <div v-if="list.length===0 && !refreshing" class="py-3rem bg-blockBg rounded-12px">
            <div class="c-text-black text-zinc-700 text-2rem mb-2rem">{{$t('common.none')}}</div>
          </div>
          <CurationItem v-for="i of list" :key="i" class="cursor-pointer">
            <template v-if="subActiveTagIndex===1" #status>
              <div class="ml-0.5rem 2xl:text-0.75rem c-text-black">
                <div v-if="(i%2)===0"
                     class="px-13px py-5px rounded-full border-1 border-color8B text-color8B">
                  Not tweeted
                </div>
                <button v-else
                        class="px-13px py-5px rounded-full border-1 border-white"
                        @click="$router.push('/confirm-reward')">
                  Confirm Reward
                </button>
              </div>
            </template>
          </CurationItem>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import CurationItem from "@/components/CurationItem";
export default {
  name: "Curations",
  components: {CurationItem},
  data() {
    return {
      subTagList: ['Attended', 'Created'],
      subActiveTagIndex: 0,
      refreshing: true,
      loading: false,
      finished: false,
      pageSize: 10,
      list: []
    }
  },
  mounted() {
    this.onLoad()
  },
  methods: {
    onRefresh() {
      this.finished = false;
      this.loading = true;
      this.onLoad();
    },
    onLoad() {
      if(this.loading || this.finished) return
      this.loading = true
      setTimeout(() => {
        for (let i = 0; i < this.pageSize; i++) {
          this.list.push(this.list.length + 1);
        }
        this.loading = false;
        if (this.list.length >= 40) {
          this.finished = true;
        }
      }, 2000);
    }
  }
}
</script>

<style scoped>

</style>
