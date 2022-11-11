<template>
  <div class="login-view">
    <div class="" :class="isLoginPage?'px-2rem':''">
      <div v-if="authStep==='login'" :class="isLoginPage?'mt-10vh':''">
        <div class="text-1.4rem leading-2.3rem c-text-black gradient-text gradient-text-purple-white mx-auto mb-2.3rem">
          {{$t('signInView.join')}}
        </div>
       <button @click="login" :disable="loging"
               class="c-text-black gradient-btn h-3.6rem max-h-65px w-20rem mx-auto rounded-full text-1rem flex justify-center items-center">
              <img class="w-2rem mr-1rem cursor-pointer"
               @click="login"
               src="~@/assets/icon-twitter-white.svg" alt="">
               <span>{{$t('signInWithTwitter')}}</span>
         <c-spinner class="w-1.5rem h-1.5rem ml-0.5rem" v-show="loging"></c-spinner>
       </button>
        <div class="text-color8B mt-1rem" style="word-break: break-word">{{$t('signInView.p1')}}</div>
      </div>
      <div v-else-if="authStep === 'select'" :class="isLoginPage?'mt-10vh':''">
        <div class="flex justify-center items-center">
          <img v-if="pendingAccount.profileImg"
               :src="pendingAccount.profileImg" @error="replaceEmptyImg" alt=""
               class="bg-black/10 w-3rem h-3rem 2xl:w-50px 2xl:h-50px rounded-full mr-0.5rem"/>
          <img v-else src="~@/assets/icon-default-avatar.svg" alt=""
               class="bg-black/10 w-3rem h-3rem 2xl:w-50px 2xl:h-50px rounded-full mr-0.5rem"/>
          <div class="flex flex-col items-start">
            <span class="c-text-black text-1.2rem 2xl:text-24px leading-1.8rem 2xl:leading-36px text-white light:text-color46">
              {{pendingAccount.twitterName || 'Username'}}
            </span>
            <span class="text-color8B light:text-color7D">@{{pendingAccount.twitterUsername}}</span>
          </div>
        </div>
        <div class="c-text-black break-word text-1.6rem leading-2.3rem gradient-text gradient-text-purple-white mx-auto mt-1.4rem mb-1rem">
          {{$t('signUpView.p1')}}
        </div>
        <button class="c-text-black gradient-btn h-3.6rem max-h-65px w-22rem mx-auto rounded-full text-1rem mt-1.25rem flex justify-center items-center"
            @click="authStep = 'create'">
          {{$t('signUpView.createAccount')}}
        </button>
        <div class="flex justify-center items-center mt-1.5rem ">
          <span class="w-10rem h-1px bg-color8B/30 block"></span>
          <span class="mx-1rem text-color8B/30 xl:text-0.8rem">{{$t('signUpView.or')}}</span>
          <span class="w-10rem h-1px bg-color8B/30 block"></span>
        </div>
        <button @click="connectMetamask" :disabled="connecting"
          class="h-3.6rem max-h-65px w-full rounded-full text-1rem flex justify-center items-center">
          <img class="w-1.7rem mr-1rem" src="~@/assets/icon-metamask.png" alt="">
          <span class="text-color8B underline font-bold">{{$t('signUpView.metamask')}}</span>
          <c-spinner class="w-1.5rem h-1.5rem ml-0.5rem" v-show="connecting"></c-spinner>
        </button>
      </div>
      <div v-else>
        <CreateAccount v-if="authStep==='create'"
                       :wallet="wallet"
                       :pair="pair"
                       @skip="$emit('close')"
                       @back="authStep='login'"
                       @send="sendTwitter($event)"></CreateAccount>
        <MetaMaskAccount v-if="authStep==='metamask'"
                         :address="walletAddress"
                         :pair="pair"
                         @back="authStep='login'"
                         @skip="$emit('close')"/>
      </div>
    </div>
  </div>
</template>

<script>
import { isTokenExpired } from '@/utils/account'
import { notify } from "@/utils/notify";
import { sleep } from '@/utils/helper'
import { twitterLogin, twitterAuth } from '@/api/api'
import Cookie from 'vue-cookies'
import { randomWallet } from '@/utils/ethers'
import CreateAccount from "@/views/CreateAccount";
import MetaMaskAccount from "@/views/MetaMaskAccount";
import { connectMetamask } from '@/utils/web3/web3'
import { createKeypair } from '@/utils/tweet-nacl'
import { ethers } from 'ethers'
import emptyAvatar from "@/assets/icon-default-avatar.svg";

export default {
  name: "Login",
  components: {CreateAccount, MetaMaskAccount},
  data() {
    return {
      loging: false,
      showRegistering: false,
      showNotSendTwitter: false,
      isLoginPage: false,
      connecting: false,
      authStep: 'login',
      generatingKeys: false,
      showPrivateKey: false,
      ethAddress: '',
      accountInfo: {},
      walletAddress: '',
      referee: '',
      wallet: {},
      pair: {},
      pendingAccount: {}
    }
  },
  mounted() {
    this.isLoginPage = (this.$route.name==='login')
  },
  computed: {
    // ...mapState(['ethAddress', 'accountInfo']),
    // ...mapGetters(['getPrivateKey'])
  },
  methods: {
    replaceEmptyImg(e) {
      e.target.src = emptyAvatar;
    },
    showNotify(message, duration, type) {
      notify({message, duration, type})
    },
    async login() {
      try {
        this.loging = true
        const res = await twitterAuth();
        window.open(res, 'newwindow', 'height=700,width=500,top=0,left=0,toolbar=no,menubar=no,resizable=no,scrollbars=no,location=no,status=no')
        let loginCode = Cookie.get('twitter-loginCode');
        let tryTimes = 0
        await sleep(1)
        randomWallet().then(wallet => this.wallet = wallet)
        createKeypair().then(pair => this.pair = pair)
        while((!loginCode || loginCode.length === 0) && tryTimes < 50) {
          await sleep(1);
          loginCode = Cookie.get('twitter-loginCode');
          tryTimes++;
        }
        Cookie.remove('twitter-loginCode')
        if (loginCode === 'fail'){
          this.showNotify(this.$t('err.loginErr'), 5000, 'error')
          return;
        }
        const userInfo = await twitterLogin(loginCode)
        if (userInfo.code === 0) {
          // not registry
          // store auth info
          console.log('not register')
          Cookie.set('account-auth-info', JSON.stringify(userInfo.account), '180s')
          this.pendingAccount = userInfo.account
          this.authStep = 'select';
        }else if (userInfo.code === 3) { // log in
          this.$store.commit('saveAccountInfo', userInfo.account)
          this.$emit('close')
        }
      }catch(e) {
        // login error
        this.showNotify(e.toString(), 5000, 'error')
      }finally {
        this.loging = false
      }
    },
    async connectMetamask() {
      try {
        this.connecting = true
        const acc = await connectMetamask();
        this.walletAddress = ethers.utils.getAddress(acc[0])
        this.authStep = 'metamask'
      }catch(e) {
        console.log(554, e);
        this.showNotify(e, 5000, 'error')
      }finally{
        this.connecting = false
      }
    }
  },
}
</script>

<style scoped>

</style>
