<template>
  <div class="" ref="blogRef">
    <div class="sm:rounded-1rem">
      <div class="flex items-start">
        <div class="flex-1 overflow-hidden" @click="gotoSteem($event)">
          <div class="text-left font-400">
            <div @click.stop="clickContent"
                 class="cursor-pointer text-14px leading-18px text-colorD9 light:text-color46">
              <a v-if="isIgnoreAccount" :href="steemUrl" class="text-blue-500 break-all" target="_blank">{{steemUrl}}</a>
              <div class="whitespace-pre-line multi-content"
                   v-else v-html="formatEmojiText(content)"></div>
            </div>
          </div>
        </div>
        <BlogReward :post="post" class="ml-10px"></BlogReward>
      </div>
      <div class="flex justify-between items-center mt-8px text-14px filter invert-60 light:invert-50">
        <span>{{parseTimestamp(post.postTime)}}</span>
        <div class="flex items-center">
          <img class="w-14px h-14px"
               src="~@/assets/icon-member-white.svg" alt="">
          <span class="ml-4px">35</span>
        </div>
      </div>
      <div class="w-full h-1px bg-color8B/30 light:bg-color7F my-10px"></div>
      <slot name="bottom-btn-bar">
        <PostButtonGroup ref="postButtonRef"
                         :id="post.postId"
                         :post="post"
                         :imgurls="imgurls"
                         :is-detail="isDetail"
                         :content="content"/>
      </slot>
    </div>
  </div>
</template>

<script>
import {parseTimestamp, formatPrice, stringLength, formatAmount} from '@/utils/helper'
import { getCurationRewardsOfPost } from '@/api/api'
import { mapState, mapGetters } from 'vuex'
import { SteemScan, IgnoreAuthor, errCode } from '@/config'
import { ImagePreview } from 'vant';
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import {formatEmojiText} from "@/utils/tool";
import PostButtonGroup from "@/components/PostButtonGroup";
import debounce from 'lodash.debounce'
import BlogReward from "@/components/BlogReward";

export default {
  name: "RecommendPost",
  components: {PostButtonGroup, BlogReward},
  props: {
    post: {
      type: Object,
      default: {}
    },
    isDetail: {
      type: Boolean,
      default: false
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
      const res = IgnoreAuthor.indexOf(this.post.twitterId) !== -1;
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
