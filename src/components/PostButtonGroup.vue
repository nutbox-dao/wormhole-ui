<template>
  <div class="flex justify-between items-center gap-8px flex-1 max-w-425px">
    <!-- <div class="hidden sm:block sm:min-w-35px sm:w-2.2rem md:w-3rem mr-10px md:mr-1rem"></div> -->
    <!-- follow-->
    <div v-if="false" class="flex justify-between items-center">
      <button @click.stop="userFollow"
              :disabled="isFollowing || post.followed"
              class="text-white flex justify-center items-center w-24px h-24px rounded-full disabled-no-opacity">
        <i v-if="isFollowing" class="w-20px h-20px rounded-full bg-colorEA">
          <img class="w-20px h-20px" src="~@/assets/icon-loading.svg" alt="">
        </i>
        <i v-else class="w-20px h-20px min-w-20px" :class="post.followed?'btn-icon-follow-active':'btn-icon-follow'"></i>
      </button>
      <span class="px-8px font-700 text-12px" :class="post.followed?'text-color62':'text-colorB8'">{{ post.followCount ?? 0 }}</span>
    </div>
    <!-- like-->
    <button class="flex justify-center items-center"
            :disabled="isLiking || unLiked || liked"
            @click.stop="userLike">
      <img v-if="isLiking" class="w-20px h-20px" src="~@/assets/icon-loading.svg" alt="">
      <i v-else class="w-20px h-20px min-w-20px" :class="liked?'btn-icon-like-active':'btn-icon-like'"></i>
      <span class="pl-8px font-700 text-12px" :class="liked?'text-color62':'text-colorB8'">{{ post.likeCount ?? 0 }}</span>
    </button>
    <!-- retweet -->
    <button @click.stop="userRetweet"
            :disabled="isRepling || isQuoting || isRetweeting || post.retweeted || unLiked"
            class="flex items-center">
      <img v-if="isRetweeting" class="w-20px h-20px" src="~@/assets/icon-loading.svg" alt="">
      <i v-else class="w-20px h-20px min-w-20px" :class="post.retweeted?'btn-icon-retweet-active':'btn-icon-retweet'"></i>
      <span class="px-8px font-700 text-12px" :class="post.retweeted?'text-color62':'text-colorB8'">{{ post.retweetCount ?? 0 }}</span>
    </button>
    <!-- quote-->
    <button @click.stop="preQuote"
            :disabled="isRepling || isQuoting || isRetweeting || post.quoted || unLiked"
            class="flex items-center">
      <img v-if="isQuoting" class="w-20px h-20px" src="~@/assets/icon-loading.svg" alt="">
      <i v-else class="w-20px h-20px min-w-20px" :class="post.quoted?'btn-icon-quote-active':'btn-icon-quote'"></i>
      <span class="px-8px font-700 text-12px" :class="post.quoted?'text-color62':'text-colorB8'">{{ post.quoteCount ?? 0 }}</span>
    </button>
    <!-- reply-->
    <button  @click.stop="preReply"
              :disabled="isRepling || isQuoting || isRetweeting"
               class="flex justify-between items-center">
      <img v-if="isRepling" class="w-20px h-20px" src="~@/assets/icon-loading.svg" alt="">
      <i v-else class="w-20px h-20px min-w-20px" :class="post.replied?'btn-icon-reply-active':'btn-icon-reply'"></i>
      <span class="px-8px font-700 text-12px" :class="post.replied?'text-color62':'text-colorB8'">{{ post.replyCount ?? 0 }}</span>
    </button>

    <!-- dislike-->
    <button :disabled="isLiking || liked || unLiked || post.quoted || post.retweeted"
            @click.stop="userUnLike"
            class="flex justify-center items-center">
      <img v-if="isLiking" class="w-20px h-20px" src="~@/assets/icon-loading.svg" alt="">
      <i v-else class="w-20px h-20px min-w-20px" :class="unLiked?'btn-icon-dislike-active':'btn-icon-dislike'"></i>
      <span class="pl-8px font-700 text-12px" :class="unLiked?'text-color62':'text-colorB8'">{{ post.unLikeCount ?? 0 }}</span>
    </button>
    <!--    reply-->
    <van-popup class="md:w-600px bg-black light:bg-transparent w-full"
               teleport="body"
               :class="position==='center'?'rounded-12px':'rounded-t-12px'"
               v-model:show="replyVisible"
               :position="position">
      <transition name="el-zoom-in-bottom">
        <div v-if="replyVisible"
             class="relative dark:bg-glass light:bg-colorF7 rounded-t-12px overflow-hidden max-h-80vh
                    flex flex-col">
          <div class="p-15px">
            <button @click="replyVisible=false">
              <i class="w-18px h-18px 2xl:w-1rem 2xl:h-1rem icon-close"></i>
            </button>
          </div>
          <div class="flex-1 overflow-auto px-15px no-scroll-bar">
            <div class="flex justify-start items-stretch">
              <div class="flex flex-col items-center mr-10px md:mr-1rem">
                <img class="rounded-full gradient-border w-3.6rem h-3.6rem min-w-3.6rem"
                     :src="profileImg" alt="">
                <div class="flex-1 my-10px w-2px bg-color8B/30 light:bg-color7D"></div>
              </div>
              <div class="flex-1">
                <div class="flex-1 flex items-center flex-wrap">
                  <div class="flex items-center flex-wrap">
                <span class="c-text-black text-left mr-3 cursor-pointer
                      text-16px leading-18px 2xl:text-1rem 2xl:leading-1.5rem light:text-blueDark">
                  {{ post.name }}
                </span>
                  </div>
                  <div class="flex items-center id-time">
                  <span class="text-12px leading-18px 2xl:text-14px 2xl:leading-18px text-color8B light:text-color7D">
                    @{{ post.username }}
                  </span>
                    <span class="mx-4px text-color8B light:text-color7D"> · </span>
                    <span class="whitespace-nowrap text-color8B light:text-color7D
                                 text-12px leading-18px 2xl:text-14px 2xl:leading-18px ">
                    {{ parseTimestamp(post.postTime) }}
                  </span>
                  </div>
                </div>
                <div class="text-left font-400 mt-0.5rem">
                  <div class="text-12px leading-18px 2xl:text-14px 2xl:leading-20px
                            text-colorD9 light:text-color46">
                    <span v-if="isIgnoreAccount" class="text-blue-500 break-all">{{steemUrl}}</span>
                    <div class="whitespace-pre-line break-word multi-content"
                         v-else v-html="formatEmojiText(content)"></div>
                  </div>
                  <Space v-if="post.spaceId" :space="post" :show-avatar="false" class="mt-10px">
                    <template #bottom-btn-bar><div></div></template>
                  </Space>
                  <div v-if="imgurls" class="text-colorD9 light:text-color46">
                  <span v-for="(url, index) of imgurls.slice(0,4)" :key="index"
                        :title="url">[Pic]</span>
                  </div>
                  <Repost class="mt-10px"
                          :is-reply="true"
                          @click.stop="clickRetweetView()"
                          v-if="post.retweetInfo && post.retweetInfo.length>10 && !isIgnoreAccount"
                          :retweetInfo="post.retweetInfo"/>
                </div>
                <div class="py-10px text-14px">
                  <span class="text-color8B light:text-color7D mr-10px">{{$t('curation.replyTo')}} </span>
                  <span class="text-colorBlue">@{{ post.username }}</span>
                </div>
              </div>
            </div>
            <div class="flex">
              <img class="mr-10px md:mr-1rem rounded-full gradient-border w-3.6rem h-3.6rem min-w-3.6rem"
                   :src="userProfileImg" alt="">
              <div class="border-1 bg-black/40 border-1 border-color8B/30 min-h-134px flex-1
                      flex flex-col light:bg-white light:border-colorE3 rounded-8px">
                <div class="flex-1 flex flex-col relative text-14px">
                  <div v-show="showInputTip"
                       class="absolute px-15px top-5px leading-24px 2xl:leading-18px opacity-50">
                    {{$t('curation.tweetReply')}}
                  </div>
                  <div contenteditable
                       class="z-1 flex-1 px-15px pt-5px whitespace-pre-line leading-24px 2xl:leading-18px content-input-box break-word"
                       ref="contentRef"
                       @blur="getBlur"
                       @paste="onPasteEmojiContent"
                       @input="contentInputChange"
                       v-html="formatEmojiText(inputContent)">
                  </div>
                </div>
                <div class="py-2 flex justify-between items-center px-15px">
                  <el-popover ref="emojiPopover"
                              trigger="click" width="300"
                              :teleported="true" :persistent="false">
                    <template #reference>
                      <img class="w-1.8rem h-1.8rem lg:w-1.4rem lg:h-1.4rem" src="~@/assets/icon-emoji.svg" alt="">
                    </template>
                    <template #default>
                      <div class="h-310px lg:h-400px ">
                        <EmojiPicker :options="{
                                    imgSrc:'/emoji/',
                                    locals: $i18n.locale==='zh'?'zh_CN':'en',
                                    hasSkinTones:false,
                                    hasGroupIcons:false}"
                                     @select="(e) =>selectEmoji(e)" />
                      </div>
                    </template>
                  </el-popover>
                </div>
              </div>
            </div>
            <div class="flex justify-end my-1rem">
              <button class="gradient-btn gradient-btn-disabled-grey flex justify-center items-center
                           h-44px 2xl:h-2.2rem min-w-8rem px-20px rounded-full text-16px 2xl:text-0.8rem"
                      :disabled="isRepling"
                      @click="userReply">
                {{$t('curation.reply')}}
                <c-spinner v-show="isRepling" class="w-1.5rem h-1.5rem ml-0.5rem" color="white"></c-spinner>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </van-popup>
    <!--    quote-->
    <van-popup class="md:w-600px bg-black light:bg-transparent w-full"
               teleport="body"
               :class="position==='center'?'rounded-12px':'rounded-t-12px'"
               v-model:show="quoteVisible"
               :position="position">
      <transition name="el-zoom-in-bottom">
        <div v-if="quoteVisible"
             class="relative dark:bg-glass light:bg-colorF7 rounded-t-12px overflow-hidden
                    max-h-80vh flex flex-col">
          <div class="p-15px">
            <button @click="quoteVisible=false">
              <i class="w-18px h-18px 2xl:w-1rem 2xl:h-1rem icon-close"></i>
            </button>
          </div>
          <div class="flex-1 overflow-hidden">
            <div class="flex px-15px" >
              <img class="mr-10px md:mr-1rem rounded-full gradient-border w-3rem h-3rem"
                   :src="userProfileImg" alt="">
              <div class="flex-1 overflow-x-hidden flex flex-col">
                <div class="flex flex-col relative max-h-30vh overflow-auto">
                  <div v-show="showInputTip"
                       class="absolute top-5px leading-24px 2xl:leading-18px opacity-50">
                    {{isDefaultQuote?$t('curation.tweetInputTip'):$t('curation.inputCurationDes')}}
                  </div>
                  <div contenteditable
                       class="z-1 flex-1 pt-5px whitespace-pre-line leading-24px 2xl:leading-18px content-input-box break-word"
                       ref="contentRef"
                       @blur="getBlur"
                       @paste="onPasteEmojiContent"
                       @input="contentInputChange"
                       v-html="formatEmojiText(inputContent)">
                  </div>
                </div>
                <div class="mt-1rem border-1 border-listBgBorder bg-white/10 rounded-12px p-15px">
                  <div class="flex items-center flex-wrap">
                    <img class="rounded-full gradient-border w-1.6rem h-1.6rem mr-5px min-w-1.6rem"
                         :src="profileImg" alt="">
                    <div class="flex items-center flex-wrap">
                      <span class="c-text-black text-left mr-3 cursor-pointer
                        text-16px leading-18px 2xl:text-14px 2xl:leading-20px light:text-blueDark">
                        {{ post.name }}
                      </span>
                    </div>
                    <div class="flex items-center id-time">
                      <span class="text-12px leading-18px 2xl:text-14px 2xl:leading-18px text-color8B light:text-color7D">
                        @{{ post.username }}
                      </span>
                      <span class="mx-4px text-color8B light:text-color7D"> · </span>
                      <span class="whitespace-nowrap text-12px leading-18px 2xl:text-14px
                               2xl:leading-18px text-color8B light:text-color7D">
                        {{ parseTimestamp(post.postTime) }}
                      </span>
                    </div>
                  </div>
                  <div class="text-left font-400 mt-0.5rem">
                    <div class="text-12px leading-18px 2xl:text-14px 2xl:leading-20px
                            text-colorD9 light:text-color46">
                      <span v-if="isIgnoreAccount" class="text-blue-500 break-all">{{steemUrl}}</span>
                      <div class="whitespace-pre-line break-word" v-else v-html="formatEmojiText(content)"></div>
                    </div>
                    <Space v-if="post.spaceId" :space="post" :show-avatar="false" class="mt-10px">
                      <template #bottom-btn-bar><div></div></template>
                    </Space>
                    <div v-if="imgurls" class="text-colorD9 light:text-color46">
                      <span v-for="(url, index) of imgurls.slice(0,4)" :key="index" :title="url">[Pic]</span>
                    </div>
                  </div>
                </div>
                <div class="flex justify-between py-1rem">
                  <div class="flex justify-between items-center">
                    <el-popover ref="emojiPopover" placement="top"
                                trigger="click" width="300"
                                :teleported="true" :persistent="false">
                      <template #reference>
                        <img class="w-1.8rem h-1.8rem lg:w-1.4rem lg:h-1.4rem" src="~@/assets/icon-emoji.svg" alt="">
                      </template>
                      <template #default>
                        <div class="h-310px lg:h-400px ">
                          <EmojiPicker :options="{
                                    imgSrc:'/emoji/',
                                    locals: $i18n.locale==='zh'?'zh_CN':'en',
                                    hasSkinTones:false,
                                    hasGroupIcons:false}"
                                       @select="(e) =>selectEmoji(e)" />
                        </div>
                      </template>
                    </el-popover>
                  </div>
                  <button class="gradient-btn gradient-btn-disabled-grey flex justify-center items-center
                               h-44px 2xl:h-2rem min-w-6rem px-20px rounded-full text-16px 2xl:text-0.8rem"
                          :disabled="isQuoting"
                          @click="userQuote">
                    {{isDefaultQuote ? $t('curation.tweet') : $t('postView.createNewCuration')}}
                    <c-spinner v-show="isQuoting" class="w-1.5rem h-1.5rem ml-0.5rem" color="white"></c-spinner>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </transition>
    </van-popup>

    <van-popup class="md:w-600px bg-black light:bg-transparent"
               :class="position==='center'?'rounded-12px':'rounded-t-12px'"
               teleport="body"
               v-model:show="showTip"
               :position="position">
      <transition name="el-zoom-in-bottom">
        <div v-if="showTip"
             class="relative dark:bg-glass light:bg-colorF7 rounded-t-12px overflow-hidden min-h-60vh">
          <TipModalVue class="pt-70px 2xl:pt-3.5rem h-60vh"
                       :tipToUser="post"
                       :parent-tweet-id="post.postId"
                       @close="showTip=false"
                       @back="showTip=false"></TipModalVue>
          <button class="absolute right-20px top-24px"
                  @click.stop="showTip=false">
            <i class="w-18px h-18px 2xl:w-1rem 2xl:h-1rem icon-close"></i>
          </button>
        </div>
      </transition>
    </van-popup>
  </div>
</template>

<script>
import {followPost, likePost, quotePost, replyPost, retweetPost} from "@/utils/post";
import {errCode, IgnoreAuthor} from "@/config";
import {notify} from "@/utils/notify";
import {mapGetters} from "vuex";
import {parseTimestamp, stringLength, formatAmount} from "@/utils/helper";
import {formatEmojiText, onPasteEmojiContent} from "@/utils/tool";
import Repost from "@/components/Repost";
import { EmojiPicker } from 'vue3-twemoji-picker-final'
import TipModalVue from "@/components/TipModal";
import Space from "@/components/Space";
import ChainTokenIcon from "@/components/ChainTokenIcon";
import { getCurationRewardsOfPost } from '@/api/api'
import debounce from 'lodash.debounce'
import { getPriceFromOracle } from '@/utils/asset'
import { joinCommunity } from "@/utils/community";
import {useTimer} from "@/utils/hooks";
import {watch, ref} from "vue";


export default {
  name: "PostButtonGroup",
  components: {Repost, EmojiPicker, TipModalVue, Space, ChainTokenIcon},
  setup() {
    const { setTimer } = useTimer()
    return {setTimer}
  },
  props: {
    post: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // imgurls: {
    //   type: Array,
    //   default: () => {
    //     return []
    //   }
    // },
    // content: {
    //   type: String,
    //   default: ''
    // },
    isDetail: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      position: document.body.clientWidth < 768?'bottom':'center',
      isFollowing: false,
      isRepling: false,
      isQuoting: false,
      isRetweeting: false,
      isLiking: false,
      replyVisible: false,
      quoteVisible: false,
      showTip: false,
      showInputTip: true,
      contentRange: null,
      inputContent: '',
      inputContentEl: '',
      isDefaultQuote: true,
      showCuratedTip: false,
      rewards: [],
      price: '0.00',
      reg: '',
      imgurls: [],
      urls: []
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo']),
    profileImg() {
      if (!this.post.profileImg) return null
      if (this.post.profileImg) {
        return this.post.profileImg.replace('normal', '200x200')
      }else {
        return 'https://profile-images.heywallet.com/' + this.getAccountInfo.twitterId
      }
    },
    userProfileImg() {
      if (!this.getAccountInfo) return "";
      if (this.getAccountInfo.profileImg) {
        return this.getAccountInfo.profileImg.replace("normal", "400x400");
      } else {
        return (
            "https://profile-images.heywallet.com/" +
            this.getAccountInfo.twitterId
        );
      }
    },
    isIgnoreAccount() {
      const res = IgnoreAuthor.indexOf(this.post.steemId) !== -1
      return res
    },
    liked() {
      return this.post.liked === 1 && !this.post.downVote
    },
    unLiked() {
      return this.post.liked === 1 && this.post.downVote > 0
    },
    content() {
      let content = ''
      if (this.post.longContentStatus === 1) {
        for (let c of JSON.parse(this.post.content)) {
          if (c && c !== 'null' && c !== 'undefined') {
            content += c + '\n'
          }
        }
      }else {
        content = this.post.content
      }
      content = content.replace(this.reg, '');
      // content = content.replace('\n', '</br>')
      for (let url of this.urls){
        content = content.replace(url, `<span data-url="${url}" class="text-blue-500 text-14px break-all">${url}</span>`)
      }
      return content
    },
  },
  watch: {
    '$refs.replayBoxRef.scrollHeight' () {
      console.log('sdsdsd');
    }
  },
  methods: {
    parseTimestamp,
    formatEmojiText,
    formatAmount,
    getBlur() {
      const sel = window.getSelection();
      this.contentRange = sel.getRangeAt(0);
    },
    setInputFocus() {
      this.setTimer(() => {
        document.getElementsByClassName('content-input-box')[0].focus()
      }, 500)
    },
    onPasteEmojiContent,
    contentInputChange() {
      this.showInputTip = this.$refs.contentRef.innerHTML.length===0
    },
    selectEmoji(e) {
      const newNode = document.createElement('img')
      newNode.alt = e.i
      newNode.src = e.imgSrc
      newNode.className = 'inline-block w-18px h-18px mx-2px'
      if(!this.contentRange) return
      this.contentRange.insertNode(newNode)
      this.$refs.emojiPopover.hide()
      this.showInputTip = false
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
    getTip: debounce(function t() {
      // get rewards
      if (this.rewards && this.rewards.length > 0) {
        this.showCuratedTip = true
      }else {
        this.getRewards();
      }
    }, 500),
    async getRewards() {
      getCurationRewardsOfPost(this.post.postId).then(async res => {
          if (res && res.length > 0) {
            this.rewards = res.map(r => ({
              ...r,
              reward: r.amount > 0 ? formatAmount(r.amount / ( 10 ** r.decimals)) : '???',
              amount: r.amount > 0 ? r.amount / ( 10 ** r.decimals) : '???'
            }));
            const prices = await Promise.all(this.rewards.map(reward => getPriceFromOracle(reward.chainId, [reward])));
            let price = 0;
            for (let i = 0; i < prices.length; i++) {
              const p = prices[i];
              if (p) {
                if (this.rewards[i].amount !== '???'){
                  price += parseFloat(this.rewards[i].amount) * parseFloat(p[this.rewards[i].token] ?? 0)
                }
              }
            }
            if (price > 0) {
              this.price = price.toFixed(2);
            }
          }else {
            this.rewards = []
          }
        }).catch(e => {this.rewards = []; console.log(4, e)}).finally(() => this.showCuratedTip = true)
    },
    async userReply() {
      this.inputContentEl = this.$refs.contentRef.innerHTML
      this.inputContent = this.formatElToTextContent(this.$refs.contentRef)
      try{
        this.isRepling = true
        await replyPost(this.post.postId, this.inputContent, this.post.twitterId)
        if (this.post.communityId) {
          joinCommunity(this.post.communityId).catch();
        }
        this.post.replied = 1;
        this.post.replyCount = this.post.replyCount ? this.post.replyCount + 1 : 1
        this.replyVisible = false
        this.$bus.emit('updatePostIndetail', {postDetail: this.post})
      } catch (e) {
        console.log('reply post fail:', e);
        if (e === 'log out') {
          this.$store.commit('saveShowLogin', true)
          return
        }
        if (e === errCode.TWEET_NOT_FOUND) {
          notify({message: this.$t('tips.tweetNotFound'), type: "info", duration: 5000})
          return;
        }
        if (e === errCode.INSUFFICIENT_RC) {
          notify({message: this.$t('tips.insufficientRC'), type: 'info', duration: 5000})
          return;
        }
        notify({message: e, type: 'error'})
      } finally {
        this.isRepling = false
      }
    },
    async userQuote() {
      this.inputContentEl = this.$refs.contentRef.innerHTML
      this.inputContent = this.formatElToTextContent(this.$refs.contentRef)
      try{
        this.isQuoting = true
        await quotePost(this.post.postId, this.isDefaultQuote ? this.inputContent : this.inputContent + '\n#iweb3 #curate', this.post.twitterId)
        if (this.post.communityId) {
          joinCommunity(this.post.communityId).catch();
        }
        this.post.quoted = 1;
        this.post.quoteCount = this.post.quoteCount ? this.post.quoteCount + 1 : 1
        this.quoteVisible = false
        this.$bus.emit('updatePostIndetail', {postDetail: this.post})
      } catch (e) {
        console.log('quote post fail:', e);
        if (e === 'log out') {
          this.$store.commit('saveShowLogin', true)
          return
        }
        if (e === errCode.TWEET_NOT_FOUND) {
          notify({message: this.$t('tips.tweetNotFound'), type: "info", duration: 5000})
          return;
        }
        if (e === errCode.INSUFFICIENT_RC) {
          notify({message: this.$t('tips.insufficientRC'), type: 'info', duration: 5000})
          return;
        }
        if (e === errCode.INSUFFICIENT_VP) {
          notify({message: this.$t('tips.insufficientVP'), type: 'info', duration: 5000});
          return;
        }
        if (e === errCode.TWITTER_ERROR) {
          notify({message: this.$t('tips.quoteTooFrequent'), type: 'info', duration: 5000});
          return;
        }
        notify({message: e, type: 'error'})
      } finally {
        this.isQuoting = false
      }
    },
    async userFollow() {
      if (!this.getAccountInfo || !this.getAccountInfo.twitterId) {
        this.$store.commit('saveShowLogin', true)
        return
      }
      try{
        this.isFollowing = true
        const result = await followPost(this.post.postId)
        if (this.post.communityId) {
          joinCommunity(this.post.communityId).catch();
        }
        this.post.followed = 1
        this.post.followCount  = this.post.followCount ? this.post.followCount + 1 : 1
        this.$bus.emit('updatePostIndetail', {postDetail: this.post})
      } catch (e) {
        if (e === 'log out') {
          this.$store.commit('saveShowLogin', true)
          return
        }
        if (e === errCode.TWEET_NOT_FOUND) {
          notify({message: this.$t('tips.tweetNotFound'), type: "info", duration: 5000})
          return;
        }
        if (e === errCode.INSUFFICIENT_RC) {
          notify({message: this.$t('tips.insufficientRC'), type: 'info', duration: 5000})
          return;
        }
        notify({message: e, type: 'error'})
      } finally {
        this.isFollowing = false
      }
    },
    async userRetweet() {
      if (!this.getAccountInfo || !this.getAccountInfo.twitterId) {
        this.$store.commit('saveShowLogin', true)
        return
      }
      try{
        this.isRetweeting = true
        await retweetPost(this.post.postId, this.post.twitterId)
        if (this.post.communityId) {
          joinCommunity(this.post.communityId).catch();
        }
        this.post.retweeted = 1
        this.post.retweetCount  = this.post.retweetCount ? this.post.retweetCount + 1 : 1
        this.$bus.emit('updatePostIndetail', {postDetail: this.post})
      } catch (e) {
        console.log('retweet fail:', e);
        if (e === 'log out') {
          this.$store.commit('saveShowLogin', true)
          return
        }
        if (e === errCode.TWEET_NOT_FOUND) {
          notify({message: this.$t('tips.tweetNotFound'), type: "info", duration: 5000})
          return;
        }
        if (e === errCode.INSUFFICIENT_RC) {
          notify({message: this.$t('tips.insufficientRC'), type: 'info', duration: 5000})
          return;
        }
        if (e === errCode.INSUFFICIENT_VP) {
          notify({message: this.$t('tips.insufficientVP'), type: 'info', duration: 5000});
          return;
        }
        if (e === errCode.TWITTER_ERROR) {
          notify({message: this.$t('tips.retweetTooFrequent'), type: 'info', duration: 5000});
          return;
        }
        notify({message: e, type: 'error'})
      } finally {
        this.isRetweeting = false
      }
    },
    async userLike() {
      if (!this.getAccountInfo || !this.getAccountInfo.twitterId) {
        this.$store.commit('saveShowLogin', true)
        return
      }
      try{
        this.isLiking = true
        const result = await likePost(this.post.postId, this.post.twitterId)
        if (this.post.communityId) {
          joinCommunity(this.post.communityId).catch();
        }
        this.post.liked = 1
        this.post.likeCount  = this.post.likeCount ? this.post.likeCount + 1 : 1
        this.$bus.emit('updatePostIndetail', {postDetail: this.post})
      } catch (e) {
        console.log('like post fail:', e === errCode.INSUFFICIENT_VP, e == errCode.INSUFFICIENT_VP)
        if (e === 'log out') {
          this.$store.commit('saveShowLogin', true)
          return
        }
        if (e === errCode.TWEET_NOT_FOUND) {
          notify({message: this.$t('tips.tweetNotFound'), type: "info", duration: 5000})
          return;
        }
        if (e === errCode.INSUFFICIENT_RC) {
          notify({message: this.$t('tips.insufficientRC'), type: 'info', duration: 5000})
          return;
        }
        if (e === errCode.INSUFFICIENT_VP) {
          notify({message: this.$t('tips.insufficientVP'), type: 'info', duration: 5000});
          return;
        }
        if (e === errCode.TWITTER_ERROR) {
          notify({message: this.$t('tips.likeTooFrequent'), type: 'info', duration: 5000});
          return;
        }
        notify({message: e, type: 'error'})
      } finally {
        this.isLiking = false
      }
    },
    async userUnLike() {
      if (!this.getAccountInfo || !this.getAccountInfo.twitterId) {
        this.$store.commit('saveShowLogin', true)
        return
      }
      try{
        this.isLiking = true
        const result = await likePost(this.post.postId, this.post.twitterId, false)
        this.post.liked = 1
        this.post.downVote = 1
        this.post.unLikeCount  = this.post.unLikeCount ? this.post.unLikeCount + 1 : 1
        this.$bus.emit('updatePostIndetail', {postDetail: this.post})
      } catch (e) {
        if (e === 'log out') {
          this.$store.commit('saveShowLogin', true)
          return
        }
        if (e === errCode.TWEET_NOT_FOUND) {
          notify({message: this.$t('tips.tweetNotFound'), type: "info", duration: 5000})
          return;
        }
        if (e === errCode.INSUFFICIENT_RC) {
          notify({message: this.$t('tips.insufficientRC'), type: 'info', duration: 5000})
          return;
        }
        if (e === errCode.INSUFFICIENT_VP) {
          notify({message: this.$t('tips.insufficientVP'), type: 'info', duration: 5000});
          return;
        }
        if (e === errCode.TWITTER_ERROR) {
          notify({message: this.$t('tips.likeTooFrequent'), type: 'info', duration: 5000});
          return;
        }
        notify({message: e, type: 'error'})
      } finally {
        this.isLiking = false
      }
    },
    preReply() {
      if (!this.getAccountInfo || !this.getAccountInfo.twitterId) {
        this.$store.commit('saveShowLogin', true)
        return
      }
      this.replyVisible = true;
      this.setInputFocus()
    },
    preQuote() {
      if (!this.getAccountInfo || !this.getAccountInfo.twitterId) {
        this.$store.commit('saveShowLogin', true)
        return
      }
      this.quoteVisible = true
      this.setInputFocus()
      this.isDefaultQuote = true
    },
    otherPreQuote() {
      this.preQuote()
      this.isDefaultQuote = false
    },
    tip(e) {
      if (!this.getAccountInfo || !this.getAccountInfo.twitterId) {
        this.$store.commit('saveShowLogin', true)
        return
      }
      this.showTip = true
    },
    gotoTweet(e) {
      e.stopPropagation();
      window.open(`https://twitter.com/${this.post.username}/status/${this.post.postId}`)
    },
    clickRetweetView() {
      try {
        const info = JSON.parse(this.post.retweetInfo);
        window.open(`https://twitter.com/${info.author.username}/status/${info.id}`)
      } catch (error) {

      }
    },
  },
  mounted () {
    this.reg = /(https?:[^:<>"]*\/)([^:<>"]*)(\.((png!thumbnail)|(png)|(jpg)|(webp)))/g
    const urls = this.post.content.replace(' ', '').replace('\r', '').replace('\t', '').match(this.urlreg)
    this.imgurls = this.post.content.replace(' ', '').replace('\r', '').replace('\t', '').match(this.reg)
    if (urls && this.imgurls) {
      this.urls = urls.filter(u => this.imgurls.indexOf(u) < 0)
    } else if(urls) {
      this.urls = urls
    }
    this.imgurls = this.imgurls?.map(u => 'https://steemitimages.com/0x0/' + u)
    // this.getRewards();
  },
}
</script>

<style scoped>

</style>
