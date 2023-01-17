<template>
  <div class="">
    <div class="relative">
      <div class="px-15px py-10px bg-blockBg light:bg-white mb-10px rounded-15px shadow-card"
           :class="showBtnGroup?'pb-15px':''">
        <div v-if="contentType==='tweet'">
          <BlogRecommend :post="curation"
                         content-class="multi-content"
                         avatar-class="min-w-35px min-h-35px w-2.2rem h-2.2rem md:w-3rem md:h-3rem">
            <template #token>
              <ChainTokenIconLarge class="bg-color62"
                              height="26px" width="26px"
                              :chain-name="curation.chainId.toString()"
                              :token="{address: curation?.token, symbol: curation?.tokenSymbol}">
                <template #amount>
              <span class="pl-30px pr-8px h-20px 2xl:h-24px whitespace-nowrap
                           flex items-center text-12px 2xl:text-0.8rem font-bold text-white">
                {{curation.amount.toString() / (10 ** curation.decimals)}} {{curation.tokenSymbol}}
              </span>
                </template>
              </ChainTokenIconLarge>
            </template>
            <template #bottom-btn-bar><div></div></template>
            <template #blog-tag><div></div></template>
          </BlogRecommend>
        </div>
        <div v-if="contentType==='space'"
             class="h-140px md:h-10rem overflow-hidden relative my-10px">
          <Space :space="curation" class="rounded-15px h-full bg-tag-gradient"/>
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
import BlogRecommend from "@/components/BlogRecommend";
import Repost from "@/components/Repost";
import Space from "@/components/Space";
import ChainTokenIconLarge from "@/components/ChainTokenIconLarge";
import {testData} from "@/views/square/test-data";
import { notify } from "@/utils/notify";
import { likeCuration, followCuration, checkMyCurationRecord } from "@/utils/curation";
import ContentTags from "@/components/ContentTags";
import { errCode } from "@/config";

export default {
  name: "CurationRecommendItem",
  components: {BlogRecommend,Repost, Space, ChainTokenIconLarge, ContentTags},
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
    // 获取卡片
    getCard() {
      this.$emit('getCard')
    },
    async quoteOrReply() {
      if (!this.checkLogin() || this.quoted || this.replyed || this.isQuoting || this.isRepling) return

      let url;
      if (this.isQuote) {
        url = `https://twitter.com/intent/tweet?text=%0a%23iweb3&url=https://twitter.com/${this.curation.username}/status/${this.curation.tweetId}`
       this.isQuoting = true
      }else {
        url = `https://twitter.com/intent/tweet?in_reply_to=${this.curation.tweetId}&text=%0a%23iweb3`
        this.isRepling = true;
      }
      window.open(url, '__blank');

      await sleep(6)
      let count = 0;
      while(count++ < 20) {
        try {
          let record = await checkMyCurationRecord(this.getAccountInfo.twitterId, this.curation.curationId)
          if (record && record.record && record.record.taskRecord) {
            const nyCard = record.nyCard;

            if (nyCard && nyCard.cardId > 0) {
              this.$store.commit('saveNewCardId', nyCard.cardId)
              this.$store.commit('saveGetCardVisible', true)
            }
            record = record.record;
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
        await sleep(4)
      }
      this.isQuoting = false
      this.isRepling = false
    }
  },
  mounted() {
    // this.enableFold = this.$refs.blogRef?.clientHeight > 200
    this.isEnd = this.curation.curationStatus > 0
  }
}
</script>

<style scoped>

</style>
