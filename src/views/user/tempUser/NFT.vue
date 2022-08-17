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
      <div v-if="reputation > 0" class="flex items-center py-1rem px-1.5rem border-b-1 border-listBgBorder cursor-pointer"
           @click="modalVisible=true">
        <img class="w-43px h-43px 2xl:w-2rem 2xl:h-2rem rounded-full"
             src="~@/assets/icon-nft.svg" alt="">
        <div class="text-left ml-1rem">
          <div class="c-text-black text-1rem">Twitter Reputation NFT</div>
          <div class="text-color8B text-0.8rem mt-0.5rem">from @wormhole3 official</div>
        </div>
      </div>
      <div class="mt-2rem" v-else>
        <div class="text-center">{{$t('token.noNft')}}</div>
      </div>
    </div>
    <el-dialog v-model="modalVisible"
               custom-class="c-dialog c-dialog-lg c-dialog-center c-dialog-no-bg c-dialog-no-shadow">
      <GetNft @close="modalVisible=false" :username="username" :reputation="reputation"></GetNft>
    </el-dialog>
  </div>
</template>

<script>
import GetNft from "@/views/user/components/GetNft";
export default {
  name: "NFT",
  components: {GetNft},
  props: {
    accountInfo: {
      type: Object,
      default: {}
    },
  },
  computed: {
    username() {
      return this.accountInfo?.twitterUsername
    },
    reputation() {
      return this.accountInfo?.reputation
    },
  },
  data() {
    return {
      dataList: [],
      modalVisible: false
    }
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
