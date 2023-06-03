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
        <div v-for="(noti, i) of postNotis" :key="i" class="text-14px">
          <Reply v-if="noti.type==='reply'" :info-data="noti"></Reply>
          <Like v-if="noti.type==='like'" :info-data="noti"></Like>
          <Retweet v-if="noti.type==='retweet'" :info-data="noti"></Retweet>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getPostNotiByUserId } from '@/api/api'
import { mapState, mapGetters } from 'vuex';
import { notify } from '@/utils/notify';
import {parseTimestamp} from "@/utils/helper";
import Reply from "@/components/info/Reply.vue";
import Like from "@/components/info/Like.vue";
import Retweet from "@/components/info/Retweet.vue";

export default {
  name: "InteractiveList",
  components: {Reply, Like, Retweet},
  data() {
    return {
      refreshing: false,
      listLoading: false,
      listFinished: false,
      postNotis: [
        {
          type: 'retweet',
          time: '2023-05-31 10:10:10',
          userList: [
            { twitterName: 'terry3t.eth', twitterUsername: 'terry3t1', profileImg: 'https://pbs.twimg.com/profile_images/1412585491006996485/4URGPzqP_400x400.jpg'},
            { twitterName: 'terry3t.eth', twitterUsername: 'terry3t1', profileImg: 'https://pbs.twimg.com/profile_images/1412585491006996485/4URGPzqP_400x400.jpg'},
            { twitterName: 'terry3t.eth', twitterUsername: 'terry3t1', profileImg: 'https://pbs.twimg.com/profile_images/1412585491006996485/4URGPzqP_400x400.jpg'},
          ]
        },
        {
          type: 'reply',
          twitterName: 'terry3t.eth',
          twitterUsername: 'terry3t1',
          profileImg: 'https://pbs.twimg.com/profile_images/1412585491006996485/4URGPzqP_400x400.jpg',
          time: '2023-05-31 10:10:10',
        },
        {
          type: 'like',
          contentType: 'tweet',
          userList: [
            {twitterName: 'terry3t.eth', profileImg: 'https://pbs.twimg.com/profile_images/1412585491006996485/4URGPzqP_400x400.jpg'},
            {twitterName: 'abcallen', profileImg: 'https://pbs.twimg.com/profile_images/1658677806749061120/9AjwngZ-_200x200.png'},
            {twitterName: 'Jason', profileImg: 'https://pbs.twimg.com/profile_images/1653068718321336321/grq9EkXA_200x200.jpg'},
          ]
        },
      ]
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo']),
    ...mapState('noti', ['postNotis'])
  },
  methods: {
    parseTimestamp,
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
    }
  },
  mounted () {
    this.onRefresh();
  },
}
</script>

<style scoped>

</style>
