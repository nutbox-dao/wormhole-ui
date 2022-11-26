<template>
  <div>
<!--    <div v-if="dataList.length===0">-->
<!--      <div class="c-text-black text-zinc-700 text-2rem my-4rem">None</div>-->
<!--      <div class="text-zinc-400 text-0.8rem leading-1.4rem">-->
<!--        This service is still in Beta. Please be careful and do not deposit anything more than you can lose.-->
<!--        By depositing into this account, you are agreeing to our terms of service.-->
<!--      </div>-->
<!--    </div>-->
    <div>
      <template  v-if="reputation>0 || showingStellarTreks.length > 0">
        <div class="flex items-center py-1rem px-1.5rem border-b-1 border-listBgBorder cursor-pointer"
            @click="modalVisible=true">
          <img class="w-43px h-43px 2xl:w-2rem 2xl:h-2rem rounded-full"
              src="~@/assets/icon-nft.svg" alt="">
          <div class="text-left ml-1rem">
            <div class="c-text-black text-1.3rem md:text-1rem">Twitter Reputation NFT</div>
            <div class="text-color8B text-0.8rem mt-0.5rem">From @wormhole3 official</div>
          </div>
        </div>

        <div v-if="this.liquidation.image" class="flex items-center py-1rem px-1.5rem border-b-1 border-listBgBorder cursor-pointer"
            @click="modalVisibleLiq=true">
          <img class="w-43px h-43px 2xl:w-2rem 2xl:h-2rem rounded-full"
              src="~@/assets/icon-liquidation.png" alt="">
          <div class="text-left ml-1rem">
            <div class="c-text-black text-1.3rem md:text-1rem">Liquidation NFT</div>
            <div class="text-color8B text-0.8rem mt-0.5rem">register wormhole3, Tweet (picture and text) to show your liquidation experience and add the hashtags #iweb3 #liquidation</div>
          </div>
        </div>

        <div v-for="st of  showingStellarTreks" :key="st" class="flex items-center py-1rem px-1.5rem border-b-1 border-listBgBorder cursor-pointer"
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
    <el-dialog v-model="modalVisible" custom-class="c-dialog c-dialog-lg c-dialog-center c-dialog-no-bg c-dialog-no-shadow">
      <GetNft @close="modalVisible=false" :username="username" :reputation="reputation"></GetNft>
    </el-dialog>
    <el-dialog v-model="modalVisibleLiq" custom-class="c-dialog c-dialog-lg c-dialog-center c-dialog-no-bg c-dialog-no-shadow">
      <GetNft @close="modalVisibleLiq=false" :username="username" :liquidation="liquidation ? liquidation.liquidation : 0"></GetNft>
    </el-dialog>
    <el-dialog v-model="showTrekImage" custom-class="c-dialog c-dialog-lg c-dialog-center c-dialog-no-bg c-dialog-no-shadow">
      <img :src="showingTrekImage" alt="">
    </el-dialog>
  </div>
</template>

<script>
import GetNft from "@/views/user/components/GetNft";
import { mapGetters, mapState } from 'vuex'
import { getStellarTreks, getLiquidationNft } from '@/utils/asset'
import { STELLAR_TREK_NFT } from '@/config'

export default {
  name: "NFT",
  components: {GetNft},
  computed: {
    ...mapState(['stellarTreks']),
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
  },
  data() {
    return {
      dataList: [],
      modalVisible: false,
      modalVisibleLiq: false,
      showTrekImage: false,
      showingTrekImage: '',
      liquidation:{}
    }
  },
  methods: {
    showTrek(url) {
      this.showingTrekImage = url
      this.showTrekImage = true
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
  }
}
</script>

<style scoped>
.top-box {
  background: linear-gradient(99.28deg, rgba(83, 83, 83, 0.8) 0.41%, rgba(78, 72, 61, 0.8) 75.78%);
  border: 1px solid #323436;
  border-radius: 12px;
}
.router-link-exact-active {
  background-color: var(--primary-custom);
}
</style>
