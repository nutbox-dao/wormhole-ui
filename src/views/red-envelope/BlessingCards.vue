<template>
  <div class="pb-2rem relative px-15px ">
    <div class="grid grid-cols-2 xs:grid-cols-4 gap-1rem py-1rem">
      <div class="col-span-1" v-for="(item, index) of cards" :key="index">
        <div class="relative text-white">
          <img class="w-full" src="~@/assets/red-envelope/card-default.png" alt="">
          <div class="absolute top-5px left-10px font-bold text-shadow-lg opacity-70">{{item.label}}</div>
          <div class="absolute text-60px top-1/2 left-1/2 opacity-70
                      transform -translate-x-1/2 -translate-y-1/2 text-shadow-lg">?</div>
          <div class="absolute bottom-10px right-15px text-shadow-lg font-bold opacity-70">
            {{$t('common.balance')}}: {{ blessCardBalance[index+1] }}
          </div>
        </div>
        <div class="flex gap-5px mx-10px mt-10px text-14px xl:text-0.8rem">
          <button class="flex-1 py-6px border-1 border-color8B/30 rounded-4px"
                  @click="onGive(index+1)">{{$t('ny.give')}}</button>
          <button class="flex-1 py-6px border-1 border-color8B/30 rounded-4px">{{$t('ny.ask')}}</button>
        </div>
      </div>
    </div>
    <div class="flex justify-center">
      <div class="w-1/2 xs:w-1/4 px-0.5rem">
        <div class="relative text-white">
          <img class="w-full" src="~@/assets/red-envelope/card0.png" alt="">
          <div class="absolute top-1/18 left-1/10 font-bold text-shadow-lg opacity-70">Leek Rabbit</div>
          <div class="absolute bottom-1/14 right-1/10 text-shadow-lg font-bold opacity-70">
            {{$t('common.balance')}}: {{ blessCardBalance[5] }}
          </div>
        </div>
        <div class="flex gap-5px mx-10px mt-10px text-14px xl:text-0.8rem">
          <button class="flex-1 py-6px border-1 border-color8B/30 rounded-4px"
                  @click="onGive(0)">{{$t('ny.give')}}</button>
          <button class="flex-1 py-6px border-1 border-color8B/30 rounded-4px"
                  @click="buyCardVisible=true">{{$t('ny.buy')}}</button>
        </div>
      </div>
    </div>
    <button class="absolute right-20px bottom-2rem" @click="openBoxVisible=true">
      <img class="w-40px " src="~@/assets/red-envelope/icon-box.png" alt="">
    </button>
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
               class="c-dialog c-dialog-center max-w-500px bg-glass border-1 border-color84/30 rounded-1.6rem">
      <GiveCardModal :select-index="giveCardIndex"
                     @close="giveCardVisible=false"/>
    </el-dialog>
    <el-dialog v-model="openBoxVisible"
               destroy-on-close
               :show-close="false"
               :close-on-click-modal="true"
               class="c-dialog c-dialog-center max-w-500px bg-glass border-1 border-color84/30 rounded-1.6rem">
      <OpenBlindBoxModal @close="openBoxVisible=false"/>
    </el-dialog>
  </div>
</template>

<script>
import BuyCardModal from "@/views/red-envelope/BuyCardModal";
import GiveCardModal from "@/views/red-envelope/GiveCardModal";
import OpenBlindBoxModal from "@/views/red-envelope/OpenBlindBoxModal";
import { getUserNYCards } from '@/utils/new-year'
import { mapGetters, mapState } from "vuex";

export default {
  name: "BlessingCards",
  components: {BuyCardModal, GiveCardModal, OpenBlindBoxModal},
  data() {
    return {
      cards: [
        {label: 'SBF Rabbit', balance: 0},
        {label: 'MashiMaro', balance: 0},
        {label: 'BTC Rabbit', balance: 0},
        {label: 'Rabbit Trader', balance: 0},
      ],
      buyCardVisible: false,
      giveCardVisible: false,
      giveCardIndex: 0,
      openBoxVisible: false
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
    }
  },
  mounted () {
    if (!this.getAccountInfo) return;
    const { twitterId, ethAddress } = this.getAccountInfo;
    if (ethAddress) {
      getUserNYCards(ethAddress).catch(e => {
        console.log('get bless card balance fail:', e);
      })
    }
  },
}
</script>

<style scoped>

</style>
