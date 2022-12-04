<template>
  <div class="pop-up-bg h-min light:border-1 light:border-colorE3 rounded-8px text-left mt-1rem overflow-hidden">
    <div class="w-full">
      <div class="title-bg flex-1 px-1.25rem py-8px min-h-38px flex justify-between items-center">
        <div class="text-white c-text-black italic text-orangeColor text-16px
                    flex-1 flex justify-between items-center truncate">
          Pop-Ups
        </div>
        <button v-if="showCreate" class="w-1.2rem" @click.stop="create">
          <img class="w-1.2rem" src="~@/assets/icon-add-yellow.svg" alt="">
        </button>
      </div>
    </div>
    <div class="collapse-box px-1.25rem"
         :class="[popUpsCollapse?'show':'', showingPopup.length>2 && !popUpsCollapse?'hide':'']">
      <div class="h-80px py-3px my-8px border-1 border-colorEE rounded-12px
                  flex flex-col cursor-pointer"
            @click="join(popup)"
           v-for="popup of showingPopup" :key="popup.tweetId">
        <div class="flex flex-1 items-center h-full truncate">
          <div v-if="!isEnded(popup)"
               class="text-orangeColor rounded-full h-full bg-colorEE/25 whitespace-nowrap
                      font-bold min-w-4rem flex justify-center items-center relative">
            {{popup.showingState}}
            <img v-if="isJoin(popup)"
                 class="w-14px h-14px absolute bottom-0 -right-5px"
                 src="~@/assets/icon-checked-green.svg" alt="">
          </div>
          <div class="flex-1 flex items-center justify-end -mr-4px">
            <ChainTokenIcon height="20px" width="20px" :chain-name="popup.chainId.toString()"
                            :token="{address: popup.token, symbol: popup.symbol}">
              <template #amount>
            <span class="px-8px h-17px whitespace-nowrap
                         flex items-center text-12px 2xl:text-0.8rem font-bold"
                  :class="[!isEnded(popup)?'text-colorEE':'', isEnded(popup)?'text-white':'']">
              {{(isEnded(popup) && isJoin(popup)) ? formatAmount(popup.myReward?.toString() / (10 ** popup.decimals)) + '/' + formatAmount(popup.bonus.toString() / (10 ** popup.decimals)) : formatAmount(popup.bonus.toString() / (10 ** popup.decimals))}} {{popup.symbol}}
            </span>
              </template>
            </ChainTokenIcon>
          </div>
        </div>
        <div class="w-full flex-1 flex px-1rem items-center justify-between">
          <div class="flex-1 whitespace-nowrap truncate text-colorFA leading-24px">
            {{popup.content}}
          </div>
          <div v-if="(isEnded(popup) && popup.totalAcount > 0)" class="flex-1 flex justify-end items-center" @click.stop="selectedPopup=popup;modalVisible = true">
            <!-- <div class="-ml-7px" v-for="p of 3" :key="p">
              <img class="w-18px min-w-18px h-18px xl:w-1.2rem xl:min-w-1.2rem xl:h-1.2rem rounded-full
                              border-1 border-color62 light:border-white"
                   src="~@/assets/icon-default-avatar.svg" alt="">

            </div> -->
            <span  class="flex justify-center items-center text-10px">{{popup.totalAcount}} >></span>
          </div>
        </div>
      </div>
    </div>
    <button v-show="showingPopup.length > 2" class="w-full h-24px" @click="popUpsCollapse=!popUpsCollapse">
      <img class="mx-auto" :class="popUpsCollapse?'transform rotate-180':''" src="~@/assets/icon-arrow-yellow.svg" alt="">
    </button>
    <van-popup class="md:w-600px bg-black light:bg-transparent rounded-t-12px"
               v-model:show="modalVisible"
               :position="position">
      <transition name="el-zoom-in-bottom">
        <div v-if="modalVisible"
             class="relative dark:bg-glass light:bg-white rounded-t-12px overflow-hidden min-h-60vh">
          <PopUpsParticipants :pop-up="selectedPopup"  @close="modalVisible=false"></PopUpsParticipants>
        </div>
      </transition>
    </van-popup>
  </div>

</template>

<script>
import ChainTokenIcon from "@/components/ChainTokenIcon";
import { mapGetters } from 'vuex'
import { formatAmount } from "@/utils/helper";
import PopUpsParticipants from "@/components/PopUpsParticipants";

export default {
  name: "PopUpsCard",
  components: {ChainTokenIcon, PopUpsParticipants},
  props: {
    space: {
      type: Object,
      default: {}
    },
    popups: {
      type: Array,
      default: []
    },
    showCreate: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      selectedPopup: {}
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo']),
    ...mapGetters('curation', ['detailCuration']),
    showingPopup() {
      console.log(this.popups)
      if (!this.popups || this.popups.length === 0) return [];
      this.popups.forEach(p => ({
        ...p,
        showingState: this.popTime(p)
      }))
      let ongoing = this.popups.filter(p => p.status === 0);
      let over = this.popups.filter(p => p.status > 0);
      const hostIds = this.space.host_ids ? JSON.parse(this.space.host_ids) : []
      const speakers = this.space.speakder_ids ? JSON.parse(this.space.speakder_ids) : []
      const h = ongoing.filter(o => hostIds.find(h => h === o.twitterId))
      const s = ongoing.filter(o => speakers.find(s => s === o.twitterId))
      const o = ongoing.filter(o => !hostIds.find(h => h === o.twitterId) && !speakers.find(s => s === o.twitterId))
      return h.concat(s).concat(o).concat(over)
    }
  },
  methods: {
    formatAmount,
    create() {
      if (!this.getAccountInfo || !this.getAccountInfo.twitterId) {
          this.$store.commit('saveShowLogin', true);
          return;
      }
      this.$emit('createPopUpVisible')
    },
    prefixInteger(num, length) {
      var i = (num + "").length;
      while(i++ < length) num = "0" + num;
      return num;
    },
    isEnded(popup) {
      return popup.status > 0
    },
    isJoin(popup) {
      return !!popup.retweetId
    },
    popTime(popup) {
      const now = new Date().getTime()
      const endTime = new Date(popup.endTime).getTime()
      if(endTime < now) popup.status=1
      return endTime - now
    },
    join(popup) {
      if (this.isEnded(popup) || this.isJoin(popup) || !popup.tweetId) {

      }else {
        window.open(`https://twitter.com/intent/tweet?in_reply_to=${popup.tweetId}&text=%0a%23iweb3%20%23popup`)
      }
    },
    isNumeric (val) {
      return val !== null && val !== '' && !isNaN(val)
    }
  },
  data() {
    return {
      position: document.body.clientWidth < 768?'bottom':'center',
      popUpsCollapse: false,
      timeUpdateInterval: null,
      modalVisible: false
    }
  }
}
</script>

<style scoped lang="scss">
.pop-up-bg {
  background-image: linear-gradient(93.53deg, rgba(255, 168, 0, 0.22) 2.33%, rgba(255, 227, 182, 0) 91.45%);
  background-size: 70% 100%;
  background-repeat: no-repeat;
}
.title-bg {
  background: linear-gradient(93.53deg, rgba(255, 168, 0, 0.22) 2.33%, rgba(255, 227, 182, 0) 91.45%);
}
.collapse-box {
  overflow: hidden;
  transition: max-height ease 0.2s;
  &.show {
    max-height: 1500px;
    transition: max-height ease-in-out 0.5s;
  }
  &.hide {
    max-height: 160px;
    min-height: 160px;
  }
}
</style>
