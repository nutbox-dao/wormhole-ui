<template>
  <div class="p-15px bg-blockBg light:bg-white light:shadow-md rounded-12px text-14px xl:text-0.8rem">
    <div class="flex items-center mb-10px"  @click.stop="gotoUserPage()">
      <img class="w-42px min-w-42px h-42px md:w-2.5rem md:h-2.5rem md:w-min-2.5rem
                  mr-15px rounded-full cursor-pointer"
           :src="recommendData.profileImg && recommendData.profileImg.replace('normal', '200x200')" alt="">
      <div class="flex-1 flex items-center flex-wrap">
        <div class="flex items-center flex-wrap">
          <a class="c-text-black text-left mr-3 cursor-pointer
                      text-16px leading-18px 2xl:text-1rem 2xl:leading-1.5rem light:text-blueDark"
             @click.stop="gotoUserPage()">{{ recommendData.name }}</a>
        </div>
        <div class="flex items-center id-time">
            <span class="text-12px leading-18px 2xl:text-0.7rem 2xl:leading-1rem text-color8B light:text-color7D">
              @{{ recommendData.username }}
            </span>
          <span class="mx-4px text-color8B light:text-color7D"> · </span>
          <span class="whitespace-nowrap text-12px leading-18px 2xl:text-0.7rem 2xl:leading-1rem text-color8B light:text-color7D">
             {{ parseTimestamp(recommendData.postTime) }}
            </span>
        </div>
      </div>
    </div>
    <div class="light:text-color21 text-left leading-18px text-12px mb-14px whitespace-pre-line">
      {{recommendData?.description}}
    </div>
    <div class="flex items-center gap-2rem">
      <i class="w-24px h-24px min-w-24px" v-if="isFollow" :class="followed?'btn-icon-follow-active':'btn-icon-follow'"></i>
      <i class="w-24px h-24px min-w-24px" v-if="isReply" :class="replyed?'btn-icon-reply-active':'btn-icon-reply'"></i>
      <i class="w-24px h-24px min-w-24px" v-if="isQuote" :class="quoted?'btn-icon-quote-active':'btn-icon-quote'"></i>
      <i class="w-24px h-24px min-w-24px" v-if="isRetweet" :class="retweeted?'btn-icon-retweet-active':'btn-icon-retweet'"></i>
      <i class="w-24px h-24px min-w-24px" v-if="isLike" :class="liked?'btn-icon-like-active':'btn-icon-like'"></i>
    </div>
    <template v-if="recommendData.curationType===2 && popups.length>0">
      <PopUpsCard :popups="popups"
                  :space="popups"
                  :showCreate="popups.spaceState === 2"
                  @createPopUpVisible='createPopUpVisible=true'></PopUpsCard>
    </template>
    <div>
      <!-- max count -->
      <div class="flex justify-between items-center mt-1rem">
        <span class="text-16px 2xl:text-0.9rem c-text-black">{{ $t('curation.maxCount') }}</span>
        <button class="h-26px xl:1.3rem px-1rem bg-primaryColor/20 light:bg-black light:text-white text-color62 rounded-6px">
          {{recommendData ? (recommendData.maxCount > 1e6 ? $t('common.max') : recommendData.maxCount) : '0'}}
        </button>
      </div>
      <!-- min reputation -->
      <div class="flex justify-between items-center mt-1rem">
        <span class="text-16px 2xl:text-0.9rem c-text-black">{{ $t('curation.minReputation') }}</span>
        <button class="h-26px xl:1.3rem px-1rem bg-primaryColor/20 light:bg-black light:text-white text-color62 rounded-6px">
          {{recommendData ? (recommendData.minReputation <= 0 ? $t('common.max') : recommendData.minReputation) : '0'}}
        </button>
      </div>
      <!-- ended -->
      <div v-if="recommendData?.endtime < (new Date().getTime() / 1000)" class="flex justify-between items-center mt-1rem">
        <span class="text-16px 2xl:text-0.9rem c-text-black">End Time</span>
        <button class="h-26px xl:1.3rem px-1rem bg-color62/20 border-1 border-color62 light:text-black text-color7D rounded-5px ">
          {{parseTimestampToUppercase(recommendData.endtime)}}
        </button>
      </div>
      <!-- ongoing -->
      <div v-else class="flex justify-between items-center mt-1rem">
        <span class="text-16px 2xl:text-0.9rem c-text-black">Expiration</span>
        <button class="h-26px xl:1.3rem px-1rem bg-color62/20 border-1 border-color62 light:text-black text-color7D rounded-5px ">
          <van-count-down v-if="recommendData && recommendData.endtime"
                          class="text-color7D"
                          :time="countdown(recommendData.endtime)">
            <template #default="timeData">
              <span v-if="timeData.days>0">
                {{ timeData.days }} <span class="text-color62">DAY</span>
                {{ timeData.hours }} <span class="text-color62">HOURS</span>
                {{ timeData.minutes }} <span class="text-color62">MIN</span>
              </span>
              <span v-else-if="timeData.hours>0">
                {{ timeData.hours }} <span class="text-color62">HOURS</span>
                {{ timeData.minutes }} <span class="text-color62">MIN</span>
                {{ timeData.seconds }} <span class="text-color62">S</span>
              </span>
              <span v-else>
                {{ timeData.minutes }} <span class="text-color62">MIN</span>
                {{ timeData.seconds }} <span class="text-color62">S</span>
              </span>
            </template>
          </van-count-down>
        </button>
      </div>
      <div class="flex items-center justify-between h-40px xl:h-2rem mt-10px">
        <div class="flex items-center ml-11px">
          <div class="-ml-11px" v-for="p of participant.slice(0,3)" :key="p">
            <img v-if="p.profileImg"
                 class="w-28px min-w-28px h-28px xl:w-1.2rem xl:min-w-1.2rem xl:h-1.2rem rounded-full
                        border-2 border-color62 light:border-white"
                 @error="replaceEmptyImg"
                 :src="p.profileImg" alt="">
            <img v-else
                 class="w-28px min-w-28px h-28px xl:w-1.2rem xl:min-w-1.2rem xl:h-1.2rem rounded-full
                              border-2 border-color62 light:border-white"
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
        <ChainTokenIconLarge height="26px" width="26px"
                             class="bg-color62"
                             :token="{symbol: recommendData?.tokenSymbol, address: recommendData?.token}"
                             :chainName="recommendData ? recommendData.chainId?.toString() : ''">
          <template #amount>
            <span v-if="recommendData?.curationStatus > 0 && (recommendData?.taskRecord === recommendData?.tasks)"
                  class="pl-30px pr-8px h-20px whitespace-nowrap flex items-center text-12px 2xl:text-0.8rem font-bold text-white">
              {{formatAmount(recommendData?.myRewardAmount / (10 ** recommendData?.decimals))+'/'+formatAmount(recommendData?.amount / ( 10 ** recommendData?.decimals)) + " " + recommendData?.tokenSymbol}}
            </span>
            <span v-else
                  class="pl-30px pr-8px h-20px whitespace-nowrap flex items-center text-12px 2xl:text-0.8rem font-bold text-white">
              {{formatAmount(recommendData?.amount / ( 10 ** recommendData?.decimals)) + " " + recommendData?.tokenSymbol}}
            </span>
          </template>
        </ChainTokenIconLarge>
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
import {mapGetters} from "vuex";
import {isNumeric} from "@/utils/tool";
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import ChainTokenIconLarge from "@/components/ChainTokenIconLarge";
import {getCurationRecord, getMyParticipantionInCuration } from "@/api/api";
import Submissions from "@/views/curations/Submissions";
import PopUpsCard from "@/components/PopUpsCard";
import CreatePopUpModal from "@/components/CreatePopUpModal";

export default {
  name: "PostRecommendItem",
  components: {ChainTokenIconLarge, Submissions, PopUpsCard, CreatePopUpModal},
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
    },
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
