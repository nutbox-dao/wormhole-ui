<template>
  <van-pull-refresh class="h-full min-h-full overflow-auto"
                    v-model="refreshing"
                    @refresh="onRefresh"
                    :loading-text="$t('common.loading')"
                    :pulling-text="$t('common.pullRefresh')"
                    :loosing-text="$t('common.loosingRefresh')">
    <van-list :loading="listLoading"
              :finished="listFinished"
              :immediate-check="false"
              :loading-text="$t('common.loading')"
              :finished-text="listData.length!==0?$t('common.noMore'):''"
              @load="onLoad">
      <div v-for="i of 20" :key="i"
           class="flex items-center px-15px">
        <img class="w-40px h-40px min-w-40px mr-10px"
             src="~@/assets/icon-quote-circle-active.svg" alt="">
        <div class="flex-1 flex flex-col items-start py-20px border-b-1 border-color8B/30 light:border-color7F">
          <div class="w-full mb-4px flex items-end justify-between">
            <span class="c-text-black text-14px">互动消息</span>
            <span class="text-12px text-color7D">21:25</span>
          </div>
          <div class="text-12px text-color7D">大头等13人点赞了你的策展</div>
        </div>
      </div>
    </van-list>
  </van-pull-refresh>
</template>

<script>

export default {
  name: "InteractiveList",
  data() {
    return {
      refreshing: false,
      listLoading: false,
      listFinished: true,
      listData: []
    }
  },
  methods: {
    onRefresh() {

    },
    onLoad() {

    }
  }
}
</script>

<style scoped>

</style>
