<template>
  <div class="">
    <div class="py-2rem"
         v-if="refreshing && (!postNotis || postNotis.length === 0)">
      <img class="w-5rem mx-auto" src="~@/assets/profile-loading.gif" alt="" />
    </div>
    <div v-else-if="!refreshing && (!postNotis || postNotis.length === 0)" class="py-2rem">
      <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
      <div class="text-color8B light:text-color7D text-12px mt-15px">{{$t('common.none')}}</div>
    </div>
    <van-pull-refresh v-else
                      v-model="refreshing"
                      @refresh="onRefresh"
                      :loading-text="$t('common.loading')"
                      :pulling-text="$t('common.pullRefresh')"
                      :loosing-text="$t('common.loosingRefresh')">
      <van-list :loading="listLoading"
                :finished="listFinished"
                :immediate-check="false"
                :loading-text="$t('common.loading')"
                :finished-text="postNotis.length!==0?$t('common.noMore'):''"
                @load="onLoad">
        <div v-for="(noti, i) of postNotis" :key="i"
             class="flex ">
          <div class="w-32px h-32px min-w-32px min-h-32px flex items-center justify-center mr-8px mt-15px">
            <img v-show="noti.type === 4" class="w-20px h-20px min-w-20px" src="~@/assets/info-like.svg" alt="">
            <img v-show="noti.type === 2" class="w-20px h-20px min-w-20px" src="~@/assets/info-retweet.svg" alt="">
            <img v-show="noti.type === 3" class="w-20px h-20px min-w-20px" src="~@/assets/info-reply.svg" alt="">
            <img v-show="noti.type === 1" class="w-20px h-20px min-w-20px" src="~@/assets/info-retweet.svg" alt="">
          </div>
          <div class="flex-1 flex flex-col items-start py-15px border-b-1 border-color8B/30 light:border-color7F">
            <div class="w-full flex justify-between items-center">
              <img class="w-32px h-32px min-w-32px min-h-32px rounded-full"
                   :src="profile(noti)" alt="">
              <span class="text-12px text-color7D mr-6px relative" :class="!noti.isRead ? 'c-badge' : ''">{{ notiTime(noti) }}</span>
            </div>
            <div class="w-full my-5px text-left text-14px leading-20px">
              {{ notiTips(noti) }}
            </div>
            <div v-show="[1, 2, 3, 4].indexOf(noti.type) !== -1" class="text-12px leading-18px text-color7D text-left break-word">
              {{ noti.content }}
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getPostNotiByUserId } from '@/api/api'
import { mapState, mapGetters } from 'vuex';
import { notify } from '@/utils/notify';
import { parseTimestamp } from '@/utils/helper';

export default {
  name: "InteractiveList",
  data() {
    return {
      refreshing: false,
      listLoading: false,
      listFinished: false,
      isLike: false,
      isRetweet: true,
      isReply: false
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
        console.log(4, noti, cursorId);
        if (noti && noti.length >= 0) {
          this.$store.commit('noti/savePostNotis', noti.concat(this.postNotis));
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
          this.$store.commit('noti/savePostNotis', this.postNotis.concat(noti));
        }
        if (noti.length === 0) {
          this.finished = true;
        }
      } catch (e) {

      } finally {
        this.listLoading = false
      }
    },
    notiTime(noti) {
      let time = noti.quoteTime || noti.likeTime || noti.retweetTime || noti.commentTime || noti.postTime;
      return parseTimestamp(time)
    },
    profile(noti) {
      return noti.type === 1 ? noti.quoteProfileImg : noti.type === 2 ? noti.retweetProfileImg : noti.type === 3 ? noti.commentProfileImg : noti.type === 4 ? noti.likeProfileImg : noti.likeProfileImg
    },
    notiTips(noti) {
      let type = noti.type === 1 ? 'quoted' : noti.type === 2 ? 'retweeted' : noti.type === 3 ? 'replyed' : noti.type === 4 ? 'liked' : ''
      return `${noti.username} ${this.$t('info.' + type)} ${this.$t('info.yourTweet')}`
    }
  },
  mounted () {
    this.onRefresh();
  },
}
</script>

<style scoped>

</style>
