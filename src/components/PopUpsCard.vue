<template>
  <div class="pop-up-bg h-min light:border-1 light:border-colorE3 rounded-12px text-left mt-1rem">
    <div class="w-full">
      <div class="title-bg flex-1 px-1.25rem py-8px flex justify-between items-center">
        <div class="text-white c-text-black italic text-orangeColor text-16px
                    flex-1 flex justify-between items-center truncate">
          Pop-Ups
        </div>
        <button v-if="showCreate" class="w-1.2rem" @click.stop="create">
          <img class="w-1.2rem" src="~@/assets/icon-add-yellow.svg" alt="">
        </button>
      </div>
    </div>
    <div class="collapse-box px-1.25rem mt-12px" :class="popUpsCollapse?'show':''">
      <div class="h-30px 2xl:h-1.5rem p-3px flex justify-between items-start mb-8px
                  border-1 border-colorEE rounded-full"
           v-for="popup of showingPopup" :key="popup.tweetId">
        <div class="flex items-center h-full truncate">
          <div v-if="!isEnded(popup)"
               class="text-orangeColor rounded-full h-full bg-colorEE/25 whitespace-nowrap
                      font-bold min-w-4rem flex justify-center items-center relative">
            {{popTime(popup)}}
            <img v-if="isJoin(popup)"
                 class="w-14px h-14px absolute bottom-0 -right-5px"
                 src="~@/assets/icon-checked-green.svg" alt="">
          </div>
          <div v-else
               class="text-white rounded-full h-full bg-colorD8 whitespace-nowrap
                      font-bold min-w-4rem flex justify-center items-center relative">
            {{ $t('popup.ended') }}
            <img v-if="isJoin(popup)"
                 class="w-14px h-14px absolute bottom-0 -right-5px"
                 src="~@/assets/icon-checked-green.svg" alt="">
          </div>
          <div class="flex-1 ml-1rem whitespace-nowrap truncate">
            {{popup.content}}
          </div>
        </div>
        <div class="flex items-center justify-end min-w-1/3">
          <ChainTokenIcon :class="[!isEnded(popup)?'bg-colorEE/25':'', isEnded(popup)?'bg-colorD8':'']"
                          height="20px" width="20px" :chain-name="popup.chainId.toString()" 
                          :token="{address: popup.token, symbol: popup.symbol}">
            <template #amount>
            <span class="px-8px h-17px whitespace-nowrap
                         flex items-center text-12px 2xl:text-0.8rem font-bold"
                  :class="[!isEnded(popup)?'text-colorEE':'', isEnded(popup)?'text-white':'']">
              {{formatAmount(popup.amount / (10 ** popup.decimals))}} {{popup.symbol}}
            </span>
            </template>
          </ChainTokenIcon>
        </div>
      </div>
    </div>
    <button v-show="showingPopup.length > 2" class="w-full h-24px" @click="popUpsCollapse=!popUpsCollapse">
      <img class="mx-auto" :class="popUpsCollapse?'transform rotate-180':''" src="~@/assets/icon-arrow-yellow.svg" alt="">
    </button>
  </div>

</template>

<script>
import ChainTokenIcon from "@/components/ChainTokenIcon";
import { mapGetters } from 'vuex'
import { formatAmount } from "@/utils/helper";

export default {
  name: "PopUpsCard",
  components: {ChainTokenIcon},
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
  computed: {
    ...mapGetters(['getAccountInfo']),
    ...mapGetters('curation', ['detailCuration']),
    showingPopup() {
      if (!this.popups || this.popups.length === 0) return [];
      let ongoing = this.popups.filter(p => p.status === 0);
      let over = this.popups.filter(p => p.status > 0);
      const hostIds = this.space.host_ids ? JSON.parse(this.space.host_ids) : []
      const speakers = this.space.speakder_ids ? JSON.parse(this.space.speakder_ids) : []
      console.log(34, ongoing, over, hostIds, speakers);
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
      if (popup.status > 0) {
        return this.$t('popup.ended')
      }else {
        const now = new Date().getTime()
        const endTime = new Date(popup.endTime).getTime()
        if (now > endTime) {
          return this.$t('popup.ended')
        }else {
          const diff = endTime - now;
          const min = Math.floor(diff / 60000);
          const leave = diff % 60000;
          const sec = Math.floor(leave / 1000);
          return `${this.prefixInteger(min, 2)}:${this.prefixInteger(sec, 2)}`
        }
      }
    }
  },
  data() {
    return {
      popUpsCollapse: false
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
  max-height: 76px;
  min-height: 76px;
  overflow: hidden;
  transition: max-height ease 0.2s;
  &.show {
    max-height: 1500px;
    transition: max-height ease-in-out 0.5s;
  }
}
</style>
