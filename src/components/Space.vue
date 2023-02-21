<template>
  <div>
    <div v-if="showAvatar" class="flex items-center">
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
             @click.stop="gotoUserPage()">{{ space.name }}</a>
          <!-- <img class="w-1rem h-1rem mx-0.5rem" src="~@/assets/icon-checked.svg" alt=""> -->
        </div>
        <div class="flex items-center id-time">
            <span class="text-12px leading-18px 2xl:text-0.7rem 2xl:leading-1rem text-color8B light:text-color7D">
              @{{ space.username }}
            </span>
          <span class="mx-4px text-color8B light:text-color7D"> · </span>
          <span class="whitespace-nowrap text-12px leading-18px 2xl:text-0.7rem 2xl:leading-1rem text-color8B light:text-color7D">
             {{ parseTimestamp(space.postTime) }}
            </span>
        </div>
      </div>
      <div v-if="space.isCurated" class="bg-colorF1 light:bg-white px-8px rounded-full py-4px light:shadow-md">
        <div class="gradient-text gradient-text-right3-deg text-12px xl:text-0.75rem font-bold">Curated</div>
      </div>
    </div>
    <div class="flex">
      <div v-if="showAvatar"
           class="hidden sm:block mr-10px md:mr-1rem ml-block" :class="[avatarClass]"></div>
      <div class="flex-1 md:max-w-35rem">
        <div class="flex-1 p-17px 2xl:p-1rem sm:rounded-1rem flex flex-col justify-between
                    min-h-154px rounded-15px bg-tag-gradient">
          <div class="flex justify-between items-center text-14px 2xl:text-0.8rem">
            <div class="flex items-center">
              <img v-if="space.authorProfileImg || space.profileImg"
                   class="w-30px h-30px xl:w-1.5rem xl:h-1.5rem rounded-full"
                   :src="(space.authorProfileImg ?? space.profileImg).replace('normal', '200x200')" alt="">
              <img v-else class="w-30px h-30px xl:w-1.5rem xl:h-1.5rem rounded-full opacity-50"
                   src="~@/assets/icon-default-avatar.svg" alt="">
              <div class="flex-1 flex flex-col items-start cursor-pointer" @click.stop="gotoUserPage()">
                <div class="flex items-center flex-wrap">
                  <a class="c-text-black text-left mr-3 ml-3 text-16px leading-18px 2xl:text-1rem 2xl:leading-1.5rem text-white">
                    @{{ space.authorUsername ?? space.username }}</a>
                </div>
              </div>
            </div>
          </div>
          <div class="text-left c-text-black text-16px 2xl:text-1.2rem text-white">{{ space.spaceTitle ?? space.authorName ?? space.name }}</div>
          <button class="bg-white h-30px 2xl:1.5rem w-full rounded-full font-bold flex justify-center items-center"
                  @click.stop="gotoSpace">
            <img v-if="space.spaceState === 2" class="w-10x mr-5px" src="~@/assets/icon-listen.svg" alt="">
            <span class="c-text-black text-14px 2xl:text-0.8rem text-black">{{ state }}</span>
          </button>
        </div>
        <slot name="bottom-btn-bar">
          <PostButtonGroup :post="space"/>
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

export default {
  name: "Space",
  components: {PostButtonGroup},
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
          return parseSpaceStartTime(this.space.spaceStartedAt)
        case 2:
          return this.$t('space.listening')
        case 3:
          return this.$t('space.ended')
        case 4:
          return this.$t('space.canceled')
        case 'scheduled':
          return parseSpaceStartTime(this.space.scheduledStart)
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
    parseTimestamp,
    gotoUserPage() {
    },
    gotoSpace () {
      window.open('https://twitter.com/i/spaces/' + this.space.spaceId)
    },
    replaceEmptyImg(e) {
      e.target.src = emptyAvatar;
    },
  },
}
</script>

<style scoped>
.space-box {
  background: linear-gradient(135.53deg, #917AFD 2.61%, #6246EA 96.58%);
}
</style>
