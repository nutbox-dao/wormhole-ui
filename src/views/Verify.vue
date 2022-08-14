<template>
  <div class="w-full h-full overflow-auto">
    <div class="lg:p-3rem p-2rem max-w-40rem mx-auto">
      <div class="text-white" v-if="!showRegisterModal">
        <div class=" keep-all c-text-black text-2rem max-w-30rem mx-auto mb-2rem">
          {{$t('verifyView.p1')}}
        </div>
        <div class="flex items-center bg-inputBg py-1rem lg:px-6rem px-2rem max-w-50rem mx-auto rounded-12px c-text-bold text-1rem lg:leading-2rem leading-1.6rem mb-2rem">
          {{ ethAccount.privateKey }}
          <img class="w-1.3rem h-1.3rem ml-1rem cursor-pointer"
               @click="onCopy(ethAccount.privateKey)"
               src="~@/assets/icon-copy.svg" alt="">
        </div>
        <div class="flex justify-center max-w-41rem mx-auto">
<!--          <div class="leading-1.5rem flex item-center mr-1rem">-->
<!--            <img class="w-1.1rem h-1.1rem min-w-1.1rem my-0.2rem" src="~@/assets/icon-warning.svg" alt="">-->
<!--          </div>-->
          <div class="max-w keep-all text-color8B text-left text-12px leading-20px md:text-0.9rem md:leading-1.2rem">
            {{$t('verifyView.p2')}}
          </div>
        </div>
        <!-- <div class="flex justify-start items-center mt-1.5rem max-w-41rem mx-auto">
          <el-checkbox v-model="checked" size="lg" class="c-checkbox" />
          <div class="c-text-black text-1.5rem leading-1.5rem underline ml-1rem cursor-pointer" @click="checked=true">
            Ok, I saved it.
          </div>
        </div> -->
        <button class="c-text-black gradient-btn h-2.8rem px-1.5rem mx-auto rounded-full text-1rem mt-1.25rem"
                @click="importModal = true">
          {{$t('verifyView.btn1')}}
        </button>
      </div>
      <div class="text-white" v-else>
        <div class="keep-all c-text-black text-2rem max-w-20rem mx-auto sm:max-w-30rem sm:mx-auto mb-2.3rem leading-2.9rem text-left sm:text-center">
          <span class="text-primaryColor ">{{$t('verifyView.p3')}}</span> <br class="sm:hidden">
          {{$t('verifyView.p4')}}
        </div>
        <button class="flex items-center justify-center c-text-black gradient-btn h-2.8rem px-1.5rem mx-auto rounded-full w-full max-w-12rem mb-2.3rem text-1rem mt-1.25rem"
                @click="attachKeyToServer" :disabled="attachServer">
          <c-spinner class="w-2.4rem h-2.4rem ml-1rem" v-show="attachServer"></c-spinner>
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
               custom-class="c-dialog c-dialog-lg c-dialog-center c-dialog-no-bg rounded-12px">
      <div class="w-full gradient-border gradient-border-color3 border-2px rounded-12px">
        <div class="import-box text-center">
          <div class="px-3rem pt-2.3rem pb-1.6rem">
            <div class="c-text-black text-1.4rem text-white">
              {{$t('verifyView.p7')}}
            </div>
            <div class="gradient-border gradient-border-color3 border-2px rounded-12px overflow-hidden my-1.2rem">
              <div class="key-box">
                <div class="gradient-text max-w-25rem mx-auto py-15px font-bold text-center text-14px leading-26px md:text-1rem md:leading-1.3rem">
                  {{ ethAccount.privateKey }}
                </div>
              </div>
            </div>
            <div class="text-0.9rem font-bold text-white">
              {{$t('verifyView.p8')}}
            </div>
          </div>
          <div class="bg-black py-1.6rem rounded-b-12px">
            <button class="gradient-btn gradient-btn-purple h-2.7rem w-12rem rounded-full"
                    @click="importModal=false">
              {{$t('verifyView.btn3')}}
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

export default {
  name: "Verify",
  props: {
    ethAccount: {
      type: Object,
      default: {}
    },
  },
  data() {
    return {
      checked: false,
      attachServer: false,
      showRegisterModal: false,
      importModal: false
    }
  },
  methods: {
    onCopy,
    showNotify(message, duration, type) {
        notify({message, duration, type})
    },
    async attachKeyToServer() {
      try{
        this.attachServer = true
        const pair = createKeypair()
        const pwd = box(generateSteemAuth(this.ethAccount.privateKey), SendPwdServerPubKey, pair.privateKey)
        await cacheKey({
          ethAddress: this.ethAccount.ethAddress,
          pwd,
          publicKey: pair.publicKey
        })
        this.$emit('send')
      } catch (e) {
        this.showNotify('Pre bind account fail', 5000, 'error')
      } finally {
        this.attachServer = false
      }
    }
  },
  mounted () {
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
