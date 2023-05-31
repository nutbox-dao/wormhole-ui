<template>
  <div class="relative">
    <div class="flex items-center pb-8px" @click.stop>
      <div class="flex-1 flex justify-between items-center">
        <div class="flex items-center">
          <div class="flex flex-col justify-between items-start cursor-pointer light:text-color59
                        c-text-black text-16px leading-20px 2xl:text-0.7rem 2xl:leading-0.9rem mr-5px"
               @click.stop="gotoUserPage()">
            <a class="c-text-black text-left text-1rem leading-1.5rem c-text-black">
              {{curation.creatorTwitterUsername}} created a curation
            </a>
          </div>
        </div>
        <ChainTokenIconLarge class="bg-color62"
                             height="26px" width="26px"
                             :chain-name="curation.chainId.toString()"
                             :token="{address: curation?.token, symbol: curation?.tokenSymbol}">
          <template #amount>
            <span class="pl-30px pr-8px h-20px whitespace-nowrap
                         flex items-center text-12px 2xl:text-0.8rem font-bold text-white">
              {{curation.amount.toString() / (10 ** curation.decimals)}} {{curation.tokenSymbol}}
            </span>
          </template>
        </ChainTokenIconLarge>
      </div>
    </div>
    <div v-if="contentType==='tweet'">
      <Blog :post="curation"
            content-class="multi-content"
            avatar-class="min-w-35px min-h-35px w-2.2rem h-2.2rem md:w-3rem md:h-3rem">
        <template #bottom-btn-bar><div></div></template>
        <template #blog-tag><div></div></template>
        <template #blog-reward><div></div></template>
      </Blog>
    </div>
    <div v-if="contentType==='space'">
      <Space :space="curation"
             avatar-class="min-w-35px min-h-35px w-2.2rem h-2.2rem md:w-3rem md:h-3rem">
        <template #bottom-btn-bar><div></div></template>
      </Space>
    </div>
    <div class="flex items-center">
      <div class="block min-w-35px w-2.2rem md:w-3rem mr-10px"></div>
      <div class="flex gap-x-0.8rem font-200 text-0.6rem flex-wrap text-color8B light:text-color7D blog-tag">
        <button class="border-1 border-color62 py-3px px-6px rounded-full mt-10px
                        whitespace-nowrap cursor-pointer"
                :class="selectedTag === cTag?'bg-color62 text-white':'text-color62 light:bg-colorF1'"
                v-for="cTag of JSON.parse(curation.topics || '[]')" :key="cTag"
                @click.stop="onSelectTag(cTag)">
          {{cTag}}
        </button>
      </div>
    </div>
    <van-popup class="c-tip-drawer 2xl:w-2/5"
               v-model:show="showLowerReputation"
               :position="position">
      <div class="modal-bg w-full md:w-560px 2xl:max-w-28rem
      max-h-80vh 2xl:max-h-28rem overflow-auto flex flex-col
      rounded-t-1.5rem md:rounded-b-1.5rem pt-1rem md:py-2rem">
        <div class="flex-1 overflow-auto px-1rem xl:px-2.5rem no-scroll-bar">
          <div class="text-left px-1.25rem pb-3rem sm:pb-1.5rem flex flex-col text-14px 2xl:text-0.8rem overflow-auto">
            <div class="flex-1">
              <div class="text-20px 2xl:text-1rem c-text-black mb-1rem">Attention</div>
              <div>
                {{ $t('curation.lowerReputation') }}
              </div>
            </div>
            <div class="flex items-center justify-center gap-x-1rem mt-1rem">
              <button class="c-text-black bg-color84 light:bg-colorD6 light:text-white
                         w-full h-44px 2xl:h-2.2rem px-2.5rem mx-auto rounded-full text-16px 2xl:text-0.8rem mr-1.25rem"
                      @click.stop="showLowerReputation=false">{{ $t('common.cancel') }}</button>
              <button class="gradient-btn gradient-btn-disabled-grey flex items-center justify-center
                            h-44px 2xl:h-2.2rem w-full rounded-full text-16px 2xl:text-0.8rem"
                      @click.stop="isRetweet ? retweet() : confirmQuest()">
                {{ $t('common.confirm') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
    <van-popup class="c-tip-drawer 2xl:w-2/5"
               v-model:show="showTweetEditor"
               teleport="body"
               :position="position">
      <div class="modal-bg w-full md:w-560px 2xl:max-w-28rem
      max-h-80vh 2xl:max-h-28rem overflow-auto flex flex-col
      rounded-t-1.5rem md:rounded-b-1.5rem pt-1rem md:py-2rem">
        <div class="flex-1 overflow-auto px-1rem xl:px-2.5rem no-scroll-bar">
          <div class="flex-1 px-1.5rem mt-0.5rem flex flex-col">
            <div class="flex-1">
              <div class="mt-0.5rem mb-2rem">{{$t('curation.quoteOrReplyTip')}}</div>
              <div class="border-1 bg-black/40 border-1 border-color8B/30
                          light:bg-white light:border-colorE3 hover:border-primaryColor
                          rounded-8px">
                <div contenteditable
                     class="desc-input px-1rem pt-1rem min-h-6rem whitespace-pre-line leading-24px xl:leading-1.2rem"
                     ref="contentRef"
                     @blur="getBlur('desc')"
                     @paste="onPasteEmojiContent"
                     @keydown="showQuoteContentTip=false"
                     v-html="contentEl"></div>
                <div class="py-2 border-color8B/30 flex justify-between">
                  <el-popover ref="descEmojiPopover" :placement="position"
                              trigger="click" width="300"
                              :teleported="true"
                              :persistent="false">
                    <template #reference>
                      <img class="w-1.8rem h-1.8rem lg:w-1.4rem lg:h-1.4rem mx-8px" src="~@/assets/icon-emoji.svg" alt="">
                    </template>
                    <div class="h-310px">
                      <EmojiPicker :options="{
                                      imgSrc:'/emoji/',
                                      locals: $i18n.locale==='zh'?'zh_CN':'en',
                                      hasSkinTones:false,
                                      hasGroupIcons:false}"
                                   @select="selectEmoji" />
                    </div>
                  </el-popover>
                </div>
              </div>
            </div>
            <span v-show="showQuoteContentTip" class="mt-0.4rem text-redColor text-0.8rem">
              {{ quoteTipStr }}
            </span>
            <div class="text-center mb-1.4rem mt-1.6rem flex items-center justify-center">
              <button class="c-text-black bg-color84 light:bg-colorD6 light:text-white
                         w-full h-44px 2xl:h-2.2rem mx-auto rounded-full text-16px 2xl:text-0.8rem mr-1.25rem"
                      @click.stop="showTweetEditor=false">
                {{ $t('common.cancel') }}
              </button>
              <button class="gradient-btn h-44px 2xl:h-2.2rem w-full rounded-full text-16px 2xl:text-0.8rem
                          flex items-center justify-center mx-auto"
                      :disabled="isQuoting || isRepling"
                      @click.stop="quoteOrReply">
                {{ isQuote ? $t('curation.quote') : $t('curation.reply') }}
                <c-spinner class="w-1.5rem h-1.5rem ml-0.5rem" v-show="isQuoting || isRepling"></c-spinner>
              </button>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import { parseTimestamp, sleep, stringLength } from '@/utils/helper'
import {mapGetters, mapState} from "vuex";
import Blog from "@/components/Blog";
import Repost from "@/components/Repost";
import Space from "@/components/Space";
import { EmojiPicker } from 'vue3-twemoji-picker-final'
import ChainTokenIconLarge from "@/components/ChainTokenIconLarge";
import {testData} from "@/views/square/test-data";
import { notify } from "@/utils/notify";
import { likeCuration, followCuration, quoteCuration, replyCuration, retweetCuration, checkMyCurationRecord } from "@/utils/curation";
import ContentTags from "@/components/ContentTags";
import { errCode } from "@/config";
import {formatEmojiText, onPasteEmojiContent} from "@/utils/tool";

export default {
  name: "CurationItem",
  components: {Blog,Repost, Space, ChainTokenIconLarge, ContentTags, EmojiPicker},
  props: {
    curation: {
      type: Object,
      default: {}
    },
    showBtnGroup: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      position: document.body.clientWidth < 768?'bottom':'center',
      testData,
      enableFold: true,
      isFold: false,
      isLiking: false,
      isFollowing: false,
      isEnd: false,
      isQuoting: false,
      isRepling: false,
      isRetweeting: false,
      showLowerReputation: false,
      showTweetEditor: false,
      contentEl: '',
      tweetLength: 0,
      contentRange: null,
      showQuoteContentTip: false,
      quoteTipStr: ''
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo']),
    ...mapState('curation', ['selectedTag']),
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
    isRetweet() {
      if (!this.curation) return false;
      return (this.curation.tasks & 16) / 16
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
    retweeted() {
      if (!this.curation || !this.getAccountInfo) return false
      return (this.curation?.taskRecord & 16) / 16
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
    onPasteEmojiContent,
    formatEmojiText,
    getBlur() {
      const sel = window.getSelection();
      this.contentRange = sel.getRangeAt(0);
    },
    onSelectTag(tag) {
      this.$store.commit('curation/saveSelectedTag', tag)
    },
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
    selectEmoji(e) {
      const newNode = document.createElement('img')
      newNode.alt = e.i
      newNode.src = e.imgSrc
      newNode.className = 'inline-block w-18px h-18px mx-2px'
      if(!this.contentRange) return
      this.contentRange.insertNode(newNode)
      this.$refs.descEmojiPopover.hide()
    },
    formatElToTextContent(el) {
      el.innerHTML = el.innerHTML.replaceAll('<div>', '\n')
      el.innerHTML =el.innerHTML.replaceAll('</div>', '\n')
      el.innerHTML =el.innerHTML.replaceAll('<br>', '')
      let content = ''
      let tweetLength = 0;
      for(let i of el.childNodes) {
        if(i.nodeName==='#text') {
          tweetLength += stringLength(i.textContent);
          content += i.textContent
        } else if(i.nodeName === 'IMG') {
          tweetLength+=2;
          content += i.alt
        }
      }
      this.tweetLength = tweetLength
      return content
    },
    async preQuoteOrReply() {
      if (!this.checkLogin()) return
      if (this.isRepling || this.isQuoting || this.isRetweeting || this.retweeted || this.quoted || this.replyed) return;
      // check reputation
      if (this.curation.minReputation > 0) {
        if (this.getAccountInfo.reputation < this.curation.minReputation) {
          this.showLowerReputation = true;
          return;
        }
      }
      if (this.isRetweet) {
        this.retweet()
      }else {
        this.contentRange = null;
        this.contentEl = '';
        this.showTweetEditor = true;
      }
    },
    async confirmQuest() {
      this.showLowerReputation = false;
      this.showTweetEditor = true
    },
    async retweet() {
      this.showLowerReputation = false;
      try{
        this.isRetweeting = true;
        const twitterId = this.getAccountInfo?.twitterId;
        const result = await retweetCuration(twitterId, this.curation.curationId);
        let nyCard = result.nyCard;
        if (nyCard && nyCard.cardId > 0) {
          this.$store.commit('saveNewCardId', nyCard.cardId)
          this.$store.commit('saveGetCardVisible', true)
        }
        this.curation.taskRecord = this.curation.taskRecord | 16
        this.showTweetEditor = false
      } catch (e) {
        if (e === 'log out') {
          this.$store.commit('saveShowLogin', true)
          return;
        }else if (e === errCode.TWEET_NOT_FOUND) {
          notify({message: this.$t('tips.tweetNotFound'), type: 'info', duration: 5000})
          return;
        }
        notify({message:this.$t('err.serverErr'), type:'error'})
      } finally {
        this.isRetweeting = false
      }
    },
    async quoteOrReply() {
      this.showLowerReputation = false;
      const content = this.formatElToTextContent(this.$refs.contentRef)
      if (content.length < 10) {
        this.showQuoteContentTip = true;
        this.quoteTipStr = this.$t('curation.inputMoreWords')
        return;
      }


      try{
        const twitterId = this.getAccountInfo?.twitterId;
        const userInfo = {
          name: this.getAccountInfo?.twitterName,
          username: this.getAccountInfo?.twitterUsername,
          profileImg: this.getAccountInfo?.profileImg,
          steemId: this.getAccountInfo?.steemId
        }
        if (this.isQuote) {
          this.isQuoting = true;
          const result = await quoteCuration(twitterId, userInfo, content, this.curation.curationId)
          let nyCard = result.nyCard;

          if (nyCard && nyCard.cardId > 0) {
            this.$store.commit('saveNewCardId', nyCard.cardId)
            this.$store.commit('saveGetCardVisible', true)
          }
          this.curation.taskRecord = this.curation.taskRecord | 1
          this.showTweetEditor = false
        }else if (this.isReply) {
          this.isRepling = true
          const result = await replyCuration(twitterId, userInfo, content, this.curation.curationId)
          let nyCard = result.nyCard;

          if (nyCard && nyCard.cardId > 0) {
            this.$store.commit('saveNewCardId', nyCard.cardId)
            this.$store.commit('saveGetCardVisible', true)
          }
          this.curation.taskRecord = this.curation.taskRecord | 2
          this.showTweetEditor = false
        }
      } catch (e) {
        if (e === 303) {
          this.showQuoteContentTip = true;
          this.quoteTipStr = this.$t('curation.inputRelatedWords')
          return
        }
        if (e === 'log out') {
          this.$store.commit('saveShowLogin', true)
          return;
        }else if (e === errCode.TWEET_NOT_FOUND) {
          notify({message: this.$t('tips.tweetNotFound'), type: 'info', duration: 5000})
          return;
        }
        notify({message:this.$t('err.serverErr'), type:'error'})
      } finally {
        this.isQuoting = false
        this.isRepling = false
        this.isRetweeting = false
      }
    },
    async like() {
      if (!this.checkLogin() || this.liked || this.isLiking) return
      try{
        this.isLiking = true
        const result = await likeCuration({...this.curation, twitterId: this.getAccountInfo.twitterId});
        let nyCard = result.nyCard;

        if (nyCard && nyCard.cardId > 0) {
          this.$store.commit('saveNewCardId', nyCard.cardId)
          this.$store.commit('saveGetCardVisible', true)
        }
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
        const result = await followCuration({...this.curation, twitterId: this.getAccountInfo.twitterId})
        let nyCard = result.nyCard;

        if (nyCard && nyCard.cardId > 0) {
          this.$store.commit('saveNewCardId', nyCard.cardId)
          this.$store.commit('saveGetCardVisible', true)
        }
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
    // this.enableFold = this.$refs.blogRef?.clientHeight > 200
    this.isEnd = this.curation.curationStatus > 0
  }
}
</script>

<style scoped>

</style>
