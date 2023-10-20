<template>
  <div class="h-full flex flex-col overflow-hidden relative">
    <!-- <div class="container px-15px mx-auto max-w-50rem md:max-w-48rem">
      <div class="text-24px c-text-black text-left py-20px">
        {{$t('community.hot')}}
      </div>
    </div> -->
    <div class="flex-1 overflow-auto no-scroll-bar"
         ref="communityPageRef" @scroll="pageScroll($refs.communityPageRef)">
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
        <div class="h-full overflow-auto no-scroll-bar">
          <van-list :loading="listLoading"
                    :finished="listFinished"
                    :immediate-check="false"
                    :loading-text="$t('common.loading')"
                    :finished-text="communities.length!==0?$t('common.noMore'):''"
                    @load="onLoad">
            <div class="sm:px-15px">
              <div class="container px-15px mx-auto max-w-50rem md:max-w-48rem py-15px">




                <div class="bg-blockBg light:bg-white py-20px xs:py-40px px-1/15 rounded-16px
                            flex flex-col xs:flex-row items-center justify-between mb-15px gap-y-20px">
                  <div class="text-14px leading-20px text-left max-w-400px">
                    Discover the endless potentials of web3. Find your community here, sharing novelty journeys together.
                  </div>
                  <div class="w-full flex justify-end">
                    <button class="flex items-center gap-10px" @click="goToCreate">
                      <span class="text-16px c-text-black">Creat community</span>
                      <img src="~@/assets/community-create.svg" alt="">
                    </button>
                  </div>
                </div>



                
                <div v-if="communities && communities.length === 0"
                     class="py-3rem bg-blockBg light:bg-white rounded-12px shadow-color1A">
                  <div class="c-text-black text-zinc-700 text-2rem mb-2rem">{{$t('common.none')}}</div>
                </div>
                <div v-show="refreshing || joinedCommunities.length > 0" class="text-left text-16px font-bold text-color8B light:text-color7D mb-8px">
                  {{$t('community.joined')}}
                </div>
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-15px mb-20px ">
                  <button class="col-span-1 bg-blockBg light:bg-white rounded-16px flex flex-col items-center p-15px"
                       v-for="(joinCom, i) of joinedCommunities" :key="i"
                       @click="$router.push(`/community-detail/${joinCom.communityId}`);">
                    <img class="w-72px h-72px min-w-72px min-h-72px bg-white rounded-full -16px"
                         :src="joinCom.icon" alt="">
                    <div class="c-text-black text-18px text-white light:text-blueDark mt-8px truncate w-full">
                      {{joinCom.communityName}}
                    </div>
                  </button>
                </div>
                <div v-show="refreshing || pendingCommunities.length > 0" class="text-left text-16px font-bold text-color8B light:text-color7D mb-8px">
                  {{$t('community.moreCommunities')}}
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-15px">
                  <button v-for="(com, i) of pendingCommunities" :key="i"
                       @click="$router.push(`/community-detail/${com.communityId}`);">
                    <CommunityItem class="rounded-16px overflow-hidden relative pt-50px pb-15px px-15px
                                          border-0.5px border-color8B/30 light:border-transparent bg-blockBg
                                          light:bg-white light:shadow-color1A"
                                          :community="com"></CommunityItem>
                  </button>
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
import { getCommunities } from '@/utils/community'
import { mapState, mapGetters } from "vuex";
import { notify, showError } from "@/utils/notify";
import {usePageScroll} from "@/utils/hooks";

export default {
  name: "CommunityIndex",
  components: {CommunityItem},
  setup() {
    const { scroll, pageScroll, pageScrollTo, pageScrollToTop} = usePageScroll()
    return {
      scroll,
      pageScroll,
      pageScrollTo,
      pageScrollToTop
    }
  },
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
    ...mapGetters(['getAccountInfo']),
    joinedCommunities() {
      return this.communities.filter(item => item.joined)
    },
    pendingCommunities() {
      return this.communities.filter(item => !item.joined)
    }
  },
  methods: {
    onLoad() {

    },
    async onRefresh() {
      this.refreshing = true
      try {
        await getCommunities()
      } catch (e) {
        showError(501)
      } finally {
        this.refreshing = false
      }
    },
    goToCreate() {
    // window.location.href = "https://arbi.nutbox.app/#/community/index";
    window.open("https://arbi.nutbox.app/#/community/index", "_blank");
  },
  },
  activated() {
    this.pageScrollTo(this.$refs.communityPageRef)
  },
  mounted () {
    this.onRefresh();
    this.$bus.on('login', () => {
      this.onRefresh();
    })
  },

}
</script>

<style scoped>

</style>
