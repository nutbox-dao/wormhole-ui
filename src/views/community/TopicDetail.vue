<template>
  <div class="h-full overflow-auto 2md:px-15px" ref="detailPageRef" @scroll="pageScroll">
    <div v-if="scroll>30 || width>640"
         class="fixed w-full top-0 left-0 z-1 px-15px h-70px flex justify-center items-center 2md:hidden
                bg-primaryBg light:bg-white border-b-1 border-headerBorder light:border-headerBorderLight">
      <button @click="$router.go(-1)" class="absolute left-15px">
        <i class="icon-back w-20px h-20px"></i>
      </button>
      <span class="text-20px c-text-black">{{showingCommunity.communityName}}</span>
    </div>
    <div v-else
         class="fixed w-full top-0 left-0 z-1 px-15px h-70px flex justify-center items-center 2md:hidden">
      <button @click="$router.go(-1)" class="absolute left-15px">
        <img class="w-20px h-20px" src="~@/assets/icon-back.svg" alt="">
      </button>
    </div>
    <div class="container mx-auto w-full sm:max-w-50rem">
      <div class="hidden 2md:flex h-70px items-center ">
        <button @click="$router.go(-1)"
                class="w-40px h-40px bg-white/20 rounded-full flex items-center justify-center">
          <img class="w-20px h-20px" src="~@/assets/icon-back.svg" alt="">
        </button>
      </div>
    </div>
    <div class="sm:pt-85px 2md:pt-0 pb-20px">
      <div class="2md:grid grid-cols-3 gap-15px container mx-auto sm:max-w-50rem">
        <div class="col-span-2 sm:border-1 border-color8B/30 light:border-color7F rounded-16px">
          <div class="overflow-hidden relative bg-blockBg light:bg-white sm:rounded-t-16px">
            <c-image :src="showingCommunity.banner"
                     class="w-full h-160px min-h-160px max-h-160px object-cover"></c-image>
            <div class="flex justify-between items-center bg-color1A h-40px px-15px">
              <span class="c-text-black text-16px text-white">{{ topic.title }}</span>
              <div class="flex items-center">
                <i class="w-18px h-18px btn-icon-tip"></i>
                <span class="px-8px font-700 text-12px text-color7D">{{ formatAmount(topic.totalReward / (10 ** showingCommunity.rewardTokenDecimals)) }}({{ formatPrice(topic.totalReward / (10 ** showingCommunity.rewardTokenDecimals) * showingCommunity.rewardPrice) }})</span>
              </div>
            </div>
          </div>
          <div class="px-15px">
            <div class="flex justify-between items-center my-15px">
              <span class="text-12px flex items-center text-white">
                {{$t('community.distanceStartTime')}}：
                <van-count-down class="text-12px text-white"
                                :time="countdown(new Date('2023-05-17 00:00:00').getTime()/1000)">
                  <template #default="timeData">
                    {{ timeData.days }} {{$t('common.day')}}
                    {{ timeData.hours }} {{$t('common.hour')}}
                    {{ timeData.minutes }} {{$t('common.minute')}}
                    {{ timeData.seconds }} {{$t('common.second')}}
                  </template>
                </van-count-down>
              </span>
              <div class="flex justify-between items-center">
                <div class="flex items-center ml-11px">
                  <div class="-ml-11px" v-for="p of participant.slice(0,3)" :key="p">
                    <img v-if="p.profileImg"
                         class="w-28px min-w-28px h-28px xl:w-1.2rem xl:min-w-1.2rem xl:h-1.2rem rounded-full
                        border-2 border-color62 light:border-white bg-color8B/10"
                         :src="p.profileImg" alt="">
                    <img v-else
                         class="w-28px min-w-28px h-28px xl:w-1.2rem xl:min-w-1.2rem xl:h-1.2rem rounded-full
                              border-2 border-color62 light:border-white bg-color8B/10"
                         src="~@/assets/icon-default-avatar.svg" alt="">
                  </div>
                  <span v-if="participant.length>3"
                        class="min-w-28px h-28px xl:min-w-1.2rem xl:h-1.2rem rounded-full px-4px
                       rounded-full -ml-10px flex justify-center items-center
                       border-2 border-blockBg bg-primaryColor
                       light:border-white light:bg-color62 light:text-white text-10px">
                  +{{ participant[0].totalCount - 3 }}
                </span>
                </div>
              </div>
            </div>
            <div class="text-14px leading-20px text-left">
              🎉  Welcome to the CrossSpace chill group, where everyone is encouraged to engage in lighthearted banter!
              🚀  And then the CrossSpace officials will generously shower crossers with
              🌧️  Seems quiet now with not many people around = =
              Is this the calm before the storm? Tsk tsk tsk.
              ⚡️  Come on, let the storm rage on even more fiercely!
              🔥   Let's get it!   🔥
            </div>
          </div>
          <div class="w-7/10 h-1px mx-auto bg-color8B/30 light:bg-color7F my-20px hidden 2md:block"></div>
          <div class="flex items-center justify-center gap-30px h-48px text-18px font-bold 2md:hidden
                border-b-1 border-color8B/30 light:border-color7F bg-primaryBg light:bg-white
                sticky top-70px 2md:top-0 z-9">
            <button class="h-full px-10px"
                    :class="tabIndex===0?'active-tab text-color62':'text-color7D'"
                    @click="tabIndex=0">
              {{$t('community.post')}}
            </button>
            <button class="h-full px-10px"
                    :class="tabIndex===1?'active-tab text-color62':'text-color7D'"
                    @click="tabIndex=1">
              {{$t('community.award')}}
            </button>
          </div>
          <div class="px-15px pt-15px">
            <template v-if="tabIndex===0">
              <div class="flex items-center justify-between">
                <span class="c-text-black text-14px">Post (341)</span>
                <el-dropdown>
                  <button class="text-14px text-color62 flex items-center">
                    <span class="font-bold">{{postType[typeIndex]}}</span>
                    <img class="w-12px ml-4px" src="~@/assets/icon-arrow-primary.svg" alt="">
                  </button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item v-for="(type, index) of postType" :key="type"
                                        @click="typeIndex=index">
                <span :class="typeIndex===index?'text-color62':''">
                  {{type}}
                </span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              <div v-for="(post, index) of postsList" :key="post.postId"
                   class="py-20px border-b-1 border-color8B/30 light:border-colorD8">
                <Blog :post="post"
                      @click="gotoDetail(post, index)"
                      avatar-class="min-w-35px min-h-35px w-35px h-35px md:w-3rem md:h-3rem">
                </Blog>
              </div>
            </template>
            <template v-if="tabIndex===1">
              <div class="text-left font-bold c-text-black text-16px">{{$t('community.award')}}</div>
              <div v-for="(p, index) of participant" :key="index"
                   class="flex justify-between items-center py-15px gap-15px">
                <div class="flex-1 flex items-center truncate">
                  <img v-if="p.profileImg"
                       class="w-28px min-w-28px h-28px xl:w-1.2rem xl:min-w-1.2rem xl:h-1.2rem rounded-full
                        border-2 border-color62 light:border-white bg-color8B/10"
                       :src="p.profileImg" alt="">
                  <img v-else
                       class="w-28px min-w-28px h-28px xl:w-1.2rem xl:min-w-1.2rem xl:h-1.2rem rounded-full
                              border-2 border-color62 light:border-white bg-color8B/10"
                       src="~@/assets/icon-default-avatar.svg" alt="">
                  <span class="truncate ml-8px">{{p.twitterName}}</span>
                </div>
                <span>9.2(0.29$)</span>
              </div>
            </template>
          </div>
        </div>
        <div class="col-span-1 hidden 2md:block">
          <div class="border-1 border-color8B/30 light:border-color7F rounded-12px p-15px">
            <div class="text-left font-bold c-text-black text-16px">{{$t('community.award')}}</div>
            <div v-for="(p, index) of participant" :key="index"
                 class="flex justify-between items-center py-15px gap-15px">
              <div class="flex-1 flex items-center truncate">
                <img v-if="p.profileImg"
                     class="w-28px min-w-28px h-28px xl:w-1.2rem xl:min-w-1.2rem xl:h-1.2rem rounded-full
                        border-2 border-color62 light:border-white bg-color8B/10"
                     :src="p.profileImg" alt="">
                <img v-else
                     class="w-28px min-w-28px h-28px xl:w-1.2rem xl:min-w-1.2rem xl:h-1.2rem rounded-full
                              border-2 border-color62 light:border-white bg-color8B/10"
                     src="~@/assets/icon-default-avatar.svg" alt="">
                <span class="truncate ml-8px">{{p.twitterName}}</span>
              </div>
              <span>9.2(0.29$)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {TokenIcon} from "@/config";
import {formatAddress, isNumeric, onCopy } from "@/utils/tool";
import { formatAmount, formatPrice } from '@/utils/helper'
import {useWindowSize} from "@vant/use";
import { mapState, mapGetters } from 'vuex'
import { getCommunityByTopicId } from '@/api/api'
import { notify } from "@/utils/notify";
import Blog from "@/components/Blog";
import communityModule from '@/store/community'
import { getPriceFromOracle } from '@/utils/asset'
import { EVM_CHAINS, EVM_CHAINS_ID } from '@/config'

export default {
  name: "TopicDetail",
  components: {Blog},
  setup() {
    const { width } = useWindowSize();
    return {
      width
    }
  },
  data() {
    return {
      TokenIcon,
      tabIndex: 0,
      postType: ['trend'],
      typeIndex: 0,
      scroll: 0,
      communityId: '',
      topicId: '',
      participant: []
    }
  },
  computed: {
    ...mapState('community', ['showingCommunity', 'configs']),
    ...mapGetters(['getAccountInfo']),
  },
  methods: {
    formatAmount,
    formatPrice,
    formatAddress,
    onCopy,
    pageScroll() {
      this.scroll = this.$refs.detailPageRef.scrollTop
    },
    countdown(time) {
      if(!time || !isNumeric(time)) return 0
      return time*1000 - new Date().getTime()
    },
    gotoDetail(post, index) {
      console.log(post)
      this.selectedPost = post
      this.selectedPostIndex = index
      this.$store.commit('postsModule/saveCurrentShowingDetail', post);
      this.$router.push('/post-detail/' + post.postId);
    },
  },
  mounted () {
    const topicId = this.$route.params.topicId;
    this.topicId = topicId
    console.log(325, topicId);
    if (!topicId) {
      return this.$router.go(-1);
    }
    console.log(53, {...this.showingCommunity});
    getCommunityByTopicId(this.getAccountInfo?.twitterId, topicId).then( async res => {
      if (res && res.communityId) {
        const price = await getPriceFromOracle(EVM_CHAINS_ID[res.chainId], [{token: res.rewardToken, decimals: res.rewardTokenDecimals}])
          res.rewardPrice = price[res.rewardToken]
          this.$store.commit('community/saveShowingCommunity', res)
      }
    }).catch(e => {
      notify({error: e, type: 'error'})
    })

    
  },
}
</script>

<style scoped lang="scss">
.active-tab {
  position: relative;
  z-index: 1;
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    height: 3px;
    width: 22px;
    background: #7851FF;
    border-radius: 3px;
    z-index: -1;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
