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
        <button class="absolute right-15px" @click="readAll">
          <img class="w-22px" src="~@/assets/icon-msg-read-white.svg" alt="">
        </button>
        <button class="h-full px-10px"
                :class="tabIndex===0?'c-active-tab text-color62':'text-color7D'"
                @click="tabIndex=0">
          <span class="relative" :class="hasActivityNoti?'c-badge':''">
            {{$t('info.interactive')}}
          </span>
        </button>
        <button class="h-full px-10px"
                :class="tabIndex===1?'c-active-tab text-color62':'text-color7D'"
                @click="tabIndex=1">
          <span class="relative">
            {{$t('info.reward')}}
          </span>
        </button>
        <!-- <button class="h-full px-10px"
                :class="tabIndex===2?'c-active-tab text-color62':'text-color7D'"
                @click="tabIndex=2">
          <span class="relative" :class="hasSysNoti?'c-badge':''">
            {{$t('info.system')}}
          </span>
        </button> -->
      </div>
    </div>
    <div class="flex-1 overflow-hidden container mx-auto max-w-600px xl:max-w-30rem  sm:py-20px">
      <div class="sm:bg-blockBg light:sm:bg-white light:sm:shadow-color1A sm:rounded-16px
                  max-h-full overflow-auto no-scroll-bar">
        <InteractiveList v-if="tabIndex===0"></InteractiveList>
        <Transaction v-if="tabIndex===1"></Transaction>
      </div>
    </div>
  </div>
</template>

<script>
import InteractiveList from "@/views/info/InteractiveList";
import Transaction from "@/views/info/Transaction.vue";
import { readAll, hasNewNoti, getPostNotiByUserId } from "@/api/api";
import { mapGetters, mapState } from "vuex";

export default {
  name: "InfoIndex",
  components: {InteractiveList, Transaction},
  data() {
    return {
      tabIndex: 0,
      isNew: true
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo']),
    ...mapState('noti', ['newNotis', 'postNotis', 'tipNotis', 'sysNotis']),
    hasActivityNoti() {
      return this.newNotis && !!this.newNotis.find(n => {
        return n.type === 1 || n.type === 2 || n.type === 3 || n.type === 4 || n.type === 5
      })
    },
    hasTipsNoti() {
      return this.newNotis && !!this.newNotis.find(n => {
        return n.type === 10
      })
    },
    hasSysNoti() {
      return this.newNotis && !!this.newNotis.find(n => {
        return n.type === 20
      })
    }
  },
  methods: {
    async readAll() {
      try{
        await readAll(this.getAccountInfo?.twitterId);
        this.$store.commit('noti/readAll')
        this.$bus.emit('readAll')
      } catch (e) {

      } finally {

      }
    }
  },
  mounted () {
    hasNewNoti(this.getAccountInfo?.twitterId).then(res => {
      this.$store.commit('noti/saveNewNotis', res)
    }).catch(e => {

    })
  },
}
</script>

<style scoped lang="scss">
</style>
