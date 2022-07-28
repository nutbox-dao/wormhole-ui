<template>
  <div class="container mx-auto max-w-960px px-0.725rem py-3rem">
    <template v-if="accountInfo && accountInfo.web25ETH">
    <img class="w-8rem h-8rem mx-auto rounded-full gradient-border border-3px" @error="replaceEmptyImg"
         :src="'https://profile-images.heywallet.com/' + (accountInfo ? accountInfo.twitterId : '')" alt="">
    <div class="text-text8F text-1.8rem font-bold mt-1.2rem">@{{ accountInfo ? accountInfo.twitterUsername : ''}}</div>
    <div class="c-text-black text-3.2rem gradient-text gradient-text-right mx-auto leading-3.6rem flex">
      <span>Web3  wallet</span>
      <img class="ml-1rem mt-0.5rem w-1.3rem h-1.3rem cursor-pointer"
           @click="tipDrawer=true"
           src="~@/assets/icon-question.svg" alt="">
    </div>
    <!-- <div class="text-left text-1.2rem mt-4.6rem">1. Web3 ETH wallet address</div> -->
    <div class="gradient-bg gradient-bg-color3 rounded-2rem p-0.2rem mt-0.8rem mb-3rem">
      <div class="text-1.4rem font-bold py-1rem text-primaryColor bg-primaryBg rounded-t-1.8rem">
        Web3 ETH Address
      </div>
      <div class="c-text-bold text-1.2rem leading-1.9rem py-1.2rem px-2.1rem break-all flex items-center justify-center">
        {{ accountInfo ? accountInfo.ethAddress : '' }}
        <img class="w-1.5rem h-1.5rem ml-1rem hover" @click="copy(accountInfo.ethAddress)" src="~@/assets/icon-copy.svg" alt="">
      </div>
    </div>
    <!-- <div class="text-left text-1.2rem">
      2. One-click transfer of assets from Wormhole3 wallet to Web3 wallet
    </div>
    <div class="border-1px border-text8F rounded-1rem h-min-10rem p-1rem mt-0.8rem relative">
      <div class="text-left break-all">
        <span class="text-primaryColor">#wormhole3 !send </span>
        <span class="text-text8F">all ETH to 0x77B8DF624d19c8f537E22397fCa899836E539e74</span>
      </div>
      <button class="text-text53 flex items-center justify-center border-1px border-text53 rounded-full h-2.45rem px-1.7rem absolute bottom-1rem right-1rem">
        <img class="w-1rem h-1rem mr-1rem" src="~@/assets/icon-twitter.svg" alt="">
        <span class="text-white">GO tweet</span>
      </button>
    </div>
    <div class="text-primaryColor italic text-1.2rem text-left leading-1.5rem mt-0.8rem">
      tips: please confirm that the receiving wallet address is your own web3 wallet address.
    </div> -->
    </template>
    <div class="c-text-black text-1.8rem mb-3rem" v-else>
      <img src="~@/assets/profile-loading.gif" alt="">
    </div>
    <van-popup class="c-tip-drawer" v-model:show="tipDrawer"
               :position="position">
      <div class="modal-bg w-full md:w-49rem max-h-80vh overflow-auto flex flex-col rounded-t-1.5rem md:rounded-b-1.5rem pt-2rem md:p-2rem">
        <div v-if="position === 'bottom'"
             @click="tipDrawer=false"
             class="w-6rem h-8px bg-color73 rounded-full mx-auto mb-2rem"></div>
        <div class="flex-1 overflow-auto px-1.5rem no-scroll-bar pb-4rem">
          <div class="gradient-text gradient-text-bottom c-text-black md:text-2rem md:leading-3.6rem text-1.8rem leading-2.4rem text-center w-full">
            What is a wormhole3 <br>
            wallet or web3 wallet?
          </div>
          <div class="text-1rem leading-1.2rem c-text-bold mt-4rem">
            1. Transfer ETH/STEEM to a twitter account or an ETH address
          </div>
          <div class="text-text8F text-0.8rem leading-1rem mt-0.5rem">
            tips:    please replace {***} to real content. and also you could replace   {@twitter_username} with a wallet address.
          </div>
          <div class="text-1rem leading-1.2rem c-text-bold mt-2rem">
            2. Add a post  to web3
          </div>
          <div class="text-text8F text-0.8rem leading-1rem mt-0.5rem">
            tips:    replace {***} to real content.
          </div>
          <div class="text-1rem leading-1.2rem c-text-bold mt-2rem">
            3. Add a post  to web3
          </div>
          <div class="text-text8F text-0.8rem leading-1rem mt-0.5rem">
            tips:    replace {***} to real content.
          </div>
          <div class="text-1rem leading-1.2rem c-text-bold mt-2rem">
            4. Add a post  to web3
          </div>
        </div>
      </div>
    </van-popup>
    <el-dialog v-model="showRegistering" custom-class="c-dialog c-dialog-lg c-dialog-center">
      <div class="text-white verify-view lg:p-3rem px-1rem py-2rem text-2rem">
        Your account is in the process of registration<br>
        Please wait for a moment<br>
        <div class="mx-auto">
          <img src="~@/assets/loading.gif" alt="" class="w-25 mx-auto mt-2rem">
        </div>
      </div>
    </el-dialog>
    <el-dialog v-model="showNotSendTwitter" custom-class="c-dialog c-dialog-lg c-dialog-center">
      <div class="text-white verify-view lg:p-3rem px-1rem py-2rem text-2rem">
        You havn't send twitter yet
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo, FetchingStatus } from '@/utils/account'
import emptyAvatar from '@/assets/icon-default-avatar.svg'
import { notify } from "@/utils/notify";
import { ethers } from 'ethers'

export default {
  name: "AccountInfo",
  data() {
    return {
      loading: false,
      tipDrawer: false,
      showRegistering: false,
      showNotSendTwitter: false,
      position: document.body.clientWidth < 768?'bottom':'center',
    }
  },
  computed: {
    ...mapState(['accountInfo'])
  },
  methods: {
     showNotify(message, duration, type) {
          notify({message, duration, type})
      },
    replaceEmptyImg(e) {
        e.target.src = emptyAvatar
     },
     copy(address) {
      if (ethers.utils.isAddress(address)) {
        navigator.clipboard.writeText(address).then(() => {
            this.showNotify('Copied address:'+address, 5000, 'success')
        }, (e) => {
          console.log(e)
        })
      }
     }
  },
  async mounted () {
    const twitterUsername = this.$route.params.user.startsWith('@') ? this.$route.params.user.substring(1) : this.$route.params.user
    // getUserInfo
    if (this.accountInfo && twitterUsername == this.accountInfo.twitterUsername) {
    }else {
        try{
            this.loading = true
            const result = await getUserInfo(twitterUsername, null, status => {
              if (status === FetchingStatus.MATCH_TICKETS) {
              } else if(status === FetchingStatus.REGISTERING) {
                this.showRegistering = true
              } else if(status === FetchingStatus.NOT_SEND_TWITTER) {
                this.showNotSendTwitter = true
              }
            })
            if (!result) {
                console.log('Not exsit');
                this.showNotify('This twitter account is invalid.', 5000, 'error')
                this.$router.push('/')
                return;
            }else {
            }
        }catch(e) {
            this.showNotify("Server error", 5000, 'error')
            this.$router.push('/')
            return;
        }finally{
          this.loading = false;
        }
    };
  },
}
</script>

<style scoped>

</style>
