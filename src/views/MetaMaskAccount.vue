<template>
  <div class="w-full h-full overflow-auto">
    <div class="lg:p-3rem p-2rem max-w-40rem mx-auto">
      <template v-if="step===1">
        <div
             class="text-white light:text-blueDark">
          <div class=" keep-all c-text-black text-2rem leading-2.8rem max-w-30rem mx-auto mb-2rem">
           {{$t('metamaskView.p1')}}
          </div>
          <div class="flex items-center bg-inputBg
                    light:bg-colorF2 light:border-1 gradient-border
                    py-1rem lg:px-6rem px-2rem
                    max-w-50rem mx-auto rounded-12px c-text-bold
                    text-1rem lg:leading-2rem leading-1.6rem mb-2rem">
            {{ account }}
          </div>
          <template v-if="isRegister">
            <div class="max-w-41rem mx-auto light:bg-color62/10 light:p-1rem light:text-color62 light:rounded-12px">
              <div class="whitespace-pre-line mb-1rem">{{$t('metamaskView.p2')}}</div>
              <div class="max-w whitespace-pre-line text-center text-12px leading-20px md:text-0.9rem md:leading-1.2rem">
                {{$t('metamaskView.p3', {account: '@' + username})}}
              </div>
            </div>
            <button class="c-text-black w-full gradient-btn h-2.8rem px-2.5rem mx-auto rounded-full text-1rem mt-1.25rem"
                    @click="$emit('back')">
              {{$t('metamaskView.back')}}
            </button>
          </template>
          <template v-else>
            <div class="max-w-41rem mx-auto light:bg-color62/10 light:p-1rem light:text-color62 light:rounded-12px">
              <div class="whitespace-pre-line mb-1rem">{{$t('metamaskView.p2')}}</div>
            </div>
            <button class="c-text-black w-full gradient-btn h-2.8rem px-2.5rem mx-auto rounded-full text-1rem mt-1.25rem"
                    @click="confirm"
                    :disabled="isCheckingAddress || isSigning">
              {{$t('metamaskView.confirm')}}
              <c-spinner class="w-1.5rem h-1.5rem ml-0.5rem" v-show="isCheckingAddress || isSigning"></c-spinner>
            </button>
            <button class="c-text-black w-full border-1 border-primaryColor h-2.8rem px-2.5rem mx-auto rounded-full text-1rem mt-1.25rem"
                    @click="$emit('back')">
              {{$t('metamaskView.back')}}
            </button>
          </template>
        </div>
      </template>
      <div v-if="step===2"
           class="text-white light:text-blueDark max-w-20rem mx-auto sm:max-w-25rem sm:mx-auto">
        <div class="keep-all c-text-black text-2rem mb-1rem leading-2.9rem text-left  whitespace-pre-line">
          <span class="text-primaryColor ">{{$t('verifyView.p3')}}</span> <br>
          {{$t('verifyView.p4')}}
        </div>
        <template v-if="authError">
          <div class="text-redColor text-left">Error</div>
          <button class="flex items-center justify-center c-text-black gradient-btn
                      h-3.6rem w-full rounded-full
                      w-full mb-2.3rem text-1rem mt-1.25rem"
                  @click="$emit('back')">
            {{$t('verifyView.back')}}
          </button>
        </template>
        <button v-else class="flex items-center justify-center c-text-black gradient-btn
                      h-3.6rem w-full rounded-full
                      w-full mb-2.3rem text-1rem mt-1.25rem"
                :disabled="isSigningup"
                @click="signup">
          {{isSigningup?$t('verifyView.verifying'):$t('verifyView.verify')}}
          <c-spinner class="w-1.5rem h-1.5rem ml-0.5rem" v-show="isSigningup"></c-spinner>
        </button>
      </div>
      <div v-if="step===3"
           class="text-white light:text-blueDark max-w-20rem mx-auto sm:max-w-25rem sm:mx-auto">
        <div class="keep-all c-text-black text-2rem mb-1rem leading-2.9rem text-left sm:text-center">
          <span class="text-primaryColor ">{{$t('verifyView.p9')}}</span> <br class="sm:hidden">
          {{$t('verifyView.p10')}}
        </div>
        <button class="flex items-center justify-center c-text-black gradient-btn
                      h-3.6rem w-full rounded-full
                      w-full mb-1.3rem text-1rem mt-1.25rem"
                @click="send">
          {{$t('verifyView.postBtn')}}
        </button>
        <button class="c-text-black h-3.6rem w-full border-1 border-primaryColor rounded-full
                      w-full mb-2.3rem text-1rem"
                @click="$emit('skip')">
          {{$t('verifyView.skip')}}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { onCopy } from "@/utils/tool";
import { getUserByEth, register, check } from '@/api/api'
import { mapState } from 'vuex'
import { accountChanged } from '@/utils/web3/account'
import { signMessage } from '@/utils/web3/web3'
import { SignUpMessage, SendPwdServerPubKey } from '@/config'
import { ethers } from 'ethers'
import { bytesToHex } from '@/utils/code'
import { generateSteemAuth } from '@/utils/steem'
import { box, createKeypair } from '@/utils/tweet-nacl'
import { notify } from "@/utils/notify";
import Cookie from 'vue-cookies'

export default {
  name: "MetaMaskAccount",
  props: {
    address: {
      type: String,
      default: ''
    },
    pair: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      isRegister: false,
      step: 1,
      isCheckingAddress: false,
      username: '',
      isSigning: false,
      isSigningup: false,
      pwd: '',
      sendPubKey: '',
      salt: "",
      authError: false
    }
  },
  computed: {
    ...mapState('web3', ['account']),
    ...mapState(['referee'])
  },
  watch: {
    account(newValue, oldValue) {
      if (!this.isCheckingAddress)
        this.checkoutAccount()
    }
  },
  methods: {
    onCopy,
    async send() {
    },
    showNotify(message, duration, type) {
      notify({message, duration, type})
    },
    async confirm() {
      if(this.isRegister){
        this.$emit('back')
      }else {
        try{
          this.isSigning = true
          const sig = await signMessage(SignUpMessage, this.account)
          if (!sig) {
            this.showNotify(this.$t('tips.dismatchAddress'), 5000, 'error')
            return;
          }
          const salt = bytesToHex(ethers.utils.randomBytes(4))
          let pair = this.pair;
            await sleep(0.6);
          if (!pair.privateKey) {
            pair = await createKeypair();
          }
          const pwd = box(generateSteemAuth(sig.substring(2) + salt, this.account), SendPwdServerPubKey, pair.privateKey)
          this.pwd = pwd,
          this.salt = salt
          this.sendPubKey = pair.publicKey
          this.step = 2
        } catch (e) {
          console.log('sign message fail:', e);
        } finally {
          this.isSigning = false
        }
      }
    },
    async checkoutAccount() {
      try {
        this.isCheckingAddress = true
        const account = await getUserByEth(this.account);
        if (account && account.code === 3){
          // registred
          this.username = account.account.twitterUsername
          this.isRegister = true;
        }else {
          // not registred
          this.username = ''
          this.isRegister = false
        }

      } catch(e) {

      } finally {
        this.isCheckingAddress = false
      }
    },
    async signup() {
      console.log('signup');
      let loginInfo = Cookie.get('account-auth-info');
      Cookie.remove('account-auth-info');
      if (loginInfo) {
        try {
          this.isSigningup = true
          const { accessToken, twitterId } = loginInfo;
          let params = {
            accessToken,
            twitterId,
            referee: this.referee,
            sendPubKey: this.sendPubKey,
            pwd: this.pwd,
            ethAddress: this.account,
            isMetamask: 1,
            salt: this.salt
          }
          await register(params);
          // checkout register progress
          const res = await check({accessToken, twitterId})
          if (res && res.code === 3) {
            this.$store.commit('saveAccountInfo', res.account)
            // signup success
            this.step = 2;
          }
        }catch(e) {
          console.log(532, e);
        }finally {
          this.isSigningup = false
        }
      }else {
        // not authed
        // this.showNotify(this.$t('signUpView.notAuth'), 5000, 'error')
        // this.step = 0
        // this.$emit('back');
        this.authError = true
      }
    }
  },
  async mounted () {
    this.$store.commit('web3/saveAccount', this.address)
    this.checkoutAccount();
    accountChanged()
  },
}
</script>

<style scoped lang="scss">
</style>
