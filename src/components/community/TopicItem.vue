<template>
  <div class="rounded-12px overflow-hidden border-1 border-color8B/30 light:border-color7F">
    <div class="flex justify-between items-center bg-color1A h-40px px-15px">
      <span class="c-text-black text-16px text-white">{{ topic.title }}</span>
      <div v-if="status==='toBeStart'"
           class="flex items-center px-8px py-4px rounded-full whitespace-nowrap
                  bg-colorF7F2 text-color62 text-12px ">
        <img class="w-14px h-14px mr-2px" src="~@/assets/icon-time-primary.svg" alt="">
        <span>{{$t('community.toBeStart')}}</span>
        <span class="w-1px h-10px bg-color62/50 mx-5px"></span>
        <van-count-down class="text-12px text-color62"
                        :time="countdown(new Date(topic.startTime).getTime()/1000)">
          <template #default="timeData">
            {{ timeData.days }} {{$t('common.day')}}
            {{ timeData.hours }} {{$t('common.hour')}}
            {{ timeData.minutes }} {{$t('common.minute')}}
            {{ timeData.seconds }} {{$t('common.second')}}
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
      <div class="text-14px leading-20px text-left mt-15px">
        {{ topic.description }}
      </div>
      <button class="w-full h-40px gradient-bg gradient-bg-color3 text-white c-text-black text-16px rounded-full mt-10px"
              @click="$router.push(`/topic-detail/${topic.activityId}`)">
        {{$t('community.enter')}}
      </button>
    </div>
  </div>
</template>

<script>
import {isNumeric} from "@/utils/tool";

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
      participant: [{"twitterId":"3419530221","twitterName":"⭐Zvezda Crypto","twitterUsername":"C_Zvezdaa","profileImg":"https://pbs.twimg.com/profile_images/1653485193808826373/H0DBPYya_normal.jpg","createAt":"2023-05-12T14:23:42.000Z","id":359344,"curationId":"23ba1526c4af","amount":"0","isFeed":0,"token":"0x217dffF57E3b855803CE88a1374C90759Ea071bD","decimals":18,"tokenName":"Wrapped NULS","tokenSymbol":"WNULS","taskStatus":0,"totalCount":6},{"twitterId":"1397026760114335749","twitterName":"Leo.bnb Web 3 Camp","twitterUsername":"Leo69129849","profileImg":"https://pbs.twimg.com/profile_images/1479014955227631616/9uck0k8A_normal.jpg","createAt":"2023-05-12T12:52:43.000Z","id":359212,"curationId":"23ba1526c4af","amount":"0","isFeed":0,"token":"0x217dffF57E3b855803CE88a1374C90759Ea071bD","decimals":18,"tokenName":"Wrapped NULS","tokenSymbol":"WNULS","taskStatus":0,"totalCount":6},{"twitterId":"1654915931213004801","twitterName":"Abmustafa","twitterUsername":"Abmustafa340","profileImg":"https://pbs.twimg.com/profile_images/1655622288094507012/BF4L87Yl_normal.jpg","createAt":"2023-05-12T12:31:41.000Z","id":359189,"curationId":"23ba1526c4af","amount":"0","isFeed":0,"token":"0x217dffF57E3b855803CE88a1374C90759Ea071bD","decimals":18,"tokenName":"Wrapped NULS","tokenSymbol":"WNULS","taskStatus":0,"totalCount":6},{"twitterId":"1005908138237878272","twitterName":"Abdulkadir","twitterUsername":"Abdulkadir007ab","profileImg":"https://pbs.twimg.com/profile_images/1624717814748569602/CR0qcrvt_normal.jpg","createAt":"2023-05-12T12:26:04.000Z","id":359147,"curationId":"23ba1526c4af","amount":"0","isFeed":0,"token":"0x217dffF57E3b855803CE88a1374C90759Ea071bD","decimals":18,"tokenName":"Wrapped NULS","tokenSymbol":"WNULS","taskStatus":0,"totalCount":6},{"twitterId":"1086512818843774976","twitterName":"Donut","twitterUsername":"Adedotu69664225","profileImg":"https://pbs.twimg.com/profile_images/1566911992409071617/UFUsKISL_normal.jpg","createAt":"2023-05-12T12:24:36.000Z","id":359129,"curationId":"23ba1526c4af","amount":"0","isFeed":0,"token":"0x217dffF57E3b855803CE88a1374C90759Ea071bD","decimals":18,"tokenName":"Wrapped NULS","tokenSymbol":"WNULS","taskStatus":0,"totalCount":6},{"twitterId":"419295898","twitterName":"Aliu Herpheezy","twitterUsername":"herpheezy","profileImg":"https://pbs.twimg.com/profile_images/1251775841073278981/Qn3vPT3R_normal.jpg","createAt":"2023-05-12T11:52:33.000Z","id":359108,"curationId":"23ba1526c4af","amount":"0","isFeed":0,"token":"0x217dffF57E3b855803CE88a1374C90759Ea071bD","decimals":18,"tokenName":"Wrapped NULS","tokenSymbol":"WNULS","taskStatus":0,"totalCount":6}]
    }
  },
  methods: {
    countdown(time) {
      if(!time || !isNumeric(time)) return 0
      return time*1000 - new Date().getTime()
    },
  }
}
</script>

<style scoped>

</style>
