<template>
  <el-collapse class="border-0 no-border-collapse pb-0 speaker-collapse">
    <el-collapse-item name="" :class="allUsers.length<5?'collapse-no-arrow':''" :disabled="allUsers.length<5">
      <template #title>
        <div class="flex-1">
          <div class="text-white light:text-blueDark px-1.25rem font-bold
                              flex-1 flex justify-between items-center truncate">
            👧🏻 Speakers
          </div>
          <div class="flex flex-wrap px-1.25rem pb-1rem gap-1rem overflow-hidden header-avatar">
            <div v-for="u of allUsers" :key="'host' + u.twitterId" class="w-4rem" @click.stop="$emit('showTip')">
              <img v-if="u.profileImg" class="w-3rem h-3rem mr-10px rounded-1.5rem" :src="avatar(u.profileImg)" alt="">
              <img v-else class="w-3rem h-3rem mr-10px" src="~@/assets/icon-default-avatar.svg" alt="">
              <div class="w-4rem text-color8B mt-0.5rem leading-1rem truncate">{{u.name}}</div>
            </div>
          </div>
        </div>
      </template>
      <div class="text-white light:text-blueDark px-1.25rem py-0.5rem border-t-1 border-color8B/30">
        <div class="text-1.2rem c-text-black my-6px">Host</div>
        <div class="flex justify-between items-center">
          <div class="flex items-center py-5px">
            <img v-if="host.profileImg" class="w-3rem h-3rem mr-10px rounded-1.5rem" :src="avatar(host.profileImg)" alt="">
            <img v-else class="w-3rem h-3rem mr-10px" src="~@/assets/icon-default-avatar.svg" alt="">
            <span>{{host.name}}</span>
          </div>
          <div class="flex items-center py-5px" v-for="u of coHosts" :key="'co' + u.twitterId">
            <img v-if="u.profileImg" class="w-3rem h-3rem mr-10px rounded-1.5rem" :src="avatar(u.profileImg)" alt="">
            <img v-else class="w-3rem h-3rem mr-10px" src="~@/assets/icon-default-avatar.svg" alt="">
            <span>{{u.name}}</span>
          </div>
          <button class="border-1 border-color62 px-1rem rounded-full text-color62"
                  @click="$emit('showTip')">Tip</button>
        </div>
        <div class="text-1.2rem c-text-black my-6px">Speaker</div>
        <div class="flex justify-between items-center" v-for="u of speakers" :key="'speaker' + u.twitterId">
          <div class="flex items-center py-5px">
            <img v-if="u.profileImg" class="w-3rem h-3rem mr-10px rounded-1.5rem" :src="avatar(u.profileImg)" alt="">
            <img v-else class="w-3rem h-3rem mr-10px" src="~@/assets/icon-default-avatar.svg" alt="">
            <span>{{u.name}}</span>
          </div>
          <button class="border-1 border-color62 px-1rem rounded-full text-color62"
                  @click="$emit('showTip')">Tip</button>
        </div>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
export default {
  name: "SpeakerCollapse",
  props: {
    space: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      allUsers: [],
      host: {},
      coHosts: [],
      speakers: []
    }
  },
  methods: {
    avatar(url) {
      return url.replace('normal', '200x200')
    }
  },
  mounted () {
    if (this.space.hosts && this.space.hosts.length > 0) {
      this.host = this.space.hosts.find(h => h.twitterId === this.space.creatorId)
      this.coHosts = this.space.hosts.filter(h => h.twitterId !== this.space.creatorId);
      this.speakers = this.space.speakers ?? [];
      this.allUsers = [this.host].concat(this.coHosts).concat(this.speakers)
    };
  },
}
</script>

<style scoped>

</style>
