<template>
  <div class="text-14px" ref="spaceRef">
    <div v-show="showCommunity && space.communityId"
         @click.stop="$router.push('/community-detail/' + space.communityId)"
         class="flex items-center mb-5px">
      <div class="max-h-16px overflow-hidden">
        <div class="mr-10px max-w-56px max-h-56px flex justify-end"
             :class="avatarClass">
          <img class="w-16px h-16px bg-color8B/30 rounded-full mx-4px" :src="space.communityIcon" alt="">
        </div>
      </div>
      <span class="text-12px text-color8B light:text-color7D">{{ space.communityName }}</span>
    </div>
    <div v-if="showAvatar" class="flex items-center">
      <Avatar :profile-img="profileImg"
              :name="space.spaceTwitterName"
              :username="space.spaceTwitterUsername"
              :steem-id="space.spaceSteemId"
              :eth-address="space.spaceEthAddress"
              :reputation="space.spaceReputation"
              @gotoUserPage="gotoUserPage">
        <template #avatar-img>
          <img v-if="profileImg" @click.stop="gotoUserPage()"
               class="mr-10px rounded-full cursor-pointer blog-avatar max-w-56px max-h-56px bg-color62/10 border-1"
               :class="avatarClass"
               @error="replaceEmptyImg"
               :src="profileImg" alt="">
          <img class="mr-10px rounded-full max-w-56px max-h-56px bg-color62/10 border-1"
               :class="avatarClass"
               src="@/assets/icon-default-avatar.svg" v-else alt="">
        </template>
      </Avatar>
      
      <div class="flex-1 flex justify-between sm:items-center">
          <div class="flex-1 flex flex-col items-start sm:flex-wrap sm:flex-row sm:items-center">
            <div class="flex items-center sm:mr-6px">
              <div class="flex items-center flex-wrap">
                <a class="c-text-black text-left cursor-pointer
                      text-16px leading-18px  light:text-blueDark"
                   @click.stop="gotoUserPage()">{{ space.spaceTwitterName }}</a>
              </div>
              <div @click.stop class="ml-4px flex items-center sm:hidden">
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
            <div class="flex items-center id-time">
              <span class="text-12px leading-18px  text-color8B light:text-color7D">
                @{{ space.spaceTwitterUsername }}
              </span>
              <span class="mx-4px text-color8B light:text-color7D"> · </span>
              <span class="whitespace-nowrap text-12px leading-18px 2xl:text-0.7rem 2xl:leading-1rem text-color8B light:text-color7D">
               {{ parseTimestamp(space.postTime) }}
              </span>
            </div>
            <div class="ml-4px items-center hidden sm:flex">
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
          <slot name="blog-reward">
            <BlogReward :post="post" class="ml-10px">
              <slot name="curation-time"></slot>
            </BlogReward>
          </slot>
        </div>
    </div>
    <div class="flex mt-5px sm:mt-0 relative">
      <div v-if="showAvatar"
           class="mr-10px max-w-56px max-h-56px" :class="[avatarClass]"></div>
      <div class="flex-1 truncate">
        <div v-if="isDetail" class="text-left font-400 mt-1rem sm:mt-0.5rem md:mt-0rem mb-15px">
          <div class="cursor-pointer text-14px leading-18px  text-colorD9 light:text-color46">
            <div class="whitespace-pre-line"
                 v-html="formatEmojiText(content)"></div>
          </div>
        </div>
        <div class="flex-1 rounded-12px
                    min-h-154px bg-tag-gradient overflow-hidden relative">
          <div class="p-17px 2xl:p-1rem min-h-154px flex flex-col justify-between">
            <div class="w-full flex justify-between items-center text-14px mb-10px">
              <div class="flex items-center">
                <img v-if="space.spaceProfileImg"
                     class="w-30px h-30px xl:w-1.5rem xl:h-1.5rem rounded-full"
                     @error="replaceEmptyImg"
                     :src="(space.spaceProfileImg).replace('normal', '200x200')" alt="">
                <img v-else class="w-30px h-30px xl:w-1.5rem xl:h-1.5rem rounded-full opacity-50"
                     src="~@/assets/icon-default-avatar.svg" alt="">
                <div class="flex items-center flex-wrap" @click.stop="gotoUserPage()">
                  <a class="c-text-black text-left ml-5px text-14px leading-18px cursor-pointer text-white">
                    @{{ space.spaceTwitterUsername }}</a>
                  <button class="h-18px border-1px border-white rounded-full px-8px text-12px ml-6px">{{$t('curation.host')}}</button>
                </div>
              </div>
            </div>
            <div class="flex-1 w-full">
              <div class="text-left c-text-black text-16px text-white mb-8px truncate">
                {{ space.spaceTwitterName }}
              </div>
              <div v-if="space.spaceState===1" class="text-left text-white mb-8px text-12px font-bold">
                {{ parseSpaceStartTime(space.spaceStartTime) }}
              </div>
              <div v-if="space.spaceState===3"
                   class="text-left text-white mb-8px text-12px font-bold">
                {{ parseSpaceStartTime(space.spaceStartTime) }}  |  {{ spaceDuration(space.spaceStartTime, space.spaceEndTime) }}  |  {{ space.participantCount + $t('space.listenerNum') }}
              </div>
            </div>
            <div class="h-30px 2xl:1.5rem">
              <button v-if="space.spaceState===1"
                      class="bg-white h-full w-full rounded-full font-bold flex justify-center items-center"
                      @click.stop="gotoSpace">
                <span class="c-text-black text-14px 2xl:text-0.8rem text-black">{{ $t('space.setReminder') }}</span>
              </button>
              <button v-if="space.spaceState===2"
                      class="bg-white h-full w-full rounded-full font-bold flex justify-center items-center"
                      @click.stop="gotoSpace">
                <span class="c-text-black text-14px 2xl:text-0.8rem text-black">{{ $t('space.joinNow') }}</span>
              </button>
              <button v-if="space.spaceState===3"
                      class="bg-white h-full w-full rounded-full font-bold flex justify-center items-center"
                      @click.stop="gotoSpace">
                <span class="c-text-black text-14px 2xl:text-0.8rem text-black">{{ $t('space.playRecording') }}</span>
              </button>
            </div>
          </div>
          <div class="absolute right-0 top-0 status-flag text-14px font-bold
                      h-60px w-120px pr-10px text-right pt-10px text-white"
               :class="`bg-${space.spaceState}`">
            {{state}}
          </div>
          <slot name="bottom-btn-bar-inside"></slot>
        </div>
        <slot name="bottom-btn-bar">
          <PostButtonGroup class="mt-15px" ref="postButtonRef" :post="space" :is-detail="isDetail"/>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { parseSpaceStartTime } from '@/utils/helper'
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import {parseTimestamp} from "@/utils/helper";
import PostButtonGroup from "@/components/PostButtonGroup";
import Avatar from "@/components/Avatar";
import {formatEmojiText} from "@/utils/tool";

export default {
  name: "Space",
  components: {PostButtonGroup, Avatar},
  props: {
    space: {
      type: Object,
      default: {}
    },
    avatarClass: {
      type: String,
      default: 'w-2.6rem h-2.6rem md:w-3.6rem md:h-3.6rem'
    },
    showAvatar: {
      type: Boolean,
      default: true
    },
    isDetail: {
      type: Boolean,
      default: false
    },
    showCommunity:{
      type: Boolean,
      default: true
    }
  },
  computed: {
    profileImg() {
      if (!this.space.spaceProfileImg) return null
      if (this.space.spaceProfileImg) {
        return this.space.spaceProfileImg.replace('normal', '200x200')
      }
      return ''
    },
    state() {
      switch (this.space.spaceState) {
        case 1:
          // return parseSpaceStartTime(this.space.spaceStartedAt)
          return this.$t('space.notStarted')
        case 2:
          return this.$t('space.listening')
        case 3:
          return this.$t('space.ended')
        case 4:
          return this.$t('space.canceled')
        case 'scheduled':
          // return parseSpaceStartTime(this.space.scheduledStart)
          return this.$t('space.notStarted')
        case 'live':
          return this.$t('space.listening')
        case 'ended':
          return this.$t('space.ended')
        case 'canceled':
          return this.$t('space.canceled')
        default:
          break;
      }
    },
    content() {
      let content = ''
      if (this.space.longContentStatus === 1) {
        for (let c of JSON.parse(this.space.content)) {
          if (c && c !== 'null' && c !== 'undefined') {
            content += c + '\n'
          }
        }
      }else {
        content = this.space.content
      }
      content = content.replace(this.reg, '');
      // content = content.replace('\n', '</br>')
      for (let url of this.urls){
        content = content.replace(url, `<span data-url="${url}" class="text-blue-500 text-14px break-all">${url}</span>`)
      }
      return content
    },
  },
  data() {
    return {
      stateMap: {
        1: 'Schedualed',
        2: 'Listening',
        3: 'Ended',
        4: 'Canceled'
      },
      urls: [],
      imgurls: [],
      allurls: [],
      url: null,
      reg: '',
      urlreg: '',
    }
  },
  methods: {
    formatEmojiText,
    parseSpaceStartTime,
    parseTimestamp,
    spaceDuration(startTime, endTime) {
      if (startTime && endTime) {
        let diff = (new Date(endTime).getTime() - (new Date(startTime).getTime())) / 1000;
        let h;
        let m;
        let s;
        h = Math.floor(diff / 3600)
        m = Math.floor(diff % 3600 / 60)
        s = diff % 60
        if (h > 0) {
          return `${h} Hour ${m} Min`
        }else {
          return `${m} Min ${s} Sec`
        }
      }
      return ''
    },
    gotoTweet(e) {
      e.stopPropagation();
      window.open(`https://twitter.com/${this.space.spaceTwitterUsername}/status/${this.space.postId}`)
    },
    gotoUserPage() {
      this.$router.push('/account-info/@' + this.space.spaceTwitterUsername)
    },
    gotoSpace () {
      window.open('https://twitter.com/i/spaces/' + this.space.spaceId)
    },
    replaceEmptyImg(e) {
      e.target.src = emptyAvatar;
    },
    onQuote() {
      this.$refs.postButtonRef.otherPreQuote()
    }
  },
  mounted () {
    this.urlreg = /http[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_#@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+/g
    this.reg = /(https?:[^:<>"]*\/)([^:<>"]*)(\.((png!thumbnail)|(png)|(jpg)|(webp)))/g
    if (!this.space.content) return;
    const urls = this.space.content.replace(' ', '').replace('\r', '').replace('\t', '').match(this.urlreg)
    this.allurls = urls
    this.imgurls = this.space.content.replace(' ', '').replace('\r', '').replace('\t', '').match(this.reg)
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
.status-flag {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 0);
  display: none;
}
.bg-2,.bg-live,.bg-1,.bg-schedulde {
  background: #1FB759;
  display: block;
}
.bg-3,.bg-ended,.bg-4,.bg-canceled {
  background: #7c7c7c;
  display: block;
}
</style>
