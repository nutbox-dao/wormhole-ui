<template>
  <div>
<!--    <div v-if="dataList.length===0">-->
<!--      <div class="c-text-black text-zinc-700 text-2rem my-4rem">None</div>-->
<!--      <div class="text-zinc-400 text-0.8rem leading-1.4rem">-->
<!--        This service is still in Beta. Please be careful and do not deposit anything more than you can lose.-->
<!--        By depositing into this account, you are agreeing to our terms of service.-->
<!--      </div>-->
<!--    </div>-->
    <div class="pt-1rem px-1.5rem">
      <template  v-if="reputation>0 || showingStellarTreks.length > 0">
        <div class="flex items-center py-1rem border-b-1 border-listBgBorder cursor-pointer c-list-item"
            @click="modalVisible=true">
          <img class="w-43px h-43px 2xl:w-2rem 2xl:h-2rem rounded-full"
              src="~@/assets/icon-nft.svg" alt="">
          <div class="text-left ml-1rem">
            <div class="c-text-black text-1.3rem md:text-1rem">Twitter Reputation NFT</div>
            <div class="text-color8B text-0.8rem mt-0.5rem">From @wormhole3 official</div>
          </div>
        </div>
        <div v-for="st of showingStellarTreks" :key="st"
             class="flex items-center py-1rem border-b-1 border-listBgBorder cursor-pointer c-list-item"
         @click="showTrek(st.image)">
          <img class="w-43px h-43px 2xl:w-2rem 2xl:h-2rem rounded-full"
              :src="st.image" alt="">
          <div class="text-left ml-1rem">
            <div class="c-text-black text-1.3rem md:text-1rem">{{st.name}}</div>
            <div class="text-color8B text-0.8rem mt-0.5rem">{{st.description}}</div>
          </div>
        </div>
        <div v-for="st of showingWC2022" :key="st"
             class="flex items-center py-1rem border-b-1 border-listBgBorder cursor-pointer c-list-item"
         @click="showTrek(st.image)">
          <img class="w-43px h-43px 2xl:w-2rem 2xl:h-2rem rounded-full"
              :src="st.image" alt="">
          <div class="text-left ml-1rem">
            <div class="c-text-black text-1.3rem md:text-1rem">{{st.name}}</div>
            <div class="text-color8B text-0.8rem mt-0.5rem">{{st.description}}</div>
          </div>
        </div>
    </template>
      <div class="mt-2rem" v-else>
        <div class="text-center">{{$t('token.noNft')}}</div>
      </div>
    </div>
    <el-dialog v-model="modalVisible" class="c-dialog c-dialog-lg c-dialog-center c-dialog-no-bg c-dialog-no-shadow">
      <GetNft @close="modalVisible=false" :username="username" :reputation="reputation"></GetNft>
    </el-dialog>
    <el-dialog v-model="showTrekImage" class="c-dialog c-dialog-lg c-dialog-center c-dialog-no-bg c-dialog-no-shadow">
      <img :src="showingTrekImage" alt="">
    </el-dialog>
    <el-dialog v-model="showWcImage" class="c-dialog c-dialog-lg c-dialog-center c-dialog-no-bg c-dialog-no-shadow">
      <img :src="showingWcImage" alt="">
    </el-dialog>
  </div>
</template>

<script>
import GetNft from "@/views/user/components/GetNft";
import { mapGetters, mapState } from 'vuex'
import { getStellarTreks, getLiquidationNft, getWc2022 } from '@/utils/asset'
import { STELLAR_TREK_NFT, WC2022_NFT } from '@/config'

export default {
  name: "NFT",
  components: {GetNft},
  computed: {
    ...mapState(['stellarTreks', 'worldCupNFT']),
    ...mapGetters(['getAccountInfo']),
    username() {
      return this.getAccountInfo?.twitterUsername
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
    showingWC2022() {
      let sts = []
      if (this.worldCupNFT && Object.keys(this.worldCupNFT).length > 0) {
        for (let id in this.worldCupNFT) {
          sts.push(WC2022_NFT[id])
        }
      }
      return sts
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
  }
}
</script>

<style scoped>
.c-list-item:last-child {
  border: none;
}
</style>
