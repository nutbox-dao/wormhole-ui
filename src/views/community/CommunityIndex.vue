<template>
  <div class="h-full flex flex-col overflow-hidden relative">
    <!-- <div class="container px-15px mx-auto max-w-50rem md:max-w-48rem">
      <div class="text-24px c-text-black text-left py-20px">
        {{$t('community.hot')}}
      </div>
    </div> -->
    <div class="flex-1 overflow-auto">
      <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
           v-if="refreshing && (!communities || communities.length === 0)">
        <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
      </div>
      <van-pull-refresh v-else
                        class="min-h-full"
                        v-model="refreshing"
                        @refresh="onRefresh"
                        :loading-text="$t('common.loading')"
                        :pulling-text="$t('common.pullRefresh')"
                        :loosing-text="$t('common.loosingRefresh')">
        <div class="h-full overflow-auto">
          <van-list :loading="listLoading"
                    :finished="listFinished"
                    :immediate-check="false"
                    :loading-text="$t('common.loading')"
                    :finished-text="communities.length!==0?$t('common.noMore'):''"
                    @load="onLoad">
            <div class="sm:px-15px">
              <div class="container px-15px mx-auto max-w-50rem md:max-w-48rem pt-15px">
                <div v-if="communities && communities.length === 0"
                     class="py-3rem bg-blockBg light:bg-white rounded-12px shadow-card">
                  <div class="c-text-black text-zinc-700 text-2rem mb-2rem">{{$t('common.none')}}</div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-15px">
                  <div v-for="(com, i) of communities" :key="i"
                       @click="$store.commit('community/clearData');$store.commit('community/saveShowingCommunity', com);$router.push(`/community-detail/${com.communityId}`)">
                    <CommunityItem class="rounded-16px overflow-hidden relative pt-50px pb-15px px-15px
                                          border-1 border-color8B/30 light:border-colorF2 bg-blockBg
                                          light:bg-white"
                                          :community="com"></CommunityItem>
                  </div>
                </div>
              </div>
            </div>
          </van-list>
        </div>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import CommunityItem from "@/components/community/CommunityItem";
import { getCommunities } from '@/api/api'
import { mapState, mapGetters } from "vuex";
import { notify, showError } from "@/utils/notify";

export default {
  name: "CommunityIndex",
  components: {CommunityItem},
  data() {
    return {
      refreshing: false,
      listLoading: false,
      listFinished: false,
      communityList: [1]
    }
  },
  computed: {
    ...mapState('community', ['communities']),
    ...mapGetters(['getAccountInfo'])
  },
  methods: {
    onLoad() {

    },
    async onRefresh() {
      this.refreshing = true
      try {
        const communities = await getCommunities(this.getAccountInfo?.twitterId)
        this.$store.commit('community/saveCommunities', communities)
      } catch (e) {
        showError(501)
      } finally {
        this.refreshing = false
      }
    }
  },
  mounted () {
    this.onRefresh()
  },
}
</script>

<style scoped>

</style>
