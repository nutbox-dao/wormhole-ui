<template>
  <div class="text-14px">
    <div v-if="loading"
         class="c-text-black py-2rem min-h-1rem">
      <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
    </div>
    <div v-else-if="!participant || participant.length === 0">
      <div class="c-text-black py-2rem min-h-1rem">
        <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
        <div class="mt-1rem">{{$t('common.none')}}</div>
      </div>
    </div>
    <div v-else class="px-15px">
      <!-- <div class="flex justify-between items-center pt-10px">
        <div class="c-text-black text-16px">
          {{$t('curation.speaker')}}
        </div>
        <div class="text-12px">
          {{speakers.length}} {{$t('common.people')}}
        </div>
      </div> -->
      <div class="flex items-center justify-between py-10px">
        <div class="flex items-center w-1/2 truncate pl-8px pt-10px">
          <!-- profile image -->
          <div class="border-2 gradient-border gradient-border-color3 rounded-full relative mr-4px">
            <img v-if="host.profileImg"
                 @click="gotoUserTwitter(host)"
                 class="w-40px h-40px min-w-40px border-2px border-blockBg light:border-white rounded-full"
                 :src="avatar(host.profileImg)" alt="">
            <img v-else
                 class="w-40px h-40px min-w-40px border-2px border-blockBg light:border-white rounded-full "
                 src="~@/assets/icon-default-avatar.svg" alt="">
            <img class="absolute -top-10px -left-8px" src="~@/assets/tag-host.svg" alt="">
          </div>
          <span class="text-center truncate">{{host.twitterName}}</span>
        </div>
        <div class="pl-10px pt-10px flex-1 flex flex-col justify-center items-end gap-5px">
          <div v-if="isCalc">{{ showingAmount(host.hostAmount) }}</div>
          <button class="bg-color62 rounded-full h-28px px-10px text-white text-12px flex items-center"
                  @click="$emit('tip', host)">
            <img class="h-16px mr-4px" src="~@/assets/tips-img.svg" alt="">
            <span>{{$t('info.reward')}}</span>
          </button>
        </div>
      </div>
      <div class="flex items-center justify-between py-10px" v-for="u of coHosts" :key="'co' + u.twitterId">
        <div class="flex items-center w-1/2 truncate pl-8px pt-10px">
          <div class="border-2 gradient-border gradient-border-color3 rounded-full relative mr-4px">
            <img v-if="u.profileImg"
                 @click="gotoUserTwitter(u)"
                 class="w-40px h-40px min-w-40px border-2px border-blockBg light:border-white rounded-full"
                 :src="avatar(u.profileImg)" alt="">
            <img v-else
                 class="w-40px h-40px min-w-40px border-2px border-blockBg light:border-white rounded-full "
                 src="~@/assets/icon-default-avatar.svg" alt="">
            <img class="absolute -top-10px -left-8px" src="~@/assets/tag-co-hosts.svg" alt="">
          </div>
          <span class="text-center truncate">{{u.twitterName}}</span>
        </div>
        <div class="pl-10px pt-10px flex-1 flex flex-col justify-center items-end gap-5px">
          <div v-if="isCalc">{{ showingAmount(u.hostAmount) }}</div>
          <button class="bg-color62 rounded-full h-28px px-10px text-white text-12px flex items-center"
                  @click="$emit('tip', u)">
            <img class="h-16px mr-4px" src="~@/assets/tips-img.svg" alt="">
            <span>{{$t('info.reward')}}</span>
          </button>
        </div>
      </div>
      <div class="flex items-center justify-between py-10px" v-for="u of speakers" :key="'speaker' + u.twitterId">
        <div class="flex items-center w-1/2 truncate pl-8px pt-10px">
          <div class="border-2 gradient-border gradient-border-color3 rounded-full relative mr-4px">
            <img v-if="u.profileImg"
                 @click="gotoUserTwitter(u)"
                 class="w-40px h-40px min-w-40px border-2px border-blockBg light:border-white rounded-full"
                 :src="avatar(u.profileImg)" alt="">
            <img v-else
                 class="w-40px h-40px min-w-40px border-2px border-blockBg light:border-white rounded-full "
                 src="~@/assets/icon-default-avatar.svg" alt="">
            <img class="absolute -top-10px -left-8px" src="~@/assets/tag-speaker.svg" alt="">
          </div>
          <div class="flex-1 flex flex-col items-start is-justify-center truncate">
            <span class="text-center truncate">{{u.twitterName}}</span>
            <span class="font-bold mt-8px text-14px text-color99">{{ u.speakerTime + ' Mins' }}</span>
          </div>
        </div>
        <div class="pl-10px pt-10px flex-1 flex flex-col justify-center items-end gap-5px">
          <div v-if="isCalc">{{ showingAmount(u.speakerAmount) }}</div>
          <button class="bg-color62 rounded-full h-28px px-10px text-white text-12px flex items-center"
                  @click="$emit('tip', u)">
            <img class="h-16px mr-4px" src="~@/assets/tips-img.svg" alt="">
            <span>{{$t('info.reward')}}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getSpaceInfo} from "@/api/api";
import TipModal from "@/components/TipModal.vue";
import { formatAmount, formatPrice, sleep } from "@/utils/helper";
import { mapState } from 'vuex'
import { getPriceFromOracle } from "@/utils/asset";
import { EVM_CHAINS_ID } from '@/config'

export default {
  name: "SpaceSpeaker",
  components: {TipModal},
  props: {
    space: {
      type: Object,
      default: () => {}
    },
    post: {
      type: Object,
      default: () => {}
    },
    participant: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      loading: false,
      host: {},
      coHosts: [],
      speakers: [],
      tipModalVisible: false,
      tipToUser: {},
      isCalc: false,
      price: 0
    }
  },
  computed: {
    ...mapState('community', ['showingCommunity']),
    isCalc() {
      return this.space && this.space.isCalc
    },
    host() {
      if (this.participant && this.post) {
        return this.participant.find(p => this.post.spaceTwitterId === p.twitterId) ?? {}
      }
      return {}
    },
    coHosts() {
      if(this.participant) {
        return this.participant.filter(p => (p.curationRewardType & 16) > 0)
      }
      return []
    },
    speakers() {
      if (this.participant) {
        return this.participant.filter(p => (p.curationRewardType & 32) > 8)
      }
      return []
    }
  },
  methods: {
    avatar(url) {
      return url.replace('normal', '200x200')
    },
    gotoUserTwitter(user) {
      window.open(`https://twitter.com/` + user.twitterUsername)
    },
    showingAmount(amount) {
      const a = amount / (10 ** this.space.decimals)
      return `${formatAmount(a)}(${formatPrice(a * this.price)})`
    }
  },
  async mounted() {
    this.isCalc = this.space && this.space.isCalc
    if (this.participant && this.participant.length > 0) {
      for (let p of this.participant) {
        if (this.post.spaceTwitterId === p.twitterId) {
          this.host = p
        }else {
          if (p.hostAmount > '0') {
            this.coHosts.push(p)
          }else {
            this.speakers.push(p)
          }
        }
      }
    }
    if (this.showingCommunity && this.showingCommunity.rewardPrice) {
      this.price = this.showingCommunity.rewardPrice
    }else {
      let count = 0
      while(!this.space || count++ < 60) {
        await sleep(0.1)
      }
      const prices = await getPriceFromOracle(EVM_CHAINS_ID[this.space.chainId], [{token: this.space.token, decimals: this.space.decimals}])
      this.price = prices[this.space.token]
    }
  }
}
</script>

<style scoped>

</style>
