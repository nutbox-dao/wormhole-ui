<template>
  <div class="relative h-full overflow-auto flex flex-col light:bg-white light:2md:bg-transparent">
    <div class="border-b-0.5px border-color8B/30 light:border-colorD6
                bg-primaryBg light:bg-white light:2md:bg-transparent z-9">
      <div class="container mx-auto max-w-600px xl:max-w-30rem px-15px relative
                  flex items-center justify-center gap-30px h-70px pt-23px 2md:h-48px 2md:pt-0 text-14px font-bold">
        <button @click="$router.go(-1)"
                class="absolute left-15px 2md:hidden">
          <i class="icon-back w-20px h-20px"></i>
        </button>
        <button class="absolute right-15px filter light:brightness-50" @click="readAll">
          <img class="w-22px" src="~@/assets/icon-msg-read-white.svg" alt="">
        </button>
        <button class="h-full px-10px"
                :class="tabIndex===0?'c-active-tab text-color62':'text-color7D'"
                @click="tabIndex=0">
          {{$t('info.interactive')}}
        </button>
        <button class="h-full px-10px"
                :class="tabIndex===1?'c-active-tab text-color62':'text-color7D'"
                @click="tabIndex=1">
          {{$t('info.reward')}}
        </button>
        <button class="h-full px-10px"
                :class="tabIndex===2?'c-active-tab text-color62':'text-color7D'"
                @click="tabIndex=2">
          {{$t('info.system')}}
        </button>
      </div>
    </div>
    <div class="flex-1 overflow-hidden container mx-auto max-w-600px xl:max-w-30rem px-15px sm:py-20px">
      <div class="sm:bg-blockBg light:sm:bg-white light:sm:shadow-color1A rounded-16px
                  max-h-full overflow-auto no-scroll-bar sm:px-15px pb-15px">
        <InteractiveList v-if="tabIndex===0"></InteractiveList>
        <Transaction v-if="tabIndex===1"></Transaction>
      </div>
    </div>
  </div>
</template>

<script>
import InteractiveList from "@/views/info/InteractiveList";
import Transaction from "@/views/info/Transaction.vue";
import { readAll, hasNewNoti } from "@/api/api";
import { mapGetters, mapState } from "vuex";

export default {
  name: "InfoIndex",
  components: {InteractiveList, Transaction},
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
</style>
