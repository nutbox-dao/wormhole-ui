<template>
  <div class="text-12px xl:text-0.8rem">
    <!-- title -->
    <div class="container mx-auto max-w-50rem pb-2rem px-15px pt-1rem">
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-1.5rem">
        <div class="col-span-1 xl:col-span-2">
          <div v-loading="loading1"
               class="h-min text-left">
            <!-- curation info -->
            <div v-if="detailCuration">
              <div class="flex items-start mb-1rem">
                <img class="w-2.6rem md:h-2.6rem md:w-50px md:h-50px md:min-h-50px md:mr-30px mr-0.8rem rounded-full cursor-pointer"
                     @error="replaceEmptyImg"
                     @click="gotoUserPage(detailCuration && detailCuration.creatorTwitterUsername)"
                     :src="detailCuration.creatorProfileImg && detailCuration.creatorProfileImg.replace('normal', '200x200')" alt="">
                <div class="flex flex-col justify-center items-start cursor-pointer" @click="gotoUserPage(detailCuration && detailCuration.creatorTwitterUsername)">
                  <a class="c-text-black text-16px 2xl:text-0.8rem leading-24px 2xl:leading-1rem mr-0.8rem">{{detailCuration && detailCuration.creatorTwitterName}}</a>
                  <span class="text-15px 2xl:text-0.75rem text-color8B light:text-color7D leading-22px 2xl:leading-1.1rem">@{{detailCuration && detailCuration.creatorTwitterUsername}}</span>
                </div>
                <ContentTags :is-quote="isQuote" :is-reply="isReply" :content-type="contentType"/>
              </div>
              <template v-if="contentType==='tweet'">
                <Blog :post="detailCuration" @click="gotoTweet" class="border-1 border-color8B/30 light:border-colorD6 rounded-12px">
                  <template #bottom-btn-bar><div></div></template>
                </Blog>
              </template>
              <template v-else-if="contentType==='space'">
                <Space :space="space" class="h-146px md:min-h-10rem bg-color7D/10 rounded-15px mt-10px"></Space>
              </template>
              <template v-else>
                <div class="px-1.25rem pb-2rem border-b-1 border-color8B/30">
                  <div class="c-text-black text-1.5rem sm:text-24px">
                    {{title}}
                  </div>
                  <div class="flex items-center flex-wrap gap-1rem mt-1rem">
                    <span class="px-10px py-6px bg-white/10 rounded-full text-12px lg:text-0.7rem leading-18px">
                      {{status}}
                    </span>
                        <span class="px-10px py-6px bg-white/10 rounded-full text-12px lg:text-0.7rem leading-18px">
                      {{time}}
                    </span>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <!-- tips -->
          <div class="border-0 light:border-1 gradient-border gradient-border-color91 mt-1rem rounded-8px overflow-hidden">
            <div class="h-min bg-blockBg light:bg-colorED text-left cursor-pointer"
                 :class="tipCollapse?'tip-bg':'tip-bg-close'">
              <div class="text-white light:text-blueDark pl-45px pr-15px font-bold min-h-48px
                        flex-1 flex justify-between items-center truncate relative"
                   @click.stop="showTipModal">
                <el-carousel v-if="tips && tips.length>0"
                             class="w-full hidden sm:block"
                             height="48px" indicator-position="none" :loop="true"
                             direction="vertical" :autoplay="true"
                             :interval="2500">
                  <el-carousel-item v-for="item in tips" :key="item" class="flex items-center">
                    <div class="flex-1 text-color62 c-text-black text-12px">{{tipStr(item)}}</div>
                  </el-carousel-item>
                </el-carousel>
                <van-notice-bar class="w-full bg-transparent px-0 sm:hidden"
                                scrollable :speed="100"
                                v-if="tips && tips.length>0">
                  <template #default>
                    <span v-for="item in tips" :key="item"
                          class="mr-4rem c-text-black text-12px text-color62">{{tipStr(item)}}</span>
                  </template>
                </van-notice-bar>
                <span v-else class="text-14px absolute w-full h-full top-0 left-0 flex items-center justify-center text-color62 font-bold">
                {{ detailCuration?.curationType == 1 ? this.$t('curation.tipToUser', {user: detailCuration.username}) : this.$t('curation.tipToSpeaker') }}
              </span>
                <button v-if="topTips && topTips.length > 0" @click.stop="tipCollapse=!tipCollapse"
                        class="ml-10px bg-tag-gradient text-white h-24px min-w-4rem flex items-center justify-center
                             leading-18px rounded-5px px-3px">Top3</button>
              </div>
              <el-collapse-transition>
                <div v-show="tipCollapse" class="pl-45px pb-5px">
                  <div class="border-t-1 gradient-border gradient-border-color91"></div>
                  <div class="pr-1.25rem py-6px hover:bg-color62/30 flex justify-between items-center text-12px"
                       v-for="(tip, index) of topTips" :key="'tops' + tip.hash">
                    <div class="flex items-center">
                      <img class="w-18px" :src="top3Icons[index]" alt="">
                      <span>{{tip.fromUsername}}</span>
                    </div>
                    <span>{{tip.amount}} STEEM</span>
                  </div>
                </div>
              </el-collapse-transition>
            </div>
          </div>

          <!-- popups -->
          <template v-if="contentType==='space' && space.spaceState > 1">
            <PopUpsCard :popups="popups" :space="space" :showCreate="space.spaceState === 2" @createPopUpVisible='createPopUpVisible=true'></PopUpsCard>
          </template>
          <!-- quests -->
          <div class="h-min bg-blockBg light:bg-white light:border-1 light:border-colorE3
                      rounded-12px overflow-hidden text-left mt-1rem">
            <div>
              <div class="flex-1 flex items-center text-white bg-blueDark relative">
                <div class="w-44/100 h-40px flex px-1.25rem flex items-center c-text-black">
                  <span class="mr-6px bg-color19 rounded-full text-10px min-h-24px min-w-24px
                               flex items-center justify-center">
                    {{quoted+replyed+liked+followed}}/{{isQuote+isReply+isLike+isFollow}}
                  </span>
                  <span>{{ isQuote === 1 ? 'Quote': 'Reply' }} to Earn</span>
                </div>
                <div class="w-56/100 h-40px whitespace-nowrap bg-tag-gradient
                            flex items-center justify-center min-w-1/3 text-white token-tag">
                  <ChainTokenIconVue height="20px" width="20px"
                                     :token="{symbol: detailCuration?.tokenSymbol, address: detailCuration?.token}"
                                     :chainName="detailCuration ? detailCuration.chainId?.toString() : ''">
                    <template #amount>
                      <span class="px-8px h-17px whitespace-nowrap flex items-center text-12px 2xl:text-0.8rem font-bold">
                        {{(detailCuration?.amount / ( 10 ** detailCuration?.decimals)) + " " + detailCuration?.tokenSymbol}}
                      </span>
                    </template>
                  </ChainTokenIconVue>
                </div>
                <button class="absolute right-10px top-1/2 transform -translate-y-1/2"
                        @click="quotesCollapse=!quotesCollapse">
                  <img class="w-14px"
                       :class="quotesCollapse?'transform rotate-180':''"
                       src="~@/assets/icon-arrow.svg" alt="">
                </button>
              </div>
              <el-collapse-transition>
                <div v-show="quotesCollapse"
                     class="text-white light:text-blueDark py-0.5rem font-bold">
                  <div @click="quoteOrReply"
                       class="px-1.25rem py-4px hover:bg-color62/30 flex items-center cursor-pointer">
                    <i class="w-1.2rem h-1.2rem mr-10px"
                       :class="quoted || replyed ?'icon-checked':(isQuote===1?'icon-quote-circle':'icon-reply-circle')"></i>
                    <span>Click to {{isQuote === 1 ? 'Quote' : 'Reply'}}</span>
                  </div>
                  <div v-if="isLike"
                       @click="like"
                       class="px-1.25rem py-4px hover:bg-color62/30 flex items-center cursor-pointer">
                    <img v-if="isLiking"
                         class="w-1.2rem h-1.2rem mr-10px rounded-full" src="~@/assets/icon-loading.svg" alt="">
                    <i v-else class="w-1.2rem h-1.2rem mr-10px"
                       :class="liked?'icon-checked':'icon-like-circle'"></i>
                    <span>Like (or Verify your Like)</span>
                  </div>
                  <div v-if="isFollow" @click="follow"
                       class="px-1.25rem py-4px hover:bg-color62/30 flex items-center cursor-pointer">
                    <img v-if="isFollowing"
                         class="w-1.2rem h-1.2rem mr-10px rounded-full" src="~@/assets/icon-loading.svg" alt="">
                    <i v-else class="w-1.2rem h-1.2rem mr-10px"
                       :class="followed?'icon-checked':'icon-follow-circle'"></i>
                    <span>Follow @{{detailCuration.username}} (or Verify your Follow)</span>
                  </div>
                </div>
              </el-collapse-transition>
            </div>
            <div class="w-full h-1px bg-color8B/30 light:bg-colorE3"></div>
            <div class="flex items-center justify-between h-40px xl:h-2rem pl-1.25rem pr-10px">
              <span class="c-text-black">Participants</span>
              <div class="flex items-center">
                <div class="-ml-7px" v-for="p of participant.slice(0,3)" :key="p">
                  <img v-if="p.profileImg"
                       class="w-18px h-18px xl:w-1.2rem xl:h-1.2rem rounded-full border-1 border-color62 light:border-white"
                       @error="replaceEmptyImg"
                       :src="p.profileImg" alt="">
                  <img v-else
                       class="w-18px h-18px xl:w-1.2rem xl:h-1.2rem rounded-full border-1 border-color62 light:border-white"
                       src="~@/assets/icon-default-avatar.svg" alt="">

                </div>
                <span v-if="participant.length>3"
                      class="w-24px h-24px xl:w-1.2rem xl:h-1.2rem rounded-full
                             rounded-full -ml-10px flex justify-center items-center
                             border-1 border-blockBg bg-primaryColor
                             light:border-white light:bg-color62 light:text-white text-10px">+10</span>
                <button class="ml-10px" v-if="participant.length>0" @click="showSubmissions=true">All participants >></button>
              </div>
            </div>
          </div>
          <!-- Details -->
          <div v-loading="loading1" class="bg-blockBg light:bg-white h-min light:border-1 light:border-colorE3
                      rounded-12px overflow-hidden mt-1rem">
            <div class="px-1.25rem pt-8px pb-1rem text-left">
              <div class="c-text-black mt-4px">{{$t('curation.details')}}</div>
              <div class="w-full h-1px bg-color8B/30 light:bg-colorE3 my-10px"></div>
              <div class="text-color7D">{{detailCuration?.description}}</div>
              <div class="flex justify-between items-center mt-1rem c-text-black">
                <span class="">Prize</span>
                <button class="h-26px xl:1.3rem px-1rem bg-primaryColor/20 text-color62 rounded-5px">
                  {{detailCuration ? (detailCuration.amount / (10 ** detailCuration.decimals)) + ' ' + detailCuration.tokenSymbol : ''}}
                </button>
              </div>
              <!-- ended -->
              <div v-if="detailCuration?.endtime < (new Date().getTime() / 1000)" class="flex justify-between items-center mt-1rem c-text-black">
                <span class="">End Time</span>
                <button class="h-26px xl:1.3rem px-1rem bg-color7D/20 text-color7D rounded-5px">
                  {{endtime}}
                </button>
              </div>
              <!-- ongoing -->
              <div v-else class="flex justify-between items-center mt-1rem c-text-black">
                <span class="">Expiration</span>
                <button class="h-26px xl:1.3rem px-1rem bg-primaryColor/20 text-color62 rounded-5px">
                  {{endtime}}
                </button>
              </div>
            </div>
            <template v-if="contentType==='space'">
              <div v-loading="loading5" class="light:bg-card-gradient text-left mt-1rem">
                <SpeakerCollapse :space="space"/>
              </div>
            </template>
          </div>
          <!-- Related Curations web -->
          <div class="hidden xl:block py-1rem rounded-15px mt-1rem" v-if="relatedCurations && relatedCurations.length > 0">
            <div class="text-left pt-0.5rem pb-1rem text-1.2rem font-bold">📢  Related Curations</div>
            <div class="max-h-15rem overflow-hidden relative py-10px rounded-15px bg-blockBg mb-1rem"
                 v-for="item of relatedCurations" :key="('related' + item.curationId)">
              <CurationItem :curation="item"
                            class="bg-blockBg light:bg-white rounded-15px
                                   sm:bg-transparent sm:border-b-1 sm:border-listBgBorder mb-1rem md:mb-0">
              </CurationItem>
              <div class="absolute bg-color62/70 text-white bottom-0 left-0 w-full py-10px text-center">
                view more >
              </div>
            </div>
          </div>
        </div>
        <div v-if="detailCuration">
          <!-- Related Curations mobile -->
          <div class="xl:hidden py-1rem rounded-15px mt-1rem" v-if="relatedCurations && relatedCurations.length > 0">
            <div class="text-left pt-0.5rem pb-1rem text-1.2rem font-bold">📢  Related Curations</div>
            <div class="max-h-15rem overflow-hidden relative py-10px rounded-15px bg-blockBg mb-1rem"
                @click="gotoCuration(rc)"
                 v-for="rc of relatedCurations" :key="rc.curationId">
              <CurationItem :curation="rc"
                            class="bg-blockBg light:bg-white rounded-15px
                                   sm:bg-transparent sm:border-b-1 sm:border-listBgBorder mb-1rem md:mb-0">
              </CurationItem>
              <div class="absolute bg-color62/70 text-white bottom-0 left-0 w-full py-10px text-center">
                view more >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- modals -->
    <van-popup class="c-tip-drawer 2xl:w-2/5"
               v-model:show="modalVisible"
               :position="position">
      <div class="modal-bg w-full md:w-560px 2xl:max-w-28rem
      max-h-80vh 2xl:max-h-28rem overflow-auto flex flex-col
      rounded-t-1.5rem md:rounded-b-1.5rem pt-1rem md:py-2rem">
        <div v-if="position === 'bottom'"
             @click="modalVisible=false"
             class="w-6rem h-8px bg-color73 rounded-full mx-auto mb-1rem"></div>
        <div class="flex-1 overflow-auto px-1rem xl:px-2.5rem no-scroll-bar">
          <TweetAttendTip class="py-2rem md:py-0"
                          :curation="detailCuration"
                          @close="modalVisible=false"/>
        </div>
      </div>
    </van-popup>

    <el-dialog v-model="showSubmissions" fullscreen
               class="c-dialog-fullscreen c-dialog-no-shadow bg-primaryBg light:bg-primaryBgLight">
      <Submissions :records="participant" @close="showSubmissions=false"></Submissions>
    </el-dialog>
    <van-popup class="md:w-600px bg-black light:bg-transparent rounded-t-12px"
               v-model:show="showTip"
               :position="position">
      <transition name="el-zoom-in-bottom">
        <div v-if="showTip"
             class="relative dark:bg-glass light:bg-colorF7 rounded-t-12px overflow-hidden min-h-60vh">
          <button class="absolute right-20px top-24px"
                  @click="showTip=false">
            <i class="w-18px h-18px 2xl:w-1rem 2xl:h-1rem icon-close"></i>
          </button>
          <TipModalVue class="pt-70px 2xl:pt-3.5rem h-60vh"
                       :tipToUser="detailCuration"
                       @close="showTip=false"
                       @back="showTip=false"></TipModalVue>
        </div>
      </transition>
    </van-popup>
    <van-popup class="md:w-600px bg-black light:bg-transparent rounded-t-12px"
               v-model:show="speakerTipVisible"
               :position="position">
      <transition name="el-zoom-in-bottom">
        <div v-if="speakerTipVisible"
             class="relative dark:bg-glass light:bg-colorF7 rounded-t-12px overflow-hidden">
          <SpeakerTipModal class="h-60vh"
                           :space="space"
                           :parentTweetId="detailCuration.tweetId"
                           @close="speakerTipVisible=false"/>
        </div>
      </transition>
    </van-popup>
    <van-popup class="md:w-600px bg-black light:bg-transparent rounded-t-12px"
               v-model:show="createPopUpVisible"
               :position="position">
      <transition name="el-zoom-in-bottom">
        <div v-if="createPopUpVisible"
             class="relative dark:bg-glass light:bg-colorF7 rounded-t-12px overflow-hidden min-h-80vh">
          <CreatePopUpModal @close="createPopUpVisible=false"/>
        </div>
      </transition>
    </van-popup>
  </div>
</template>

<script>
import TweetAttendTip from "@/components/TweetAttendTip";
import { mapState, mapGetters } from "vuex";
import { getCurationById, getCurationRecord, popupsOfCuration, popupRecords,
   getSpaceInfoById, getCurationsOfTweet, getAllTipsOfCuration } from "@/api/api";
import { getDateString, parseTimestamp, formatAmount, parseTimestampToUppercase } from '@/utils/helper'
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import { ERC20List, EVM_CHAINS } from "@/config";
import {onCopy} from "@/utils/tool";
import Submissions from "@/views/curations/Submissions";
import {formatEmojiText} from "@/utils/tool";
import Blog from "@/components/Blog";
import ChainTokenIconVue from "@/components/ChainTokenIcon.vue";
import Space from "@/components/Space";
import CurationItem from "@/components/CurationItem";
import SpeakerCollapse from "@/components/SpeakerCollapse";
import SpeakerTipModal from "@/components/SpeakerTipModal";
import CreatePopUpModal from "@/components/CreatePopUpModal";
import PopUpsCard from "@/components/PopUpsCard";
import TipModalVue from "@/components/TipModal.vue";
import {testData} from "@/views/square/test-data";
import { notify } from "@/utils/notify";
import { newPopups, likeCuration, followCuration} from '@/utils/curation'
import iconTop1 from '@/assets/icon-top1.svg'
import iconTop2 from '@/assets/icon-top2.svg'
import iconTop3 from '@/assets/icon-top3.svg'
import ContentTags from "@/components/ContentTags";

export default {
  name: "CurationDetail",
  components: {
    TweetAttendTip, Submissions, Blog, Space, TipModalVue,
    CurationItem, SpeakerCollapse, SpeakerTipModal,
    CreatePopUpModal, PopUpsCard, ChainTokenIconVue,ContentTags
  },
  data() {
    return {
      position: document.body.clientWidth < 768?'bottom':'center',
      modalVisible: false,
      showSubmissions: false,
      isExpand: false,
      loading1: false, // curation total
      loading2: false, // particpant
      loading3: false, // popups
      loading4: false, // tips
      loading5: false, // space info
      loading: false,
      participant: [],
      space: {},
      popups: [],
      tips: [],
      topTips: [],
      relatedCurations: [],
      speakerTipVisible: false,
      createPopUpVisible: false,
      showTip: false,
      testData,
      updateInterval: null,
      timeIntrerval: null,
      tipCollapse: false,
      quotesCollapse: true,
      isLiking: false,
      isFollowing:false,
      top3Icons: [iconTop1, iconTop2, iconTop3],
      endtime: '',
      timeIntrerval: null
    }
  },
  computed: {
    ...mapState('curation', ['detailCuration', 'getPendingPopup']),
    ...mapGetters(['getAccountInfo']),
    title() {
      if (this.detailCuration && this.detailCuration.content) {
        return this.detailCuration.content.split('\n')[0].slice(0, 50)
      }else{
        return '---'
      }
    },
    contentType() {
      if (!this.detailCuration) return 'space';
      return this.detailCuration.curationType === 1 ? 'tweet' : 'space'
    },
    content() {
      if (this.detailCuration && this.detailCuration.content) {
        return this.detailCuration.content
      }else{
        return '---'
      }
    },
    isQuote() {
      if (!this.detailCuration) return false;
      return this.detailCuration.tasks & 1;
    },
    isReply() {
      if (!this.detailCuration) return false;
      return (this.detailCuration.tasks & 2) / 2
    },
    isLike() {
      if (!this.detailCuration) return false;
      return (this.detailCuration.tasks & 4) / 4
    },
    isFollow() {
      if (!this.detailCuration) return false;
      return (this.detailCuration.tasks & 8) / 8
    },
    quoted() {
      if(!this.detailCuration || !this.getAccountInfo) return false
      return this.detailCuration?.taskRecord & 1;
    },
    replyed() {
      if(!this.detailCuration || !this.getAccountInfo) return false
      return (this.detailCuration?.taskRecord & 2) / 2
    },
    liked() {
      if(!this.detailCuration || !this.getAccountInfo) return false
      return (this.detailCuration?.taskRecord & 4) / 4
    },
    followed() {
      if(!this.detailCuration || !this.getAccountInfo) return false
      return (this.detailCuration.taskRecord & 8) / 8
    },
    status() {
      if (!this.detailCuration) return ''
      const curationStatus = this.detailCuration.curationStatus;
      const createStatus = this.detailCuration.createStatus;
      if (createStatus === 0) {
        return this.$t('curation.invalidStatus')
      }else{
        if (curationStatus === 0) {
          return this.$t('curation.ongoing')
        }else if(curationStatus === 1) {
          return this.$t('curation.end')
        } else if (curationStatus === 2) {
          return this.$t('curation.complete')
        }
      }
    },
    showReward() {
      if (!this.detailCuration) return false;
      const curationStatus = this.detailCuration.curationStatus;
      const createStatus = this.detailCuration.createStatus;
      if (createStatus && curationStatus > 0) {
        return true;
      }
      return false;
    },
    tokenIcon() {
      const token = this.detailCuration && this.detailCuration.token
      if(!token) return
      for (let t of ERC20List) {
        if(token === t.address) {
          return t.icon
        }
      }
      return
    },
    top3Tip() {
      if (this.tips && this.tips.length > 0) {
        const steemTips = this.tips.filter(t => t.chainName == 'STEEM');
        return steemTips.sort((a, b) => a.amount - b.amount).slice(0, 3)
      }
      return []
    },
    time() {
      if (!this.detailCuration || !this.detailCuration.createdTime || !this.detailCuration.endtime) return '';
      const local = new Date().getTimezoneOffset() / -60;
      let start = new Date(this.detailCuration.createdTime);
      let end = new Date(this.detailCuration.endtime * 1000)
      return getDateString(start, local, 0) + ' ~ ' + getDateString(end, local, 0)
    }
  },
  watch: {
    $route(newValue, oldValue) {
      const newId = this.$route.params.id;
      if (this.$route.name == 'curation-detail' && newId && newId.match(/^[0-9a-fA-F]+$/)) {
        this.loadCuration()
      }
    }
  },
  methods: {
    formatEmojiText,
    onCopy,
    formatAmount,
    gotoTweet() {
      window.open('https://twitter.com/' + this.detailCuration.username + '/status/' + this.detailCuration.tweetId)
    },  
    createTime(p) {
      if (!this.detailCuration || !this.detailCuration.createdTime || !this.detailCuration.endtime) return '';
      return parseTimestamp(p.createAt)
    },
    replaceEmptyImg(e) {
      e.target.src = emptyAvatar;
    },
    gotoUserPage(username) {
        this.$router.push({path : '/account-info/@' + username})
    },
    tipStr(tip) {
      if (tip.chainName === 'STEEM') {
        return `@${tip.fromUsername} tips ${tip.emoji ? (tip.emoji + '(' + this.amount + ' STEEM)') : (tip.amount + ' STEEM')} to @${tip.toUsername}`
      }else {
        let chainName;
        for (let chain in EVM_CHAINS) {
          if (EVM_CHAINS[chain].id === parseInt(tip.chainName)) {
            chainName = chain;
            break;
          }
        }
        return `@${tip.fromUsername} tips ${(tip.amount / (10 ** tip.decimals)).toFixed(3)} ${tip.symbol}(${chainName}) to @${tip.toUsername}`
      }
    },
    checkLogin() {
      if(!this.getAccountInfo || !this.getAccountInfo.twitterId) {
        this.$store.commit('saveShowLogin', true)
        return false;
      }
      return true
    },
    showTipModal() {
      if (!this.checkLogin() || !this.detailCuration) return
      if (this.detailCuration.curationType === 1) {
        this.showTip=true
      }else
        this.speakerTipVisible=true
    },
    quoteOrReply() {
      if (!this.checkLogin()) return
      let url;
      if (this.isQuote) {
        if (this.quoted) return;
        url = `https://twitter.com/intent/tweet?text=tweet%20content%20%23iweb3&url=https://twitter.com/${this.detailCuration.username}/status/${this.detailCuration.tweetId}`
        this.detailCuration.taskRecord = this.detailCuration.taskRecord | 1
      }else {
        if (this.replyed) return;
        url = `https://twitter.com/intent/tweet?in_reply_to=${this.detailCuration.tweetId}&text=%0a%23iweb3`
        this.detailCuration.taskRecord = this.detailCuration.taskRecord | 2
      }
      window.open(url, '__blank');
    },
    async like() {
      if (!this.checkLogin()) return
      if(this.liked) {
        return
      }
      try{
        this.isLiking = true
        await likeCuration({...this.detailCuration, twitterId: this.getAccountInfo.twitterId});
        this.detailCuration.taskRecord = this.detailCuration.taskRecord | 4
      } catch (e) {
        if (e === 'log out') {
          this.$store.commit('saveShowLogin', true)
        }
        notify({message:this.$t('err.serverErr'), type:'error'})
      } finally {
        this.isLiking = false
      }
    },
    async follow() {
      if (!this.checkLogin()) return
      if (this.followed) {
        return
      }
      try{
        this.isFollowing = true
        await followCuration({...this.detailCuration, twitterId: this.getAccountInfo.twitterId})
        this.detailCuration.taskRecord = this.detailCuration?.taskRecord | 8
      } catch (e) {
        if (e === 'log out') {
          this.$store.commit('saveShowLogin', true)
        }
        notify({message:this.$t('err.serverErr'), type:'error'})
      } finally {
        this.isFollowing = false
      }
    },
    gotoCuration(curation) {
      const id = curation.curationId
      this.$store.commit('curation/saveDetailCuration', {})
      this.participant = [];
      this.space = {};
      this.popups = [];
      this.tips = [];
      this.topTips = [];
      this.relatedCurations = [];
      this.$router.replace('/curation-detail/' + id);
    },
    updateCurationInfos() {
      if (this.detailCuration && this.detailCuration.curationId) {
        const id = this.detailCuration.curationId;
        // update curation paricipant info
        getCurationRecord(id).then(res => {
          console.log('participant', res);
          this.participant = res ?? []
        }).catch(console.log).finally(() => {
          this.loading2 = false
        })

        // update popup info
        popupsOfCuration(this.getAccountInfo.twitterId, id).then(res => {
          console.log('popups', res);
          this.popups = res
        }).catch(console.log).finally(() => {
          this.loading3 = false
        })

        // update tip info
        getAllTipsOfCuration(id).then(res => {
          console.log('tips:', res);
          this.tips = res
        })

        // update space host profile
        if (this.detailCuration.spaceId) {
          getSpaceInfoById(this.detailCuration.spaceId).then(res => {
            console.log('space', res);
            this.space = res
          }).finally(() => {
            this.loading5 = false;
          })
        }else {
          this.loading5 = false
        }
      }
    },
    loadCuration() {
      const id = this.$route.params.id;
      const account = this.getAccountInfo

      if (this.getPendingPopup) {
        newPopups(pendingPopup).then(res => {
          console.log('update popup again', re);
        }).catch(e => {
          if (e === 'log out') {
            notify({message: this.$t('tips.accessTokenExpire'), type:'info'})
          }
          console.log('update popup fail:', e);
        }).finally(() => {
          // this.$store.commit('curation/savePendingPopup', null)
        })
      }

      if (this.detailCuration && this.detailCuration.curationId === id) {
        this.updateCurationInfos()
      }else {
        this.$store.commit('curation/saveDetailCuration', null)
        this.loading1 = true
      }
      getCurationById(id, account?.twitterId).then(res => {
        console.log('curation detail: ', res);
        if (res) {
          getCurationsOfTweet(res.tweetId).then(res => {
            const cs = res ?? []
            this.relatedCurations = cs.filter(c => c.curationId !== this.detailCuration.curationId)
          })
          this.$store.commit('curation/saveDetailCuration', res)
          this.updateCurationInfos()
        }
      }).finally(() => {
        this.loading1 = false
      })
      this.loading2 = true
      this.loading3 = true
      this.loading4 = true
      this.loading5 = true

    }
  },
  mounted () {
    this.loadCuration()
    this.updateInterval = setInterval(this.updateCurationInfos, 15000);
    this.timeIntrerval = setInterval(() => {
      this.endtime = parseTimestampToUppercase(this.detailCuration?.endtime)
    }, 1000)
  },
  beforeUnmount () {
    clearInterval(this.updateInterval)
    clearInterval(this.timeIntrerval)
  },
  unmounted() {
    clearInterval(this.updateInterval)
    clearInterval(this.timeIntrerval)
  }
}
</script>

<style scoped lang="scss">
.expand-box {
  transition: max-height 500ms;
}
.icon-share {
  background-image: url("~@/assets/icon-share-white.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  &:hover {
    background-image: url("~@/assets/icon-share-primary.svg");
  }
  &:focus {
    background-image: url("~@/assets/icon-share-primary.svg");
  }
}
.light .icon-share {
  background-image: url("~@/assets/icon-share-light.svg");
  &:hover {
    background-image: url("~@/assets/icon-share-primary.svg");
  }
  &:focus {
    background-image: url("~@/assets/icon-share-primary.svg");
  }
}
.tip-bg {
  background-image: url("~@/assets/tips-img.png"), linear-gradient(180deg, #EDEDFC 29.84%, #FFFFFF 62.65%);
  background-repeat: no-repeat;
  background-size: auto 80px, 100% auto;
}
.tip-bg-close {
  background-image: url("~@/assets/tips-img.png");
  background-repeat: no-repeat;
  background-size: auto 80px;
}
.token-tag {
  clip-path: polygon(20px 0, 100% 0, 100% 100%, 0 100%);
}
</style>
