<template>
  <div class="h-full flex flex-col overflow-hidden relative">
    <div class="flex-1 overflow-auto">
       <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
         v-if="refreshing && (!communityCC || communityCC.length === 0)">
        <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
      </div>
      <div v-else-if="!refreshing && (!communityCC || communityCC.length === 0)" class="py-2rem">
        <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
        <div class="text-color8B light:text-color7D text-12px mt-15px">{{$t('common.none')}}</div>
        <div class=" flex items-center justify-center">
          <button class="ny-gradient-btn gradient-btn-disabled-grey
                          flex items-center justify-center min-w-10rem px-20px mt-2rem text-14px
                          rounded-full h-40px text-white font-bold"
                          @click="$router.push('/community')">
              {{ $t("community.joinCommunity") }}
          </button>
        </div>
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
                    :finished-text="communityCC.length!==0?$t('common.noMore'):''"
                    @load="onLoad">
            <div class="container mx-auto max-w-50rem md:max-w-48rem px-15px py-15px">
              <div v-if="communityCC && communityCC.length === 0"
                   class="py-3rem bg-blockBg light:bg-white rounded-12px shadow-card">
                <div class="c-text-black text-zinc-700 text-2rem mt-1rem mb-2rem">{{$t('common.none')}}</div>
              </div>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-15px">
                <div v-for="community of communityCC" :key="community.communityId" class="col-span-1">
                  <InfluenceCardItem :community="community"
                                     class="cursor-pointer bg-blockBg light:bg-color27"
                                     @click="gotoCommunity(community)"></InfluenceCardItem>
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
import InfluenceCardItem from "@/components/influence/InfluenceCardItem";
import { getJoinCommunityState } from '@/utils/community'
import { mapGetters, mapState } from "vuex";

export default {
  name: "InfluenceIndex",
  components: {InfluenceCardItem},
  data() {
    return {
      refreshing: false,
      listLoading: false,
      listFinished: false
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo']),
    ...mapState('community', ['communityCC'])
  },
  methods: {
    async onRefresh() {
      this.refreshing = true
      try{
        const res  = await getJoinCommunityState(this.getAccountInfo.twitterId)
        this.$store.commit('community/saveCommunityCC', res)

      } catch (e) {

      } finally {
        this.refreshing = false
      }
    },
    onLoad() {

    },
    gotoCommunity(community) {
      // this.$router.push('/community-detail/' + community.communityId)
    }
  },
  async activated() {
    this.onRefresh()
  },
}
</script>

<style scoped>

</style>
