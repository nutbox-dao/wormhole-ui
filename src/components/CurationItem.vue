<template>
  <div class="">
    <div class="relative">
      <div class="flex items-center pb-8px" @click.stop>
        <div class="flex-1 flex justify-between items-center px-15px">
          <div class="flex items-center">
            <div class="flex flex-col justify-between items-start cursor-pointer light:text-color59
                        c-text-black text-14px leading-18px 2xl:text-0.7rem 2xl:leading-0.9rem"
                 @click.stop="gotoUserPage()">
              <a class="c-text-black text-left mr-3 text-1rem leading-1.5rem">{{curation.creatorTwitterUsername}} created a curation</a>
<!--              <span class="text-orangeColor light:text-color62 text-12px xl:text-0.75rem">{{endtime}}</span>-->
            </div>
            <ContentTags v-if="showBtnGroup" :is-quote="isQuote" :is-reply="isReply" :content-type="contentType"/>
            <slot name="status"></slot>
          </div>
        </div>
      </div>
      <div class="px-15px pt-10px bg-blockBg light:bg-white mb-20px rounded-15px shadow-card"
           :class="showBtnGroup?'pb-15px':''">
        <div v-if="contentType==='tweet'">
          <Blog :post="curation"
                content-class="multi-content"
                avatar-class="min-w-35px min-h-35px w-2.2rem h-2.2rem md:w-3rem md:h-3rem">
            <template #bottom-btn-bar><div></div></template>
            <template #blog-tag><div></div></template>
          </Blog>
        </div>
        <div v-if="contentType==='space'"
             class="h-140px md:h-10rem overflow-hidden relative my-10px">
          <Space :space="curation" class="rounded-15px h-full bg-tag-gradient"/>
        </div>
        <div class="flex">
          <div class="hidden sm:block sm:min-w-35px sm:w-2.2rem md:w-3rem mr-10px md:mr-1rem"></div>
          <div class="flex gap-x-0.8rem font-200 text-0.6rem flex-wrap text-color8B light:text-color7D blog-tag">
            <button class="border-1 border-color62 py-3px px-6px rounded-full mt-10px
                        whitespace-nowrap cursor-pointer"
                    :class="selectedTag === cTag?'bg-color62 text-white':'light:text-color46 bg-color62/20'"
                    v-for="cTag of JSON.parse(curation.topics || '[]')" :key="cTag"
                    @click.stop="onSelectTag(cTag)">
              {{cTag}}
            </button>
          </div>
        </div>
        <div class="flex justify-between items-center mt-1rem" @click.stop>
          <template v-if="showBtnGroup">
            <div v-if="!isEnd" class="flex-1 flex items-center">
              <div class="hidden sm:block sm:min-w-35px sm:w-2.2rem md:w-3rem mr-10px md:mr-1rem"></div>
              <!-- reply-->
              <div v-if="isReply" class="flex items-center mr-24px">
                <button @click.stop="preQuoteOrReply"
                        class="text-white flex justify-center items-center w-24px h-24px rounded-full">
                  <i v-if="isRepling" class="w-20px h-20px rounded-full bg-colorEA">
                    <img class="w-20px h-20px" src="~@/assets/icon-loading.svg" alt="">
                  </i>
                  <i v-else class="w-20px h-20px min-w-20px" :class="replyed?'btn-icon-reply-active':'btn-icon-reply'"></i>
                </button>
                <span class="ml-6px font-700 text-12px" :class="replyed?'text-color62':''">{{ curation.replied }}</span>
              </div>
              <!-- quote-->
              <div v-if="isQuote" class="flex items-center mr-24px">
                <button @click.stop="preQuoteOrReply"
                        :disabled="isRepling || isQuoting || isRetweeting"
                        class="text-white flex justify-center items-center w-20px h-20px rounded-full">
                  <i v-if="isQuoting" class="w-20px h-20px rounded-full bg-colorEA">
                    <img class="w-20px h-20px" src="~@/assets/icon-loading.svg" alt="">
                  </i>
                  <i v-else class="w-20px h-20px min-w-20px" :class="quoted?'btn-icon-quote-active':'btn-icon-quote'"></i>
                </button>
                <span class="ml-6px font-700 text-12px" :class="quoted?'text-color62':''">{{ curation.quoted }}</span>
              </div>
              <!-- retweet -->
              <div v-if="isRetweet" class="flex items-center mr-24px">
                <button @click.stop="preQuoteOrReply"
                        :disabled="isRepling || isQuoting || isRetweeting"
                        class="text-white flex justify-center items-center w-20px h-20px rounded-full">
                  <i v-if="isRetweeting" class="w-20px h-20px rounded-full bg-colorEA">
                    <img class="w-20px h-20px" src="~@/assets/icon-loading.svg" alt="">
                  </i>
                  <i v-else class="w-20px h-20px min-w-20px" :class="retweeted?'btn-icon-quote-active':'btn-icon-quote'"></i>
                </button>
                <span class="ml-6px font-700 text-12px" :class="retweeted?'text-color62':''">{{ curation.retweeted }}</span>
              </div>
              <!-- like-->
              <div v-if="isLike" class="flex items-center mr-24px">
                <button :disabled="isLiking"
                        @click.stop="like"
                        class="flex items-center">
                  <i v-if="isLiking" class="w-20px h-20px rounded-full bg-colorEA">
                    <img class="w-20px h-20px" src="~@/assets/icon-loading.svg" alt="">
                  </i>
                  <i v-else class="w-20px h-20px min-w-20px" :class="liked?'btn-icon-like-active':'btn-icon-like'"></i>
                </button>
                <span class="ml-6px font-700 text-12px" :class="liked?'text-color62':''">{{ curation.liked }}</span>
              </div>
              <!-- follow-->
<!--              <button v-if="isFollow"-->
<!--                      :disabled="isFollowing"-->
<!--                      @click.stop="follow"-->
<!--                      class="flex items-center" >-->
<!--                <i v-if="isFollowing" class="w-20px h-20px rounded-full bg-colorEA">-->
<!--                  <img class="w-20px h-20px" src="~@/assets/icon-loading.svg" alt="">-->
<!--                </i>-->
<!--                <i v-else class="w-20px h-20px min-w-20px" :class="followed?'btn-icon-follow-active':'btn-icon-follow'"></i>-->
<!--              </button>-->
            </div>
            <div v-else>
              <div v-if="curation.curatorProfile" class="flex items-center ml-10px">
                <img v-for="i of curation.curatorProfile" :key="i"
                     class="w-20px h-20px min-w-20px min-h-20px
                        2xl:w-1.2rem 2xl:h-1.2rem 2xl:min-w-1.2rem 2xl:min-h-1.2rem
                        rounded-full -ml-10px border-1 border-blockBg light:border-white"
                     @error="replaceEmptyImg"
                     :src="i" alt="">
                <span v-show="(curation.totalCount ?? 0) - 3 > 0"
                      class="min-w-20px px-4px h-20px min-w-20px min-h-20px xl:w-1.6rem xl:min-w-1.6rem xl:h-1.6rem xl:min-h-1.6rem
                    rounded-full -ml-10px flex justify-center items-center
                    border-1 border-blockBg bg-primaryColor
                    light:border-white light:bg-color62 light:text-white text-10px">
              +{{(curation.totalCount - 3)}}
            </span>
              </div>
            </div>
          </template>
          <div class="flex items-center justify-center ml-20px"
               :class="showBtnGroup?'':' absolute right-0 -top-2px'">
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
              <button class="gradient-btn gradient-btn-disabled-grey
                            h-44px 2xl:h-2.2rem w-full rounded-full text-16px 2xl:text-0.8rem"
                      @click.stop="showLowerReputation=false">{{ $t('common.cancel') }}</button>
              <button class="gradient-btn gradient-btn-disabled-grey flex items-center justify-center
                            h-44px 2xl:h-2.2rem w-full rounded-full text-16px 2xl:text-0.8rem"
                      @click.stop="quoteOrReply">
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
                              :teleported="false"
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
                         w-full h-44px 2xl:h-2.2rem px-2.5rem mx-auto rounded-full text-16px 2xl:text-0.8rem mr-1.25rem"  
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
      default: true
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
        this.quoteOrReply()
      }else {
        this.contentRange = null;
        this.contentEl = '';
        this.showTweetEditor = true;
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
        }else if(this.isRetweet) {
          this.isRetweeting = true;
          const result = await retweetCuration(twitterId, this.curation.curationId);
          let nyCard = result.nyCard;
          if (nyCard && nyCard.cardId > 0) {
            this.$store.commit('saveNewCardId', nyCard.cardId)
            this.$store.commit('saveGetCardVisible', true)
          }
          this.curation.taskRecord = this.curation.taskRecord | 16
          this.showTweetEditor = false
        }
      } catch (e) {
        if (e === 303) {
          this.showQuoteContentTip = true;
          this.quoteTipStr = this.$t('curation.inputRelatedWords')
          return
        }
      } finally {
        this.isQuoting = false
        this.isRepling = false
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
