<template>
  <div class="text-14px">
    <div v-if="loading"
         class="c-text-black py-2rem min-h-1rem">
      <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
    </div>
    <div class="px-15px">
      <div class="flex justify-between items-center pt-10px">
        <div class="c-text-black text-16px">
          {{$t('curation.speaker')}}
        </div>
        <div class="text-12px">
          {{speakers.length}} {{$t('common.people')}}
        </div>
      </div>
      <div class="flex items-center justify-between py-10px">
        <div class="flex items-center w-1/2 truncate pl-8px pt-10px">
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
          <span class="text-center truncate">{{host.name}}</span>
        </div>
        <div class="pl-10px pt-10px flex items-center flex-1 justify-between">
          <div>60 min</div>
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
          <span class="text-center truncate">{{u.name}}</span>
        </div>
        <div class="pl-10px pt-10px flex items-center flex-1 justify-between">
          <div>60 min</div>
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
          <span class="text-center truncate">{{u.name}}</span>
        </div>
        <div class="pl-10px pt-10px flex items-center flex-1 justify-between">
          <div>60 min</div>
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
import {getSpaceInfoById} from "@/api/api";
import TipModal from "@/components/TipModal.vue";

export default {
  name: "SpaceSpeaker",
  components: {TipModal},
  props: {
    space: {
      type: Object,
      default: () => {}
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

    }
  },
  methods: {
    avatar(url) {
      return url.replace('normal', '200x200')
    },
    gotoUserTwitter(user) {
      window.open(`https://twitter.com/` + user.username)
    }
  },
  mounted() {
    if(this.space.spaceId) {
      getSpaceInfoById(this.space.spaceId).then(res => {
        if (res && res.spaceId) {
          this.host = res.hosts.find(h => h.twitterId === res.creatorId)
          this.coHosts = res.hosts.filter(h => h.twitterId !== res.creatorId);
          this.speakers = res.speakers ?? [];        }
      }).finally(() => {
        this.loading = false;
      })
    }
  }
}
</script>

<style scoped>

</style>
