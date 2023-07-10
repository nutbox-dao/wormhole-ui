<template>
  <div class="rounded-12px overflow-hidden border-1 border-color8B/30 light:border-color7F">
    <div class="flex justify-between items-center bg-color1A h-40px px-15px truncate">
      <span class="c-text-black text-16px text-white truncate mr-15px">{{ topic.title }}</span>
      <div v-if="status==='toBeStart'"
           class="flex items-center px-8px py-4px rounded-full whitespace-nowrap
                  bg-colorF7F2 text-color62 text-12px ">
        <img class="w-14px h-14px mr-2px" src="~@/assets/icon-time-primary.svg" alt="">
        <span>{{$t('community.toBeStart')}}</span>
        <span class="w-1px h-10px bg-color62/50 mx-5px"></span>
        <van-count-down class="text-12px text-color62"
                        :time="countdown(new Date(topic.startTime).getTime()/1000)">
          <template #default="timeData">
            <span v-if="timeData.days>0">
              {{ timeData.days }} <span class="">{{$t('common.day')}}</span>
              {{ timeData.hours }} <span class="">{{$t('common.hour')}}</span>
            </span>
            <span v-else-if="timeData.hours>0">
              {{ timeData.hours }} <span class="">{{$t('common.hour')}}</span>
              {{ timeData.minutes }} <span class="">{{$t('common.minute')}}</span>
            </span>
            <span v-else>
              {{ timeData.minutes }} <span class="">{{$t('common.minute')}}</span>
              {{ timeData.seconds }} <span class="">{{$t('common.second')}}</span>
            </span>
          </template>
        </van-count-down>
      </div>
      <div v-else-if="status==='inProgress'"
           class="flex items-center px-8px py-4px rounded-full whitespace-nowrap
                  bg-color62 text-white text-12px ">
        🔥 {{$t('community.inProgress')}}
      </div>
      <div v-else-if="status==='ended'"
           class="flex items-center px-8px py-4px rounded-full whitespace-nowrap
                  bg-colorF0 text-color66 text-12px">
        <img class="w-14px h-14px mr-2px" src="~@/assets/icon-delete.svg" alt="">
        <span>{{$t('community.ended')}}</span>
      </div>
    </div>
    <div class="p-15px">
      <div class="flex justify-between items-center">
        <span class="text-15px c-text-black">{{$t('community.grandTotalPost', {count: topic.postCounts})}}</span>
        <div class="flex items-center ml-11px">
          <div class="-ml-11px" v-for="p of topic.participates.slice(0,3)" :key="p">
            <img v-if="p"
                 class="w-28px min-w-28px h-28px xl:w-1.2rem xl:min-w-1.2rem xl:h-1.2rem rounded-full
                        border-2 border-color62 light:border-white bg-color8B/10"
                 :src="p" alt="">
            <img v-else
                 class="w-28px min-w-28px h-28px xl:w-1.2rem xl:min-w-1.2rem xl:h-1.2rem rounded-full
                              border-2 border-color62 light:border-white bg-color8B/10"
                 src="~@/assets/icon-default-avatar.svg" alt="">
          </div>
          <span v-if="topic.membersCount>3"
                class="min-w-28px h-28px xl:min-w-1.2rem xl:h-1.2rem rounded-full px-4px
                       rounded-full -ml-10px flex justify-center items-center
                       border-2 border-blockBg bg-primaryColor
                       light:border-white light:bg-color62 light:text-white text-10px">
            +{{ topic.membersCount - 3 }}
          </span>
        </div>
      </div>
      <div class="text-14px leading-20px text-left mt-15px" v-html="formatEmojiText(topic.description)">
      </div>
      <button class="w-full h-40px gradient-bg gradient-bg-color3 text-white c-text-black text-16px rounded-full mt-10px"
              @click="goTopicDetail(topic)">
        {{$t('community.enter')}}
      </button>
    </div>
  </div>
</template>

<script>
import {isNumeric} from "@/utils/tool";
import { getDateString, parseSpaceStartTime } from "@/utils/helper"
import {formatEmojiText} from "@/utils/tool";

export default {
  name: "TopicItem",
  props: {
    topic: {
      type: Object,
      default: {}
    },
  },
  computed: {
    status() {
      if(!this.topic.startTime) return ''
      const currentTime = new Date().getTime()
      if(new Date(this.topic.startTime).getTime() > currentTime) return 'toBeStart'
      if(currentTime > new Date(this.topic.startTime).getTime() &&
          currentTime < new Date(this.topic.endTime).getTime()) return 'inProgress'
      return 'ended'
    }
  },
  data() {
    return {
    }
  },
  methods: {
    getDateString,
    parseSpaceStartTime,
    formatEmojiText,
    countdown(time) {
      if(!time || !isNumeric(time)) return 0
      return time*1000 - new Date().getTime()
    },
    goTopicDetail(topic) {
      this.$bus.emit('refreshDetail')
      this.$router.push(`/topic-detail/${topic.activityId}`)
    }
  }
}
</script>

<style scoped>

</style>
