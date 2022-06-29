<template>
  <div>
    <div class="flex">
      <img v-if="accountInfo" @click="gotoSteemProfile" class="w-5rem h-5rem mr-1.5rem rounded-full gradient-border border-3px cursor-pointer"
           :src="profileImg" alt="">
      <img class="w-5rem h-5rem mr-1.5rem rounded-full gradient-border border-3px" src="@/assets/icon-default-avatar.svg" v-else alt="">
      <div class="flex-1 overflow-x-hidden">
        <div class="flex sm:items-center sm:flex-row flex-col items-start">
          <div class="flex items-center">
            <a class="font-700 text-left">{{ post.name }}</a>
            <img class="w-1rem h-1rem sm:mx-0.5rem ml-0.5rem" src="~@/assets/icon-checked.svg" alt="">
          </div>
          <span class="whitespace-nowrap overflow-ellipsis overflow-x-hidden text-text8F">
            @{{ post.username }} · {{ parseTimestamp(post.postTime) }}
          </span>
        </div>
        <div class="text-left font-400 mt-1">
          <p @click="gotoSteem" class="cursor-pointer">
            {{ post.content.replace(this.urlreg, '') }}
          </p>
          <p v-show="urls && urls.length > 0" v-for="u of urls" :key="u">
             <a :href="u"
                class="text-blue-500" target="_blank">
              {{ u }}
            </a>
          </p>
        </div>
        <!--img-1, img-2, img-3, img-4 -->
        <div class="grid mt-10px max-w-25rem" :class="`img-`+(imgurls.length%5)" v-if="imgurls && imgurls.length > 0">
          <div class="img-box" v-for="url of imgurls.slice(0,4)" :key="url">
            <img @click="viewImg(url)" :src="url" alt="">
          </div>
        </div>
        <div class="flex gap-0.8rem font-200 text-0.6rem mt-15px flex-wrap">
          <div v-show="tag != 'wormhole3'" class="blog-tag" v-for="tag of JSON.parse(post.tags)" :key="tag">
            #{{ tag }}
          </div>
        </div>
        <div class="flex gap-4rem mt-15px">
          <div class="text-text8F flex items-center">
            <img class="w-18px" src="~@/assets/icon-msg.svg" alt="">
            <span class="c-text-medium ml-2px">{{ post.children }}</span>
          </div>
          <!-- <div class="text-text8F flex items-center">
            <img class="w-18px" src="~@/assets/icon-forward.svg" alt="">
            <span class="c-text-medium ml-2px">61</span>
          </div> -->
          <div class="flex items-center">
            <svg width="18" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="#8F8F8F" d="M10.0001 17.8349H9.98726C7.61951 17.7909 0.787598 11.6181 0.787598 5.77157C0.787598 2.9629 3.10218 0.49707 5.74035 0.49707C7.83951 0.49707 9.25118 1.9454 9.99918 2.99957C10.7453 1.94724 12.157 0.49707 14.2571 0.49707C16.8971 0.49707 19.2108 2.9629 19.2108 5.77249C19.2108 11.6172 12.3779 17.79 10.0102 17.8331H10.0001V17.8349Z"/>
            </svg>
            <span class="c-text-medium ml-2px text-text8F">{{ post.votes }}</span>
          </div>
          <div class="text-text8F flex items-center">
            <!-- <img class="w-16px" src="~@/assets/icon-share.svg" alt=""> -->
            <span class="c-text-medium ml-2px text-text8F">$ {{ value }}</span>
          </div>
        </div>
      </div>
    </div>
    <el-dialog custom-class="c-img-dialog" v-model="imgViewDialog" :fullscreen="true" title="&nbsp;">
      <img class="absolute transform top-1/2 left-1/2  -translate-y-1/2 -translate-x-1/2 max-h-70vh"
           :src="imgUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { parseTimestamp } from '@/utils/helper'
import { mapState } from 'vuex'
import { EVM_CHAINS } from '@/config'

export default {
  name: "Blog",
  props: {
    post: {
      type: Object
    },
  },
  data() {
    return {
      like: true,
      urls: [],
      imgurls: [],
      allurls: [],
      url: null,
      reg: '',
      urlreg: '',
      imgViewDialog: false,
      imgUrl: ''
    }
  },
  computed: {
    ...mapState(['accountInfo']),
    profileImg() {
      if (!this.accountInfo) return ''
      if (this.accountInfo.profileImg) {
        return 'https://pbs.twimg.com/profile_images/' + this.accountInfo.profileImg.replace('normal', '200x200')
      }else {
        return 'https://profile-images.heywallet.com/' + this.accountInfo.twitterId
      }
     },
    value() {
      const value = this.parseSBD(this.post.curatorPayoutValue)
       + this.parseSBD(this.post.pendingPayoutValue)
      + this.parseSBD(this.post.totalPayoutValue)
      return value || 0
    }
  },
  methods: {
    parseTimestamp(time) {
      return parseTimestamp(time)
    },
    parseSBD(v) {
      return parseFloat(v.replace(' SBD', ''))
    },
    gotoSteem() {
      window.open(`${EVM_CHAINS.STEEM.scan}@${this.post.steemId}/${this.post.postId}`, '__blank')
    },
    gotoSteemProfile() {
      window.open(`${EVM_CHAINS.STEEM.scan}@` + this.post.steemId, '__blank')
    },
    viewImg(url) {
      this.imgUrl = url
      this.imgViewDialog = true
    }
  },
  mounted () {
    this.urlreg = /http[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+/g
    this.reg = /(https?:[^:<>"]*\/)([^:<>"]*)(\.((png!thumbnail)|(png)|(jpg)|(webp)))/g
    const urls = this.post.content.replace(' ', '').replace('\r', '').replace('\t', '').match(this.urlreg)
    this.allurls = urls
    this.imgurls = this.post.content.replace(' ', '').replace('\r', '').replace('\t', '').match(this.reg)
    if (urls && this.imgurls) {
      this.urls = urls.filter(u => this.imgurls.indexOf(u) < 0)
    } else if(urls) {
      this.urls = urls
    }
  },
}
</script>

<style scoped lang="scss">
.img-box {
  overflow: hidden;
  width: 100%;
  padding-top: 100%;
  position: relative;
  img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 16px;
    object-fit: cover;
  }
}
.img-1 {
  grid-template-columns: repeat(1, 1fr);
}
.img-2 {
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
.img-3 {
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
.img-4 {
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 1rem;
}
.blog-tag{
  border-radius: 0.4rem;
  padding: .2rem .5rem 0.2rem 0.8rem;
  border: 1px solid #434343;
  background-color: rgba(white, .1);
  background-image: linear-gradient(to bottom, var(--gradient-primary-color1), var(--gradient-primary-color2));
  background-size: 0.3rem 100%;
  background-repeat: no-repeat;
}
@media (max-width: 500px) {
  .img-3 {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
  }
}
</style>
