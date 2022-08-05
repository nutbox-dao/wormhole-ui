<template>
  <div class="">
    <div class="py-1rem px-1.5rem sm:rounded-1rem">
      <div class="flex ">
        <img v-if="profileImg" @click.stop="gotoUserPage()"
             class="w-2.6rem h-2.6rem md:w-3.6rem md:h-3.6rem md:mr-1.5rem sm:mr-1.4rem mr-0.8rem rounded-full gradient-border cursor-pointer"
             :src="profileImg" alt="">
        <img class="w-2.6rem h-2.6rem md:w-3.6rem md:h-3.6rem md:mr-1.5rem sm:mr-1.4rem mr-0.8rem rounded-full gradient-border" src="@/assets/icon-default-avatar.svg" v-else alt="">
        <div class="flex-1 flex flex-col items-start cursor-pointer" @click.stop="gotoUserPage()">
          <div class="flex items-center flex-wrap">
            <a class="c-text-black text-left mr-3 text-1rem leading-1.5rem">{{ post.name }}</a>
            <!-- <img class="w-1rem h-1rem mx-0.5rem" src="~@/assets/icon-checked.svg" alt=""> -->
            <span class="text-0.8rem text-color8B">@{{ post.username }}</span>
          </div>
          <span class="whitespace-nowrap overflow-ellipsis overflow-x-hidden text-color8B text-0.7rem leading-1.5rem">
            {{ parseTimestamp(post.postTime) }}
          </span>
        </div>
      </div>

      <div class="overflow-x-hidden md:ml-5.1rem md:mr-1/20 sm:mx-4.1rem" @click="gotoSteem($event)">
        <div class="text-left font-400 my-1rem sm:mt-0.5rem md:mt-0rem">
          <div class="cursor-pointer text-14px leading-24px 2xl:text-0.9rem 2xl:leading-1.8rem text-color8B">
            <span>{{ post.content && post.content.replace(this.urlreg, '') }}</span>
          </div>
          <div v-show="urls && urls.length > 0" v-for="u of urls" :key="u" class="w-min">
             <a :href="u"
                class="text-blue-500 text-14px 2xl:text-0.8rem" target="_blank">
              {{ u }}
            </a>
          </div>
        </div>

<!--       foreign page -->
       <LinkPreview v-if="post.pageInfo && post.pageInfo.length>10" :pageInfo="post.pageInfo"/>
<!--       retweet  -->
       <Repost v-if="post.retweetInfo && post.retweetInfo.length>10" :retweetInfo="post.retweetInfo"/>

        <!--img-1, img-2, img-3, img-4 -->
        <div class="grid mt-10px md:max-w-35rem rounded-12px overflow-hidden"
             :class="`img-`+(imgurls.length%5)" v-if="imgurls && imgurls.length > 0">
          <div class="img-box" v-for="(url, index) of imgurls.slice(0,4)" :key="url">
            <img @click.stop="viewImg(index)" :src="url" alt="">
          </div>
        </div>
        <div class="flex gap-0.8rem font-200 text-0.6rem mt-15px flex-wrap">
          <div v-show="tag != 'iweb3'" class="blog-tag" v-for="tag of JSON.parse(post.tags || '[]')" :key="tag">
            #{{ tag }}
          </div>
        </div>
        <div class="flex gap-4rem mt-15px">
          <div class="text-white flex items-center">
            <img class="w-18px" src="~@/assets/icon-msg.svg" alt="">
            <span class="c-text-medium ml-2px">{{ post.children }}</span>
          </div>
          <!-- <div class="text-text8F flex items-center">
            <img class="w-18px" src="~@/assets/icon-forward.svg" alt="">
            <span class="c-text-medium ml-2px">61</span>
          </div> -->
          <div class="flex items-center">
            <svg width="18" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="white" d="M10.0001 17.8349H9.98726C7.61951 17.7909 0.787598 11.6181 0.787598 5.77157C0.787598 2.9629 3.10218 0.49707 5.74035 0.49707C7.83951 0.49707 9.25118 1.9454 9.99918 2.99957C10.7453 1.94724 12.157 0.49707 14.2571 0.49707C16.8971 0.49707 19.2108 2.9629 19.2108 5.77249C19.2108 11.6172 12.3779 17.79 10.0102 17.8331H10.0001V17.8349Z"/>
            </svg>
            <span class="c-text-medium ml-2px text-white">{{ post.votes }}</span>
          </div>
          <div class="text-white flex items-center">
             <img class="w-16px" src="~@/assets/icon-coin.svg" alt="">
            <span class="c-text-medium ml-2px">{{ value }}</span>
          </div>
        </div>
      </div>
    </div>
    <el-dialog custom-class="c-img-dialog" v-model="imgViewDialog" :fullscreen="true" title="&nbsp;">
      <el-carousel height="70vh" indicator-position="none" :autoplay="false" :initial-index="imgIndex">
        <el-carousel-item v-for="item in imgurls" :key="item">
          <img class="absolute transform top-1/2 left-1/2  -translate-y-1/2 -translate-x-1/2 max-h-70vh"
               :src="item" alt="">
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>

<script>
import { parseTimestamp, formatPrice } from '@/utils/helper'
import { mapState, mapGetters } from 'vuex'
import { EVM_CHAINS } from '@/config'
import { ImagePreview } from 'vant';
import LinkPreview from "@/components/LinkPreview";
import Repost from "@/components/Repost";

export default {
  name: "Blog",
  components: {LinkPreview, Repost},
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
      like: true,
      urls: [],
      imgurls: [],
      allurls: [],
      url: null,
      reg: '',
      urlreg: '',
      imgViewDialog: false,
      imgIndex: 0
    }
  },
  computed: {
    ...mapState(['accountInfo']),
    ...mapGetters(['getAccountInfo']),
    profileImg() {
      if (!this.post.profileImg) return null
      if (this.post.profileImg) {
        return this.post.profileImg.replace('normal', '200x200')
      }else {
        return 'https://profile-images.heywallet.com/' + this.getAccountInfo.twitterId
      }
     },
    value() {
      if (!this.post.content) return '$0'
      const value = this.parseSBD(this.post.curatorPayoutValue)
       + this.parseSBD(this.post.pendingPayoutValue)
      + this.parseSBD(this.post.totalPayoutValue)
      return formatPrice(value)
    }
  },
  methods: {
    parseTimestamp(time) {
      return parseTimestamp(time)
    },
    parseSBD(v) {
      return parseFloat(v.replace(' SBD', ''))
    },
    gotoSteem(e) {
      if (this.isDetail) {
        e.stopPropagation();
        window.open(`${EVM_CHAINS.STEEM.scan}@${this.post.steemId}/${this.post.postId}`, '__blank')
      }
    },
    gotoUserPage() {
      if (this.post.username !== this.getAccountInfo.twitterUsername){
        this.$router.push({path : '/account-info/@' + this.post.username})
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
    }
  },
  mounted () {
    this.urlreg = /http[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+/g
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
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
}
.img-4 {
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 2px;
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
    :nth-child(2) {
      grid-column: 2 / 2;
      grid-row: 1 / 3;
    }
  }
}
</style>
