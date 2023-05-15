<template>
  <div>
    <van-list :loading="listLoading"
              :finished="listFinished"
              :immediate-check="false"
              :loading-text="$t('common.loading')"
              :finished-text="postList.length!==0?$t('common.noMore'):''"
              @load="onLoad">
      <van-swipe :loop="false" :width="300">
        <van-swipe-item>1</van-swipe-item>
        <van-swipe-item>2</van-swipe-item>
        <van-swipe-item>3</van-swipe-item>
        <van-swipe-item>4</van-swipe-item>
      </van-swipe>
    </van-list>
  </div>
</template>

<script>
export default {
  name: "CommunityPost",
  data() {
    return {
      listLoading: false,
      listFinished: false,
      postList: []
    }
  },
  methods: {
    onLoad() {

    }
  }
}
</script>

<style scoped>

</style>
