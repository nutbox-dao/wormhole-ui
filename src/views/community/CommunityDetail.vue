<template>
  <div class="container mx-auto max-w-50rem pb-2rem md:px-1rem relative md:pt-1rem h-full overflow-auto"
       ref="detailPageRef" @scroll="pageScroll">
    <div v-if="scroll>30"
         class="fixed w-full top-0 left-0 z-1 px-15px h-70px flex justify-center items-center
                bg-primaryBg light:bg-white border-b-1 border-headerBorder light:border-headerBorderLight">
      <router-link to="/community" class="absolute left-15px">
        <i class="icon-back w-20px h-20px"></i>
      </router-link>
      <span class="text-20px c-text-black">{{showingCommunity.communityName}}</span>
    </div>
    <div v-else
         class="fixed w-full top-0 left-0 z-1 px-15px h-70px flex justify-center items-center">
      <router-link to="/community" class="absolute left-15px">
        <img class="w-20px h-20px" src="~@/assets/icon-back.svg" alt="">
      </router-link>
    </div>
    <div>
      <div class="overflow-hidden relative py-15px px-15px
                bg-blockBg light:bg-white md:rounded-16px">
        <img class="w-full h-160px min-h-160px max-h-160px object-cover absolute top-0 left-0"
             :src="showingCommunity.banner" alt="">
        <div class="relative mt-95px">
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
                <button v-show="!showingCommunity.joined" class="h-34px rounded-full bg-white flex justify-center items-center px-15px"
                  @click.stop="join">
                  <img class="w-14px h-14px mr-4px" src="~@/assets/icon-add-black.svg" alt="">
                  <span class="text-14px font-500 text-color46">{{$t('community.join')}}</span>
                </button>
              </div>
              <div class="flex flex-wrap gap-5px">
            <span v-for="(tag, tIndex) of showingCommunity.tags ? showingCommunity.tags.split(',') : []" :key="tIndex"
                  class="border-1 border-color62 rounded-full bg-colorF1 text-color62 text-12px h-18px
                         px-8px flex justify-center items-center">{{tag}}</span>
              </div>
            </div>
          </div>
          <div class="text-left text-13px leading-20px mt-10px">{{showingCommunity.description}}</div>
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
          <div class="bg-color62/20 light:bg-colorF7F9 rounded-12px p-15px mt-15px flex justify-between items-center">
            <div class="flex items-center">
              <img class="w-32px h-32px rounded-full mr-10px bg-color62/20"
                   :src="TokenIcon[chain.main? chain.main.symbol : '']" alt="">
              <div class="flex flex-col items-start">
                <div class="text-14px font-500 mb-2px">{{ chain.main? chain.main.symbol : '' }}</div>
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
      <div class="shadow-color1A sm:shadow-none">
        <div class="flex items-center justify-center gap-30px h-48px text-18px font-bold
                    border-b-1 border-color8B/30 light:border-color7F
                    sticky top-70px bg-primaryBg light:bg-white z-9">
          <button class="h-full px-10px"
                  :class="tabIndex===0?'active-tab text-color62':'text-color7D'"
                  @click="tabIndex=0">
            {{$t('community.post')}}
          </button>
          <button class="h-full px-10px"
                  :class="tabIndex===1?'active-tab text-color62':'text-color7D'"
                  @click="tabIndex=1">
            {{$t('community.topic')}}
          </button>
          <button class="h-full px-10px"
                  :class="tabIndex===2?'active-tab text-color62':'text-color7D'"
                  @click="tabIndex=2">
            {{$t('community.member')}}
          </button>
          <button class="h-full px-10px"
                  :class="tabIndex===3?'active-tab text-color62':'text-color7D'"
                  @click="tabIndex=3">
            {{$t('community.about')}}
          </button>
        </div>
        <CommunityTopic v-if="tabIndex===1"></CommunityTopic>
        <CommunityMember v-if="tabIndex===2"></CommunityMember>
      </div>
    </div>
  </div>
</template>

<script>
import {TokenIcon} from "@/config";
import {formatAddress, onCopy} from "@/utils/tool";
import CommunityTopic from "@/views/community/CommunityTopic";
import CommunityMember from "@/views/community/CommunityMember";
import {useWindowSize} from "@vant/use";
import { mapState, mapGetters } from 'vuex'
import { EVM_CHAINS } from '@/config'
import { getCommunityById, getCommunityConfigs } from '@/api/api'
import { notify } from "@/utils/notify";

export default {
  name: "CommunityDetail",
  components: {CommunityTopic, CommunityMember},
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
      tabIndex: 2,
      communityId: ''
    }
  },
  computed: {
    ...mapState('community', ['showingCommunity', 'configs']),
    ...mapGetters('getAccountInfo'),
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
  methods: {
    formatAddress,
    onCopy,
    pageScroll() {
      this.scroll = this.$refs.detailPageRef.scrollTop
    },
  },
  mounted () {
    const communityId = this.$route.params.communityId;
    this.communityId = communityId
    if (!communityId) {
      return this.$router.go(-1);
    }
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
      this.$store.commit('commnuity/saveConfigs', this.configs)
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
