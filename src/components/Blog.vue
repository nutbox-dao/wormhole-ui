<template>
  <div class="" ref="blogRef">
    <div class="sm:rounded-1rem">
      <div class="flex items-center">
        <img v-if="profileImg" @click.stop="gotoUserPage()"
             class="mr-10px rounded-full gradient-border cursor-pointer blog-avatar max-w-56px max-h-56px"
             :class="avatarClass"
             @error="replaceEmptyImg"
             :src="profileImg" alt="">
        <img class="mr-10px rounded-full gradient-border max-w-56px max-h-56px"
             :class="avatarClass"
             src="@/assets/icon-default-avatar.svg" v-else alt="">
        <div class="flex-1 flex justify-between sm:items-center">
          <div class="flex-1 flex flex-col items-start sm:flex-wrap sm:flex-row sm:items-center">
            <div class="flex items-center sm:mr-6px">
              <div class="flex items-center flex-wrap">
                <a class="c-text-black text-left cursor-pointer
                      text-16px leading-18px  light:text-blueDark"
                   @click.stop="gotoUserPage()">{{ post.name }}</a>
                <!-- <img class="w-1rem h-1rem mx-0.5rem" src="~@/assets/icon-checked.svg" alt=""> -->
              </div>
              <div v-if="post.isCurated && !isDetail" class="ml-4px flex items-center sm:hidden">
                <el-tooltip :show-after="500">
                  <template #content>
                    <div v-if="showCuratedTip" class="text-white light:text-black max-w-200px">
                      <ChainTokenIcon v-if="rewards && rewards.length > 0" v-for="reward of rewards" :key="post.postId + reward.token" height="20px" width="20px"
                             class="bg-color62 my-4px"
                             :token="{symbol: reward.tokenSymbol, address: reward.token}"
                             :chainName="reward.chainId?.toString()">
                        <template #amount>
                          <span class="pl-4px pr-8px h-20px whitespace-nowrap flex items-center text-12px text-white">
                            {{reward.amount + " " + reward.tokenSymbol}}
                          </span>
                        </template>
                    </ChainTokenIcon>
                    </div>
                    <img v-else class="w-20px" src="~@/assets/icon-loading.svg" alt="">
                  </template>
                  <button @mouseover="getTip">
                    <i class="icon-curated w-16px h-16px min-w-16px"></i>
                  </button>
                </el-tooltip>
              </div>
            </div>
            <div class="flex items-center id-time">
            <span class="text-12px leading-18px  text-color8B light:text-color7D">
              @{{ post.username }}
            </span>
              <span class="mx-4px text-color8B light:text-color7D"> · </span>
              <span class="whitespace-nowrap text-12px leading-18px 2xl:text-0.7rem 2xl:leading-1rem text-color8B light:text-color7D">
             {{ parseTimestamp(post.postTime) }}
            </span>
            </div>
            <div v-if="post.isCurated && !isDetail" class="ml-4px items-center hidden sm:flex">
              <el-tooltip :show-after="500">
                <template #content>
                  <div v-if="showCuratedTip" class="text-white light:text-black max-w-200px">
                    <ChainTokenIcon v-if="rewards && rewards.length > 0" v-for="reward of rewards" :key="post.postId + reward.token" height="20px" width="20px"
                             class="bg-color62 my-4px"
                             :token="{symbol: reward.tokenSymbol, address: reward.token}"
                             :chainName="reward.chainId?.toString()">
                        <template #amount>
                          <span class="pl-4px pr-8px h-20px whitespace-nowrap flex items-center text-12px text-white">
                            {{reward.amount + " " + reward.tokenSymbol}}
                          </span>
                        </template>
                    </ChainTokenIcon>
                  </div>
                  <img v-else class="w-20px" src="~@/assets/icon-loading.svg" alt="">
                </template>
                <button @mouseover="getTip">
                  <i class="icon-curated w-16px h-16px min-w-16px"></i>
                </button>
              </el-tooltip>
            </div>
          </div>
          <el-tooltip>
            <template #content>
              <span class="text-white light:text-black">{{$t('curation.blogTweetTip')}}</span>
            </template>
            <button @click="gotoTweet($event)"
                    class="text-white ml-6px flex justify-center items-center w-16px h-16px rounded-full disabled-no-opacity">
              <img class="w-16px h-16px" src="~@/assets/icon-twitter-blue.svg" alt="">
            </button>
          </el-tooltip>
        </div>
      </div>
      <div class="flex blog-content">
        <div class="mr-10px max-w-56px max-h-56px" :class="[avatarClass]"></div>
        <div class="flex-1 overflow-hidden" @click="gotoSteem($event)">
          <div class="text-left font-400 mt-1rem sm:mt-0.5rem md:mt-0rem">
            <div @click.stop="clickContent"
                 class="cursor-pointer text-14px leading-18px  text-colorD9 light:text-color46">
              <a v-if="isIgnoreAccount" :href="steemUrl" class="text-blue-500 break-all" target="_blank">{{steemUrl}}</a>
              <div class="whitespace-pre-line"
                   :class="(imgurls && imgurls.length>0 && !isDetail)?'multi-content':''"
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
                   class="py-3px px-6px rounded-6px mt-10px
                        whitespace-nowrap cursor-pointer light:text-color46"
                   :class="selectedTag === tag?'bg-color62 text-white':'light:text-color8B bg-white/10 light:bg-color8B/10'"
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
            <PostButtonGroup ref="postButtonRef" :post="post" :imgurls="imgurls" :is-detail="isDetail" :content="content"/>
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
  </div>
</template>

<script>
import {parseTimestamp, formatPrice, stringLength, formatAmount} from '@/utils/helper'
import { getCurationRewardsOfPost } from '@/api/api'
import { mapState, mapGetters } from 'vuex'
import { SteemScan, IgnoreAuthor, errCode } from '@/config'
import { ImagePreview } from 'vant';
import LinkPreview from "@/components/LinkPreview";
import Repost from "@/components/Repost";
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import {formatEmojiText} from "@/utils/tool";
import PostButtonGroup from "@/components/PostButtonGroup";
import debounce from 'lodash.debounce'
import ChainTokenIcon from "@/components/ChainTokenIcon.vue";

export default {
  name: "Blog",
  components: {LinkPreview, Repost, PostButtonGroup, ChainTokenIcon},
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
      showCuratedTip: false,
      rewards: []
    }
  },
  computed: {
    ...mapState(['accountInfo']),
    ...mapState('postsModule', ['selectedTag']),
    ...mapGetters(['getAccountInfo']),
    profileImg() {
      if (!this.post.profileImg) return null
      if (this.post.profileImg) {
        return this.post.profileImg.replace('normal', '200x200')
      }else {
        return 'https://profile-images.heywallet.com/' + this.getAccountInfo.twitterId
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
        content = content.replace(url, `<span data-url="${url}" class="text-blue-500 text-14px break-all">${url}</span>`)
      }
      return content
    },
  },
  methods: {
    formatEmojiText,
    parseTimestamp,
    formatAmount,
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
      this.$store.commit('postsModule/saveSelectedTag', tag)
    },
    onFollow() {
      this.$refs.postButtonRef.userFollow()
    },
    onReply() {
      this.$refs.postButtonRef.preReply()
    },
    onQuote() {
      this.$refs.postButtonRef.otherPreQuote()
    },
    onCreateCuration() {
      this.$refs.postButtonRef.preQuote()
    },
    onRetweet() {
      this.$refs.postButtonRef.userRetweet()
    },
    onLike() {
      this.$refs.postButtonRef.userLike()
    },
    gotoTweet(e) {
      e.stopPropagation();
      window.open(`https://twitter.com/${this.post.username}/status/${this.post.postId}`)
    },
    getTip: debounce(function t() {
      // get rewards
      if (this.rewards && this.rewards.length > 0) {
        this.showCuratedTip = true
      }else {
        getCurationRewardsOfPost(this.post.postId).then(res => {
          if (res && res.length > 0) {
            this.rewards = res.map(r => ({
              ...r,
              amount: r.amount > 0 ? this.formatAmount(r.amount / ( 10 ** r.decimals)) : '???'
            }));
          }else {
            this.rewards = []
          }
        }).catch(e => this.rewards = []).finally(() => this.showCuratedTip = true)
      }
    }, 500)
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
    // if(this.$refs.curatedTipRef) {
    //   console.log('========', this.$refs.curatedTipRef.onOpen)
    //   this.$refs.curatedTipRef.onOpen = () => {
    //     console.log('test')
    //   }
    // }
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
