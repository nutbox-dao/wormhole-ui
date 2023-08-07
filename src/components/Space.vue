<template>
  <div class="text-14px">
    <div v-if="showAvatar" class="flex items-center">
      <Avatar :profile-img="profileImg"
              :name="space.name"
              :username="space.username"
              :steem-id="space.steemId"
              :eth-address="space.ethAddress"
              :reputation="space.reputation"
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
                 @click.stop="gotoUserPage()">{{ space.name }}</a>
            </div>
          </div>
          <div class="flex items-center id-time">
              <span class="text-12px leading-18px  text-color8B light:text-color7D">
                @{{ space.username }}
              </span>
            <span class="mx-4px text-color8B light:text-color7D"> · </span>
            <span class="whitespace-nowrap text-12px leading-18px 2xl:text-0.7rem 2xl:leading-1rem text-color8B light:text-color7D">
               {{ parseTimestamp(space.postTime) }}
              </span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex mt-5px sm:mt-0 relative">
      <div v-if="showAvatar"
           class="mr-10px max-w-56px max-h-56px" :class="[avatarClass]"></div>
      <div class="flex-1 truncate">
        <div class="flex-1 rounded-12px
                    min-h-154px bg-tag-gradient overflow-hidden relative">
          <div class="p-17px 2xl:p-1rem">
            <div class="flex justify-between items-center text-14px mb-10px">
              <div class="flex items-center">
                <img v-if="space.authorProfileImg || space.profileImg"
                     class="w-30px h-30px xl:w-1.5rem xl:h-1.5rem rounded-full"
                     @error="replaceEmptyImg"
                     :src="(space.authorProfileImg ?? space.profileImg).replace('normal', '200x200')" alt="">
                <img v-else class="w-30px h-30px xl:w-1.5rem xl:h-1.5rem rounded-full opacity-50"
                     src="~@/assets/icon-default-avatar.svg" alt="">
                <div class="flex items-center flex-wrap" @click.stop="gotoUserPage()">
                  <a class="c-text-black text-left ml-5px text-14px leading-18px cursor-pointer text-white">
                    @{{ space.authorUsername ?? space.username }}</a>
                  <button class="h-18px border-1px border-white rounded-full px-8px text-12px ml-6px">{{$t('curation.host')}}</button>
                </div>
              </div>
            </div>
            <div class="text-left c-text-black text-16px text-white mb-8px truncate">
              {{ space.spaceTitle ?? space.authorName ?? space.name }}
            </div>
            <div v-if="space.spaceState===1" class="text-left text-white mb-8px text-12px font-bold">
              {{ parseSpaceStartTime(space.spaceStartedAt) }}
            </div>
            <div v-if="space.spaceState==='scheduled'" class="text-left text-white mb-8px text-12px font-bold">
              {{ parseSpaceStartTime(space.scheduledStart) }}
            </div>
            <div v-if="space.spaceState===3 || space.spaceState==='ended'"
                 class="text-left text-white mb-8px text-12px font-bold">
              7月18日 1小时23分钟 160人收听
            </div>
            <div class="h-30px 2xl:1.5rem">
              <button v-if="space.spaceState===1 || space.spaceState==='scheduled'"
                      class="bg-white h-full w-full rounded-full font-bold flex justify-center items-center"
                      @click.stop="gotoSpace">
                <span class="c-text-black text-14px 2xl:text-0.8rem text-black">{{ $t('space.setReminder') }}</span>
              </button>
              <button v-if="space.spaceState===2 || space.spaceState==='live'"
                      class="bg-white h-full w-full rounded-full font-bold flex justify-center items-center"
                      @click.stop="gotoSpace">
                <span class="c-text-black text-14px 2xl:text-0.8rem text-black">{{ $t('space.joinNow') }}</span>
              </button>
              <button v-if="space.spaceState===3 || space.spaceState==='ended'"
                      class="bg-white h-full w-full rounded-full font-bold flex justify-center items-center"
                      @click.stop="gotoSpace">
                <span class="c-text-black text-14px 2xl:text-0.8rem text-black">{{ $t('space.playRecording') }}</span>
              </button>
            </div>
          </div>
          <div class="absolute right-0 top-0 status-flag text-14px font-bold
                      h-60px w-120px pr-10px text-right pt-10px"
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
    }
  },
  computed: {
    profileImg() {
      if (!this.space.profileImg) return null
      if (this.space.profileImg) {
        return this.space.profileImg.replace('normal', '200x200')
      }else {
        return 'https://profile-images.heywallet.com/' + this.getAccountInfo.twitterId
      }
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
    }
  },
  data() {
    return {
      stateMap: {
        1: 'Schedualed',
        2: 'Listening',
        3: 'Ended',
        4: 'Canceled'
      }
    }
  },
  methods: {
    parseSpaceStartTime,
    parseTimestamp,
    gotoUserPage() {
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
}
</script>

<style scoped lang="scss">
.status-flag {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 0);
  background: #FA910D;
}
.bg-2,.bg-live {
  background: #19AF00;
}
.bg-3,.bg-ended,.bg-4,.bg-canceled {
  background: #A0A0A0;
}
</style>
