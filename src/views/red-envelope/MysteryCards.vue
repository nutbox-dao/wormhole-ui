<template>
  <div class="pb-2rem relative px-15px text-14px leading-18px 2xl:text-1rem 2xl:leading-1.2rem">
    <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
         v-if="listLoading && showingBox.length===0">
      <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
    </div>
    <template v-else>
      <div class="data-box px-20px py-12px flex flex-col xs:flex-row justify-between mt-1rem">
        <div class="flex items-center">
          <div v-if="!isOver" class="flex items-center">
            <img class="w-45px mr-10px hidden sm:block"
                 src="~@/assets/red-envelope/icon-amount.svg" alt="">
            <div class="h-45px flex flex-col items-start justify-between">
              <div class="text-colorDF light:text-blueDark font-bold">
                {{$t('ny.expectedGet')}}
              </div>
              <div class="c-text-black text-18px sm:text-1.2rem">${{ rewards }}</div>
            </div>
          </div>
          <div v-else class="ny-box-shadow bg-color36 rounded-6px flex items-center">
            <button class="font-bold ny-red-gradient text-white h-45px 2xl:h-1.7rem px-20px rounded-6px">
              {{$t('ny.claimReward')}}
            </button>
            <span class="px-16px c-text-black text-18px sm:text-1.2rem flex items-center text-white">
              ${{ rewards }}
            </span>
          </div>
          <div class="h-45px w-1px bg-color62 mx-20px"></div>
          <div class="h-45px flex flex-col items-start justify-between">
            <div class="text-colorDF light:text-blueDark font-bold">
              {{$t('ny.totalPower')}}: {{ userActivityInfo.totalWeights }}
            </div>
            <div class="c-text-black text-18px sm:text-1.2rem">
              {{$t('ny.yourPower')}}: {{ userActivityInfo.userWeights }}
            </div>
          </div>
        </div>
        <div class="flex justify-start">
          <div v-if="!isOver" class="flex flex-col justify-between items-center mt-20px xs:mt-0"
               @click="makeCardVisible=true">
            <button class="font-bold ny-red-gradient text-white h-34px 2xl:h-1.7rem px-20px max-w-12rem
                           border-2 border-white rounded-full whitespace-nowrap">
              {{$t('ny.makeCard')}}
            </button>
            <div class="text-12px leading-14px mt-3px">
              {{ userActivityInfo.openBoxCounts }} / {{ userActivityInfo.mintBoxCounts }} {{$t('ny.opened')}}
            </div>
          </div>
          <div v-else
               class="flex flex-col justify-between items-center mt-20px xs:mt-0"
               @click="redeemCardVisible=true">
            <button class="font-bold bg-color62 text-white h-34px 2xl:h-1.7rem px-20px max-w-12rem
                           rounded-full whitespace-nowrap"
                    @click="redeemCardVisible=true">
              {{$t('ny.redeemCards')}}
            </button>
            <div class="text-12px leading-14px mt-3px">
              {{ userActivityInfo.openBoxCounts }} / {{ userActivityInfo.mintBoxCounts }} {{$t('ny.opened')}}
            </div>
          </div>
        </div>
      </div>
      <van-pull-refresh class="min-h-full"
                        v-model="refreshing"
                        @refresh="onRefresh"
                        :loading-text="$t('common.loading')"
                        :pulling-text="$t('common.pullRefresh')"
                        :loosing-text="$t('common.loosingRefresh')">
        <van-list :loading="listLoading"
                  :finished="listFinished"
                  :immediate-check="false"
                  :loading-text="$t('common.loading')"
                  :finished-text="''"
                  @load="onLoad">
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1rem py-1rem">
            <div v-if="showingBox.length===0 && !refreshing && !loading"
                 class="py-2rem bg-blockBg light:bg-white rounded-12px col-span-2 xs:col-span-4">
              <div class="flex flex-col items-center max-w-600px mx-auto">
                <img class="max-w-200px w-10rem" src="~@/assets/red-envelope/no-card.png" alt="">
                <div class="c-text-black text-colorC9 text-20px my-10px">{{$t('ny.noMysteryCard')}}</div>
                <div class="text-colorC9">{{$t('ny.noCardDesc')}}</div>
              </div>
            </div>
            <div class="relative text-14px leading-18px 2xl:text-1rem 2xl:leading-1.2rem text-white cursor-pointer"
                 :class="`ny-power-${card.weights}`"
                 v-for="(card, index) of showingBox" :key="index"
                 @click="selectedCard=card, cardDetailVisible=true">
              <img class="w-full cursor-pointer"
                   :src="require(`@/assets/red-envelope/mystery-power-${card.weights || 10}.png`)"
                   alt="">
              <img v-if="card?.logo"
                   class="w-3/10 max-w-3/10 absolute top-16/100 left-1/2 transform -translate-x-1/2 rounded-12px"
                   :src="card.logo" alt="">
              <img v-else
                   class="w-3/10 max-w-3/10 absolute top-16/100 left-1/2 transform -translate-x-1/2 rounded-12px"
                   src="~@/assets/red-envelope/mystery-logo.png" alt="">
              <div class="absolute top-40/100 left-1/2 transform -translate-x-1/2 brand-name
                          text-14px lg:text-16px font-bold">
                {{card.brandName || 'Wormhole3'}}
              </div>
              <!-- <div class="absolute top-55/100 sm:top-54/100 left-1/2 transform -translate-x-1/2 amount
                          font-bold text-12px lg:text-18px">
                + {{card.amount}} {{card.tokenName}}
              </div> -->
              <div v-if="!card.brandName || (!card.tokenSymbol && card.nftId === 0)"
                    class="absolute top-59/100 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                    font-bold text-12px xl:text-14px">
                Congrats!<br>
                Power Up!
              </div>
              <div v-else-if="card.prizeType === 1"
                    class="absolute top-55/100 left-1/2 transform -translate-x-1/2
                    font-bold text-12px xl:text-14px">
              + {{ card.amount }} {{ card.tokenSymbol }}
              </div>
              <div v-else-if="card.prizeType === 2"
                    class="absolute top-55/100 left-1/2 transform -translate-x-1/2 amount
                    font-bold text-12px xl:text-14px">
                + 1 NFT
              </div>
              <div v-else-if="card.prizeType === 3"
                    class="absolute top-55/100 left-1/2 transform -translate-x-1/2 amount
                    font-bold text-12px xl:text-14px">
                + {{ card.amount  }} NFT
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </template>
    <el-dialog v-model="cardDetailVisible"
               destroy-on-close
               :show-close="false"
               :close-on-click-modal="true"
               class="c-dialog c-dialog-center max-w-500px bg-glass border-1 border-color84/30 rounded-1.6rem">
      <MysteryCardDetailModal :card-detail="selectedCard"
                              @close="cardDetailVisible=false"/>
    </el-dialog>
    <el-dialog v-model="makeCardVisible"
               destroy-on-close
               :show-close="false"
               :close-on-click-modal="true"
               class="c-dialog c-dialog-center max-w-800px bg-glass border-1 border-color84/30 rounded-1.6rem">
      <MakeMysteryCard @close="makeCardVisible=false"/>
    </el-dialog>
    <el-dialog v-model="redeemCardVisible"
               destroy-on-close
               :show-close="false"
               :close-on-click-modal="true"
               class="c-dialog c-dialog-center max-w-500px bg-glass border-1 border-color84/30 rounded-1.6rem">
      <RedeemCardModal @close="redeemCardVisible=false"/>
    </el-dialog>
  </div>
</template>

<script>
import MysteryCardDetailModal from "@/views/red-envelope/MysteryCardDetailModal";
import MakeMysteryCard from "@/views/red-envelope/MakeMysteryCard";
import RedeemCardModal from "@/views/red-envelope/RedeemCardModal";
import CardLogo from '@/assets/red-envelope/mystery-logo.png'
import { getUserActivityInfo, getUserBlindBox } from '@/utils/new-year'
import { mapGetters, mapState } from "vuex";
import { formatAmount } from "@/utils/helper";


export default {
  name: "MysteryCards",
  components: {MysteryCardDetailModal, MakeMysteryCard, RedeemCardModal},
  computed: {
    ...mapState('newYear', ['blessCardBalance', 'getUSDTBalance', 'approvedUSDT', 'usdtBalance', 'userActivityInfo', 'blindBoxBalance']),
    ...mapState('web3', ['chainId', 'account']),
    ...mapGetters(['getAccountInfo']),
    isOver() {
      return (new Date().getTime() / 1000) > this.userActivityInfo.eventEndTime
    },
    showingBox() {
      if (this.blindBoxBalance && this.blindBoxBalance.length > 0) {
        return this.blindBoxBalance.sort((b,a) => a.weights - b.weights)
      }
      return [];
    },
    rewards() {
      if (this.userActivityInfo) {
        return formatAmount(this.userActivityInfo.userWeights / (this.userActivityInfo.totalWeights ?? 1) * this.userActivityInfo.prizeTotalAmount)
      }
      return 0
    }
  },
  data() {
    return {
      loading: false,
      cardDetailVisible: false,
      selectedCard: {},
      makeCardVisible: false,
      redeemCardVisible: false,
      refreshing: false,
      listLoading: false,
      listFinished: false,
      list: [],
    }
  },
  mounted() {
    const account = this.getAccountInfo?.ethAddress;
    if (!account) return;
    if (this.blindBoxBalance.length > 0) {
      this.loading = false
    }
    getUserActivityInfo(account).catch();
    getUserBlindBox(account, 0, 48).then(res => {
      if (res && res.length > 0) {
        this.$store.commit('newYear/saveBlindBoxBalance', res)
      }
      this.loading = false;
    }).catch()
    this.onLoad()
  },
  methods: {
    onRefresh() {
      getUserBlindBox(this.getAccountInfo.ethAddress, 0, 48).then(res => {
        if (res && res.length > 0) {
          this.$store.commit('newYear/saveBlindBoxBalance', res)
          if (res.length < 48) {
            this.listFinished = true;
          }
        }
        this.loading = false;
        this.refreshing = false;
      }).catch().finally(() => {
        this.loading = false;
        this.refreshing = false;
      })
    },
    async onLoad() {
      if(this.listLoading) return
      try{
        this.listLoading = true;
        const count = this.blindBoxBalance?.length ?? 0;
        const res = await getUserBlindBox(this.getAccountInfo?.ethAddress, count, count + 48);
        if (res && res.length > 0) {
          this.$store.commit('newYear/saveBlindBoxBalance', res)
          if (res.length < 48) {
            this.listFinished = true;
          }
        }else{
          this.listFinished = true;
        }
      } catch (e) {

      } finally {
        this.listLoading = false;
      }
    }
  }
}
</script>

<style scoped lang="scss">
.data-box {
  background-image: linear-gradient(100.54deg, #9F5FFF -8.05%, rgba(66, 73, 255, 0) 65.7%);
  background-repeat: no-repeat;
  border: 1px solid rgba(138, 104, 255, 0.4);
  border-radius: 10px;
}
.bg-color36 {
  background: #362473;
}
.text-colorC9 {
  color: #C9CDD4;
}
</style>
