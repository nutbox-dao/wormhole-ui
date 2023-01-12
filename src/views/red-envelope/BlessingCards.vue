<template>
  <van-pull-refresh class="min-h-full"
                    v-model="refreshing"
                    @refresh="onRefresh"
                    :loading-text="$t('common.loading')"
                    :pulling-text="$t('common.pullRefresh')"
                    :loosing-text="$t('common.loosingRefresh')">
    <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
         v-if="loading">
      <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
    </div>
    <div v-else class="pb-2rem relative px-15px ">
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1rem py-1rem">
        <div class="col-span-1 " v-for="(item, index) of cards" :key="index">
          <div class="relative text-white">
            <img src="~@/assets/red-envelope/lucky-card.png" alt="">
            <div class="w-full h-full px-18px absolute top-0 pt-1/6 pb-1/9
                        flex flex-col justify-between items-center">
              <img v-if="blessCardBalance[index+1] > 0"
                   :src="require(`@/assets/red-envelope/card${index}.png`)" alt="">
              <img v-else class="w-full" src="~@/assets/red-envelope/card-default.png" alt="">
              <div class="flex flex-col items-center">
                <div class="flex items-center justify-between sm:px-10px mt-10px w-full">
                  <img src="~@/assets/red-envelope/icon-title-tag.svg" alt="">
                  <span class="text-12px xs:text-18px xs:whitespace-nowrap px-2px">
                  {{ BLESS_CARD_NAME[index] }}
                </span>
                  <img class="transform rotate-180" src="~@/assets/red-envelope/icon-title-tag.svg" alt="">
                </div>
                <div class="bg-white/10 w-max px-12px py-2px text-14px leading-18px rounded-full mt-6px xs:mt-10px">
                  {{$t('common.balance')}}: {{ blessCardBalance[index+1] }}
                </div>
              </div>
            </div>
          </div>
          <div class="flex gap-5px mx-10px mt-10px text-14px xl:text-0.8rem">
            <button class="flex-1 py-6px bg-color62 text-white rounded-full card-btn"
                    :disabled="blessCardBalance[index+1]===0"
                    @click="onGive(index)">{{$t('ny.give')}}</button>
            <button class="flex-1 py-6px bg-color62 text-white rounded-full card-btn">{{$t('ny.ask')}}</button>
          </div>
        </div>
        <div class="col-span-1 ">
          <div class="relative text-white">
            <img src="~@/assets/red-envelope/lucky-card.png" alt="">
            <div class="w-full px-18px absolute top-36px flex flex-col items-center">
              <img v-if="blessCardBalance[5] > 0"
                   :src="require(`@/assets/red-envelope/card4.png`)" alt="">
              <img v-else class="w-full" src="~@/assets/red-envelope/card-default.png" alt="">
              <div class="flex items-center justify-between sm:px-10px mt-10px w-full">
                <img src="~@/assets/red-envelope/icon-title-tag.svg" alt="">
                <span class="text-12px xs:text-18px xs:whitespace-nowrap px-2px">
                  {{ BLESS_CARD_NAME[4] }}
                </span>
                <img class="transform rotate-180" src="~@/assets/red-envelope/icon-title-tag.svg" alt="">
              </div>
              <div class="bg-white/10 w-max px-12px py-2px text-14px leading-18px rounded-full mt-6px xs:mt-10px">
                {{$t('common.balance')}}: {{ blessCardBalance[5] }}
              </div>
            </div>
          </div>
          <div class="flex gap-5px mx-10px mt-10px text-14px xl:text-0.8rem">
            <button class="flex-1 py-6px bg-color62 text-white rounded-full card-btn"
                    :disabled="blessCardBalance[5]===0"
                    @click="onGive(4)">{{$t('ny.give')}}</button>
            <button class="flex-1 py-6px bg-color62 text-white rounded-full buy-btn"
                    @click="buyCardVisible=true">{{$t('ny.buy')}}</button>
          </div>
        </div>
      </div>
      <div class="absolute right-20px bottom-3rem flex flex-col items-center">
        <img class="w-8rem max-w-120px" src="~@/assets/red-envelope/icon-box.png" alt="">
        <button class="buy-btn rounded-full font-bold px-12px h-34px text-12px"
                @click="openBoxVisible=true">
          {{$t('ny.compoundBox')}}
        </button>
      </div>
      <el-dialog v-model="buyCardVisible"
                 destroy-on-close
                 :show-close="false"
                 :close-on-click-modal="true"
                 class="c-dialog c-dialog-center max-w-500px bg-glass border-1 border-color84/30 rounded-1.6rem">
        <BuyCardModal @close="buyCardVisible=false"/>
      </el-dialog>
      <el-dialog v-model="giveCardVisible"
                 destroy-on-close
                 :show-close="false"
                 :close-on-click-modal="true"
                 class="c-dialog c-dialog-center max-w-500px bg-white">
        <GiveCardModal :select-index="giveCardIndex"
                       @close="giveCardVisible=false"/>
      </el-dialog>
      <el-dialog v-model="openBoxVisible"
                 destroy-on-close
                 :show-close="false"
                 :close-on-click-modal="true"
                 class="c-dialog c-dialog-center max-w-500px bg-glass border-1 border-color84/30 rounded-1.6rem">
        <OpenBlindBoxModal @close="openBoxVisible=false" @gotoBlind="$emit('gotoBlind')"/>
      </el-dialog>
    </div>
  </van-pull-refresh>
</template>

<script>
import BuyCardModal from "@/views/red-envelope/BuyCardModal";
import GiveCardModal from "@/views/red-envelope/GiveCardModal";
import OpenBlindBoxModal from "@/views/red-envelope/OpenBlindBoxModal";
import { getUserNYCards } from '@/utils/new-year'
import { mapGetters, mapState } from "vuex";
import { BLESS_CARD_NAME } from '@/ny-config'

export default {
  name: "BlessingCards",
  components: {BuyCardModal, GiveCardModal, OpenBlindBoxModal},
  data() {
    return {
      loading: false,
      cards: [
        {label: 'SBF Rabbit', balance: 0},
        {label: 'MashiMaro', balance: 0},
        {label: 'BTC Rabbit', balance: 0},
        {label: 'Rabbit Trader', balance: 0},
      ],
      BLESS_CARD_NAME,
      buyCardVisible: false,
      giveCardVisible: false,
      giveCardIndex: 0,
      openBoxVisible: false,
      refreshing: false
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo']),
    ...mapState('newYear', ['blessCardBalance'])
  },
  methods: {
    onGive(index) {
      this.giveCardIndex = index
      this.giveCardVisible = true
    },
    onRefresh() {
    }
  },
  mounted () {
    if (!this.getAccountInfo) return;
    const { twitterId, ethAddress } = this.getAccountInfo;
    if (ethAddress) {
      getUserNYCards(ethAddress).catch(e => {
        console.log('get lucky card balance fail:', e);
      })
    }
  },
}
</script>

<style scoped>
.card-btn:disabled{
  border: 1px solid #8B949E;
  background: transparent;
  color: #8B949E;
}
.buy-btn {
  background-image: linear-gradient(180deg, #F5319D 0%, #FC6767 100%);
  border: 1px solid #FFF7E8;
}
</style>
