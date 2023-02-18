<template>
  <div class="flex text-14px xl:text-0.8rem">
    <img class="min-w-35px min-h-35px w-2.2rem h-2.2rem md:w-3rem md:h-3rem mr-10px md:mr-1rem rounded-full"
         :src="profile" alt="">
    <div class="flex-1 text-left">
      <div class="flex items-center flex-wrap text-14px xl:text-0.8rem gap-y-4px">
        <span class="c-text-black mr-1rem light:text-blueDark">{{comment.name}}</span>
        <span class="text-color8B light:text-color7D">
          @{{comment.username}} · {{ parseTimestamp(comment.commentTime) }}
        </span>
      </div>
      <!-- <div class="text-left my-0.5rem">
        Replying to
        <a class="text-primaryColor" href="">@acsc</a>
      </div> -->
      <div class="text-14px leading-20px text-colorE3 light:text-color46 mt-1rem">{{comment.content}}</div>
      <!-- <div class="flex gap-4rem mt-15px">
        <div class="flex items-center">
          <i class="w-18px h-18px icon-msg"></i>
          <span class="ml-2px font-700 text-white light:text-color7D">{{ comment.children }}</span>
        </div>
        <div class="flex items-center">
          <i class="w-18px h-18px icon-like"></i>
          <span class="ml-2px font-700 text-white light:text-color7D">{{ comment.votes }}</span>
        </div>
        <div class="text-white flex items-center">
          <i class="w-18px h-18px icon-coin"></i>
          <span class="ml-2px font-700 text-white light:text-color7D">{{value}}</span>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { formatPrice, parseTimestamp } from '@/utils/helper'

export default {
  name: "Comment",
  props: {
    comment: {
      type: Object,
      default: {}
    },
  },
  data() {
    return {
      like: true
    }
  },
  computed: {
    value() {
      if (!this.comment.content) return '$0'
      const value = this.parseSBD(this.comment.curatorPayoutValue)
       + this.parseSBD(this.comment.pendingPayoutValue)
      + this.parseSBD(this.comment.totalPayoutValue)
      return formatPrice(value)
    },
    profile() {
      if (!this.comment.profileImg) return null
      if (this.comment.profileImg) {
        return this.comment.profileImg.replace('normal', '200x200')
      }else {
        return 'https://profile-images.heywallet.com/' + this.comment.twitterId
      }
    }
  },
  methods: {
    parseTimestamp(time) {
      return parseTimestamp(time)
    },
    parseSBD(v) {
      return parseFloat(v.replace(' SBD', ''))
    },
  },
}
</script>

<style scoped>

</style>
