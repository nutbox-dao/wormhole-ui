<template>
  <div>
<!--    <div v-if="dataList.length===0">-->
<!--      <div class="c-text-black text-zinc-700 text-2rem my-4rem">None</div>-->
<!--      <div class="text-zinc-400 text-0.8rem leading-1.4rem">-->
<!--        This service is still in Beta. Please be careful and do not deposit anything more than you can lose.-->
<!--        By depositing into this account, you are agreeing to our terms of service.-->
<!--      </div>-->
<!--    </div>-->
    <div class="pt-1rem px-1.5rem pb-2rem">
      <div class="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-20px">
        <div class="col-span-1">
          <div class="relative min-w hover-scale" @click="collectionVisible=true, collectionIndex=0">
            <img class="w-full " src="~@/assets/nft-collection-bg.png" alt="">
            <div class="absolute w-full h-full top-0 left-0 pt-2/10 pb-1/10 flex flex-col justify-between">
              <div class="w-80/100 mx-auto">
                <GetNft :username="username" :reputation="reputation" text-scale="scale-20"></GetNft>
              </div>
              <div class="text-12px scale-text leading-14px text-white">Reputation<br>{{prefixInteger(reputation, 6)}}</div>
            </div>
          </div>
        </div>
        <div class="col-span-1" v-if="curatorNFT > 0">
          <div class="relative min-w hover-scale" @click="collectionVisible=true, collectionIndex=6">
            <img class="w-full " src="~@/assets/nft-collection-bg.png" alt="">
            <div class="absolute w-full h-full top-0 left-0 pt-2/10 pb-1/20 flex flex-col justify-between">
              <img class="w-70/100 mx-auto" :src="Curator_NFT.image" alt="">
              <div class="text-12px scale-text leading-14px text-white">Certified <br> Curator</div>
            </div>
          </div>
        </div>
        <div class="col-span-1" v-if="showingWC2022.length > 0">
          <div class="relative min-w hover-scale" @click="collectionVisible=true, collectionIndex=2">
            <img class="w-full " src="~@/assets/nft-collection-bg.png" alt="">
            <div class="absolute w-full h-full top-0 left-0 pt-2/10 pb-1/10 flex flex-col justify-between">
              <img class="w-70/100 mx-auto" src="~@/assets/nft-collection2.png" alt="">
              <div class="text-12px scale-text leading-14px text-white">FIFA World Cup<br>Qatar 2022</div>
            </div>
          </div>
        </div>
        <div class="col-span-1" v-if="showingChristmasNFT.length > 0">
          <div class="relative min-w hover-scale" @click="collectionVisible=true, collectionIndex=3">
            <img class="w-full " src="~@/assets/nft-collection-bg.png" alt="">
            <div class="absolute w-full h-full top-0 left-0 pt-2/10 pb-1/10 flex flex-col justify-between">
              <img class="w-70/100 mx-auto" src="https://gateway.nutbox.app/ipfs/QmVudQSy1hvGgigAvZtP1x7qj6Vg6j7WD8bJykG8pg6WKF" alt="">
              <div class="text-12px scale-text leading-14px text-white">2022 Christmas Campaign</div>
            </div>
          </div>
        </div>
        <div class="col-span-1" v-if="showingStellarTreks.length > 0">
          <div class="relative min-w hover-scale" @click="collectionVisible=true, collectionIndex=4">
            <img class="w-full " src="~@/assets/nft-collection-bg.png" alt="">
            <div class="absolute w-full h-full top-0 left-0 pt-2/10 pb-1/10 flex flex-col justify-between">
              <img class="w-70/100 mx-auto" src="https://gateway.nutbox.app/ipfs/QmcuJyKGuSfSh7SQgKhvympxUPQmix4mwKzymBJ68w21Su" alt="">
              <div class="text-12px scale-text leading-14px text-white">Stellar Trek</div>
            </div>
          </div>
        </div>

        <div class="col-span-1" v-if="showingLuckyCards.length > 0">
          <div class="relative min-w hover-scale" @click="collectionVisible=true, collectionIndex=5">
            <img class="w-full " src="~@/assets/nft-collection-bg.png" alt="">
            <div class="absolute w-full h-full top-0 left-0 pt-2/10 pb-1/10 flex flex-col justify-between">
              <div class="w-70/100 mx-auto h-67/100 flex items-center justify-center">
                <img class="w-full rounded-4px" src="https://cdn.wherein.mobi/wormhole3/newyear/card4.png" alt="">
              </div>
              <div class="text-12px scale-text leading-14px text-white">2023 New Year Lucky Cards</div>
            </div>
          </div>
        </div>

        <div class="col-span-1" v-if="getAccountInfo.wordCloudUrl">
          <div class="relative min-w hover-scale" @click="collectionVisible=true, collectionIndex=7">
            <img class="w-full " src="~@/assets/nft-collection-bg.png" alt="">
            <div class="absolute w-full h-full top-0 left-0 pt-2/10 pb-1/10 flex flex-col justify-between">
              <div class="w-70/100 mx-auto h-67/100 flex items-center justify-center">
                <img class="w-full rounded-4px" :src="getAccountInfo.wordCloudUrl" alt="">
              </div>
              <div class="text-12px scale-text leading-14px text-white">My Twitter Persona</div>
            </div>
          </div>
        </div>
      </div>
<!--      <div class="h-1px w-full bg-primaryBg light:bg-colorF2 my-2rem"></div>-->
      <template  v-if="reputation>0 || showingStellarTreks.length > 0 || showingWC2022.length > 0
          || showingChristmasNFT.length > 0 || showingLuckyCards.length > 0">

    </template>
      <div class="my-2rem" v-else>
        <div class="text-center">{{$t('token.noNft')}}</div>
      </div>
    </div>
    <el-dialog v-model="collectionVisible" fullscreen class=" c-dialog-fullscreen" :show-close="false">
      <div class="py-4rem px-15px max-w-50rem mx-auto relative">
        <button class="absolute top-1rem left-15px" @click="collectionVisible=false">
          <i class="icon-back w-30px h-30px"></i>
        </button>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-y-10px gap-x-20px lg:gap-x-40px" v-show="collectionIndex===0">
          <div class="col-span-1 text-left hover-scale">
            <div class="relative min-w cursor-pointer" @click="modalVisible=true">
              <img class="w-full " src="~@/assets/nft-bg.png" alt="">
              <div class="absolute w-full h-full top-0 left-0 flex flex-col justify-center">
                <div class="w-90/100 mx-auto">
                  <GetNft :username="username" :reputation="reputation" text-scale="scale-30"></GetNft>
                </div>
              </div>
            </div>
            <div class="w-120/100 mx-auto transform scale-70 relative -left-10/100">
              <div class="text-14px leading-14px mt-5px">Twitter Reputation NFT</div>
              <div class="text-12px leading-13px text-color8B mt-6px">From @wormhole3 official</div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-y-10px gap-x-20px lg:gap-x-40px" v-show="collectionIndex===1">
          <div v-if="liquidation.image"
               class="col-span-3 xs:col-span-5 text-color8B/30 c-text-black py-2rem text-center">{{$t('common.none')}}</div>
          <div class="col-span-1 text-left hover-scale">
            <div class="relative min-w cursor-pointer " @click="showTrek(liquidation.image)">
              <img class="w-full " src="~@/assets/nft-bg.png" alt="">
              <div class="absolute w-full h-full top-0 left-0 flex flex-col justify-center">
                <div class="w-80/100 mx-auto">
                  <img :src="liquidation.image" alt="">
                </div>
              </div>
            </div>
            <div class="w-120/100 mx-auto transform scale-70 relative -left-10/100">
              <div class="text-14px leading-14px">{{liquidation.name}}</div>
              <div class="text-12px leading-13px text-color8B mt-6px">{{liquidation.description}}</div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-y-10px gap-x-20px lg:gap-x-40px" v-show="collectionIndex===2">
          <div v-if="showingWC2022.length===0"
               class="col-span-3 xs:col-span-5 text-color8B/30 c-text-black py-2rem text-center">{{$t('common.none')}}</div>
          <div class="col-span-1 text-left hover-scale" v-for="st of showingWC2022" :key="st">
            <div class="relative min-w cursor-pointer" @click="showTrek(st.image)">
              <img class="w-full " src="~@/assets/nft-bg.png" alt="">
              <div class="absolute w-full h-full top-0 left-0 flex flex-col justify-center">
                <div class="w-80/100 mx-auto">
                  <img :src="st.image" alt="">
                </div>
              </div>
            </div>
            <div class="w-120/100 mx-auto transform scale-70 relative -left-10/100">
              <div class="text-14px leading-14px">{{st.name}}</div>
              <div class="text-12px leading-13px text-color8B mt-6px">{{st.description}}</div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-y-10px gap-x-20px lg:gap-x-40px" v-show="collectionIndex===3">
          <div v-if="showingChristmasNFT.length===0"
               class="col-span-2 xs:col-span-4 text-color8B/30 c-text-black py-2rem text-center">{{$t('common.none')}}</div>
          <div class="col-span-1 text-left hover-scale" v-for="st of showingChristmasNFT" :key="st">
            <div class="relative min-w cursor-pointer" @click="showChristmas(st.image)">
              <img class="w-full " src="~@/assets/nft-bg.png" alt="">
              <div class="absolute w-full h-full top-0 left-0 flex flex-col justify-center">
                <div class="w-80/100 mx-auto">
                  <img class="rounded-4px" :src="st.image" alt="">
                </div>
              </div>
            </div>
            <div class="w-120/100 mx-auto transform scale-70 relative -left-10/100">
              <div class="text-14px leading-14px">{{st.name}}</div>
              <div class="text-12px leading-13px text-color8B mt-6px">{{st.description}}</div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-y-10px gap-x-20px lg:gap-x-40px" v-show="collectionIndex===4">
          <div v-if="showingStellarTreks.length===0"
               class="col-span-2 xs:col-span-4 text-color8B/30 c-text-black py-2rem text-center">{{$t('common.none')}}</div>
          <div class="col-span-1 text-left hover-scale" v-for="st of showingStellarTreks" :key="st">
            <div class="relative min-w cursor-pointer">
              <img class="w-full " src="~@/assets/nft-bg.png" alt="">
              <div class="absolute w-full h-full top-0 left-0 flex flex-col justify-center">
                <div class="w-80/100 mx-auto">
                  <img :src="st.image" alt="">
                </div>
              </div>
            </div>
            <div class="w-120/100 mx-auto transform scale-70 relative -left-10/100">
              <div class="text-14px leading-14px">{{st.name}}</div>
              <div class="text-12px leading-13px text-color8B mt-6px">{{st.description}}</div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-y-10px gap-x-20px lg:gap-x-40px" v-show="collectionIndex===5">
          <div v-if="showingLuckyCards.length===0"
               class="col-span-2 xs:col-span-4 text-color8B/30 c-text-black py-2rem text-center">{{$t('common.none')}}</div>
          <div class="col-span-1 text-left hover-scale" v-for="st of showingLuckyCards" :key="st">
            <div class="relative min-w cursor-pointer">
              <img class="w-full " src="~@/assets/nft-bg.png" alt="">
              <div class="absolute w-full h-full top-0 left-0 flex flex-col justify-center">
                <div class="w-80/100 mx-auto">
                  <img class="rounded-4px" :src="st.image" alt="">
                </div>
              </div>
            </div>
            <div class="w-120/100 mx-auto transform scale-70 relative -left-10/100">
              <div class="text-14px leading-14px">{{st.name}}</div>
              <div class="text-12px leading-13px text-color8B mt-6px">{{st.description}}</div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-y-10px gap-x-20px lg:gap-x-40px" v-show="collectionIndex===6">
          <div v-if="curatorNFT===0"
               class="col-span-2 xs:col-span-4 text-color8B/30 c-text-black py-2rem text-center">{{$t('common.none')}}</div>
          <div class="col-span-1 text-left hover-scale">
            <div class="relative min-w cursor-pointer">
              <img class="w-full " src="~@/assets/nft-bg.png" alt="">
              <div class="absolute w-full h-full top-0 left-0 flex flex-col justify-center">
                <div class="w-80/100 mx-auto">
                  <img :src="Curator_NFT.image" alt="">
                </div>
              </div>
            </div>
            <div class="w-120/100 mx-auto transform scale-70 relative -left-10/100">
              <div class="text-14px leading-14px">{{Curator_NFT.name}}</div>
              <div class="text-12px leading-13px text-color8B mt-6px">{{Curator_NFT.description}}</div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-y-10px gap-x-20px lg:gap-x-40px" v-show="collectionIndex===7">
          <div v-if="!getAccountInfo.wordCloudUrl"
               class="col-span-2 xs:col-span-4 text-color8B/30 c-text-black py-2rem text-center">{{$t('common.none')}}</div>
          <div class="col-span-1 text-left hover-scale">
            <div class="relative min-w cursor-pointer">
              <img class="w-full " src="~@/assets/nft-bg.png" alt="">
              <div class="absolute w-full h-full top-0 left-0 flex flex-col justify-center item-center align-center">
                <div class="w-80/100 mx-auto my-auto">
                  <img :src="getAccountInfo.wordCloudUrl" alt="">
                </div>
              </div>
            </div>
            <div class="w-120/100 mx-auto transform scale-70 relative -left-10/100">
              <div class="text-14px leading-14px">Word cloud NFT</div>
              <div class="text-12px leading-13px text-color8B mt-6px">Word cloud generated by user's twitter data</div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import GetNft from "@/views/user/components/GetNft";
import { mapGetters, mapState } from 'vuex'
import { getStellarTreks, getLiquidationNft, getWc2022, getChritmasNFT, getCuratorNFT } from '@/utils/asset'
import { Curator_NFT } from '@/nft-config'
import { Christmas_NFT, WC2022_NFT, STELLAR_TREK_NFT } from '@/nft-config'
import { getUserNYCards } from '@/utils/new-year'
import { BLESS_CARD_NAME, BLESS_CARD_DESC } from '@/ny-config'

export default {
  name: "NFT",
  components: {GetNft},
  computed: {
    ...mapState(['stellarTreks', 'worldCupNFT', 'christmasNFT', 'luckyCardsNFT', 'curatorNFT']),
    ...mapGetters(['getAccountInfo']),
    username() {
      return this.getAccountInfo ? this.getAccountInfo.twitterUsername : '';
    },
    reputation() {
      return this.getAccountInfo?.reputation
    },
    showingStellarTreks() {
      let sts = []
      if (this.stellarTreks && Object.keys(this.stellarTreks).length > 0) {
        for (let id in this.stellarTreks) {
          sts.push(STELLAR_TREK_NFT[id])
        }
      }
      return sts
    },
    showingLuckyCards() {
      if (this.luckyCardsNFT && this.luckyCardsNFT.length > 0) {
        return this.luckyCardsNFT
      }
      return []
    },
    showingWC2022() {
      let sts = []
      if (this.worldCupNFT && Object.keys(this.worldCupNFT).length > 0) {
        for (let id in this.worldCupNFT) {
          sts.push(WC2022_NFT[id])
        }
      }
      return sts
    },
    showingChristmasNFT() {
      let chr = []
      if (this.christmasNFT && Object.keys(this.christmasNFT).length > 0) {
        for (let id in this.christmasNFT) {
          chr.push(Christmas_NFT[id])
        }
      }
      return chr
    }
  },
  data() {
    return {
      dataList: [],
      modalVisible: false,
      modalVisibleLiq: false,
      // stellar treck
      showTrekImage: false,
      showingTrekImage: '',
      liquidation:{},
      // world cup 2022
      showingWcImage: '',
      showWcImage: false,
      // christmas
      showingChristmasImage: '',
      showChristmasImage: false,
      collectionIndex: 0,
      collectionVisible: false,
      showingCuratorImage: '',
      showCuratorImage: false,
      Curator_NFT
    }
  },
  methods: {
    showTrek(url) {
      this.showingTrekImage = url
      this.showTrekImage = true
    },
    showLiquidation() {
      this.showingTrekImage = this.liquidation.image;
      this.showTrekImage = true
    },
    showWC2022(url) {
      this.showingWcImage = url;
      this.showWcImage = true;
    },
    showChristmas(url) {
      this.showingChristmasImage = url;
      this.showChristmasImage = true;
    },
    showCurator(url) {
      this.showingCuratorImage = url;
      this.showCuratorImage = true;
    },
    prefixInteger(num, length) {
      return num.toString().padStart(length, '0')
    }
  },
  mounted() {
    const { ethAddress } = this.getAccountInfo
    getStellarTreks(ethAddress).then(balances => {
      this.$store.commit('saveStellarTreks', balances)
    }).catch(e => {
      console.log(60, e);
    })
    getLiquidationNft(ethAddress).then(res => this.liquidation = res).catch(console.log)
    getWc2022(ethAddress).then(balances => {
      this.$store.commit('saveWorldCupNFT', balances)
    }).catch(e => {
      console.log(64, e);
    })
    getChritmasNFT(ethAddress).then(balances => {
      this.$store.commit('saveChristmasNFT', balances)
    }).catch(e => {
      console.log(65, e);
    })
    getUserNYCards(ethAddress).then(balances => {
      let res = []
      for (let b of [1,2,3,4,5]) {
        if (balances[b] > 0) {
          res.push({
            name: BLESS_CARD_NAME[b - 1],
            description: BLESS_CARD_DESC[b-1],
            image: `https://cdn.wherein.mobi/wormhole3/newyear/card${b-1}.png`
          })
        }
      }
      this.$store.commit('saveLuckyCardsNFT', res)
    }).catch()
    getCuratorNFT(ethAddress).then(balance => {
      this.$store.commit('saveCuratorNFT', balance)
    }).catch(e => {
      console.log(66, e);
    })
  }
}
</script>

<style scoped lang="scss">
.c-list-item:last-child {
  border: none;
}
.scale-text {
  transform: scale(0.7);
}
.multi-content {
  word-break: break-word;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
.hover-scale:hover {
  cursor: pointer;
  transform: scale(1.1);
}
</style>
