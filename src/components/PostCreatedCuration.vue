<template>
  <div class="p-15px bg-blockBg light:bg-white light:shadow-md rounded-12px text-14px xl:text-0.8rem">
    <div class="flex justify-between items-center mb-1rem">
      <span class="text-16px 2xl:text-0.9rem c-text-black">{{ $t('curation.startTime') }}</span>
      <button class="h-26px xl:1.3rem px-1rem bg-primaryColor/20 light:bg-black light:text-white text-color62 rounded-6px">
      {{ parseSpaceStartTime(curationData.createdTime) }}
      </button>
    </div>
    <div class="flex justify-between items-center">
      <span class="text-16px 2xl:text-0.9rem c-text-black">{{ $t('curation.endTime') }}</span>
      <button class="h-26px xl:1.3rem px-1rem bg-primaryColor/20 light:bg-black light:text-white text-color62 rounded-6px">
        {{ parseSpaceStartTime(curationData.endtime * 1000) }}
      </button>
    </div>
    <div class="flex items-center gap-x-2rem py-14px">
      <i class="w-24px h-24px min-w-24px" :class="followed?'btn-icon-follow-active':'btn-icon-follow'"></i>
      <i class="w-24px h-24px min-w-24px" :class="quoted?'btn-icon-quote-active':'btn-icon-quote'"></i>
      <i class="w-24px h-24px min-w-24px" :class="liked?'btn-icon-like-active':'btn-icon-like'"></i>
    </div>
    <div v-if="curationData.curationStatus > 0" class="flex items-center justify-between h-40px xl:h-2rem my-10px">
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
        <button class="ml-10px whitespace-nowrap" v-if="participant.length>3" @click="showSubmissions=true">
          {{$t('curation.all')}} >>
        </button>
      </div>
      <ChainTokenIconLarge  v-if="curationData.curationStatus > 0" height="26px" width="26px"
                           class="bg-color62"
                           :token="{symbol: curationData?.tokenSymbol, address: curationData?.token}"
                           :chainName="curationData ? curationData.chainId?.toString() : ''">
        <template #amount>
          <span v-if="curationData?.curationStatus > 0 && (curationData?.taskRecord === curationData?.tasks)"
                class="pl-30px pr-8px h-20px whitespace-nowrap flex items-center text-12px 2xl:text-0.8rem font-bold text-white">
            {{formatAmount(curationData?.myRewardAmount / (10 ** curationData?.decimals))+'/'+formatAmount(curationData?.amount / ( 10 ** curationData?.decimals)) + " " + curationData?.tokenSymbol}}
          </span>
          <span v-else
                class="pl-30px pr-8px h-20px whitespace-nowrap flex items-center text-12px 2xl:text-0.8rem font-bold text-white">
            {{formatAmount(curationData?.amount / ( 10 ** curationData?.decimals)) + " " + curationData?.tokenSymbol}}
          </span>
        </template>
      </ChainTokenIconLarge>
    </div>
    <div class="flex text-14px my-10px">
      <span>{{ $t('postView.curatorsList') }}</span>
    </div>
    <div v-for="c of allCurations" :key="c.twitterId" class="border-t-1 border-color8B/30 light:border-colorF4 py-8px">
      <div class="flex items-center mb-10px ">
        <img class="w-30px min-w-30px h-30px md:w-1.8rem md:h-1.8rem md:w-min-1.8rem
                  mr-10px rounded-full cursor-pointer"
             :src="c.profileImg && c.profileImg.replace('normal', '200x200')" alt="">
        <div class="flex-1 flex items-center flex-wrap">
          <div class="flex items-center flex-wrap">
            <a class="c-text-black text-left mr-2 cursor-pointer
                      text-16px leading-18px 2xl:text-1rem 2xl:leading-1.5rem light:text-blueDark"
               @click.stop="gotoUserPage(c)">{{ c.twitterName }}</a>
          </div>
          <div class="flex items-center id-time">
          <span class="text-12px leading-18px 2xl:text-0.7rem 2xl:leading-1rem text-color8B light:text-color7D">
            @{{ c.twitterUsername }}
          </span>
          </div>
        </div>
      </div>
      <div class="light:text-color21 text-left leading-18px text-12px whitespace-pre-line">
        {{c?.content.replace('#iweb3', '').replace('#curate', '').replace(`https://twitter.com/${curationData.username}/status/${curationData.tweetId}`, '').trim()}}
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
          <Submissions :records="participant" :curation="curationData" :state="curationData.curationStatus" @close="showSubmissions=false"></Submissions>
        </div>
      </transition>
    </van-popup>
  </div>
</template>

<script>

import {getCurationRecord, getCurationCreateRelation, getMyParticipantionInCuration} from "@/api/api";
import ChainTokenIconLarge from "@/components/ChainTokenIconLarge";
import {formatAmount, parseTimestamp, parseSpaceStartTime} from "@/utils/helper";
import {mapGetters} from "vuex";
import Submissions from "@/views/curations/Submissions";

export default {
  name: "PostCreatedCuration",
  components: {ChainTokenIconLarge, Submissions},
  props: {
    curationData: {
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
      allCurations: [],
      updateInterval: null,
      taskRecord: 0,
      count: 0
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo']),
    quoted() {
      if(!this.curationData || !this.getAccountInfo) return false
      return this.taskRecord & 1;
    },
    liked() {
      if(!this.curationData || !this.getAccountInfo) return false
      return (this.taskRecord & 4) / 4
    },
    followed() {
      if(!this.curationData || !this.getAccountInfo) return false
      return (this.taskRecord & 8) / 8
    },
  },
  mounted() {
    this.updateCurationInfos()
    this.updateInterval = setInterval(() => {
      this.updateCurationInfos()
    }, 3000);
  },
  methods: {
    formatAmount,
    parseSpaceStartTime,
    updateCurationInfos() {
      if (this.curationData && this.curationData.curationId) {
        const id = this.curationData.curationId;
        if (this.count++ % 3 === 0){
          getCurationRecord(id).then(res => {
            this.participant = res ?? []
          }).catch(console.log).finally(() => {
            this.loading2 = false
          })
        }
        getCurationCreateRelation(id).then(curations => {
          this.allCurations = curations
        }).catch(e => {
          console.log('getCurationCreateRelation fail:', e);
        })
        if(this.getAccountInfo?.twitterId) {
          getMyParticipantionInCuration(this.getAccountInfo?.twitterId, id).then(res => {
            this.taskRecord = res.taskRecord
          }).catch()
        }
      }
    },
    gotoUserPage(c) {
      if (!this.getAccountInfo || c.twitterUsename !== this.getAccountInfo.twitterUsername){
        this.$router.push({path : '/account-info/@' + c.twitterUsername})
      }
    },
  },
  unmounted() {
    clearInterval(this.updateInterval)
  },
  beforeUnmount() {
    clearInterval(this.updateInterval)
  }
}
</script>

<style scoped>

</style>
