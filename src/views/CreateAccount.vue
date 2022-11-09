<template>
  <div class="w-full h-full overflow-auto">
    <div class="lg:p-3rem p-2rem max-w-40rem mx-auto">
      <div v-if="step===0"
           class="text-white light:text-blueDark">
        <div class=" keep-all c-text-black text-2rem leading-2.8rem max-w-30rem mx-auto mb-2rem">
          {{$t('verifyView.p1')}}
        </div>
        <div class="flex items-center bg-inputBg
                    light:bg-colorF2 light:border-1 gradient-border
                    py-1rem lg:px-6rem px-2rem
                    max-w-50rem mx-auto rounded-12px c-text-bold
                    text-1rem lg:leading-2rem leading-1.6rem mb-2rem">
          {{ wallet && wallet.nemonic }}
          <img class="w-1.3rem h-1.3rem ml-1rem cursor-pointer"
               @click="onCopy(wallet.nemonic)"
               src="~@/assets/icon-copy-primary.svg" alt="">
        </div>
        <div class="flex justify-center max-w-41rem mx-auto
                    light:bg-color62/10 light:p-1rem light:text-color62 light:rounded-12px">
          <div class="max-w keep-all text-left text-12px leading-20px md:text-0.9rem md:leading-1.2rem">
            {{$t('verifyView.p2')}}
          </div>
        </div>
        <button class="c-text-black gradient-btn h-2.8rem px-2.5rem mx-auto rounded-full text-1rem mt-1.25rem"
          @click="importModal=true">
          {{$t('verifyView.btn1')}}
        </button>
      </div>
    </div>
    <div v-if="step===1"
          class="text-white light:text-blueDark max-w-20rem mx-auto sm:max-w-25rem sm:mx-auto">
      <div class="keep-all c-text-black text-2rem mb-1rem leading-2.9rem text-left sm:text-center">
        <span class="text-primaryColor ">{{$t('verifyView.p3')}}</span> <br class="sm:hidden">
        {{$t('verifyView.p4')}}
      </div>
      <button class="flex items-center justify-center c-text-black gradient-btn
                      h-3.6rem w-full rounded-full
                      w-full mb-2.3rem text-1rem mt-1.25rem"
              :disabled="isSigningup"
              @click="signup">
        {{$t('verifyView.btn2')}}
        <c-spinner class="w-1.5rem h-1.5rem ml-0.5rem" v-show="isSigningup"></c-spinner>
      </button>
    </div>
    <div v-if="step===2"
          class="text-white light:text-blueDark max-w-20rem mx-auto sm:max-w-25rem sm:mx-auto">
      <div class="keep-all c-text-black text-2rem mb-1rem leading-2.9rem text-left sm:text-center">
        <span class="text-primaryColor ">{{$t('verifyView.p9')}}</span> <br class="sm:hidden">
        {{$t('verifyView.p10')}}
      </div>
      <button class="flex items-center justify-center c-text-black gradient-btn
                      h-3.6rem w-full rounded-full
                      w-full mb-1.3rem text-1rem mt-1.25rem"
              @click="send">
        {{$t('verifyView.btn4')}}
      </button>
      <button class="c-text-black h-3.6rem w-full border-1 border-primaryColor rounded-full
                      w-full mb-2.3rem text-1rem"
              @click="$emit('skip')">
        {{$t('verifyView.btn5')}}
      </button>
    </div>
    <el-dialog :destroy-on-close="true" :append-to-body="true" v-model="importModal"
               custom-class="c-dialog c-dialog-lg c-dialog-center c-dialog-no-bg">
      <div class="w-full gradient-border gradient-border-color3 border-2px rounded-12px overflow-hidden">
        <div class="import-box text-center">
          <div class="px-3rem pt-2.3rem pb-1.6rem">
            <div class="c-text-black text-1.4rem text-white light:text-blueDark">
              {{$t('verifyView.p7')}}
            </div>
            <div class="gradient-border gradient-border-color3 border-2px rounded-12px overflow-hidden my-1.2rem">
              <div class="key-box">
                <div class="gradient-text max-w-25rem mx-auto py-15px px-20px font-bold text-center text-14px leading-26px md:text-1rem md:leading-1.3rem">
                  {{ wallet && wallet.nemonic }}
                </div>
              </div>
            </div>
            <div class="flex justify-center items-start mt-1.5rem max-w-41rem mx-auto">
              <el-checkbox v-model="checked"  class="c-checkbox"/>
              <div class="flex-1 text-0.9rem font-bold text-white light:text-blueDark text-left ml-8px" style="word-break: break-word">
                {{$t('verifyView.p8')}}
              </div>
            </div>
          </div>
          <div class="bg-black light:bg-color62/30 py-1.6rem rounded-b-12px flex justify-center items-center">
            <button class="gradient-btn gradient-btn-purple h-2.7rem w-14rem rounded-full flex justify-center items-center"
                    @click="step=1;importModal=false">
              {{$t('verifyView.btn3')}}
            </button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { register, check } from '@/api/api'
import { randomWallet } from '@/utils/ethers'
import { box, createKeypair } from '@/utils/tweet-nacl'
import { SendPwdServerPubKey } from '@/config'
import { notify } from "@/utils/notify";
import { onCopy } from "@/utils/tool";
import { generateSteemAuth } from '@/utils/steem'
import Cookie from 'vue-cookies'
import { mapState } from 'vuex'
import { sleep } from '@/utils/helper'

export default {
  name: "CreateAccount",
  props: {
    wallet: {
      type: Object,
      default: {}
    },
    pair: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      checked: false,
      step: 0,
      importModal: false,
      isSigningup: false
    }
  },
  computed: {
    ...mapState(['referee'])
  },
  methods: {
    onCopy,
    showNotify(message, duration, type) {
        notify({message, duration, type})
    },
    async signup() {
      console.log('signup');
      this.isSigningup = true
      let loginInfo = Cookie.get('account-auth-info');
      Cookie.remove('account-auth-info');
      if (loginInfo) {
        try {
          let pair = this.pair
          await sleep(0.6);
          if (!pair && !pair.privateKey) {
            pair = await createKeypair();
          }
          const pwd = box(generateSteemAuth(this.wallet.privateKey), SendPwdServerPubKey, pair.privateKey)
          const { accessToken, twitterId } = loginInfo;
          let params = {
            accessToken,
            twitterId,
            referee: this.referee,
            sendPubKey: pair.publicKey,
            pwd,
            ethAddress: this.wallet.address,
            isMetamask: 0
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
        this.showNotify(this.$t('signUpView.notAuth'), 5000, 'error')
        this.step = 0
        this.$emit('back');
      }
    },
    send() {
      // go to send twitter
      this.$emit('skip')
    }
  },
  async mounted () {
    console.log(4,this.pair);
    if (!this.wallet && !this.wallet.address) {
      await sleep(0.6);
      randomWallet().then(wallet => this.wallet = wallet)
    }
  },
}
</script>

<style scoped lang="scss">
.tip-block {
  background-image: linear-gradient(to right, var(--gradient-primary-color1), var(--gradient-primary-color2));
}
.keep-all {
  word-break: keep-all;
}
.import-box {
  background-image: url("~@/assets/modal-bg2.svg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  .key-box {
    background: linear-gradient(99.51deg, #CBBEE7 9.03%, #FFFFFF 89.53%);
    .gradient-text {
      background-image: linear-gradient(94.28deg, #812DE2 0%, #3A49F9 100%);
    }
  }
}
</style>
