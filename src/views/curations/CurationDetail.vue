<template>
  <div class="text-12px xl:text-0.8rem">
    <div class="md:border-b-1 border-dividerColor md:mb-1rem">
      <div class="relative container mx-auto max-w-50rem
                  md:px-1rem px-15px flex items-center
                  justify-between h-2.8rem">
        <div class="c-text-black text-1.5rem md:text-1rem md:mx-1.9rem">{{$t('curation.curationDetail')}}</div>
        <el-popover :width="270" trigger="click" popper-class="c-popper" ref="copyUrlPopper">
          <template #reference>
            <button class="w-24px h-24px icon-share"></button>
          </template>
          <template #default>
            <div class="gradient-border border-1 gradient-border-color3 rounded-8px
                        flex items-center justify-center py-14px cursor-pointer"
                 @click="$refs.copyUrlPopper.hide(), onCopy('https://alpha.wormhole3.io/#/curation-detail/' + detailCuration.curationId)">
              <i class="icon-copy w-20px h-20px 2xl:w-1rem 2xl:h-1rem mr-10px"></i>
              <span class="text-15px 2xl:text-0.75rem leading-22px 2xl:leading-1.1rem font-600">
                {{$t('curationsView.shareCuration')}}
              </span>
            </div>
          </template>
        </el-popover>
      </div>
    </div>
    <el-alert type="warning" v-if="!getAccountInfo?.twitterId">
      <template #default>
        <div class="flex flex-wrap justify-center">
          <div>{{$t('curationsView.t1')}}</div>
          <button class="md:mx-3 underline whitespace-nowrap" @click="$router.push('/signup')">{{$t('common.registerNow')}}</button>
        </div>
      </template>
    </el-alert>
    <!-- title -->
    <div class="container mx-auto max-w-50rem pb-2rem px-15px pt-1rem">
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-1.5rem">
        <div class="col-span-1 xl:col-span-2">
          <div v-loading="loading1"
               class="h-min text-left">
            <!-- curation info -->
            <div v-if="detailCuration">
              <div class="flex items-center">
                <img class="w-2.6rem md:h-2.6rem md:w-50px md:h-50px md:min-h-50px md:mr-30px mr-0.8rem rounded-full cursor-pointer"
                     @error="replaceEmptyImg"
                     @click="gotoUserPage(detailCuration && detailCuration.twitterUsername)"
                     :src="detailCuration && detailCuration.profileImg" alt="">
                <div class="flex md:flex-col md:justify-center md:items-start cursor-pointer" @click="gotoUserPage(detailCuration && detailCuration.twitterUsername)">
                  <a class="c-text-black text-16px 2xl:text-0.8rem leading-24px 2xl:leading-1rem mr-0.8rem">{{detailCuration && detailCuration.creatorTwitterName}}</a>
                  <span class="text-15px 2xl:text-0.75rem text-color8B light:text-color7D leading-22px 2xl:leading-1.1rem">@{{detailCuration && detailCuration.creatorTwitterUsername}}</span>
                </div>
              </div>
              <template v-if="contentType==='tweet'">
                <Blog :post="detailCuration" class="border-1 border-color7D">
                  <template #bottom-btn-bar><div></div></template>
                </Blog>
              </template>
              <template v-else-if="contentType==='space'">
                <Space :space="space" class="min-h-15rem bg-color7D/10 rounded-15px mt-10px"></Space>
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
            <div class="tip-bg h-min bg-blockBg light:bg-colorED text-left">
              <div class="text-white light:text-blueDark pl-60px pr-15px font-bold min-h-48px
                        flex-1 flex justify-between items-center truncate relative"
                   @click.stop="speakerTipVisible=true">
                <el-carousel v-if="tips && tips.length>0"
                             class="w-full"
                             height="48px" indicator-position="none" :loop="true"
                             direction="vertical" :autoplay="true"
                             :interval="2500">
                  <el-carousel-item v-for="item in tips" :key="item" class="flex items-center">
                    <div class="flex-1 text-color62 truncate">{{tipStr(item)}}</div>
                  </el-carousel-item>
                </el-carousel>
                <span v-else class="absolute w-full h-full top-0 left-0 flex items-center justify-center text-color62 font-bold">
                {{ detailCuration?.curationType == 1 ? this.$t('curation.tipToUser', {username: detailCuration.username}) : this.$t('curation.tipToSpeaker') }}
              </span>
                <button v-if="topTips && topTips.length > 0" @click.stop="tipCollapse=!tipCollapse"
                        class="ml-10px bg-tag-gradient text-white h-24px min-w-4rem flex items-center justify-center
                             leading-18px rounded-5px px-3px">Top3</button>
              </div>
              <el-collapse-transition>
                <div v-show="tipCollapse">
                  <div class="px-1.25rem py-4px hover:bg-color62/30 flex justify-between items-center text-color7D"
                       v-for="tip of topTips" :key="'tops' + tip.hash">
                    <div class="flex items-center">

                      <img v-if="tip.fromProfileImg" class="w-2rem mr-10px" :src="tip.fromProfileImg.replace('normal', '200x200')" alt="">
                      <img v-else class="w-2rem mr-10px" src="~@/assets/icon-default-avatar.svg" alt="">
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
            <PopUpsCard></PopUpsCard>
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
                  <ChainTokenIcon height="20px" width="20px" :token="{symbol: 'USDT', address: ''}" chain-name="ETH">
                    <template #amount>
                      <span class="px-8px h-17px whitespace-nowrap flex items-center text-12px 2xl:text-0.8rem font-bold">
                        10.1 USDT/1000
                      </span>
                    </template>
                  </ChainTokenIcon>
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
                    <span>Click to {{isQuote === 1 ? 'Quote' : 'Reply'}} {{quoted}}</span>
                  </div>
                  <div v-if="isLike" @click="like"
                       class="px-1.25rem py-4px hover:bg-color62/30 flex items-center cursor-pointer">
                    <i class="w-1.2rem h-1.2rem mr-10px" :class="isLike?'icon-checked':'icon-like-circle'"></i>
                    <span>Like (or Verify your Like)</span>
                  </div>
                  <div v-if="isFollow" @click="follow"
                       class="px-1.25rem py-4px hover:bg-color62/30 flex items-center cursor-pointer">
                    <i class="w-1.2rem h-1.2rem mr-10px" :class="isFollow?'icon-checked':'icon-follow-circle'"></i>
                    <span>Follow @{{detailCuration.username}} (or Verify your Follow)</span>
                  </div>
                </div>
              </el-collapse-transition>
            </div>
            <div class="w-full h-1px bg-color8B/30 light:bg-colorE3"></div>
            <div class="flex items-center justify-between h-40px xl:h-2rem pl-1.25rem pr-10px">
              <span class="c-text-black">Participants</span>
              <div class="flex items-center">
                <div class="-ml-7px" v-for="record of (participant.slice(0, 5) ?? [])" :key="record.id">
                  <img class="w-18px h-18px xl:w-1.2rem xl:h-1.2rem rounded-full border-1 border-color62 light:border-white"
                       @error="replaceEmptyImg"
                       :src="record.profileImg" alt="">
                </div>
                <button class="ml-10px" v-if="participant.length>0" @click="showSubmissions=true">All participants >></button>
              </div>
            </div>
          </div>
          <div class="bg-blockBg light:bg-white h-min light:border-1 light:border-colorE3
                      rounded-12px overflow-hidden mt-1rem">
            <div class="px-1.25rem pt-8px pb-1rem text-left">
              <div class="c-text-black mt-4px">Details</div>
              <div class="w-full h-1px bg-color8B/30 light:bg-colorE3 my-10px"></div>
              <div class="text-color7D">Our first giveaway event, come and grab your airdrop</div>
              <!-- 已结束 -->
              <div class="flex justify-between items-center mt-1rem c-text-black">
                <span class="">End Time</span>
                <button class="h-26px xl:1.3rem px-1rem bg-color7D/20 text-color7D rounded-5px">
                  1 DAY 27 MIN 05 S
                </button>
              </div>
              <!-- 未结束 -->
              <div class="flex justify-between items-center mt-1rem c-text-black">
                <span class="">Expiration</span>
                <button class="h-26px xl:1.3rem px-1rem bg-primaryColor/20 text-color62 rounded-5px">
                  1 DAY 27 MIN 05 S
                </button>
              </div>
            </div>
            <template v-if="contentType==='space'">
              <div class="light:bg-card-gradient text-left mt-1rem">
                <SpeakerCollapse :space="space" @showTip="speakerTipVisible=true"/>
              </div>
            </template>
          </div>
          <!-- Related Curations web -->
          <div class="hidden xl:block py-1rem rounded-15px mt-1rem" v-if="relatedCurations && relatedCurations.length > 0">
            <div class="text-left pt-0.5rem pb-1rem text-1.2rem font-bold">📢  Related Curations</div>
            <div class="max-h-15rem overflow-hidden relative py-10px rounded-15px bg-blockBg mb-1rem"
                 v-for="item of relatedCurations" :key="item">
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
        <div class="col-span-1 xl:col-span-1" v-if="detailCuration">
          <!-- token -->
<!--          <div v-loading="loading1" class="gradient-bg gradient-bg-color3 rounded-15px py-0.5rem px-1.5rem min-h-4rem light:shadow-popper-tip">-->
<!--            <div class="flex justify-between items-center">-->
<!--              <span class="text-colorF7">{{$t('curation.reward')}}</span>-->
<!--              <div class="flex items-center">-->
<!--                &lt;!&ndash; <span class="text-primaryColor font-500">PosW</span>-->
<!--                <img class="w-20px 2xl:w-1rem ml-0.5rem" src="~@/assets/icon-question-purple.svg" alt=""> &ndash;&gt;-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="w-full h-1px bg-white mt-0.8rem mb-1.6rem"></div>-->
<!--            <div class="flex justify-between items-center mb-2rem">-->
<!--              <span class="text-colorF7">Token</span>-->
<!--              <div class="flex items-center">-->
<!--                <img v-if="tokenIcon" class="w-1.5rem mr-0.6rem rounded-full" :src="tokenIcon" alt="">-->
<!--                <img v-else class="w-1.5rem mr-0.6rem rounded-full" src="~@/assets/icon-eth-white.svg" alt="">-->
<!--                <span class="font-700 text-white text-1.4rem">{{(detailCuration && detailCuration.amount) ? (detailCuration.amount.toString() / (10 ** detailCuration.decimals)) : '0'}} {{detailCuration && detailCuration.tokenSymbol}}</span>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="text-colorE0/80 text-12px 2xl:text-0.6rem">{{$t('curation.rewardOnChain')}}</div>-->
<!--          </div>-->
          <!-- curators list -->
<!--          <div v-loading="loading2" class="border-1 border-color8B/30 rounded-15px p-2 mt-1rem text-left min-h-8rem">-->
<!--            <div class="flex justify-between items-center mb-10px p-0.5rem">-->
<!--              <div class="text-primaryColor light:text-color62">{{$t('curation.curators')}}  {{detailCuration && detailCuration.totalCount}}</div>-->
<!--              <div v-if="participant.length > 10" class="text-right cursor-pointer text-12px 2xl:text-0.6rem"-->
<!--                   @click="showSubmissions=true">-->
<!--                {{$t('curation.viewAll')}}  >-->
<!--              </div>-->
<!--            </div>-->
<!--            <div v-if="participant.length===0" class="flex flex-col justify-center items-center py-1rem">-->
<!--              <div class="icon-list-no-data w-6rem h-4rem"></div>-->
<!--              <div class="text-color84/30 font-600">{{$t('common.none')}}</div>-->
<!--            </div>-->
<!--            <div v-else class="flex justify-between items-center py-6px cursor-pointer"-->
<!--                @click="gotoUserPage(record.twitterUsername)"-->
<!--                 v-for="record of (participant.slice(0, 10) ?? [])" :key="record.id">-->
<!--              <div class="flex items-center flex-1 overflow-hidden mr-8px">-->
<!--                <img class="w-34px h-34px 2xl:w-1.7rem 2xl:h-1.7rem rounded-full"-->
<!--                     @error="replaceEmptyImg"-->
<!--                     :src="record.profileImg" alt="">-->
<!--                <div class="flex-1 text-12px leading-18px 2xl:text-0.7rem 2xl:leading-1rem ml-15px truncate">-->
<!--                  <div class="w-full truncate">{{record.twitterUsername}}</div>-->
<!--                  <div class="text-color8B">{{createTime(record)}}</div>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="flex items-center" v-show="showReward">-->
<!--                <span class="font-700 text-15px leading-18px 2xl:text-0.75rem 2xl:leading-1rem whitespace-nowrap">-->
<!--                  {{ formatAmount(record.amount / (10 ** detailCuration.decimals)) }} {{ detailCuration.tokenSymbol }}-->
<!--                </span>-->
<!--                &lt;!&ndash; <img class="w-15px h-15px 2xl:w-0.75rem 2xl:h-0.75rem ml-5px"-->
<!--                     src="~@/assets/icon-question-white.svg" alt=""> &ndash;&gt;-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
          <!-- Related Curations mobile -->
          <div class="xl:hidden py-1rem rounded-15px mt-1rem" v-if="relatedCurations && relatedCurations.length > 0">
            <div class="text-left pt-0.5rem pb-1rem text-1.2rem font-bold">📢  Related Curations</div>
            <div class="max-h-15rem overflow-hidden relative py-10px rounded-15px bg-blockBg mb-1rem"
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
    <el-dialog v-model="speakerTipVisible"
               :show-close="false"
               :destroy-on-close="true"
               class="c-dialog c-dialog-center max-w-500px bg-glass border-1 border-color84/30 rounded-1.6rem">
      <div class="relative">
        <div class="w-max p-1rem ml-auto mr-0" @click="speakerTipVisible=false">
          <i class="w-1.2rem h-1.2rem icon-close"></i>
        </div>
        <SpeakerTipModal :space="space" :parentTweetId="detailCuration.tweetId" @close="speakerTipVisible=false"/>
      </div>
    </el-dialog>
    <el-dialog v-model="createPopUpVisible"
               :show-close="false"
               :destroy-on-close="true"
               class="c-dialog c-dialog-center max-w-500px bg-glass border-1 border-color84/30 rounded-1.6rem">
      <div class="relative">
        <div class="w-max p-1rem ml-auto mr-0" @click="createPopUpVisible=false">
          <i class="w-1.2rem h-1.2rem icon-close"></i>
        </div>
        <CreatePopUpModal/>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TweetAttendTip from "@/components/TweetAttendTip";
import { mapState, mapGetters } from "vuex";
import { getCurationById, getCurationRecord, popupsOfCuration, popupRecords,
   getSpaceInfoById, getCurationsOfTweet, getAllTipsOfCuration } from "@/api/api";
import { userLike, userFollowing } from '@/utils/twitter'
import { getDateString, parseTimestamp, formatAmount } from '@/utils/helper'
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
import ChainTokenIcon from "@/components/ChainTokenIcon";
import {testData} from "@/views/square/test-data";
import { notify } from "@/utils/notify";

export default {
  name: "CurationDetail",
  components: {
    TweetAttendTip, Submissions, Blog, Space,
    CurationItem, SpeakerCollapse, SpeakerTipModal,
    CreatePopUpModal, PopUpsCard, ChainTokenIcon
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
      liking: false,
      following: false,
      participant: [],
      space: {},
      popups: [],
      tips: [],
      topTips: [],
      contentType: 'space',
      speakerTipVisible: false,
      createPopUpVisible: false,
      testData,
      updateInterval: null,
      relatedCurations: [],
      tipCollapse: false,
      quotesCollapse: false
    }
  },
  computed: {
    ...mapState('curation', ['detailCuration']),
    ...mapGetters(['getAccountInfo']),
    title() {
      if (this.detailCuration && this.detailCuration.content) {
        return this.detailCuration.content.split('\n')[0].slice(0, 50)
      }else{
        return '---'
      }
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
      if(!this.detailCuration || this.getAccountInfo) return false
      return this.detailCuration?.taskRecord & 1;
    },
    replyed() {
      if(!this.detailCuration || this.getAccountInfo) return false
      return (this.detailCuration?.taskRecord & 2) / 2
    },
    liked() {
      if(!this.detailCuration || this.getAccountInfo) return false
      return (this.detailCuration?.taskRecord & 4) / 4
    },
    followed() {
      if(!this.detailCuration || this.getAccountInfo) return false
      return (this.detailCuration.authorId === this.getAccountInfo.twitterId) || (this.detailCuration.taskRecord & 8) / 8
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
    },
  },
  methods: {
    formatEmojiText,
    onCopy,
    formatAmount,
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
        return `@${tip.fromUsername} tips ${tip.amount} STEEM to @${tip.toUsername}`
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
    quoteOrReply() {
      let url;
      if (this.isQuote) {
        url = `https://twitter.com/intent/tweet?text=tweet%20content%20%23iweb3&url=https://twitter.com/${this.detailCuration.username}/status/${this.detailCuration.tweetId}`
        this.detailCuration.taskRecord = this.detailCuration.taskRecord | 1
      }else {
        url = `https://twitter.com/intent/tweet?in_reply_to=${this.detailCuration.tweetId}&text=%0a%23iweb3`
        this.detailCuration.taskRecord = this.detailCuration.taskRecord | 2
      }
      window.open(url, '__blank');
    },
    async like() {
      if(this.liked) {
        return
      }
      try{
        this.liking = true
        await userLike(this.detailCuration.tweetId);
        this.detailCuration.taskRecord = this.detailCuration.taskRecord | 4
      } catch (e) {
        if (e === 'log out') {
          this.$store.commit('saveShowLogin', true)
        }
        notify({message:this.$t('err.serverErr'), type:'error'})
      } finally {
        this.liking = false
      }
    },
    async follow() {
      if (this.followed) {
        return
      }
      try{
        this.following = true
        await userFollowing(this.detailCuration.authorId)
        this.detailCuration.taskRecord = this.detailCuration?.taskRecord | 4
      } catch (e) {
        if (e === 'log out') {
          this.$store.commit('saveShowLogin', true)
        }
        notify({message:this.$t('err.serverErr'), type:'error'})
      } finally {
        this.following = false
      }
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
        popupsOfCuration(id).then(res => {
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
    }
  },
  mounted () {
    const id = this.$route.params.id;
    const account = this.getAccountInfo

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

    this.updateInterval = setInterval(this.updateCurationInfos, 15000);
  },
  beforeUnmount () {
    clearInterval(this.updateInterval)
  },
  unmounted() {
    clearInterval(this.updateInterval)
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
  background-image: url("~@/assets/tips-img.png");
  background-repeat: no-repeat;
  background-size: auto 100%;
}
.token-tag {
  clip-path: polygon(20px 0, 100% 0, 100% 100%, 0 100%);
}
</style>
