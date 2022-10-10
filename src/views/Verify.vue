<template>
  <div class="w-full h-full overflow-auto">
    <div class="lg:p-3rem p-2rem max-w-40rem mx-auto">
      <div class="text-white light:text-blueDark" v-if="!showRegisterModal">
        <div class=" keep-all c-text-black text-2rem leading-2.8rem max-w-30rem mx-auto mb-2rem">
          {{$t('verifyView.p1')}}
        </div>
        <div class="flex items-center bg-inputBg
                    light:(bg-colorF2 border-1) gradient-border
                    py-1rem lg:px-6rem px-2rem
                    max-w-50rem mx-auto rounded-12px c-text-bold
                    text-1rem lg:leading-2rem leading-1.6rem mb-2rem">
          {{ ethAccount.privateKey }}
          <img class="w-1.3rem h-1.3rem ml-1rem cursor-pointer"
               @click="onCopy(ethAccount.privateKey)"
               src="~@/assets/icon-copy-primary.svg" alt="">
        </div>
        <div class="flex justify-center max-w-41rem mx-auto light:(bg-color62/10 p-1rem text-color62 rounded-12px)">
<!--          <div class="leading-1.5rem flex item-center mr-1rem">-->
<!--            <img class="w-1.1rem h-1.1rem min-w-1.1rem my-0.2rem" src="~@/assets/icon-warning.svg" alt="">-->
<!--          </div>-->
          <div class="max-w keep-all text-left text-12px leading-20px md:text-0.9rem md:leading-1.2rem">
            {{$t('verifyView.p2')}}
          </div>
        </div>
        <!-- <div class="flex justify-start items-center mt-1.5rem max-w-41rem mx-auto">
          <el-checkbox v-model="checked" size="lg" class="c-checkbox" />
          <div class="c-text-black text-1.5rem leading-1.5rem underline ml-1rem cursor-pointer" @click="checked=true">
            Ok, I saved it.
          </div>
        </div> -->
        <button class="c-text-black gradient-btn h-2.8rem px-2.5rem mx-auto rounded-full text-1rem mt-1.25rem"
          @click="importModal=true">
          {{$t('verifyView.btn1')}}
        </button>
      </div>
      <div class="text-white light:text-blueDark max-w-20rem mx-auto sm:max-w-25rem sm:mx-auto" v-else>
        <div class="keep-all c-text-black text-2rem mb-1rem leading-2.9rem text-left sm:text-center">
          <span class="text-primaryColor ">{{$t('verifyView.p3')}}</span> <br class="sm:hidden">
          {{$t('verifyView.p4')}}
        </div>
        <span v-show="false" style="word-break: break-word">{{$t('ref.refereeCode')}}</span>
        <input v-show="false" class="bg-inputBg light:bg-colorF1 gradient-border border-1
                      h-3.6rem w-full rounded-full
                      px-1.6rem outline-none text-1.2rem mt-0.6rem mb-0.6rem"
               type="text"
               v-model="newReferee"
               :placeholder="$t('ref.inputReferee')">
        <span v-show="false" style="word-break: break-word">{{$t('ref.refDes')}}</span>
        <button class="flex items-center justify-center c-text-black gradient-btn
                       h-3.6rem w-full rounded-full
                       w-full mb-2.3rem text-1rem mt-1.25rem"
                @click="send">
          {{$t('verifyView.btn2')}}
        </button>

        <div class="flex justify-center max-w-41rem mx-auto">
          <div class="max-w keep-all text-left">
            {{$t('verifyView.p5')}}
          </div>
        </div>

        <router-link to="/login">
          <div class="c-text-black text-15px leading-24px 2xl:text-1rem 2xl:leading-1.5rem underline">
            {{$t('verifyView.p6')}}
          </div>
        </router-link>
      </div>
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
                  {{ ethAccount.privateKey }}
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
                    @click="attachKeyToServer" :disabled="!checked || attachingServer">
              {{$t('verifyView.btn3')}}
              <c-spinner class="w-1.6rem h-1.6rem ml-1rem" v-show="attachingServer"></c-spinner>
            </button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { cacheKey } from '@/api/api'
import { generateBrainKey } from '@/utils/ethers'
import { box, createKeypair } from '@/utils/tweet-nacl'
import { SendPwdServerPubKey } from '@/config'
import { notify } from "@/utils/notify";
import { onCopy } from "@/utils/tool";
import { generateSteemAuth } from '@/utils/steem'
import { sleep } from '@/utils/helper'

export default {
  name: "Verify",
  props: {
    ethAccount: {
      type: Object,
      default: {}
    },
    referee: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      checked: false,
      attachingServer: false,
      showRegisterModal: false,
      importModal: false,
      newReferee: ''
    }
  },
  methods: {
    onCopy,
    showNotify(message, duration, type) {
        notify({message, duration, type})
    },
    async attachKeyToServer() {
      try{
        this.attachingServer = true
        const pair = createKeypair()
        const pwd = box(generateSteemAuth(this.ethAccount.privateKey), SendPwdServerPubKey, pair.privateKey)
        await cacheKey({
          ethAddress: this.ethAccount.ethAddress,
          pwd,
          publicKey: pair.publicKey
        })
        this.importModal=false;
        this.showRegisterModal=true
      } catch (e) {
        console.log(25, e);
        this.showNotify('Pre bind account fail', 5000, 'error')
      } finally {
        this.attachingServer = false
      }
    },
    async send() {
      try{
        if (this.newReferee.length > 0) {
          if (this.newReferee.trim().match(/^[0-9]+$/)) {

          }else {
            this.showNotify(this.$t('ref.wrongReferee'), 5000, 'error')
            return;
          }
        }
        this.$emit('send', this.newReferee.trim())
      } catch (e) {
       
      } finally {
      }
    }
  },
  mounted () {
    this.newReferee = this.referee ?? ''
    this.showRegisterModal = false
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
