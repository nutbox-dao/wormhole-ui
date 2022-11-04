<template>
  <div class="login-view">
    <div class="container  mx-auto" :class="isLoginPage?'px-2rem':''">
      <div v-if="authStep==='select'" :class="isLoginPage?'mt-10vh':''">
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

        <div class="c-text-black text-2rem max-w-30rem mx-auto leading-2.6rem">
          {{$t('signUp')}}
        </div>
        <div class="c-text-black gradient-btn h-3.6rem w-full rounded-full text-1rem mt-1.25rem flex justify-center items-center"
             @click="fetchKey">
          {{$t('signInView.p3')}}
        </div>
        or
        <button @click="connectMetamask" :disabled="connecting"
          class="c-text-black gradient-btn h-3.6rem w-full rounded-full text-1rem mt-1.25rem flex justify-center items-center">
          connect metamask
          <c-spinner class="w-1.5rem h-1.5rem ml-0.5rem" v-show="connecting"></c-spinner>
        </button>
      </div>
      <div v-else>
        <CreateAccount v-if="authStep==='create'"
                       :ethAccount="walletAddress" :referee="referee"
                       @skip="$emit('close')"
                       @send="sendTwitter($event)"></CreateAccount>
        <MetaMaskAccount v-if="authStep==='metamask'"
                         :address="walletAddress"
                         @back="authStep='select'"
                         @skip="$emit('close')"/>
      </div>
    </div>
  </div>
</template>

<script>
import { FetchingStatus, isTokenExpired } from '@/utils/account'
import { mapState, mapGetters } from 'vuex'
import { notify } from "@/utils/notify";
import { sleep } from '@/utils/helper'
import { twitterLogin, twitterAuth, twitterRefreshAccessToken } from '@/api/api'
import Cookie from 'vue-cookies'
import {generateBrainKey, randomEthAccount, randomWallet} from '@/utils/ethers'
import CreateAccount from "@/views/CreateAccount";
import MetaMaskAccount from "@/views/MetaMaskAccount";
import {TWITTER_MONITOR_RULE} from "@/config";
import { connectMetamask } from '@/utils/web3/web3'

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
      authStep: 'select',
      generatingKeys: false,
      showPrivateKey: false,
      ethAddress: '',
      accountInfo: {},
      walletAddress: '',
      referee: ''
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
    // 右上角提示信息框
    showNotify(message, duration, type) {
      notify({message, duration, type})
    },
    async fetchKey() {
      this.authStep = 'create'
      const referee = this.$route.params
      if (referee.referee && referee.referee.length > 0) {
        this.referee = referee.referee
      }
      try {
        this.$store.commit('saveEthAddress', null)
        const account = randomEthAccount()
        this.accountInfo = account
        this.ethAddress = account.ethAddress
        this.showPrivateKey = true
      }catch(e) {
        this.showNotify(e.toString(), 5000, 'error')
      }
    },
    sendTwitter(referee) {
      this.$store.commit('saveEthAddress', this.ethAddress)
      window.open('https://twitter.com/intent/tweet?text=' + TWITTER_MONITOR_RULE + ' !create wormhole account:' + this.ethAddress + (referee.length > 0 ? ` ${referee}` : '') + '%0a(Powerd by https://alpha.wormhole3.io)', '__blank')
    },
    async login() {
      try {
        this.loging = true
        const res = await twitterAuth();
        window.open(res, 'newwindow', 'height=600,width=600,top=0,left=0,toolbar=no,menubar=no,resizable=no,scrollbars=no,location=no,status=no')
        let loginCode = Cookie.get('twitter-loginCode');
        let tryTimes = 0
        while((!loginCode || loginCode.length === 0) && tryTimes < 50) {
          await sleep(1);
          loginCode = Cookie.get('twitter-loginCode');
          tryTimes++;
        }
        Cookie.remove('twitter-loginCode')
        if (userInfo.code === 0) {
          // not registry
          this.showNotify(this.$t('tip.notRegister'), 5000, 'info')

        }else if (userInfo.code === 3) { // log in
          this.$store.commit('saveAccountInfo', userInfo.account)
          this.$emit('close')
        }
      }catch(e) {
        // login error
      }finally {
        this.loging = false
      }
    },
    async connectMetamask() {
      try {
        this.connecting = true
        const acc = await connectMetamask();
        this.walletAddress = acc[0]
        this.authStep = 'metamask'
        console.log(6, acc)
      }catch(e) {
        console.log(554, e);
        this.showNotify()
      }finally{
        this.connecting = false
      }
    }
  },
}
</script>

<style scoped>

</style>
