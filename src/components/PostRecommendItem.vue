<template>
  <div class="text-14px">
    <div class="flex items-center mb-10px"  @click.stop="gotoUserPage()">
      <Avatar :profile-img="recommendData.creatorProfileImg"
              :name="recommendData.creatorTwitterName"
              :username="recommendData.creatorTwitterUsername"
              :steem-id="recommendData.creatorSteemId"
              :eth-address="recommendData.creatorEthAddress"
              :reputation="recommendData.creatorReputation"
              @gotoUserPage="gotoUserPage">
        <template #avatar-img>
          <img class="w-36px min-w-36px h-36px min-h-36px md:w-1.8rem md:h-1.8rem md:w-min-1.8rem md:h-min-1.8rem
                  mr-8px rounded-full cursor-pointer bg-color8B/10"
               @error="replaceEmptyImg"
               :src="recommendData.creatorProfileImg && recommendData.creatorProfileImg.replace('normal', '200x200')" alt="">
        </template>
      </Avatar>
      <div class="flex-1 flex flex-col items-start ">
        <div class="flex items-center flex-wrap">
          <a class="c-text-black text-left mr-3 cursor-pointer
                      text-14px leading-16px light:text-blueDark"
             @click.stop="gotoUserPage()">{{ recommendData.creatorTwitterName }}</a>
        </div>
        <div class="flex items-center id-time">
            <span class="text-12px leading-14px text-color8B light:text-color7D">
              @{{ recommendData.creatorTwitterUsername }}
            </span>
          <span class="mx-4px text-color8B light:text-color7D"> · </span>
          <span class="whitespace-nowrap text-12px leading-14px text-color8B light:text-color7D">
             {{ parseTimestamp(recommendData.createdTime) }}
            </span>
        </div>
      </div>
    </div>
    <div class="text-color8B light:text-color21 text-left leading-18px text-12px mb-14px whitespace-pre-line break-word">
      {{recommendData?.description}}
    </div>
    <div class="flex justify-between items-center">
      <span class="text-14px c-text-black">{{ $t('curation.tasks') }}</span>
      <div class="flex items-center gap-8px">
        <button class="w-24px h-24px min-w-24px cursor-pointer" v-if="isFollow"
          :disabled="ended || (currentShowingDetail ? currentShowingDetail.followed : false)"
           @click="$emit('onFollow')"
           :class="followed?'icon-follow-circle-active':'icon-follow-circle'"></button>
        <button class="w-24px h-24px min-w-24px cursor-pointer" v-if="isReply"
          :disabled="ended"
           @click="$emit('onReply')"
           :class="replyed?'icon-reply-circle-active':'icon-reply-circle'"></button>
        <button class="w-24px h-24px min-w-24px cursor-pointer" v-if="isQuote"
           @click="$emit('onCreateCuration')"
           :disabled="ended || (currentShowingDetail ? currentShowingDetail.quoted : false)"
           :class="quoted?'icon-quote-circle-active':'icon-quote-circle'"></button>
        <button class="w-24px h-24px min-w-24px cursor-pointer" v-if="isRetweet"
          :disabled="ended || (currentShowingDetail ? currentShowingDetail.retweeted : false)"
           @click="$emit('onRetweet')"
           :class="retweeted?'icon-retweet-circle-active':'icon-retweet-circle'"></button>
        <button class="w-24px h-24px min-w-24px cursor-pointer" v-if="isLike"
          :disabled="ended || (currentShowingDetail ? currentShowingDetail.liked : false)"
           @click="$emit('onLike')"
           :class="liked?'icon-like-circle-active':'icon-like-circle'"></button>
      </div>
    </div>
    <template v-if="recommendData.curationType===2 && popups.length>0">
      <PopUpsCard :popups="popups"
                  :space="popups"
                  :showCreate="popups.spaceState === 2"
                  @createPopUpVisible='createPopUpVisible=true'></PopUpsCard>
    </template>
    <div>
      <!-- max count -->
      <div class="flex justify-between items-center mt-10px">
        <span class="text-14px c-text-black">{{ $t('curation.maxCount') }}</span>
        <button class="h-20px px-12px text-12px bg-white/10 light:bg-color8B/20 light:text-white text-color8B rounded-6px">
          {{recommendData ? (recommendData.maxCount > 1e6 ? $t('common.max') : recommendData.maxCount) : '0'}}
        </button>
      </div>
      <!-- min reputation -->
      <div class="flex justify-between items-center mt-10px">
        <span class="text-14px c-text-black">{{ $t('curation.minReputation') }}</span>
        <button class="h-20px px-12px text-12px bg-white/10 light:bg-color8B/20 light:text-white text-color8B rounded-6px">
          {{recommendData ? (recommendData.minReputation <= 0 ? $t('common.min') : recommendData.minReputation) : '0'}}
        </button>
      </div>
      <!-- ended -->
      <div v-if="ended" class="flex justify-between items-center mt-10px">
        <span class="text-14px c-text-black">End Time</span>
        <button class="h-20px px-12px text-12px bg-white/10 light:bg-color8B/20 text-orangeColor rounded-5px ">
          {{parseTimestampToUppercase(recommendData.endtime)}}
        </button>
      </div>
      <!-- ongoing -->
      <div v-else class="flex justify-between items-center mt-10px">
        <span class="text-14px c-text-black">Expiration</span>
        <button class="h-20px px-12px text-12px bg-white/10 light:bg-color8B/20 rounded-5px">
          <van-count-down v-if="recommendData && recommendData.endtime"
                          class="text-greenColor text-12px"
                          :time="countdown(recommendData.endtime)">
            <template #default="timeData">
              <span v-if="timeData.days>0">
                {{ timeData.days }} <span class="">DAY</span>
                {{ timeData.hours }} <span class="">HOURS</span>
                {{ timeData.minutes }} <span class="">MIN</span>
              </span>
              <span v-else-if="timeData.hours>0">
                {{ timeData.hours }} <span class="">HOURS</span>
                {{ timeData.minutes }} <span class="">MIN</span>
                {{ timeData.seconds }} <span class="">S</span>
              </span>
              <span v-else>
                {{ timeData.minutes }} <span class="">MIN</span>
                {{ timeData.seconds }} <span class="">S</span>
              </span>
            </template>
          </van-count-down>
        </button>
      </div>
      <div class="flex items-center justify-between mt-10px">
        <div class="flex items-center ml-11px">
          <div class="-ml-11px" v-for="p of participant.slice(0,3)" :key="p">
            <img v-if="p.profileImg"
                 class="w-28px min-w-28px h-28px xl:w-1.2rem xl:min-w-1.2rem xl:h-1.2rem rounded-full
                        border-2 border-color62 light:border-white bg-color8B/10"
                 @error="replaceEmptyImg"
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
          <button class="ml-10px whitespace-nowrap" v-if="participant.length>0" @click="showSubmissions=true">
            {{$t('curation.all')}} >>
          </button>
        </div>
        <ChainTokenIcon height="20px" width="20px"
                             class="bg-color62"
                             :token="{symbol: recommendData?.tokenSymbol, address: recommendData?.token}"
                             :chainName="recommendData ? recommendData.chainId?.toString() : ''">
          <template #amount>
            <span v-if="recommendData?.curationStatus > 0 && (recommendData?.taskRecord === recommendData?.tasks)"
                  class="pl-4px pr-8px h-20px whitespace-nowrap flex items-center text-12px text-white">
              {{formatAmount(recommendData?.myRewardAmount / (10 ** recommendData?.decimals))+'/'+formatAmount(recommendData?.amount / ( 10 ** recommendData?.decimals)) + " " + recommendData?.tokenSymbol}}
            </span>
            <span v-else
                  class="pl-4px pr-8px h-20px whitespace-nowrap flex items-center text-12px text-white">
              {{formatAmount(recommendData?.amount / ( 10 ** recommendData?.decimals)) + " " + recommendData?.tokenSymbol}}
            </span>
          </template>
        </ChainTokenIcon>
      </div>
    </div>
    <van-popup class="md:w-600px bg-black light:bg-transparent"
               :class="position==='center'?'rounded-12px':'rounded-t-12px'"
               v-model:show="showSubmissions"
               teleport="body"
               :position="position">
      <transition name="el-zoom-in-bottom">
        <div v-if="showSubmissions"
             class="dark:bg-glass light:bg-white rounded-t-12px">
          <Submissions :records="participant" :curation="recommendData" :state="recommendData.curationStatus" @close="showSubmissions=false"></Submissions>
        </div>
      </transition>
    </van-popup>
    <van-popup class="md:w-600px bg-black light:bg-transparent"
               :class="position==='center'?'rounded-12px':'rounded-t-12px'"
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
import {parseTimestamp, parseTimestampToUppercase, formatAmount} from "@/utils/helper";
import {mapGetters, mapState} from "vuex";
import {isNumeric} from "@/utils/tool";
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import {getCurationRecord, getMyParticipantionInCuration } from "@/api/api";
import Submissions from "@/views/curations/Submissions";
import PopUpsCard from "@/components/PopUpsCard";
import CreatePopUpModal from "@/components/CreatePopUpModal";
import ChainTokenIcon from "@/components/ChainTokenIcon.vue";
import Avatar from "@/components/Avatar";

export default {
  name: "PostRecommendItem",
  components: {ChainTokenIcon, Submissions, PopUpsCard, CreatePopUpModal, Avatar},
  props: {
    recommendData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      position: document.body.clientWidth < 768?'bottom':'center',
      participant: [],
      showSubmissions: false,
      updateInterval: null,
      popups: [],
      createPopUpVisible: false,
      count: 0
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo']),
    ...mapState('postsModule', ['currentShowingDetail']),
    ended() {
      return this.recommendData?.endtime < (new Date().getTime() / 1000)
    },
    quoted() {
      if(!this.recommendData || !this.getAccountInfo) return false
      return this.recommendData?.taskRecord & 1;
    },
    replyed() {
      if(!this.recommendData || !this.getAccountInfo) return false
      return (this.recommendData?.taskRecord & 2) / 2;
    },
    liked() {
      if(!this.recommendData || !this.getAccountInfo) return false
      return (this.recommendData?.taskRecord & 4) / 4
    },
    followed() {
      if(!this.recommendData || !this.getAccountInfo) return false
      return (this.recommendData.taskRecord & 8) / 8
    },
    retweeted() {
      if (!this.recommendData || !this.getAccountInfo) return false
      return (this.recommendData.taskRecord & 16) / 16
    },
    isQuote() {
      if (!this.recommendData) return false;
      return this.recommendData.tasks & 1;
    },
    isReply() {
      if (!this.recommendData) return false;
      return (this.recommendData.tasks & 2) / 2
    },
    isRetweet() {
      if (!this.recommendData) return false;
      return (this.recommendData.tasks & 16) /16
    },
    isLike() {
      if (!this.recommendData) return false;
      return (this.recommendData.tasks & 4) / 4
    },
    isFollow() {
      if (!this.recommendData) return false;
      return (this.recommendData.tasks & 8) / 8
    }
  },
  watch: {
    recommendData(val) {
      console.log(val)
    }
  },
  mounted() {
    this.updateCurationInfos()
    this.updateInterval = setInterval(() => {
      this.updateCurationInfos()
    }, 3000);
  },
  unmounted() {
    clearInterval(this.updateInterval)
  },
  methods: {
    parseTimestamp,
    parseTimestampToUppercase,
    formatAmount,
    replaceEmptyImg(e) {
      e.target.src = emptyAvatar;
    },
    gotoUserPage() {
      if (!this.getAccountInfo || this.recommendData.username !== this.getAccountInfo.twitterUsername){
        this.$router.push({path : '/account-info/@' + this.recommendData.username})
      }
    },
    countdown(time) {
      if(!time || !isNumeric(time)) return 0
      return time*1000 - new Date().getTime()
    },
    updateCurationInfos() {
      if (this.recommendData && this.recommendData.curationId) {
        const id = this.recommendData.curationId;
        if (this.count++ % 3 === 0){
          getCurationRecord(id).then(res => {
            this.participant = res ?? []
          }).catch(console.log).finally(() => {
            this.loading2 = false
          })
        }
        if (this.getAccountInfo?.twitterId) {
          getMyParticipantionInCuration(this.getAccountInfo.twitterId, id).then(res => {
            if (res.taskRecord) {
              this.recommendData.taskRecord = res.taskRecord
            }
          }).catch()
        }
      }
    },
  }
}
</script>

<style scoped>

</style>
