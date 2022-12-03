<template>
  <div class="relative">
    <div class="flex items-center justify-between">
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
            </div>
            <ContentTags :is-quote="isQuote" :is-reply="isReply" :content-type="contentType"/>
            <slot name="status"></slot>
          </div>
        </div>
      </div>
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
    <div class="text-left mt-1rem">
      <div class="c-text-black">{{$t('curation.desc')}}</div>
      <div class="text-color7D mt-8px">{{curation?.description}}</div>
      <div v-if="curation?.endtime < (new Date().getTime() / 1000)" class="flex justify-between items-center mt-1rem c-text-black">
        <span class="">End Time</span>
        <button class="h-26px xl:1.3rem px-1rem bg-color7D/20 text-color7D rounded-5px">
          {{curation?.endtime}}
        </button>
        <van-count-down class="text-orangeColor font-bold"
                        :time="popTime(popup)" format="mm:ss" />
      </div>
      <!-- ongoing -->
      <div v-else class="flex justify-between items-center mt-1rem c-text-black">
        <span class="">Expiration</span>
        <button class="h-26px xl:1.3rem px-1rem bg-primaryColor/20 text-color62 rounded-5px">
          {{curation?.endtime}}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import { parseTimestamp } from '@/utils/helper'
import { mapGetters } from "vuex";
import {formatEmojiText} from "@/utils/tool";
import ChainTokenIcon from "@/components/ChainTokenIcon";
import {testData} from "@/views/square/test-data";
import { notify } from "@/utils/notify";
import { likeCuration, followCuration } from "@/utils/curation";
import ContentTags from "@/components/ContentTags";

export default {
  name: "CurationItem",
  components: {ChainTokenIcon, ContentTags},
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
      isEnd: false
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
    quoteOrReply() {
      if (!this.checkLogin()) return
      let url;
      if (this.isQuote) {
        url = `https://twitter.com/intent/tweet?text=tweet%20content%20%23iweb3&url=https://twitter.com/${this.curation.username}/status/${this.curation.tweetId}`
        this.curation.taskRecord = this.curation.taskRecord | 1
      }else {
        url = `https://twitter.com/intent/tweet?in_reply_to=${this.curation.tweetId}&text=%0a%23iweb3`
        this.curation.taskRecord = this.curation.taskRecord | 2
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
        await likeCuration({...this.curation, twitterId: this.getAccountInfo.twitterId});
        this.curation.taskRecord = this.curation.taskRecord | 4
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
        await followCuration({...this.curation, twitterId: this.getAccountInfo.twitterId})
        this.curation.taskRecord = this.curation?.taskRecord | 8
      } catch (e) {
        if (e === 'log out') {
          this.$store.commit('saveShowLogin', true)
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
