<template>
  <div class="container mx-auto max-w-50rem md:px-1rem relative h-full overflow-auto flex flex-col">
    <div class="pt-22px">
      <div class="flex items-center justify-center gap-30px h-48px text-18px font-bold
                border-b-1 border-color8B/30 light:border-color7F
                bg-primaryBg light:bg-white z-9">
        <button @click="$router.go(-1)" class="absolute left-15px">
          <i class="icon-back w-20px h-20px"></i>
        </button>
        <button class="absolute right-15px filter light:brightness-50" @click="readAll">
          <img class="w-22px" src="~@/assets/icon-msg-read-white.svg" alt="">
        </button>
        <button class="h-full px-10px"
                :class="tabIndex===0?'active-tab text-color62':'text-color7D'"
                @click="tabIndex=0">
          {{$t('info.interactive')}}
        </button>
        <button class="h-full px-10px"
                :class="tabIndex===1?'active-tab text-color62':'text-color7D'"
                @click="tabIndex=1">
          {{$t('info.reward')}}
        </button>
        <button class="h-full px-10px"
                :class="tabIndex===2?'active-tab text-color62':'text-color7D'"
                @click="tabIndex=2">
          {{$t('info.system')}}
        </button>
      </div>
    </div>
    <div class="flex-1 overflow-hidden">
      <InteractiveList v-if="tabIndex===0"></InteractiveList>
    </div>
  </div>
</template>

<script>
import InteractiveList from "@/views/info/InteractiveList";
import { readAll, hasNewNoti } from "@/api/api";
import { mapGetters, mapState } from "vuex";

export default {
  name: "InfoIndex",
  components: {InteractiveList},
  computed: {
    ...mapGetters(['getAccountInfo']),
    ...mapState('noti', ['newNotis', 'postNotis', 'tipNotis', 'sysNotis'])
  },
  data() {
    return {
      tabIndex: 0
    }
  },
  methods: {
    async readAll() {
      try{
        await readAll(this.getAccountInfo.twitterId);
        this.$store.commit('noti/readAll')
      } catch (e) {
        
      } finally {
        
      }
    }
  },
  mounted () {
    hasNewNoti(this.getAccountInfo.twitterId).then(res => {

    })
  },
}
</script>

<style scoped lang="scss">
.active-tab {
  position: relative;
  z-index: 1;
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    height: 3px;
    width: 22px;
    background: #7851FF;
    border-radius: 3px;
    z-index: -1;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
