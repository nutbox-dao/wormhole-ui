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
    <div v-else-if="authStep === 'connectBtc'">
      <div class="flex justify-center items-center flex-col">
        <div class="c-text-black break-word text-1.8rem leading-2.3rem gradient-text bg-purple-white light:bg-text-color17 mx-auto mt-1.4rem mb-1rem">
          {{$t('signUpView.p3')}}
        </div>
        <div class="c-text-black break-word text-1.2rem gradient-text bg-purple-white light:bg-text-color17 mx-auto py-3">
          {{$t('signUpView.p4')}}
        </div>

        <button @click="connectUnisat" :disabled="connecting"
              class="c-text-black gradient-btn h-3.6rem max-h-65px w-22rem mx-auto rounded-full text-1rem mt-1.25rem
                      flex justify-center items-center">
          <img class="w-1.7rem mr-1rem" src="~@/assets/icon-unisat.svg" alt="">
          <span class="">{{$t('signUpView.unisat')}}</span>
          <c-spinner class="w-1.5rem h-1.5rem ml-0.5rem" v-show="connecting"></c-spinner>
        </button>
        <div class="mx-auto my-3 text-1rem">
          <span class="break-word gradient-text bg-purple-white light:bg-text-color17 ">
            {{$t('signUpView.p5')}}
          </span>
          <span @click="openDonut" class="text-primaryColor">
            Mint
          </span>
        </div>
      </div>
    </div>
    <div v-else-if="authStep === 'choseRegisterMethod'">
      <div>
        <div class="">{{ $t('signUpView.registerRequire') }}</div>
        <div class="flex flex-col items-center gap-4 mt-1.5rem">
          <div class="w-full">
            <button class="w-full max-w-300px h-48px font-bold text-16px border-1 gradient-border rounded-full
                           hover:shadow-none"
                    @click="choseEns">
              <div class="flex justify-center align-center items-center">
                <span>
                  I have ENS
                </span>
                <c-spinner class="w-1.5rem h-1.5rem ml-0.5rem" v-show="checkingEns"></c-spinner>
              </div>     
            </button>
          </div>
          <button class="w-full max-w-300px h-48px font-bold text-16px border-1 gradient-border rounded-full
                         hover:shadow-none"
                  @click="onChoseRegisterMethod('payToken')">Pay crypto currency</button>
          <button class="w-full max-w-300px h-48px font-bold text-16px border-1 gradient-border rounded-full
                         hover:shadow-none"
                  @click="onChoseRegisterMethod('bitIp')">I have BitIP</button>
        </div>
      </div>
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
    <el-dialog :destroy-on-close="true" :model-value="modalVisible"
              v-if="authStep === 'choseRegisterMethod'"
               :close-on-click-modal="false" append-to-body
               class="c-dialog c-dialog-center max-w-34rem bg-glass border-1 border-color84/30 rounded-1.6rem">
      <div class="absolute top-0 right-0 w-max p-1rem z-1" @click="modalVisible=false">
        <i class="w-1.2rem h-1.2rem icon-close"></i>
      </div>
      <div v-if="registerMethod==='payToken'"
           class="px-5 flex justify-center items-center flex-col min-h-30vh">
        <div class="mb-1.8rem mt-1rem w-full">
          <div class="font-bold mb-10px">{{$t('curation.network')}}</div>
          <div class="bg-black/40 border-1 border-color8B/30
                      light:bg-white light:border-colorE3 flex items-center
                      rounded-8px overflow-hidden h-44px 2xl:h-2.1rem">
            <CustomSelect v-model="selectedChainName"
                          @change="connectWallet(selectedChainName)">
              <template #prefix>
                <!-- chain logo -->
                <img v-if="EVM_CHAINS[selectedChainName]"
                    class="w-24px min-w-24px h-24px min-h-24px rounded-full mr-15px"
                    :src="EVM_CHAINS[selectedChainName]?.main.icon" alt="">
              </template>
              <template #options>
                <div class="bg-blockBg light:bg-white border-1 border-color8B/30
                              light:border-colorE3 rounded-8px overflow-hidden">
                  <el-option v-for="item of Object.keys(EVM_CHAINS)" :key="item"
                            class="py-5px px-12px h-min"
                            :value="item">
                    <template #default>
                      <div class="flex items-center ">
                        <span class="min-w-24px min-h-24px">
                          <img class="w-24px h-24px rounded-full mr-15px"
                              :src="EVM_CHAINS[item]?.main.icon" alt="">
                        </span>
                        <span>{{item}}</span>
                      </div>
                    </template>
                  </el-option>
                </div>
              </template>
            </CustomSelect>
          </div>
          <div class="flex justify-end mt-3">
            Balance: {{ formatAmount(selectedBalance.toString() / 1e18) }}
          </div>
        </div>
        <div class="w-full flex items-center justify-center gap-x-1rem">
          <button class="gradient-btn flex items-center justify-center
                     h-44px 2xl:h-2.2rem w-full rounded-full text-16px 2xl:text-0.8rem"
                  @click="send"
                  :disabled="!EVM_CHAINS[selectedChainName] || payLoading || showEthAddressUsed">
            Pay {{ EVM_CHAINS[selectedChainName] ? EVM_CHAINS[selectedChainName].gateAmount / 1e18 + ' ' + EVM_CHAINS[selectedChainName].main.symbol : '' }}
            <c-spinner v-show="payLoading" class="w-1.5rem h-1.5rem ml-0.5rem" color="#6246EA"></c-spinner>
          </button>
        </div>
        <div v-if="showEthAddressUsed" class="w-full text-redColor mt-3 flex justify-end">
          <div class="flex items-start mb-2rem">
            <img class="mr-10px w-1.3rem xl:mt-3px" src="~@/assets/icon-warning-primary.svg" alt="">
            <div class="whitespace-pre-line text-left text-color8B light:text-color46 font-bold text-0.8rem leading-1.3rem"
                 style="word-break: break-word"
                 v-html="$t('metamaskView.p3', {account: `<strong class='text-color62 c-text-black'>${username}</strong>`})">
            </div>
          </div>
        </div>
      </div>
      <div v-if="registerMethod==='bitIp'" class="flex justify-center items-center flex-col min-h-40vh">
        <div class="c-text-black break-word text-1.8rem leading-2.3rem gradient-text bg-purple-white light:bg-text-color17 mx-auto mt-1.4rem mb-1rem">
          {{$t('signUpView.p6')}}
        </div>
        <div class="flex flex-wrap w-full space-x-5">
          <button @click="choseBitip(bitip)" v-for="bitip of bitips" :key="bitip.iid" :disabled="connecting"
                  class="c-text-black gradient-btn max-h-65px rounded-full text-1rem mt-1.25rem
                      flex justify-center items-center py-0.5rem px-1rem">
            <span class="">{{ bitip.content }}</span>
          </button>
        </div>

        <div v-show="bitips.length == 0" class="mx-auto my-3 text-1rem">
          <span class="break-word gradient-text bg-purple-white light:bg-text-color17 ">
            {{$t('signUpView.p5')}}
          </span>
          <span @click="openDonut" class="text-primaryColor">
            Mint
          </span>
        </div>
      </div>
    </el-dialog>
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
      authStep: 'select',
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
      // if (loginInfo.wallet) {
      //   this.wallet = loginInfo.wallet;
      // }
      // if (loginInfo.pair) {
      //   this.pair = loginInfo.pair
      // }
      // this.authStep = 'choseRegisterMethod';
      
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
    onChoseRegisterMethod(method) {
      this.$store.commit('saveIdType', method)
      this.registerMethod = method
      this.modalVisible = true
      accountChanged(async acc => {
        const b = await getBalanceOfUser(this.walletAddress)
        this.selectedBalance = b
        const account = await getUserByEth(this.account);
        if (account && account.code === 3){
          // registred
          this.showEthAddressUsed = true
          this.username = account.account.twitterUsername
          return;
        }else {
          this.showEthAddressUsed = false
        }
      })
    },
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
    async choseEns() {
      try{
        this.checkingEns = true
        this.$store.commit('saveIdType', 'ens')
        await this.connectMetamask()
      } catch(e) {
        console.log('chose ens fail', e)
      } finally {
        this.checkingEns = false
      }
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
              this.authStep = 'choseRegisterMethod';
              return;
            }else if (userInfo.code === 3) { // log in
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
            Cookie.set('account-auth-info', JSON.stringify(userInfo.account), '180s')
            this.pendingAccount = userInfo.account
            this.authStep = 'choseRegisterMethod';
          }else if (userInfo.code === 3) { // log in
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
    async connectUnisat() {
      try{
        this.connecting = true
        const acc = await cu()
        this.btcAddress = acc.btcAddress
        this.btcPubkey = acc.btcPubkey
        const bitips = await getUserBitip(acc.btcAddress)
        if (bitips.length == 0) {
          this.showNotify('You have none BitIPs, Please mint first', 3000, 'info')
          return
        }
        this.bitips = bitips
        this.authStep = 'choseRegisterMethod'
      } catch (e) {
        this.showNotify(e, 5000, 'error')
      } finally {
        this.connecting = false
      }
    },
    async choseBitip(bitip) {
      // check bitip
      this.$store.commit('saveIdType', 'bitip')
      const info = await checkRegistedIdentity('btc', 'bitip', bitip.content)
      if (info.twitterId) {
        this.showNotify('This identity had been registed', 3000, 'info')
        return;
      }
      this.identityInfo = {
        bitip: bitip.content,
        btcAddress: this.btcAddress,
        version: 1,
        datetime: Date.now()
      }
      const content = JSON.stringify(this.identityInfo, null, 4)
      const signature = await signMessage(content)
      this.identityInfo.signature = signature
      this.identityInfo.btcPubkey = this.btcPubkey
      this.identityInfo.chainName = 'btc'
      this.identityInfo.type = 'bitip'
      this.identityInfo.assetId = bitip.content

      this.authStep = 'select'
    },
    async connectWallet(chain) {
      if (this.connectLoading) {
        return
      }
      this.connectLoading = true
      try{
        const connected = await setupNetwork(chain)
        if (connected) {
          this.selectedChainName = chain;
          this.identityInfo.chainName = chain
          this.walletAddress = await getAccounts(true);
          const b = await getBalanceOfUser(this.walletAddress)
          this.selectedBalance = b
        }else {
          this.selectedChainName = null;
          this.walletAddress = null;
        }
      } catch (e) {
        console.log(e)
        this.selectedChainName = null
        this.walletAddress = null
        notify({message: 'Connect metamask fail', duration: 5000, type: 'error'})
      } finally {
        this.connectLoading = false
      }
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
