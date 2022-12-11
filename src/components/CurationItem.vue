<template>
  <div class="">
    <div class="relative">
      <div class="flex items-center" @click.stop>
        <img v-if="profileImg" @click.stop="gotoUserPage()"
             class="w-2.6rem h-2.6rem md:w-3.6rem md:h-3.6rem mr-15px md:mr-1rem
                    min-w-40px min-h-40px rounded-full cursor-pointer"
             @error="replaceEmptyImg"
             :src="profileImg" alt="">
        <img class="w-2.6rem h-2.6rem md:w-3.6rem md:h-3.6rem mr-15px md:mr-1rem
                    min-w-40px min-h-40px rounded-full cursor-pointer"
             src="@/assets/icon-default-avatar.svg" v-else alt="">
        <div class="flex-1 flex justify-between items-center">
          <div class="flex items-center">
            <div class="flex flex-col justify-between items-start cursor-pointer" @click.stop="gotoUserPage()">
              <a class="c-text-black text-left mr-3 text-1rem leading-1.5rem">{{curation.creatorTwitterUsername}}</a>
<!--              <span class="text-orangeColor light:text-color62 text-12px xl:text-0.75rem">{{endtime}}</span>-->
            </div>
            <ContentTags :is-quote="isQuote" :is-reply="isReply" :content-type="contentType"/>
            <slot name="status"></slot>
          </div>
        </div>
      </div>
      <div v-if="contentType==='tweet'" class="my-10px">
        <div class="overflow-hidden relative rounded-15px border-1 border-color8B/30 light:border-colorD6 md:ml-4.1rem"
             :class="enableFold && !isFold?'max-h-200px':''">
          <div ref="blogRef">
            <Blog :post="curation"
                  class="bg-blockBg light:bg-white rounded-15px blog-item
                         sm:bg-transparent"
                  avatar-class="min-w-34px min-h-34px w-2.2rem h-2.2rem md:w-3rem md:h-3rem">
              <template #bottom-btn-bar><div></div></template>
            </Blog>
          </div>
          <button v-if="enableFold && !isFold" @click.stop="isFold=true"
                  class="absolute bg-view-more light:bg-view-more-light text-white bottom-0 left-0 w-full h-60px sm:h-50px flex
                 items-center justify-center text-center">
          </button>
        </div>
      </div>
      <div v-if="contentType==='space'"
           class="h-140px md:h-10rem overflow-hidden relative my-10px">
        <Space :space="curation" class="rounded-15px h-full"/>
      </div>
      <div class="flex justify-between items-center" @click.stop>
        <template v-if="showBtnGroup">
          <div v-if="!isEnd" class="flex gap-x-24px">
            <!-- reply-->
            <button v-if="isReply" @click.stop="quoteOrReply"
                    class="text-white flex justify-center items-center w-24px h-24px rounded-full">
              <img v-if="isRepling" class="w-24px h-24px rounded-full" src="~@/assets/icon-loading.svg" alt="">
              <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" :fill="replyed?'#6246EA':'#7D7F88'"/>
                <path d="M10 6C7.23858 6 5 8.23858 5 11C5 13.7614 7.23858 16 10 16H11V19C13.8696 17.0869 19 15.0587 19 11C19 8.23858 16.7614 6 14 6H10Z" stroke="white"/>
              </svg>
            </button>
            <!-- quote-->
            <button v-if="isQuote" @click.stop="quoteOrReply"
                    class="text-white flex justify-center items-center w-24px h-24px rounded-full">
              <img v-if="isQuoting" class="w-24px h-24px rounded-full" src="~@/assets/icon-loading.svg" alt="">
              <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" :fill="quoted?'#6246EA':'#7D7F88'"/>
                <g clip-path="url(#clip0_2340_3084)">
                  <path d="M6.36842 8.08289V16.4497C6.36842 17.3059 7.07534 18 7.94737 18H13.4737M6.36842 8.08289L4 10.4083M6.36842 8.08289L8.73684 10.4083M16.6316 18V8.55026C16.6316 7.69408 15.9247 7 15.0526 7H9.52632M16.6316 18L19 15.6746M16.6316 18L14.2632 15.6746" stroke="white" stroke-linecap="round"/>
                </g>
                <defs>
                  <clipPath id="clip0_2340_3084">
                    <rect width="16" height="16" fill="white" transform="translate(4 4)"/>
                  </clipPath>
                </defs>
              </svg>
            </button>
            <!-- like-->
            <button v-if="isLike"
                    :disabled="isLiking"
                    @click.stop="like"
                    class="flex items-center">
              <img v-if="isLiking" class="w-24px h-24px rounded-full" src="~@/assets/icon-loading.svg" alt="">
              <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" :fill="liked?'#6246EA':'#7D7F88'"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.08093 6.10862C8.92874 5.89776 9.8237 5.99636 10.6011 6.38304L10.9214 6.5424C11.3083 6.73481 11.6483 6.99781 11.9262 7.31312C11.9651 7.35727 12.0349 7.35727 12.0738 7.31312C12.3517 6.99781 12.6917 6.73481 13.0786 6.5424L13.3989 6.38304C14.1763 5.99636 15.0713 5.89776 15.9191 6.10862C16.7338 6.31126 17.4449 6.78454 17.9385 7.43925L18.1183 7.67776C18.6925 8.43942 19 9.36133 19 10.3051V10.5715C19 10.9939 18.9479 11.4148 18.8449 11.825L18.7822 12.0744C18.5463 13.0131 18.1237 13.8973 17.5377 14.6746L17.1724 15.1592C16.8787 15.5488 16.5574 15.9174 16.2107 16.2622L15.8403 16.6308C14.9513 17.5152 13.9235 18.2526 12.7955 18.8137C12.296 19.0621 11.704 19.0621 11.2045 18.8137C10.0765 18.2526 9.04867 17.5152 8.15975 16.6308L7.78926 16.2622C7.44262 15.9174 7.12129 15.5488 6.82759 15.1592L6.4623 14.6746C5.87625 13.8973 5.4537 13.0131 5.21783 12.0744L5.15513 11.825C5.05206 11.4148 5 10.9939 5 10.5715V10.3051C5 9.36133 5.30748 8.43942 5.88167 7.67776L6.06148 7.43925C6.55506 6.78454 7.26618 6.31126 8.08093 6.10862ZM10.0592 7.32233C9.53599 7.06207 8.94067 6.99792 8.37783 7.13791C7.83535 7.27283 7.3474 7.59161 7.00157 8.05034L6.82176 8.28885C6.38601 8.86686 6.14754 9.57436 6.14754 10.3051V10.5715C6.14754 10.9127 6.1896 11.2523 6.27265 11.5828L6.33535 11.8323C6.53864 12.6413 6.902 13.3998 7.40239 14.0635L7.76768 14.5481C8.0309 14.8972 8.31848 15.2271 8.62816 15.5352L8.99864 15.9037C9.80361 16.7046 10.7316 17.3696 11.7463 17.8744C11.9073 17.9544 12.0927 17.9544 12.2537 17.8744C13.2684 17.3696 14.1964 16.7046 15.0014 15.9037L15.3718 15.5352C15.6815 15.2271 15.9691 14.8972 16.2323 14.5481L16.5976 14.0635C17.098 13.3998 17.4614 12.6413 17.6646 11.8323L17.7273 11.5828C17.8104 11.2523 17.8525 10.9127 17.8525 10.5715V10.3051C17.8525 9.57436 17.614 8.86686 17.1782 8.28885L16.9984 8.05034C16.6526 7.59161 16.1647 7.27283 15.6222 7.13791C15.0593 6.99792 14.464 7.06207 13.9408 7.32233L13.6204 7.48169C13.2061 7.68777 12.8626 8.02597 12.6485 8.45206C12.266 9.21306 11.7316 9.20817 11.3515 8.45206C11.1374 8.02597 10.7939 7.68777 10.3796 7.48169L10.0592 7.32233Z" fill="white"/>
              </svg>
            </button>
            <!-- follow-->
            <button v-if="isFollow"
                    :disabled="isFollowing"
                    @click.stop="follow"
                    class="flex items-center" >
              <img v-if="isFollowing" class="w-24px h-24px rounded-full" src="~@/assets/icon-loading.svg" alt="">
              <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" :fill="followed?'#6246EA':'#7D7F88'"/>
                <path d="M18.2071 16.4545H16.1389V18.5227C16.1389 18.6493 16.0886 18.7707 15.9991 18.8602C15.9096 18.9497 15.7882 19 15.6616 19C15.5351 19 15.4137 18.9497 15.3242 18.8602C15.2346 18.7707 15.1844 18.6493 15.1844 18.5227V16.4545H13.1162C12.9896 16.4545 12.8682 16.4043 12.7787 16.3148C12.6892 16.2253 12.6389 16.1039 12.6389 15.9773C12.6389 15.8507 12.6892 15.7293 12.7787 15.6398C12.8682 15.5503 12.9896 15.5 13.1162 15.5H15.1844V13.4318C15.1844 13.3052 15.2346 13.1838 15.3242 13.0943C15.4137 13.0048 15.5351 12.9545 15.6616 12.9545C15.7882 12.9545 15.9096 13.0048 15.9991 13.0943C16.0886 13.1838 16.1389 13.3052 16.1389 13.4318V15.5H18.2071C18.3337 15.5 18.4551 15.5503 18.5446 15.6398C18.6341 15.7293 18.6844 15.8507 18.6844 15.9773C18.6844 16.1039 18.6341 16.2253 18.5446 16.3148C18.4551 16.4043 18.3337 16.4545 18.2071 16.4545ZM11.6844 13.2727C11.5965 13.3701 11.5087 13.2727 11.3662 13.2727C8.97536 13.2727 5.95995 15.5652 5.95995 18.2806C5.9592 18.4071 5.90823 18.5282 5.81825 18.6171C5.72828 18.7061 5.60666 18.7557 5.48014 18.755C5.41746 18.7554 5.35532 18.7434 5.29727 18.7198C5.23922 18.6961 5.1864 18.6613 5.14181 18.6172C5.09723 18.5732 5.06176 18.5208 5.03742 18.463C5.01309 18.4053 5.00037 18.3433 5 18.2806C5 16.0368 6.87441 13.4932 9.51723 12.6889C8.25373 11.9835 7.548 10.6732 7.548 9.13636C7.548 6.86582 9.38773 5 11.6844 5C13.981 5 15.8207 6.86582 15.8207 9.13636C15.8207 11.3948 13.9641 13.253 11.6844 13.2727ZM11.6844 5.95455C9.92036 5.95455 8.50255 7.39241 8.50255 9.13636C8.50255 10.8803 9.92036 12.3182 11.6844 12.3182C13.4484 12.3182 14.8662 10.8803 14.8662 9.13636C14.8662 7.39241 13.4484 5.95455 11.6844 5.95455Z" fill="white"/>
              </svg>
            </button>
          </div>
          <div v-else>
            <div v-if="curation.curatorProfile" class="flex items-center ml-10px">
              <img v-for="i of curation.curatorProfile" :key="i"
                   class="w-24px h-24px min-w-24px min-h-24px
                        2xl:w-1.2rem 2xl:h-1.2rem 2xl:min-w-1.2rem 2xl:min-h-1.2rem
                        rounded-full -ml-10px border-1 border-blockBg light:border-white"
                   @error="replaceEmptyImg"
                   :src="i" alt="">
              <span v-show="(curation.totalCount ?? 0) - 3 > 0"
                    class="w-24px h-24px min-w-24px min-h-24px xl:w-1.6rem xl:min-w-1.6rem xl:h-1.6rem xl:min-h-1.6rem
                    rounded-full -ml-10px flex justify-center items-center
                    border-1 border-blockBg bg-primaryColor
                    light:border-white light:bg-color62 light:text-white text-10px">
              +{{(curation.totalCount - 3)}}
            </span>
            </div>
          </div>
        </template>
        <div class="flex items-center justify-center"
             :class="showBtnGroup?'':'h-42px 2xl:h-2.1rem absolute right-0 top-0'">
          <ChainTokenIcon class="bg-primaryColor/20"
                          height="24px" width="24px"
                          :chain-name="curation.chainId.toString()"
                          :token="{address: curation?.token, symbol: curation?.tokenSymbol}">
            <template #amount>
            <span class="px-8px h-24px whitespace-nowrap
                         flex items-center text-12px 2xl:text-0.8rem font-bold text-color62">
              {{curation.amount.toString() / (10 ** curation.decimals)}} {{curation.tokenSymbol}}
            </span>
            </template>
          </ChainTokenIcon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import { parseTimestamp, sleep } from '@/utils/helper'
import { mapGetters } from "vuex";
import {formatEmojiText} from "@/utils/tool";
import Blog from "@/components/Blog";
import Repost from "@/components/Repost";
import Space from "@/components/Space";
import ChainTokenIcon from "@/components/ChainTokenIcon";
import {testData} from "@/views/square/test-data";
import { notify } from "@/utils/notify";
import { likeCuration, followCuration, checkMyCurationRecord } from "@/utils/curation";
import ContentTags from "@/components/ContentTags";
import { errCode } from "@/config";

export default {
  name: "CurationItem",
  components: {Blog,Repost, Space, ChainTokenIcon, ContentTags},
  props: {
    curation: {
      type: Object,
      default: {}
    },
    showBtnGroup: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      testData,
      enableFold: true,
      isFold: false,
      isLiking: false,
      isFollowing: false,
      isEnd: false,
      isQuoting: false,
      isRepling: false
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo']),
    profileImg() {
      return this.curation.creatorProfileImg.replace('normal', '200x200')
    },
    contentType() {
      return this.curation.curationType === 1 ? 'tweet' : 'space'
    },
    endtime() {
      if (this.curation.curationStatus === 0){
        return parseTimestamp(this.curation.endtime * 1000)
      }else {
        return this.$t('curation.end')
      }
    },
    title() {
      const t = this.curation.content.split('\n')[0]
      if (t.length > 30) {
        return t.slice(0, 30)
      }else {
        return t
      }
    },
    content() {
      return this.curation.content
    },
    isQuote() {
      if (!this.curation) return false;
      return this.curation.tasks & 1;
    },
    isReply() {
      if (!this.curation) return false;
      return (this.curation.tasks & 2) / 2
    },
    isLike() {
      if (!this.curation) return false;
      return (this.curation.tasks & 4) / 4
    },
    isFollow() {
      if (!this.curation) return false;
      return (this.curation.tasks & 8) / 8
    },
    quoted() {
      if(!this.curation || !this.getAccountInfo) return false
      return this.curation?.taskRecord & 1;
    },
    replyed() {
      if(!this.curation || !this.getAccountInfo) return false
      return (this.curation?.taskRecord & 2) / 2
    },
    liked() {
      if(!this.curation || !this.getAccountInfo) return false
      return (this.curation?.taskRecord & 4) / 4
    },
    followed() {
      if(!this.curation || !this.getAccountInfo) return false
      return (this.curation.taskRecord & 8) / 8
    },
  },
  methods: {
    formatEmojiText,
    replaceEmptyImg(e) {
      e.target.src = emptyAvatar;
    },
    checkLogin() {
      if(!this.getAccountInfo || !this.getAccountInfo.twitterId) {
        this.$store.commit('saveShowLogin', true)
        return false;
      }
      return true
    },
    gotoUserPage() {
      if (!this.getAccountInfo || this.curation.creatorTwitterUsername !== this.getAccountInfo.twitterUsername){
        this.$router.push({path : '/account-info/@' + this.curation.creatorTwitterUsername})
      }
    },
    async quoteOrReply() {
      if (!this.checkLogin() || this.quoted || this.replyed || this.isQuoting || this.isRepling) return

      let url;
      if (this.isQuote) {
        url = `https://twitter.com/intent/tweet?text=tweet%20content%20%23iweb3&url=https://twitter.com/${this.curation.username}/status/${this.curation.tweetId}`
       this.isQuoting = true
      }else {
        url = `https://twitter.com/intent/tweet?in_reply_to=${this.curation.tweetId}&text=%0a%23iweb3`
        this.isRepling = true;
      }
      window.open(url, '__blank');

      await sleep(6)
      let count = 0;
      while(count++ < 50) {
        try {
          const record = await checkMyCurationRecord(this.getAccountInfo.twitterId, this.curation.curationId)
          if (record && record.taskRecord) {
            this.curation.taskRecord = record.taskRecord;
            if (this.isQuote && (record.taskRecord & 1 === 1)) {
              break;
            }
            if (this.isReply && (record.taskRecord & 2 === 2)) {
              break;
            }
          }
        }catch(e) {
          if (e === 'log out') {
            notify({message: this.$t('tips.accessTokenExpire')})
            break;
          }
        }
        await sleep(2)
      }
      this.isQuoting = false
      this.isRepling = false
    },
    async like() {
      if (!this.checkLogin() || this.liked || this.isLiking) return
      try{
        this.isLiking = true
        await likeCuration({...this.curation, twitterId: this.getAccountInfo.twitterId});
        this.curation.taskRecord = this.curation.taskRecord | 4
      } catch (e) {
        if (e === 'log out') {
          this.$store.commit('saveShowLogin', true)
          return;
        }else if (e === errCode.TWEET_NOT_FOUND) {
          notify({message: this.$t('tips.tweetNotFound'), type: "info", duration: 5000})
          return
        }
        notify({message:this.$t('err.serverErr'), type:'error'})
      } finally {
        this.isLiking = false
      }
    },
    async follow() {
      if (!this.checkLogin() || this.followed || this.isFollowing) return
      try{
        this.isFollowing = true
        await followCuration({...this.curation, twitterId: this.getAccountInfo.twitterId})
        this.curation.taskRecord = this.curation?.taskRecord | 8
      } catch (e) {
        if (e === 'log out') {
          this.$store.commit('saveShowLogin', true)
          return;
        }
        notify({message:this.$t('err.serverErr'), type:'error'})
      } finally {
        this.isFollowing = false
      }
    }
  },
  mounted() {
    this.enableFold = this.$refs.blogRef?.clientHeight > 200
    this.isEnd = this.curation.curationStatus > 0
  }
}
</script>

<style scoped>

</style>
