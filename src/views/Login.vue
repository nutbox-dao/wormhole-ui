<template>
  <div class="login-view">
    <div v-if="authStep==='login'">
      <div class="text-1.6rem leading-2.3rem c-text-black gradient-text bg-purple-white light:bg-text-color17 mx-auto mb-2.3rem">
        {{$t('signInView.join')}}
      </div>
      <button @click="login" :disabled="loging"
              class="c-text-black gradient-btn h-3.6rem max-h-65px w-20rem mx-auto rounded-full text-1rem flex justify-center items-center">
        <img class="w-2rem mr-1rem cursor-pointer"
             src="~@/assets/icon-twitter-white.svg" alt="">
        <span>{{$t('signInWithTwitter')}}</span>
        <c-spinner class="w-1.5rem h-1.5rem ml-0.5rem" v-show="loging"></c-spinner>
      </button>
      <div class="text-color8B mt-1rem text-1rem lg:text-0.75rem leading-1.2rem" style="word-break: break-word">{{$t('signInView.p1')}}</div>
    </div>
    <div v-else-if="authStep === 'select'">
      <div class="flex justify-center items-center">
        <img v-if="pendingAccount.profileImg"
             :src="pendingAccount.profileImg" @error="replaceEmptyImg" alt=""
             class="bg-black/10 w-3rem h-3rem 2xl:w-50px 2xl:h-50px rounded-full mr-0.5rem"/>
        <img v-else src="~@/assets/icon-default-avatar.svg" alt=""
             class="bg-black/10 w-3rem h-3rem 2xl:w-50px 2xl:h-50px rounded-full mr-0.5rem"/>
        <div class="flex flex-col items-start">
            <span class="c-text-black text-1.2rem 2xl:text-24px leading-1.8rem 2xl:leading-36px text-white light:text-color46">
              {{pendingAccount.twitterName}}
            </span>
          <span class="text-color8B light:text-color7D">@{{pendingAccount.twitterUsername}}</span>
        </div>
      </div>
      <div class="c-text-black break-word text-1.4rem leading-2.3rem gradient-text bg-purple-white light:bg-text-color17 mx-auto mt-1.4rem mb-1rem">
        {{$t('signUpView.p1')}}
      </div>
      <button @click="connectMetamask" :disabled="connecting"
              class="c-text-black gradient-btn h-3.6rem max-h-65px w-22rem mx-auto rounded-full text-1rem mt-1.25rem
                     flex justify-center items-center">
        <img class="w-1.7rem mr-1rem" src="~@/assets/icon-metamask.png" alt="">
        <span class="">{{$t('signUpView.metamask')}}</span>
        <c-spinner class="w-1.5rem h-1.5rem ml-0.5rem" v-show="connecting"></c-spinner>
      </button>
      <div class="flex justify-center items-center mt-1.5rem ">
        <span class="w-10rem h-1px bg-color8B/30 light:bg-colorD6 block"></span>
        <span class="mx-1rem text-color8B/30 light:text-color7D xl:text-0.8rem">{{$t('signUpView.or')}}</span>
        <span class="w-10rem h-1px bg-color8B/30 light:bg-colorD6 block"></span>
      </div>
      <button class="h-3.6rem max-h-65px w-full rounded-full text-1rem flex justify-center items-center
                     text-color8B light:text-color7D underline font-bold"
              :disabled="!!thirdPartInfo.ethAddress"
              @click="createNewAddress">
        {{$t('signUpView.createAccount')}}
      </button>
    </div>
    <div v-else>
      <CreateAccount v-if="authStep==='create'"
                     :wallet="wallet"
                     :identity-info="identityInfo"
                     :pair="pair"
                     @skip="$emit('close')"
                     @back="authStep='select'"
                     @send="sendTwitter($event)"></CreateAccount>
      <MetaMaskAccount v-if="authStep==='metamask'"
                       :address="walletAddress"
                       :identity-info="identityInfo"
                       :pair="pair"
                       @back="authStep='select'"
                       @skip="$emit('close')"/>
    </div>
  </div>
</template>

<script>
import {EVM_CHAINS} from "@/chain-config";
import { CHAIN_NAME, GateFeeAddress } from "@/config";
import { isTokenExpired } from '@/utils/account'
import { notify } from "@/utils/notify";
import { sleep, formatAmount } from '@/utils/helper'
import { twitterLogin, twitterAuth, getUserBitip, checkRegistedIdentity, getUserByEth } from '@/api/api'
import Cookie from 'vue-cookies'
import { randomWallet } from '@/utils/ethers'
import CreateAccount from "@/views/CreateAccount";
import MetaMaskAccount from "@/views/MetaMaskAccount";
import { connectMetamask, setupNetwork } from '@/utils/web3/web3'
import { createKeypair } from '@/utils/tweet-nacl'
import { ethers } from 'ethers'
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import {useTimer} from "@/utils/hooks";
import { mapState } from 'vuex'
import { connectUnisat as cu, signMessage } from '@/utils/web3/btc';
import CustomSelect from "@/components/CustomSelect";
import {accountChanged, getAccounts} from "@/utils/web3/account";
import { sendAssetTo, getBalanceOfUser } from "@/utils/web3/web3";



export default {
  name: "Login",
  components: {CreateAccount, MetaMaskAccount, CustomSelect},
  setup() {
    const { setTimer } = useTimer()
    return {setTimer}
  },
  data() {
    return {
      EVM_CHAINS,
      loging: false,
      showRegistering: false,
      showNotSendTwitter: false,
      connecting: false,
      authStep: 'login',
      generatingKeys: false,
      showPrivateKey: false,
      ethAddress: '',
      accountInfo: {},
      walletAddress: '',
      wallet: {},
      pair: {},
      selectedChainName: '',
      pendingAccount: {},
      thirdPartInfo: {},
      bitips: [],
      btcAddress: '',
      btcPubkey: '',
      identityInfo: {},
      username: '',
      modalVisible: false,
      checkingEns: false,
      registerMethod: '',
      showEthAddressUsed: false,
      payTokenForm: {
        chain: '',
        address: '',
        token: '',
        amount: 0,
      },
      selectedToken: {},
      selectedBalance: '',
      payLoading: false,
      showNoEnsTip: false,
      selectedEns: null
    }
  },
  mounted() {
    let loginInfo = Cookie.get('account-auth-info');
    if (loginInfo) {
      this.pendingAccount = loginInfo
      this.setTimer(() => {
        randomWallet().then(wallet => this.wallet = wallet)
        createKeypair().then(pair => this.pair = pair)
      }, 200);
      this.authStep = 'select'
    }
  },
  beforeUnmount() {
    Cookie.remove('account-auth-info');
  },
  unmounted() {
    Cookie.remove('account-auth-info');
  },
  computed: {
    ...mapState(['referee', 'idType']),
    // ...mapGetters(['getPrivateKey'])
  },
  methods: {
    formatAmount,
    selectChain(chain){
      this.payTokenForm.chain = chain
    },
    selectAddress(address) {
      this.payTokenForm.address = address
    },
    selectToken(token) {
      this.selectedToken = token;
      this.payTokenForm.token = token.address;
    },
    selectAmount(amount) {
      this.payTokenForm.amount = amount
      this.payTokenForm.emoji = null;
    },
    // pay asset to register
    async send() {
      try{
        this.payLoading = true
        const hash = await sendAssetTo(GateFeeAddress, EVM_CHAINS[this.selectedChainName].gateAmount)
        this.identityInfo.type = 'payToken'
        this.identityInfo.chain = this.selectedChainName
        this.identityInfo.assetId = hash
        await this.connectMetamask()
      } catch(e) {
        console.log(333, e)
        notify({message: this.$t('err.transErr'), type: 'error'})
      } finally {
        this.payLoading = false
      }
    },
    replaceEmptyImg(e) {
      e.target.src = emptyAvatar;
    },
    showNotify(message, duration, type) {
      notify({message, duration, type})
    },
    openDonut() {
      window.open('https://bitip.social', '_blank')
    },
    async login() {
      const timeoutTip = this.$t('err.loginTimeout')
      this.$gtag.event('login', {
        method: 'login'
      })
      try {
        let isIOS = navigator.userAgent.toUpperCase().indexOf('IPHONE') >= 0
        let isAndroid = navigator.userAgent.toUpperCase().indexOf('ANDROID') >= 0

        console.log(navigator.userAgent);
        const source = this.$route.query?.utm_source

        this.loging = true
        let needLogin = false
        if (isIOS && (source === "tokenpocket" || (navigator.userAgent.indexOf('TokenPocket_iOS') >= 0))) {
          console.log('token pocket');
        }
        if (isAndroid || isIOS) {
          needLogin = true;
          // const res = await twitterAuth(true);
          // window.location.href = res;
          // return;
        }

        const res = await twitterAuth({needLogin, referee: this.referee});
        const params = res.split('?')[1].split('&')
        let state;
        for (let p of params) {
          const [key, value] = p.split('=');
          if (key === 'state') {
            state = value;
            break;
          }
        }
        if (isIOS || isAndroid) {
          setTimeout(() => {
            window.location.href = res
          });
        }else {
          setTimeout(() => {
            window.open(res, 'newwindow', 'height=700,width=500,top=0,left=0,toolbar=no,menubar=no,resizable=no,scrollbars=no,location=no,status=no')
          })
        }

        await sleep(1)
        randomWallet().then(wallet => this.wallet = wallet)
        createKeypair().then(pair => this.pair = pair)
        await sleep(5)

        let count = 0;
        let userInfo = await twitterLogin(state)
        if (userInfo.code === 1) {
          while(count < 80) {
            userInfo = await twitterLogin(state)
            if (userInfo.code === 0) {
              // not registry
              // store auth info
              console.log('not register')
              Cookie.set('account-auth-info', JSON.stringify(userInfo.account), '180s')
              this.pendingAccount = userInfo.account
              this.authStep = 'select';
              return;
            }else if (userInfo.code === 3) { // log in
              if (!userInfo.account.ethAddress)  {
                console.log('bond eth')
                Cookie.set('account-auth-info', JSON.stringify(userInfo.account), '180s')
                this.pendingAccount = userInfo.account
                this.authStep = 'select'
                return
              }
              this.$store.commit('saveAccountInfo', userInfo.account)
              this.$bus.emit('login')
              this.$emit('close')
              return;
            }
            count++;
            await sleep(1)
          }
          // time out
          this.showNotify(timeoutTip, 5000, 'error')
          return;
        }else {
          if (userInfo.code === 0) {
            // not registry
            // store auth info
            console.log('not register')
            Cookie.set('account-auth-info', JSON.stringify(userInfo.account), '1800s')
            this.pendingAccount = userInfo.account
            this.authStep = 'select';
          }else if (userInfo.code === 3) { // log in
            if (!userInfo.account.ethAddress)  {
                console.log('bond eth')
                Cookie.set('account-auth-info', JSON.stringify(userInfo.account), '180s')
                this.pendingAccount = userInfo.account
                this.authStep = 'select'
                return
              }
            this.$store.commit('saveAccountInfo', userInfo.account)
            this.$bus.emit('login')
            this.$emit('close')
          }
        }
      }catch(e) {
        // login error
        this.showNotify(e.toString(), 5000, 'error')
      }finally {
        this.loging = false
      }
    },
    async createNewAddress() {
      if (Object.keys(this.wallet).length == 0) {
        this.wallet = await randomWallet()
      }
      this.authStep = 'create'
    },
    async connectMetamask() {
      try {
        this.connecting = true
        const acc = await connectMetamask();
        this.walletAddress = ethers.utils.getAddress(acc[0])
        this.authStep = 'metamask'
      }catch(e) {
        console.log('connect metamask fail', e);
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
