<template>
  <div class="h-full overflow-auto 2md:px-15px 2md:flex 2md:flex-col"
       ref="detailPageRef" @scroll="pageScroll">
    <button v-if="tabIndex===0" v-show="scroll>200"
            @click="$refs.detailPageRef.scrollTo({top: 0, behavior: 'smooth'}),
                    $refs.webDetailPageRef.scrollTo({top: 0, behavior: 'smooth'})"
            class="flex items-center justify-center bg-color62
                   h-40px w-40px min-w-40px 2xl:w-2rem 2xl:min-w-2rem 2xl:h-2rem
                   rounded-full mt-0.5rem c-text-bold fixed bottom-2rem right-1.5rem sm:right-2.5rem z-9999">
      <img class="w-20px min-w-20px h-20px 2xl:w-1rem 2xl:h-1rem" src="~@/assets/icon-arrow-top.svg" alt="">
    </button>
    <!-- back button -->
    <div v-if="scroll>30 || width>640"
         class="fixed w-full top-0 left-0 z-1 px-15px h-70px pt-23px flex justify-center items-center 2md:hidden
                bg-primaryBg light:bg-white border-b-0.5px border-headerBorder light:border-headerBorderLight">
      <button @click="$router.go(-1)"
              class="absolute left-15px">
        <i class="icon-back w-20px h-20px"></i>
      </button>
      <div class="w-full flex justify-between items-center pl-30px">
        <span class="text-16px c-text-black">{{showingCommunity.communityName}}</span>
        <div class="flex items-center gap-8px">
          <button @click="changeTab(2)" class="filter light:brightness-0">
            <img class="w-16px h-16px" src="~@/assets/icon-warning-white.svg" alt="">
          </button>
          <button @click="changeTab(3)" class="filter invert-100 light:invert-0">
            <img class="w-16px h-16px" src="~@/assets/icon-rank-white.svg" alt="">
          </button>
          <button @click="changeTab(4)" class="filter light:brightness-0">
            <img class="w-16px h-16px" src="~@/assets/icon-warning-white.svg" alt="">
          </button>
        </div>
      </div>
    </div>
    <div v-else
         class="fixed w-full top-0 left-0 right-0 z-1 px-15px h-70px flex justify-between items-center 2md:hidden">
      <button @click="$router.go(-1)"
              class="w-30px h-30px bg-colorF7 rounded-full flex items-center justify-center p-5px">
        <img class="opacity-50" src="~@/assets/icon-back-light.svg" alt="">
      </button>
      <div class="flex items-center gap-8px">
        <button @click="changeTab(2)" class="filter light:brightness-0">
          <img class="w-16px h-16px" src="~@/assets/icon-warning-white.svg" alt="">
        </button>
        <button @click="changeTab(3)" class="filter invert-100 light:invert-0">
          <img class="w-16px h-16px" src="~@/assets/icon-rank-white.svg" alt="">
        </button>
        <button @click="changeTab(4)" class="filter light:brightness-0">
          <img class="w-16px h-16px" src="~@/assets/icon-warning-white.svg" alt="">
        </button>
      </div>
    </div>
    <div class="container mx-auto sm:max-w-50rem sm:pt-85px 2md:pt-15px sm:pb-15px
                2md:flex-1 2md:overflow-hidden 2md:grid grid-cols-3 gap-15px">
      <div class="col-span-2 sm:border-1 border-color8B/30 light:border-transparent bg-blockBg light:bg-white
                  light:shadow-color1A sm:rounded-16px h-max 2md:h-full no-scroll-bar 2md:overflow-auto"
           ref="webDetailPageRef"
           @scroll="webPageScroll">
        <div class="overflow-hidden sm:rounded-t-16px"
             :class="scroll>=90?'bg-primaryBg light:bg-white':'bg-blockBg light:bg-white'">
          <div class="overflow-hidden relative pt-15px px-15pxs  light:bg-white sm:rounded-t-16px"
               :style="{maxHeight: `${infoMaxHeight}px`}">
            <!-- description header -->
            <div class="w-full h-160px min-h-160px max-h-160px object-cover absolute top-0 left-0">
              <c-image :src="showingCommunity.banner"
                       class="w-full h-160px min-h-160px max-h-160px object-cover absolute top-0 left-0"></c-image>
              <div class="absolute top-0 left-0 w-full h-160px min-h-160px max-h-160px bg-img-overlay"></div>
            </div>
            <div class="relative mt-95px px-15px">
              <div class="flex items-stretch truncate">
                <c-image :src="showingCommunity.icon"
                         class="w-72px h-72px min-w-72px min-h-72px border-2 border-colorF7 rounded-36px bg-white"></c-image>
                <div class="flex-1 flex flex-col justify-between ml-15px truncate">
                  <div class="flex justify-between items-start truncate">
                    <div class="text-left truncate">
                      <div class="c-text-black text-24px text-white mb-8px truncate">{{showingCommunity.communityName}}</div>
                      <div class="flex items-center text-white text-12px">
                        <c-image :src="chain.main?.icon"
                                 class="w-14px h-14px min-w-14px rounded-full mr-4px"></c-image>
                        <span>{{chain.chainName}}</span>
                        <div class="w-1px h-12px bg-white mx-8px"></div>
                        <div>{{$t('community.peopleJoined', {num: showingCommunity.memberCount})}}</div>
                      </div>
                    </div>
                    <button :disabled="showingCommunity.joined"
                            class="h-34px rounded-full bg-white flex justify-center items-center px-15px shadow-color1A"
                            @click.stop="join">
                      <img v-if="!showingCommunity.joined" class="w-14px h-14px mr-4px" src="~@/assets/icon-add-black.svg" alt="">
                      <span class="text-14px font-500 text-color46">{{ showingCommunity.joined ? $t('community.joined') : $t('community.join')}}</span>
                    </button>
                  </div>
                  <!-- tag -->
                  <div class="flex flex-wrap gap-5px mt-8px">
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
                <button v-show="config['twitter']"
                        @click="open(config['twitter'])">
                  <img class="w-24px min-w-24px h-24px min-h-24px rounded-full bg-color35"
                       src="~@/assets/community-icon-twitter.svg" alt="">
                </button>
                <button v-show="config['discord']"
                        @click="open(config['discord'])">
                  <img class="w-24px min-w-24px h-24px min-h-24px rounded-full bg-color35"
                       src="~@/assets/community-icon-discord.svg" alt="">
                </button>
                <button v-show="config['telegram']"
                        @click="open(config['telegram'])">
                  <img class="w-24px min-w-24px h-24px min-h-24px rounded-full bg-color35"
                       src="~@/assets/community-icon-telegram.svg" alt="">
                </button>
                <button v-show="config['official']"
                        @click="open(config['official'])">
                  <img class="w-24px min-w-24px h-24px min-h-24px rounded-full bg-color35"
                       src="~@/assets/community-icon-official.svg" alt="">
                </button>
                <button v-show="config['doc']"
                        @click="open(config['doc'])">
                  <img class="w-24px min-w-24px h-24px min-h-24px rounded-full bg-color35"
                       src="~@/assets/community-icon-doc.svg" alt="">
                </button>
              </div>
            </div>
          </div>
          <!-- token info -->
          <div v-show="showingCommunity.rewardToken"
               class="bg-color62/20 light:bg-colorF7F2 rounded-12px p-15px m-15px
                          flex 2md:hidden justify-between items-center">
            <div class="flex items-center">
              <img v-if="TokenIcon[showingCommunity?.rewardTokenSymbol ?? '']" class="w-32px h-32px rounded-full mr-10px bg-color62/20"
                   :src="TokenIcon[showingCommunity?.rewardTokenSymbol]" alt="">
              <img v-else class="w-32px h-32px rounded-full mr-10px bg-color62/20" src="~@/assets/icon-token-default.svg" alt="">
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
              <button v-show="config['stake_url']" @click="open(config['stake_url'])" class="bg-color62 h-30px text-white px-15px rounded-full">
                {{$t('community.deposit')}}
              </button>
              <button v-show="config['swap_url']" @click="open(config['swap_url'])" class="bg-color1A h-30px text-white px-15px rounded-full">
                {{$t('community.exchange')}}
              </button>
            </div>
          </div>
        </div>
        <div class="sticky top-70px 2md:top-0 bg-primaryBg light:bg-white z-9 shadow-tab pt-5px sm:pt-0">
          <div v-if="scroll>=150"
               class="absolute w-40px h-4px bg-color8B/30 rounded-full left-1/2 top-5px transform -translate-x-1/2 sm:hidden"></div>
          <div class="w-full overflow-auto no-scroll-bar">
            <div class="flex items-center justify-center gap-30px h-48px text-14px 2md:text-18px font-bold
                border-b-0.5px border-color8B/30 light:border-color7F sm:bg-blockBg sm:light:bg-white
                px-15px w-min min-w-full">
              <button class="h-full px-5px 2md:px-10px whitespace-nowrap"
                      :class="tabIndex===0?'c-active-tab text-color62':'text-color7D'"
                      @click="changeTab(0)">
                {{$t('community.post')}}
              </button>
              <button class="h-full px-5px 2md:px-10px whitespace-nowrap"
                      :class="tabIndex===1?'c-active-tab text-color62':'text-color7D'"
                      @click="changeTab(1)">
                      {{$t('community.topic')}}
                <!-- <span :class="newHappenings?'relative c-badge':''">{{$t('community.topic')}}</span> -->
              </button>
              <button class="h-full px-5px 2md:px-10px whitespace-nowrap"
                      :class="tabIndex===5?'c-active-tab text-color62':'text-color7D'"
                      @click="changeTab(5)">
                {{$t('community.credit')}}
              </button>
              <button class="h-full px-5px 2md:px-10px whitespace-nowrap hidden 2md:block"
                      :class="tabIndex===2?'c-active-tab text-color62':'text-color7D'"
                      @click="changeTab(2)">
                {{$t('community.member')}}
              </button>
              <button class="h-full px-5px 2md:px-10px whitespace-nowrap hidden 2md:block"
                      :class="tabIndex===3?'c-active-tab text-color62':'text-color7D'"
                      @click="changeTab(3)">
                {{$t('community.about')}}
              </button>
              <button class="h-full px-5px 2md:px-10px 2md:hidden whitespace-nowrap"
                      :class="tabIndex===4?'c-active-tab text-color62':'text-color7D'"
                      @click="changeTab(4)">
                {{$t('community.activity')}}
              </button>
            </div>
          </div>
        </div>
        <div class="sm:px-15px tab-box">
          <KeepAlive>
            <component :is="activeComponent"
                       :community="showingCommunity"
                       :id="showingCommunity.communityId"/>
          </KeepAlive>
        </div>
      </div>
      <div class="col-span-1 hidden 2md:flex h-full overflow-hidden flex-col">
        <!-- token info -->
        <div v-show="showingCommunity.rewardToken"
             class="sm:border-1 border-color8B/30 light:border-transparent
                    bg-blockBg light:bg-white light:shadow-color1A rounded-12px p-15px mb-15px">
          <div class="flex items-center mb-10px">
            <img v-if="TokenIcon[showingCommunity?.rewardTokenSymbol ?? '']" class="w-40px h-40px rounded-full mr-10px bg-color62/20"
                 :src="TokenIcon[showingCommunity?.rewardTokenSymbol ?? '']" alt="">
            <img v-else class="w-40px h-40px rounded-full mr-10px bg-color62/20" src="~@/assets/icon-token-default.svg" alt="">
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
            <button v-show="config['stake_url']" @click="open(config['stake_url'])" class="bg-color62 h-40px text-white px-15px rounded-full w-full">
              {{$t('community.deposit')}}
            </button>
            <button v-show="config['swap_url']" @click="open(config['swap_url'])"
                    class="bg-colorF1 text-blueDark light:bg-color1A light:text-white h-40px
                           px-15px rounded-full w-full">
              {{$t('community.exchange')}}
            </button>
          </div>
        </div>
        <!-- activities -->
        <CommunityActivity
            class="sm:border-1 border-color8B/30 light:border-transparent
                   bg-blockBg light:bg-white light:shadow-color1A rounded-12px
                   2md:max-h-full 2md:overflow-hidden"></CommunityActivity>
      </div>
    </div>
  </div>
</template>

<script>
import {TokenIcon} from "@/config";
import {formatAddress, onCopy} from "@/utils/tool";
import { getCommunityContractInfo } from "@/utils/curation"
import CommunityPost from "@/views/community/CommunityPost";
import CommunityTopic from "@/views/community/CommunityTopic";
import CommunityMember from "@/views/community/CommunityMember";
import CommunityAbout from "@/views/community/CommunityAbout.vue";
import CommunityActivity from "@/views/community/CommunityActivity.vue";
import CommunityCredit from "@/views/community/CommunityCredit.vue";
import {useWindowSize} from "@vant/use";
import { mapState, mapGetters } from 'vuex'
import { EVM_CHAINS, EVM_CHAINS_ID } from '@/config'
import { getCommunityById, getCommunityConfigs, joinCommunity, getCommunityOps } from '@/api/api'
import { notify } from "@/utils/notify";
import {markRaw, watch} from "vue";
import { getPriceFromOracle } from '@/utils/asset'

export default {
  name: "CommunityDetail",
  components: {CommunityActivity, CommunityPost, CommunityTopic, CommunityMember, CommunityCredit},
  setup() {
    const { width } = useWindowSize();
    return {
      width
    }
  },
  data() {
    return {
      TokenIcon,
      EVM_CHAINS,
      scroll: 0,
      tabIndex: 0,
      communityId: '',
      isAdmin: false,
      activeComponent: markRaw(CommunityPost),
      infoMaxHeight: 1000,
      newHappenings: true
    }
  },
  watch: {
    width(val) {
      if(val>961 && this.tabIndex===4) this.changeTab(0)
    }
  },
  computed: {
    ...mapState('community', ['showingCommunity', 'configs', 'ops']),
    ...mapGetters(['getAccountInfo']),
    chain() {
      if (this.showingCommunity && this.showingCommunity.chainId) {
        return EVM_CHAINS[EVM_CHAINS_ID[this.showingCommunity.chainId]]
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
    if(this.width<640 && this.scroll < 400) {
      this.scroll = 90
      this.infoMaxHeight = 160
    }
    if(this.scroll > 0 && this.width<=960) this.$refs.detailPageRef.scrollTo({top: this.scroll})
    if(this.scroll > 0 && this.width>960) this.$refs.webDetailPageRef.scrollTo({top: this.scroll})
    const communityId = this.$route.params.communityId;
    if (!communityId) {
      return this.$router.go(-1);
    }
    if (this.communityId !== communityId) {
      this.communityId = communityId;
      getCommunityById(this.getAccountInfo?.twitterId, communityId).then(async res => {

        if (res && res.communityId) {
          this.$store.commit('community/saveShowingCommunity', res)
          // get token price
          const price = await getPriceFromOracle(EVM_CHAINS_ID[res.chainId], [{token: res.rewardToken, decimals: res.rewardTokenDecimals}])
          res.rewardPrice = price[res.rewardToken]
          this.$store.commit('community/saveShowingCommunity', res)

          // get community contract info

          getCommunityContractInfo(EVM_CHAINS_ID[res.chainId], communityId).then(communityInfo => {
            if (communityInfo) {
              this.$store.commit('community/saveCommunityContractInfo', communityInfo)
            } else {
              console.log('no community contract info')
            }
          })
        }
      }).catch(e => {
        console.log(53, e);
        notify({error: e, type: 'error'})
      })

      getCommunityConfigs(communityId).then(configs => {
        if (!this.configs) {
          this.configs = {}
        }
        this.configs[communityId] = configs;
        this.$store.commit('community/saveConfigs', this.configs)
      }).catch(e => {
        console.log(54, e);
        notify({error: e, type: 'error'})
      })

    }
  },
  methods: {
    formatAddress,
    onCopy,
    pageScroll() {
      if(this.$refs.detailPageRef.scrollTop<90) this.infoMaxHeight = 1000
      this.scroll = this.$refs.detailPageRef.scrollTop
    },
    webPageScroll() {
      this.scroll = this.$refs.webDetailPageRef.scrollTop
    },
    changeTab(index) {
      this.tabIndex = index
      if(this.tabIndex===0) this.activeComponent = markRaw(CommunityPost)
      if(this.tabIndex===1) this.activeComponent = markRaw(CommunityTopic)
      if(this.tabIndex===2) this.activeComponent = markRaw(CommunityMember)
      if(this.tabIndex===3) this.activeComponent = markRaw(CommunityAbout)
      if(this.tabIndex===4) this.activeComponent = markRaw(CommunityActivity)
      if(this.tabIndex===5) this.activeComponent = markRaw(CommunityCredit)
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
    },
    open(url) {
      window.open(url, '__blank')
    }
  },
  mounted () {
  },
}
</script>

<style scoped lang="scss">
@media (max-width: 500px) {
  .tab-box {
    min-height: calc(100vh - 118px);
  }
}
</style>
