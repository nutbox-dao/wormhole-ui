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
import { getPostNotiByUserId } from '@/api/api'
import { mapState, mapGetters } from 'vuex';
import { notify } from '@/utils/notify';

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
  computed: {
    ...mapGetters(['getAccountInfo']),
    ...mapState('noti', ['postNotis'])
  },
  methods: {
    async onRefresh() {
      if (this.refreshing || this.listLoading) {
        return;
      }
      try{
        this.refreshing = true
        let cursorId = null;
        if (this.postNotis && this.postNotis.length > 0) {
          cursorId = this.postNotis[0].id
        }
        const noti = await getPostNotiByUserId(this.getAccountInfo.twitterId, cursorId, true);
        if (noti && noti.length >= 0) {
          this.$store.commit('noti/savePostNotis', this.postNotis.concat(noti));
          if (noti.length === 0) {
            this.finished = true;
          }
        }
      } catch (e) {
        notify({message: e, type: error})
      } finally {
        this.refreshing = false
      }
    },
    async onLoad() {
      if (this.finished || this.refreshing || this.listLoading) {
        return;
      }
      try{
        this.listLoading = true
        let cursorId = null;
        if (this.postNotis && this.postNotis.length > 0) {
          cursorId = this.postNotis[this.postNotis.length - 1].id
        }
        const noti = await getPostNotiByUserId(this.getAccountInfo.twitterId, cursorId, false);
        if (noti && noti.length >= 0) {
          this.$store.commit('noti/savePostNotis', noti.concat(this.postNotis));
          if (noti.length === 0) {
            this.finished = true;
          }
        }
      } catch (e) {
        
      } finally {
        this.listLoading = false
      }
    }
  },
  mounted () {
    this.onRefresh();
  },
}
</script>

<style scoped>

</style>
