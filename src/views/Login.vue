<template>
  <div class="login-view">
    <div class="container  mx-auto" :class="isLoginPage?'px-2rem':''">
      <div v-if="authStep==='login'" :class="isLoginPage?'mt-10vh':''">
        <div :class="isLoginPage?'sm:text-center text-left':'text-center'">
          <div class="c-text-black text-2rem max-w-30rem mx-auto leading-2.6rem">
            {{$t('signIn')}}
          </div>
        </div>
        <button @click="login" :disable="loging"
                class="c-text-black gradient-btn h-3.6rem w-full rounded-full text-1rem mt-1.25rem flex justify-center items-center">
          <span>{{$t('signIn')}}</span>
          <c-spinner class="w-1.5rem h-1.5rem ml-0.5rem" v-show="loging"></c-spinner>
        </button>
      </div>
      <div v-else-if="authStep === 'select'" :class="isLoginPage?'mt-10vh':''">
        <div class="c-text-black text-2rem max-w-30rem mx-auto leading-2.6rem">
          {{$t('signUp')}}
        </div>
        <button class="c-text-black gradient-btn h-3.6rem w-full rounded-full text-1rem mt-1.25rem flex justify-center items-center"
            @click="authStep = 'create'">
          {{$t('signInView.p3')}}
        </button>
        or
        <button @click="connectMetamask" :disabled="connecting"
          class="c-text-black gradient-btn h-3.6rem w-full rounded-full text-1rem mt-1.25rem flex justify-center items-center">
          connect metamask
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
import { randomWallet, ethers } from '@/utils/ethers'
import CreateAccount from "@/views/CreateAccount";
import MetaMaskAccount from "@/views/MetaMaskAccount";
import { connectMetamask } from '@/utils/web3/web3'
import { createKeypair } from '@/utils/tweet-nacl'

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
      pair: {}
    }
  },
  mounted() {
    isTokenExpired()
    this.isLoginPage = (this.$route.name==='login')
  },
  computed: {
    // ...mapState(['ethAddress', 'accountInfo']),
    // ...mapGetters(['getPrivateKey'])
  },
  methods: {
    showNotify(message, duration, type) {
      notify({message, duration, type})
    },
    async login() {
      try {
        this.loging = true
        const res = await twitterAuth();
        window.open(res, 'newwindow', 'height=600,width=600,top=0,left=0,toolbar=no,menubar=no,resizable=no,scrollbars=no,location=no,status=no')
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
          this.authStep = 'select';
        }else if (userInfo.code === 3) { // log in
          this.$store.commit('saveAccountInfo', userInfo.account)
          this.$emit('close')
        }
      }catch(e) {
        // login error
        this.showNotify(e, 5000, 'error')
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
