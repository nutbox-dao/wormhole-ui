<template>
  <div class="" ref="blogRef">
    <div class="sm:rounded-1rem">
      <div class="flex items-center">
        <img v-if="profileImg" @click.stop="gotoUserPage()"
             class="mr-10px md:mr-1rem rounded-full gradient-border cursor-pointer blog-avatar"
             :class="avatarClass"
             @error="replaceEmptyImg"
             :src="profileImg" alt="">
        <img class="mr-10px md:mr-1rem rounded-full gradient-border"
             :class="avatarClass"
             src="@/assets/icon-default-avatar.svg" v-else alt="">
        <div class="flex-1 flex items-center flex-wrap">
          <div class="flex items-center flex-wrap">
            <a class="c-text-black text-left mr-3 cursor-pointer
                      text-16px leading-18px 2xl:text-1rem 2xl:leading-1.5rem light:text-blueDark"
               @click.stop="gotoUserPage()">{{ post.name }}</a>
            <!-- <img class="w-1rem h-1rem mx-0.5rem" src="~@/assets/icon-checked.svg" alt=""> -->
          </div>
          <div class="flex items-center id-time">
            <span class="text-12px leading-18px 2xl:text-0.7rem 2xl:leading-1rem text-color8B light:text-color7D">
              @{{ post.username }}
            </span>
            <span class="mx-4px text-color8B light:text-color7D"> · </span>
            <span class="whitespace-nowrap text-12px leading-18px 2xl:text-0.7rem 2xl:leading-1rem text-color8B light:text-color7D">
             {{ parseTimestamp(post.postTime) }}
            </span>
          </div>
        </div>
      </div>
      <div class="flex blog-content">
        <div class="hidden sm:block mr-10px md:mr-1rem ml-block" :class="[avatarClass]"></div>
        <div class="flex-1 overflow-hidden" @click="gotoSteem($event)">
          <div class="text-left font-400 mt-1rem sm:mt-0.5rem md:mt-0rem">
            <div @click.stop="clickContent"
                 class="cursor-pointer text-12px leading-18px 2xl:text-0.9rem 2xl:leading-1.2rem text-colorD9 light:text-color46">
              <a v-if="isIgnoreAccount" :href="steemUrl" class="text-blue-500 break-all" target="_blank">{{steemUrl}}</a>
              <div class="whitespace-pre-line"
                   :class="(imgurls && imgurls.length>0)?'multi-content':''"
                   v-else v-html="formatEmojiText(content)"></div>
            </div>
          </div>

          <!--       foreign page -->
          <LinkPreview @click.stop="clickLinkView()" class="cursor-pointer mt-10px" v-if="post.pageInfo && post.pageInfo.length>10 && !isIgnoreAccount" :pageInfo="post.pageInfo"/>
          <!--       retweet  -->
          <Repost class="mt-10px" :content-class="contentClass" @click.stop="clickRetweetView()" v-if="post.retweetInfo && post.retweetInfo.length>10 && !isIgnoreAccount" :retweetInfo="post.retweetInfo"/>

          <!--img-1, img-2, img-3, img-4 -->
          <div class="grid mt-10px md:max-w-35rem rounded-12px overflow-hidden border-1 border-listBgBorder"
               :class="`img-`+(imgurls.length%5)" v-if="imgurls && imgurls.length > 0">
            <div class="img-box" v-for="(url, index) of imgurls.slice(0,4)" :key="url">
              <img @click.stop="viewImg(index)" :src="url" alt="">
            </div>
          </div>
          <slot name="blog-tag">
            <div class="flex gap-x-0.8rem font-200 text-0.6rem flex-wrap text-color8B light:text-color7D blog-tag">
              <div v-show="tag != 'iweb3'"
                   class="border-1 border-color62 py-3px px-6px rounded-6px mt-10px
                        whitespace-nowrap cursor-pointer light:text-color46"
                   v-for="tag of JSON.parse(post.tags || '[]')" :key="tag"
                   @click.stop="onSelectTag(tag)">
                #{{ tag }}
              </div>
            </div>
          </slot>
          <slot name="curation-tag"></slot>
          <div v-if="location" class="flex mt-0.8rem">
            <img src="~@/assets/local.png" class="w-1.2rem h-1.2rem mt-0.2rem" alt="">
            <span class="ml-0.6rem c-text-medium text-blue-500">{{ location }}</span>
          </div>
          <slot name="bottom-btn-bar">
            <div class="flex justify-between mt-15px flex-1 sm:w-8/10">
              <!-- <div class="hidden sm:block sm:min-w-35px sm:w-2.2rem md:w-3rem mr-10px md:mr-1rem"></div> -->
              <!-- reply-->
              <div class="flex-1 flex items-center">
                <button @click.stop="preReply"
                        :disabled="isRepling || isQuoting || isRetweeting"
                        class="text-white flex justify-center items-center w-24px h-24px rounded-full">
                  <i v-if="isRepling" class="w-20px h-20px rounded-full bg-colorEA">
                    <img class="w-20px h-20px" src="~@/assets/icon-loading.svg" alt="">
                  </i>
                  <i v-else class="w-20px h-20px min-w-20px" :class="post.replied?'btn-icon-reply-active':'btn-icon-reply'"></i>
                </button>
                <span class="ml-6px font-700 text-12px" :class="post.replied?'text-color62':''">{{ post.replyCount ?? 0 }}</span>
              </div>
              <!-- quote-->
              <div class="flex-1 flex items-center">
                <button @click.stop="preQuote"
                        :disabled="isRepling || isQuoting || isRetweeting"
                        class="text-white flex justify-center items-center w-20px h-20px rounded-full">
                  <i v-if="isQuoting" class="w-20px h-20px rounded-full bg-colorEA">
                    <img class="w-20px h-20px" src="~@/assets/icon-loading.svg" alt="">
                  </i>
                  <i v-else class="w-20px h-20px min-w-20px" :class="post.quoted?'btn-icon-quote-active':'btn-icon-quote'"></i>
                </button>
                <span class="ml-6px font-700 text-12px" :class="post.quoted?'text-color62':''">{{ post.quoteCount ?? 0 }}</span>
              </div>
              <!-- retweet -->
              <div class="flex-1 flex items-center">
                <button @click.stop="userRetweet"
                        :disabled="isRepling || isQuoting || isRetweeting"
                        class="text-white flex justify-center items-center w-20px h-20px rounded-full">
                  <i v-if="isRetweeting" class="w-20px h-20px rounded-full bg-colorEA">
                    <img class="w-20px h-20px" src="~@/assets/icon-loading.svg" alt="">
                  </i>
                  <i v-else class="w-20px h-20px min-w-20px" :class="post.retweeted?'btn-icon-retweet-active':'btn-icon-retweet'"></i>
                </button>
                <span class="ml-6px font-700 text-12px" :class="post.retweeted?'text-color62':''">{{ post.retweetCount ?? 0 }}</span>
              </div>
              <!-- like-->
              <div class="flex-1 flex items-center">
                <button :disabled="isLiking"
                        @click.stop="userLike"
                        class="flex items-center">
                  <i v-if="isLiking" class="w-20px h-20px rounded-full bg-colorEA">
                    <img class="w-20px h-20px" src="~@/assets/icon-loading.svg" alt="">
                  </i>
                  <i v-else class="w-20px h-20px min-w-20px" :class="post.liked?'btn-icon-like-active':'btn-icon-like'"></i>
                </button>
                <span class="ml-6px font-700 text-12px" :class="post.liked?'text-color62':''">{{ post.likeCount ?? 0 }}</span>
              </div>
              <!-- <div class="text-white flex items-center">
                <i class="w-18px h-18px icon-coin"></i>
                <span class="ml-2px font-700 text-white light:text-color7D">{{ value }}</span>
              </div> -->
              <div class="text-white flex items-center cursor-pointer" @click.stop="gotoTweet($event)">
                <i class="w-18px h-18px icon-twitter"></i>
              </div>
            </div>
          </slot>
        </div>
      </div>
    </div>
    <el-dialog class="c-img-dialog" v-model="imgViewDialog" :fullscreen="true"
               destroy-on-close
               title="&nbsp;" append-to-body @click="imgViewDialog=false">
      <el-carousel height="70vh" indicator-position="none" :autoplay="false" :initial-index="imgIndex" >
        <el-carousel-item v-for="item in imgurls" :key="item">
          <img class="absolute transform top-1/2 left-1/2  -translate-y-1/2 -translate-x-1/2 max-h-70vh"
               :src="item" alt="">
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
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
                <img class="rounded-full gradient-border w-3.6rem h-3.6rem"
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
                  <span class="text-12px leading-18px 2xl:text-0.7rem 2xl:leading-1rem text-color8B light:text-color7D">
                    @{{ post.username }}
                  </span>
                    <span class="mx-4px text-color8B light:text-color7D"> · </span>
                    <span class="whitespace-nowrap text-12px leading-18px 2xl:text-0.7rem
                               2xl:leading-1rem text-color8B light:text-color7D">
                    {{ parseTimestamp(post.postTime) }}
                  </span>
                  </div>
                </div>
                <div class="text-left font-400 mt-0.5rem">
                  <div class="text-12px leading-18px 2xl:text-0.9rem 2xl:leading-1.2rem
                            text-colorD9 light:text-color46">
                    <span v-if="isIgnoreAccount" class="text-blue-500 break-all">{{steemUrl}}</span>
                    <div class="whitespace-pre-line" v-else v-html="formatEmojiText(content)"></div>
                  </div>
                  <div v-if="imgurls" class="text-colorD9 light:text-color46">
                  <span v-for="(url, index) of imgurls.slice(0,4)" :key="index"
                        :title="url">[Pic]</span>
                  </div>
                  <Repost class="mt-10px"
                          :content-class="contentClass"
                          :is-reply="true"
                          @click.stop="clickRetweetView()"
                          v-if="post.retweetInfo && post.retweetInfo.length>10 && !isIgnoreAccount"
                          :retweetInfo="post.retweetInfo"/>
                </div>
                <div class="py-10px">
                  <span class="text-color8B light:text-color7D mr-10px">{{$t('curation.replyTo')}} </span>
                  <span class="text-colorBlue">@{{ post.username }}</span>
                </div>
              </div>
            </div>
            <div class="flex">
              <img class="mr-10px md:mr-1rem rounded-full gradient-border w-3.6rem h-3.6rem"
                   :src="userProfileImg" alt="">
              <div class="border-1 bg-black/40 border-1 border-color8B/30 min-h-134px flex-1
                      flex flex-col light:bg-white light:border-colorE3 rounded-8px">
                <div class="flex-1 flex flex-col relative">
                  <div v-show="showInputTip"
                       class="absolute px-1rem top-5px leading-24px 2xl:leading-1rem opacity-50">
                    {{$t('curation.tweetReply')}}
                  </div>
                  <div contenteditable
                       class="z-1 flex-1 px-1rem pt-5px whitespace-pre-line leading-24px 2xl:leading-1rem content-input-box"
                       ref="contentRef"
                       @blur="getBlur"
                       @paste="onPasteEmojiContent"
                       @input="contentInputChange"
                       v-html="formatEmojiText(inputContent)">
                  </div>
                </div>
                <div class="py-2 flex justify-between items-center px-1rem">
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
                      @click="userReply">
                {{$t('curation.reply')}}
                <c-spinner v-show="replying" class="w-1.5rem h-1.5rem ml-0.5rem" color="white"></c-spinner>
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
          <div class="flex-1 flex overflow-auto px-15px no-scroll-bar">
            <img class="mr-10px md:mr-1rem rounded-full gradient-border w-3rem h-3rem"
                 :src="userProfileImg" alt="">
            <div class="flex-1">
              <div class="flex flex-col relative">
                <div v-show="showInputTip"
                     class="absolute top-5px leading-24px 2xl:leading-1rem opacity-50">
                  {{$t('curation.tweetInputTip')}}
                </div>
                <div contenteditable
                     class="z-1 flex-1 pt-5px whitespace-pre-line leading-24px 2xl:leading-1rem content-input-box"
                     ref="contentRef"
                     @blur="getBlur"
                     @paste="onPasteEmojiContent"
                     @input="contentInputChange"
                     v-html="formatEmojiText(inputContent)">
                </div>
              </div>
              <div class="mt-1rem border-1 border-listBgBorder bg-white/10 rounded-12px p-15px">
                <div class="flex items-center flex-wrap">
                  <img class="rounded-full gradient-border w-1.6rem h-1.6rem mr-5px"
                       :src="profileImg" alt="">
                  <div class="flex items-center flex-wrap">
                      <span class="c-text-black text-left mr-3 cursor-pointer
                        text-16px leading-18px 2xl:text-1rem 2xl:leading-1.5rem light:text-blueDark">
                        {{ post.name }}
                      </span>
                  </div>
                  <div class="flex items-center id-time">
                      <span class="text-12px leading-18px 2xl:text-0.7rem 2xl:leading-1rem text-color8B light:text-color7D">
                        @{{ post.username }}
                      </span>
                    <span class="mx-4px text-color8B light:text-color7D"> · </span>
                    <span class="whitespace-nowrap text-12px leading-18px 2xl:text-0.7rem
                               2xl:leading-1rem text-color8B light:text-color7D">
                        {{ parseTimestamp(post.postTime) }}
                      </span>
                  </div>
                </div>
                <div class="text-left font-400 mt-0.5rem">
                  <div class="text-12px leading-18px 2xl:text-0.9rem 2xl:leading-1.2rem
                            text-colorD9 light:text-color46">
                    <span v-if="isIgnoreAccount" class="text-blue-500 break-all">{{steemUrl}}</span>
                    <div class="whitespace-pre-line" v-else v-html="formatEmojiText(content)"></div>
                  </div>
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
                        @click="userQuote">
                  {{$t('curation.tweet')}}
                  <c-spinner v-show="replying" class="w-1.5rem h-1.5rem ml-0.5rem" color="white"></c-spinner>
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </van-popup>
  </div>
</template>

<script>
import {parseTimestamp, formatPrice, stringLength} from '@/utils/helper'
import { mapState, mapGetters } from 'vuex'
import { SteemScan, IgnoreAuthor, errCode } from '@/config'
import { ImagePreview } from 'vant';
import LinkPreview from "@/components/LinkPreview";
import Repost from "@/components/Repost";
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import {formatEmojiText, onPasteEmojiContent} from "@/utils/tool";
import { likePost, retweetPost } from '@/utils/post'
import { notify } from '@/utils/notify';
import { EmojiPicker } from 'vue3-twemoji-picker-final'

export default {
  name: "Blog",
  components: {LinkPreview, Repost, EmojiPicker},
  props: {
    post: {
      type: Object,
      default: {}
    },
    isDetail: {
      type: Boolean,
      default: false
    },
    avatarClass: {
      type: String,
      default: 'w-2.6rem h-2.6rem md:w-3.6rem md:h-3.6rem'
    },
    contentClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      position: document.body.clientWidth < 768?'bottom':'center',
      like: true,
      urls: [],
      imgurls: [],
      allurls: [],
      url: null,
      reg: '',
      urlreg: '',
      imgViewDialog: false,
      imgIndex: 0,
      mapOptionsModalVisible: false,
      mapLoading: false,
      gdLocation: '',
      isRepling: false,
      isQuoting: false,
      isRetweeting: false,
      isLiking: false,
      replyVisible: false,
      replying: false,
      contentRange: null,
      inputContent: '',
      inputContentEl: '',
      quoteVisible: false,
      showInputTip: true
    }
  },
  computed: {
    ...mapState(['accountInfo']),
    ...mapState('curation', ['selectedTag']),
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
    steemUrl() {
      return `https://steemit.com/wormhole3/@${this.post.steemId}/${this.post.postId}`
    },
    value() {
      if (!this.post.content) return '$0'
      const value = this.parseSBD(this.post.curatorPayoutValue)
       + this.parseSBD(this.post.pendingPayoutValue)
      + this.parseSBD(this.post.totalPayoutValue)
      return formatPrice(value)
    },
    location() {
      let location = this.post.location
      if (location) {
        location = JSON.parse(location)
        if (location && location.full_name) {
          return location.full_name
        }
      }
    },
    content() {
      let content = this.post.content.replace(this.reg, '');
      // content = content.replace('\n', '</br>')
      for (let url of this.urls){
        content = content.replace(url, `<span data-url="${url}" class="text-blue-500 text-14px 2xl:text-0.8rem break-all">${url}</span>`)
      }
      return content
    },
  },
  methods: {
    formatEmojiText,
    parseTimestamp,
    getBlur() {
      const sel = window.getSelection();
      this.contentRange = sel.getRangeAt(0);
    },
    setInputFocus() {
      setTimeout(() => {
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
    clickContent(e) {
      if(e.target.dataset.url) {
        window.open(e.target.dataset.url, '_blank')
      } else {
        // goto detail
        this.$refs.blogRef.click()
      }
    },
    replaceEmptyImg(e) {
      e.target.src = emptyAvatar;
    },
    parseSBD(v) {
      return parseFloat(v.replace(' SBD', ''))
      return 0
    },
    gotoSteem(e) {
      if (this.isDetail) {
        e.stopPropagation();
        window.open(`${SteemScan}@${this.post.steemId}/${this.post.postId}`, '__blank')
      }
    },
    gotoUserPage() {
      if (!this.getAccountInfo || this.post.username !== this.getAccountInfo.twitterUsername){
        this.$router.push({path : '/account-info/@' + this.post.username})
      }
    },
    gotoTweet(e) {
      e.stopPropagation();
      window.open(`https://twitter.com/${this.post.username}/status/${this.post.postId}`)
    },
    preQuote() {
      if (!this.getAccountInfo || !this.getAccountInfo.twitterId) {
        this.$store.commit('saveShowLogin', true)
        return
      }
      this.quoteVisible = true
      this.setInputFocus()
    },
    preReply() {
      if (!this.getAccountInfo || !this.getAccountInfo.twitterId) {
        this.$store.commit('saveShowLogin', true)
        return
      }
      this.replyVisible = true;
      this.setInputFocus()
    },
    async userReply() {
      this.inputContentEl = this.$refs.contentRef.innerHTML
      this.inputContent = this.formatElToTextContent(this.$refs.contentRef)
      console.log(this.inputContent)
    },
    async userQuote() {
    },
    async userRetweet() {
      if (!this.getAccountInfo || !this.getAccountInfo.twitterId) {
        this.$store.commit('saveShowLogin', true)
        return
      }
      try{
        this.isRetweeting = true
        await retweetPost(this.post.postId)
        this.post.retweeted = 1
        this.post.retweetCount  = this.post.retweetCount ? this.post.retweetCount + 1 : 1
      } catch (e) {
        if (e === 'log out') {
          this.$store.commit('saveShowLogin', true)
          return
        }
        if (e === errCode.TWEET_NOT_FOUND) {
          notify({message: this.$t('tips.tweetNotFound'), type: "info", duration: 5000})
        }
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
        const result = await likePost(this.post.postId)
        this.post.liked = 1
        this.post.likeCount  = this.post.likeCount ? this.post.likeCount + 1 : 1
      } catch (e) {
        if (e === 'log out') {
          this.$store.commit('saveShowLogin', true)
          return
        }
        if (e === errCode.TWEET_NOT_FOUND) {
          notify({message: this.$t('tips.tweetNotFound'), type: "info", duration: 5000})
        }
      } finally {
        this.isLiking = false
      }
    },
    clickLinkView() {
      try{
        const info = JSON.parse(this.post.pageInfo)
        window.open(info.url, '__blank')
      }catch(e) {}
    },
    clickRetweetView() {
      try {
        const info = JSON.parse(this.post.retweetInfo);
        window.open(`https://twitter.com/${info.author.username}/status/${info.id}`)
      } catch (error) {

      }
    },
    viewImg(index) {
      if(navigator.userAgent.toUpperCase().indexOf('IPHONE')>=0 ||
          navigator.userAgent.toUpperCase().indexOf('ANDROID')>=0) {
        ImagePreview({
          images: this.imgurls,
          startPosition: index
        });
      } else {
        this.imgIndex = index
        this.imgViewDialog = true
      }
    },
    onSelectTag(tag) {
      this.$store.commit('curation/saveSelectedTag', tag)
    }
  },
  mounted () {
    this.urlreg = /http[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_#@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+/g
    this.reg = /(https?:[^:<>"]*\/)([^:<>"]*)(\.((png!thumbnail)|(png)|(jpg)|(webp)))/g
    if (!this.post.content) return;
    const urls = this.post.content.replace(' ', '').replace('\r', '').replace('\t', '').match(this.urlreg)
    this.allurls = urls
    this.imgurls = this.post.content.replace(' ', '').replace('\r', '').replace('\t', '').match(this.reg)
    if (urls && this.imgurls) {
      this.urls = urls.filter(u => this.imgurls.indexOf(u) < 0)
    } else if(urls) {
      this.urls = urls
    }
    this.imgurls = this.imgurls?.map(u => 'https://steemitimages.com/0x0/' + u)
  },
}
</script>

<style scoped lang="scss">
.img-box {
  overflow: hidden;
  width: 100%;
  padding-top: 57%;
  position: relative;
  img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.img-1 {
  grid-template-columns: repeat(1, 1fr);
}
.img-2 {
  grid-template-columns: repeat(2, 1fr);
  gap: 2px;
}
.img-3 {
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 2px;
  :nth-child(2) {
    grid-column: 2 / 2;
    grid-row: 1 / 3;
  }
}
.img-4 {
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 2px;
}
@media (max-width: 500px) {
  .img-3 {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    :nth-child(2) {
      grid-column: 2 / 2;
      grid-row: 1 / 3;
    }
  }
}
</style>
