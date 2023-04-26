<template>
  <div class="text-14px">
    <div class="flex justify-between items-center mb-10px">
      <span class="text-14px c-text-black">{{ $t('curation.startTime') }}</span>
      <button class="h-20px px-12px text-12px bg-white/10 light:bg-color8B/20 rounded-6px"
              :class="new Date().getTime() > curationData.endtime * 1000?'text-orangeColor':'text-greenColor'">
      {{ parseSpaceStartTime(curationData.createdTime) }}
      </button>
    </div>
    <div class="flex justify-between items-center">
      <span class="text-14px c-text-black">{{ $t('curation.endTime') }}</span>
      <button class="h-20px px-12px text-12px bg-white/10 light:bg-color8B/20 rounded-6px"
              :class="new Date().getTime() > curationData.endtime * 1000?'text-orangeColor':'text-greenColor'">
        {{ parseSpaceStartTime(curationData.endtime * 1000) }}
      </button>
    </div>
    <div class="my-10px flex justify-between">
      <span></span>
      <ChainTokenIconLarge   height="26px" width="26px"
                          class="bg-color62"
                          :token="{symbol: curationData?.tokenSymbol, address: curationData?.token}"
                          :chainName="curationData ? curationData.chainId?.toString() : ''">
       <template #amount>
         <span class="pl-30px pr-8px h-20px whitespace-nowrap flex items-center text-12px 2xl:text-0.8rem font-bold text-white"
             v-if="curationData.curationStatus == 0">
             {{formatAmount(curationData?.amount / ( 10 ** curationData?.decimals)) + "? " + curationData?.tokenSymbol}}
         </span>
         <span v-else-if="curationData?.curationStatus > 0 && (curationData?.taskRecord > 0)"
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
    <!-- <div class="flex items-center gap-x-2rem py-14px">
      <i class="w-24px h-24px min-w-24px" :class="followed?'btn-icon-follow-active':'btn-icon-follow'"></i>
      <i class="w-24px h-24px min-w-24px" :class="replied?'btn-icon-reply-active':'btn-icon-reply'"></i>
      <i class="w-24px h-24px min-w-24px" :class="quoted?'btn-icon-quote-active':'btn-icon-quote'"></i>
      <i class="w-24px h-24px min-w-24px" :class="retweeted?'btn-icon-retweet-active':'btn-icon-retweet'"></i>
      <i class="w-24px h-24px min-w-24px" :class="liked?'btn-icon-like-active':'btn-icon-like'"></i>
    </div> -->
    <div v-if="participant.length > 0" class="mt-15px">
      <div class="grid grid-cols-5 xs:grid-cols-10 lg:grid-cols-5 items-stretch gap-10px">
        <div class="col-span-1 cursor-pointer" v-for="p of participant.slice(0,19)" :key="p" @click="gotoUserPage(p)">
          <Avatar :profile-img="p.profileImg.replace('normal', '200x200')"
                  :name="p.twitterName"
                  :username="p.twitterUsername"
                  @gotoUserPage="gotoUserPage(p)">
            <template #avatar-img>
              <img v-if="p.profileImg"
                   class="w-full min-w-28px h-full min-w-28px  rounded-full object-cover
                      border-2 border-color62 light:border-white bg-color8B/10"
                   @error="replaceEmptyImg"
                   :src="p.profileImg.replace('normal', '200x200')" alt="">
              <img v-else
                   class="w-28px min-w-28px h-28px xl:w-1.2rem xl:min-w-1.2rem xl:h-1.2rem rounded-full
                              border-2 border-color62 light:border-white bg-color8B/10"
                   src="~@/assets/icon-default-avatar.svg" alt="">
            </template>
          </Avatar>
        </div>
        <div class="col-span-1" v-if="participant.length>19">
          <button class="w-full min-w-28px h-full rounded-full
                       rounded-full flex justify-center items-center
                       border-2 border-blockBg bg-primaryColor
                       light:border-white light:bg-color62 light:text-white text-12px font-bold"
                       @click="showSubmissions=true">
            +{{ participant[0].totalCount - 19 }}
          </button>
        </div>
      </div>
    </div>
    <!-- <div class="flex text-16px font-bold pt-14px pb-8px border-b border-color84/30 mb-6px">
      <span>{{ $t('postView.curatorsList') }}</span>
    </div> -->
    <!-- <div v-for="c of allCurations" :key="c.twitterId" class="py-10px border-b-1 border-color84/20 c-list-item">
      <div class="flex items-center mb-4px ">
        <img class="w-28px min-w-28px h-28px mr-8px rounded-full cursor-pointer"
             :src="c.profileImg && c.profileImg.replace('normal', '200x200')" alt="">
        <div class="flex-1 flex items-center flex-wrap">
          <div class="flex items-center flex-wrap">
            <a class="c-text-black text-left mr-4px cursor-pointer
                      text-12px leading-14px text-white light:text-blueDark"
               @click.stop="gotoUserPage(c)">{{ c.twitterName }}</a>
          </div>
          <div class="flex items-center id-time">
          <span class="text-12px leading-14px text-color8B light:text-color7D">
            @{{ c.twitterUsername }}
          </span>
          </div>
        </div>
      </div>
      <div class="text-color8B light:text-color21 text-left leading-16px text-12px whitespace-pre-line break-word">
        {{c?.content.replace('#iweb3', '').replace('#curate', '').replace(`https://twitter.com/${post.username}/status/${post.postId}`, '').trim()}}
      </div>
    </div> -->
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

import {getAutoCurationRecord, getCurationCreateRelation, getMyParticipantionInCuration} from "@/api/api";
import ChainTokenIconLarge from "@/components/ChainTokenIconLarge";
import {formatAmount, parseTimestamp, parseSpaceStartTime} from "@/utils/helper";
import {mapGetters} from "vuex";
import Submissions from "@/views/curations/Submissions";
import Avatar from "@/components/Avatar";
import emptyAvatar from "@/assets/icon-default-avatar.svg";

export default {
  name: "PostCreatedCuration",
  components: {ChainTokenIconLarge, Submissions, Avatar},
  props: {
    curationData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    post: {
      type: Object,
      default: {}
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
    replied() {
      if(!this.curationData || !this.getAccountInfo) return false
      return this.taskRecord & 2;
    },
    retweeted() {
      if(!this.curationData || !this.getAccountInfo) return false
      return this.taskRecord & 16;
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
          getAutoCurationRecord(id).then(res => {
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
    replaceEmptyImg(e) {
      e.target.src = emptyAvatar;
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
.c-list-item:last-child {
  border: none;
}
</style>
