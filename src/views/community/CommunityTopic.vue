<template>
  <div class="py-20px">
    <van-pull-refresh
                      class="min-h-40vh"
                      v-model="refreshing"
                      @refresh="refresh"
                      :loading-text="$t('common.loading')"
                      :pulling-text="$t('common.pullRefresh')"
                      :loosing-text="$t('common.loosingRefresh')">
      <van-list :loading="listLoading"
                :finished="listFinished"
                :immediate-check="false"
                :loading-text="$t('common.loading')"
                :finished-text="topics.length!==0?$t('common.noMore'):''"
                @load="onLoad">
        <div class="pt-20px">
          <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
              v-if="refreshing && (!spaces || spaces.length === 0)">
            <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
          </div>
          <div v-else-if="!refreshing && (!spaces || spaces.length === 0)" class="py-2rem">
            <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
            <div class="text-color8B light:text-color7D text-12px mt-15px">{{$t('common.none')}}</div>
          </div>
          <div v-else class=" ">
            <div class="flex gap-15px space-container no-scroll-bar">
              <div v-for="(space, i) of spaces" :key="i"
                   class="space-item w-280px min-w-280px cursor-pointer">
                <Space :show-avatar="false" :space="space" @click="gotoDetail(space)">
                  <template #bottom-btn-bar><div></div></template>
                </Space>
              </div>
            </div>
          </div>
        </div>
        <div class="pt-20px px-15px">
          <div class="mb-4px flex justify-between items-center">
            <span class="text-16px leading-25px font-bold">{{$t('community.topic')}}</span>
          </div>
          <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
              v-if="refreshing && (!topics || topics.length === 0)">
            <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
          </div>
          <div v-else-if="!refreshing && (!topics || topics.length === 0)" class="py-2rem">
            <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
            <div class="text-color8B light:text-color7D text-12px mt-15px">{{$t('common.none')}}</div>
          </div>
          <div v-else v-for="topic of topics" :key="topic.activityId" class="mb-15px">
            <TopicItem :topic="topic"></TopicItem>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import Space from "@/components/Space";
import TopicItem from "@/components/community/TopicItem";
import { getCommunitySpaces, getCommunityActivities } from '@/api/api'
import { mapState, mapGetters } from "vuex";
import {useWindowSize} from "@vant/use";
export default {
  name: "CommunityPost",
  setup() {
    const {width} = useWindowSize()
    return {
      width
    }
  },
  data() {
    return {
      spaceType: ['inProgress', 'ended', 'toBeStart'],
      activeSpaceIndex: 0,
      spaceList: [1,2, 3, 4],
      typeIndex: 0,
      topicList: [1],
      listLoading: false,
      listFinished: false,
      refreshing: false,
      communityId: ''
    }
  },
  computed: {
    ...mapState('community', ['showingCommunity', 'topics', 'spaces']),
    ...mapGetters(['getAccountInfo'])
  },
  async activated() {
    let count = 0
    while(!this.showingCommunity || !this.showingCommunity.communityId) {
      await sleep(0.1);
      if (count++ > 50) {
        return;
      }
    }
    if (this.showingCommunity.communityId !== this.communityId){
      this.communityId = this.showingCommunity.communityId
      this.refresh()
    }
  },
  methods: {
    async refresh() {
      try{
        if (this.refreshing || this.listLoading) {
          return;
        }
        this.refreshing = true;
        const [topics, spaces] = await Promise.all([getCommunityActivities(this.communityId), getCommunitySpaces(this.getAccountInfo.twitterId, this.communityId)]);
        this.$store.commit('community/saveTopics', topics);
        this.$store.commit('community/saveSpaces', spaces)
      } catch (e) {
        console.log(66, e);
      } finally {
        this.refreshing = false;
      }
    },
    onLoad() {

    },
    gotoDetail(space) {
      this.$store.commit('postsModule/saveCurrentShowingDetail', null);
      this.$router.push('/post-detail/' + space.postId);
    }
  }
}
</script>
<style scoped lang="scss">

.swipe-item {
  &:last-child {
    padding-right: 15px;
  }
}

</style>
