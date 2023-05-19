<template>
  <div class="h-full overflow-auto 2md:px-15px" ref="detailPageRef" @scroll="pageScroll">
    <!-- back button -->
    <div v-if="scroll>30 || width>640"
         class="fixed w-full top-0 left-0 z-1 px-15px h-70px flex justify-center items-center 2md:hidden
                bg-primaryBg light:bg-white border-b-1 border-headerBorder light:border-headerBorderLight">
      <!-- <router-link to="/community" class="absolute left-15px">
        <i class="icon-back w-20px h-20px"></i>
      </router-link> -->
      <button @click="$router.go(-1)"
              class="absolute left-15px">
        <i class="icon-back w-20px h-20px"></i>
      </button>
      <span class="text-20px c-text-black">{{showingCommunity.communityName}}</span>
    </div>
    <div v-else
         class="fixed w-full top-0 left-0 z-1 px-15px h-70px flex justify-center items-center 2md:hidden">
      <!-- <router-link to="/community" class="absolute left-15px">
        <img class="w-20px h-20px" src="~@/assets/icon-back.svg" alt="">
      </router-link> -->
      <button @click="$router.go(-1)"
              class="absolute left-15px">
          <img class="w-20px h-20px" src="~@/assets/icon-back.svg" alt="">
      </button>
    </div>
    <div class="container mx-auto w-full sm:max-w-50rem">
      <div class="hidden 2md:flex h-70px items-center ">
        <!-- <router-link to="/community" class="w-40px h-40px bg-white/20 rounded-full flex items-center justify-center">
          <img class="w-20px h-20px" src="~@/assets/icon-back.svg" alt="">
        </router-link> -->
        <button @click="$router.go(-1)"
              class="w-40px h-40px bg-white/20 rounded-full flex items-center justify-center">
          <img class="w-20px h-20px" src="~@/assets/icon-back.svg" alt="">
      </button>
      </div>
    </div>
    <div class="sm:pt-85px 2md:pt-0 pb-20px">
      <div class="2md:grid grid-cols-3 gap-15px container mx-auto sm:max-w-50rem">
        <div class="col-span-2 sm:border-1 border-color8B/30 light:border-color7F rounded-16px">
          <div class="overflow-hidden relative py-15px px-15pxs bg-blockBg light:bg-white sm:rounded-t-16px">
            <!-- description header -->
            <c-image :src="showingCommunity.banner"
                     class="w-full h-160px min-h-160px max-h-160px object-cover absolute top-0 left-0"></c-image>
            <div class="relative mt-95px px-15px">
              <div class="flex items-stretch">
                <img class="w-72px h-72px min-w-72px min-h-72px border-3 border-colorF7 rounded-9px bg-colorF7"
                     :src="showingCommunity.icon" alt="">
                <div class="flex-1 flex flex-col justify-between ml-15px">
                  <div class="flex justify-between items-start">
                    <div class="text-left">
                      <div class="c-text-black text-24px text-white mb-8px">{{showingCommunity.communityName}}</div>
                      <div class="flex items-center text-white text-12px">
                        <img class="w-14px h-14px min-w-14px rounded-full mr-4px"
                             :src="TokenIcon[chain.main ? chain.main.symbol : '']" alt="">
                        <span>{{chain.chainName}}</span>
                        <div class="w-1px h-12px bg-white mx-8px"></div>
                        <div>{{$t('community.peopleJoined', {num: showingCommunity.memberCount})}}</div>
                      </div>
                    </div>
                    <button v-show="!showingCommunity.joined"
                            class="h-34px rounded-full bg-white flex justify-center items-center px-15px shadow-color1A"
                            @click.stop="join">
                      <img class="w-14px h-14px mr-4px" src="~@/assets/icon-add-black.svg" alt="">
                      <span class="text-14px font-500 text-color46">{{$t('community.join')}}</span>
                    </button>
                  </div>
                  <!-- tag -->
                  <div class="flex flex-wrap gap-5px">
                    <span v-for="(tag, tIndex) of showingCommunity.tags ? showingCommunity.tags.split(',') : []" :key="tIndex"
                          class="border-1 border-color62 rounded-full bg-colorF1 text-color62 text-12px h-18px
                                px-8px flex justify-center items-center">{{tag}}
                    </span>
                  </div>
                </div>
              </div>
              <div class="text-left text-13px leading-20px mt-10px">{{showingCommunity.description}}</div>
              <!-- social link -->
              <div v-if="Object.keys(config).length > 0" class="mt-15px flex items-center gap-10px">
                <div v-for="(type, index) of Object.keys(config)" :key="type" class="w-24px min-w-24px h-24px min-h-24px rounded-full bg-color35 flex justify-center items-center">
                  <img v-show="type === 'twitter'" class="w-16px h-16px" src="~@/assets/icon-twitter-white.svg" alt="">
                  <img class="w-16px h-16px" src="~@/assets/icon-twitter-white.svg" alt="">
                  <img class="w-16px h-16px" src="~@/assets/icon-twitter-white.svg" alt="">
                  <img class="w-16px h-16px" src="~@/assets/icon-twitter-white.svg" alt="">
                  <img class="w-16px h-16px" src="~@/assets/icon-twitter-white.svg" alt="">
                  <img class="w-16px h-16px" src="~@/assets/icon-twitter-white.svg" alt="">
                </div>
              </div>
              <!-- token info -->
              <div class="bg-color62/20 light:bg-colorF7F9 rounded-12px p-15px mt-15px
                          flex 2md:hidden justify-between items-center">
                <div class="flex items-center">
                  <img class="w-32px h-32px rounded-full mr-10px bg-color62/20"
                       :src="TokenIcon[showingCommunity?.rewardTokenSymbol ?? '']" alt="">
                  <div class="flex flex-col items-start">
                    <div class="text-14px font-500 mb-2px">{{ showingCommunity?.rewardTokenSymbol ?? '' }}</div>
                    <div class="flex items-center">
                      <span class="text-color7D text-12px mr-5px">{{formatAddress(showingCommunity.rewardToken)}}</span>
                      <img class="w-14px h-14px cursor-pointer"
                           @click="onCopy(showingCommunity.rewardToken)"
                           src="~@/assets/icon-copy-primary.svg" alt="">
                    </div>
                  </div>
                </div>
                <div class="flex gap-10px">
                  <button class="bg-color62 h-30px text-white px-15px rounded-full">
                    {{$t('community.deposit')}}
                  </button>
                  <button class="bg-color1A h-30px text-white px-15px rounded-full">
                    {{$t('community.exchange')}}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-center gap-30px h-48px text-18px font-bold
                border-b-1 border-color8B/30 light:border-color7F sm:bg-blockBg sm:light:bg-white
                sticky top-70px 2md:top-0 bg-primaryBg light:bg-white z-9">
            <button class="h-full px-10px"
                    :class="tabIndex===0?'active-tab text-color62':'text-color7D'"
                    @click="changeTab(0)">
              {{$t('community.post')}}
            </button>
            <button class="h-full px-10px"
                    :class="tabIndex===1?'active-tab text-color62':'text-color7D'"
                    @click="changeTab(1)">
              {{$t('community.topic')}}
            </button>
            <button class="h-full px-10px"
                    :class="tabIndex===2?'active-tab text-color62':'text-color7D'"
                    @click="changeTab(2)">
              {{$t('community.member')}}
            </button>
            <button class="h-full px-10px"
                    :class="tabIndex===3?'active-tab text-color62':'text-color7D'"
                    @click="changeTab(3)">
              {{$t('community.about')}}
            </button>
          </div>
          <div class="sm:px-15px">
            <KeepAlive>
              <component :is="activeComponent"
                         :id="showingCommunity.communityId"/>
            </KeepAlive>
          </div>
        </div>
        <div class="col-span-1 hidden 2md:block">
          <!-- token info -->
          <div class="bg-color62/20 light:bg-colorF7F9 rounded-12px p-15px">
            <div class="flex items-center mb-10px">
              <img class="w-40px h-40px rounded-full mr-10px bg-color62/20"
                   :src="TokenIcon[showingCommunity?.rewardTokenSymbol ?? '']" alt="">
              <div class="flex flex-col items-start">
                <div class="text-16px font-500 mb-2px">{{ showingCommunity?.rewardTokenSymbol ?? '' }}</div>
                <div class="flex items-center text-14px">
                  <span class="text-color7D mr-5px">{{formatAddress(showingCommunity.rewardToken)}}</span>
                  <img class="w-14px h-14px cursor-pointer"
                       @click="onCopy(showingCommunity.rewardToken)"
                       src="~@/assets/icon-copy-primary.svg" alt="">
                </div>
              </div>
            </div>
            <div class="flex gap-10px justify-between text-14px">
              <button class="bg-color62 h-40px text-white px-15px rounded-full w-full">
                {{$t('community.deposit')}}
              </button>
              <button class="bg-color1A h-40px text-white px-15px rounded-full w-full">
                {{$t('community.exchange')}}
              </button>
            </div>
          </div>
          <!-- activities -->
          <div class="border-1 border-color8B/30 light:border-color7F rounded-12px p-15px mt-15px">
            <div class="text-left font-bold c-text-black text-16px">{{$t('community.activity')}}</div>
            <div class="flex items-center gap-5px mt-8px">
              <span class="text-14px text-color8B light:text-color7D">{{$t('community.justAdmin')}}</span>
              <el-switch v-model="isAdmin" />
            </div>
            <img v-if="!activityList"
                 class="w-5rem mx-auto py-3rem"
                 src="~@/assets/profile-loading.gif" alt="" />
            <div v-if="activityList.length === 0"
                 class="py-2rem font-bold c-text-black text-color8B light:text-color7D text-12px">
              {{$t('common.none')}}
            </div>
            <template v-else>
              <ActivityItem v-for="i of 3" :key="i"
                            class="mb-15px bg-blockBg light:bg-colorF7F9 p-10px rounded-12px"/>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {TokenIcon} from "@/config";
import {formatAddress, onCopy} from "@/utils/tool";
import CommunityPost from "@/views/community/CommunityPost";
import CommunityTopic from "@/views/community/CommunityTopic";
import CommunityMember from "@/views/community/CommunityMember";
import {useWindowSize} from "@vant/use";
import { mapState, mapGetters } from 'vuex'
import { EVM_CHAINS } from '@/config'
import { getCommunityById, getCommunityConfigs, joinCommunity } from '@/api/api'
import { notify } from "@/utils/notify";
import ActivityItem from "@/components/community/ActivityItem";
import {markRaw} from "vue";

export default {
  name: "CommunityDetail",
  components: {CommunityPost, CommunityTopic, CommunityMember, ActivityItem},
  setup() {
    const { width } = useWindowSize();
    return {
      width
    }
  },
  data() {
    return {
      TokenIcon,
      scroll: 0,
      tabIndex: 0,
      communityId: '',
      isAdmin: false,
      activityList: [1],
      activeComponent: markRaw(CommunityPost)
    }
  },
  computed: {
    ...mapState('community', ['showingCommunity', 'configs']),
    ...mapGetters(['getAccountInfo']),
    chain() {
      if (this.showingCommunity && this.showingCommunity.chainId) {
        for (let chainName of Object.keys(EVM_CHAINS)) {
          const c = EVM_CHAINS[chainName]
            if (c.id === this.showingCommunity.chainId) {
              return c
            }
        }
      }
      return {}
    },
    config() {
      if (this.communityId && this.configs[this.communityId]) {
        return this.configs[this.communityId]
      }
      return {}
    }
  },
  activated() {
    if(this.scroll > 0) this.$refs.detailPageRef.scrollTo({top: this.scroll})
    const communityId = this.$route.params.communityId;
    if (!communityId) {
      return this.$router.go(-1);
    }
    if (this.communityId !== communityId) {
      this.communityId = communityId;
      getCommunityById(this.getAccountInfo?.twitterId, communityId).then(res => {

        if (res && res.communityId) {
          this.$store.commit('community/saveShowingCommunity', res)
        }
      }).catch(e => {
        notify({error: e, type: 'error'})
      })

      getCommunityConfigs(communityId).then(configs => {
        if (!this.configs) {
          this.configs = {}
        }
        this.configs[communityId] = configs;
        this.$store.commit('community/saveConfigs', this.configs)
      })
    }
  },
  methods: {
    formatAddress,
    onCopy,
    pageScroll() {
      this.scroll = this.$refs.detailPageRef.scrollTop
    },
    changeTab(index) {
      this.tabIndex = index
      if(this.tabIndex===0) this.activeComponent = markRaw(CommunityPost)
      if(this.tabIndex===1) this.activeComponent = markRaw(CommunityTopic)
      if(this.tabIndex===2) this.activeComponent = markRaw(CommunityMember)
    },
    checkLogin() {
      if (!this.getAccountInfo || !this.getAccountInfo.twitterId) {
        this.$store.commit('saveShowLogin', true)
        return
      }
      return true;
    },
    async join() {
      if (!this.checkLogin()) return;
      try{
        this.isJoining = true;
        await joinCommunity(this.getAccountInfo.twitterId, this.showingCommunity.communityId);
        this.showingCommunity.joined = true;
        this.showingCommunity.memberCount += 1;
      } catch (e) {
        if (e === 'log out') {
          this.$store.commit('saveShowLogin', true)
          return
        }
        notify({message: e, type: 'error'})
      } finally {
        this.isJoining = false
      }
    }
  },
  mounted () {
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
