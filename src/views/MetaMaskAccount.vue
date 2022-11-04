<template>
  <div class="w-full h-full overflow-auto">
    <div class="lg:p-3rem p-2rem max-w-40rem mx-auto">
      <template v-if="step===0">
        <div v-if="isRegister"
             class="text-white light:text-blueDark">
          <div class=" keep-all c-text-black text-2rem leading-2.8rem max-w-30rem mx-auto mb-2rem">
            {{$t('metamaskView.p3')}}
          </div>
          <div class="text-left font-bold">{{$t('metamaskView.address')}}</div>
          <div class="flex items-center bg-inputBg
                    light:bg-colorF2 light:border-1 gradient-border
                    py-1rem lg:px-6rem px-2rem
                    max-w-50rem mx-auto rounded-12px c-text-bold
                    text-1rem lg:leading-2rem leading-1.6rem mb-2rem">
            {{ address }}
          </div>
          <div class="flex justify-center max-w-41rem mx-auto
                    light:bg-color62/10 light:p-1rem light:text-color62 light:rounded-12px">
            <div class="max-w keep-all text-left text-12px leading-20px md:text-0.9rem md:leading-1.2rem">
              {{$t('metamaskView.p4', {account: '@pipi'})}}
            </div>
          </div>
          <button class="c-text-black w-full gradient-btn h-2.8rem px-2.5rem mx-auto rounded-full text-1rem mt-1.25rem"
                  @click="step=2">
            {{$t('verifyView.btn2')}}
          </button>
          <button class="c-text-black w-full border-1 border-primaryColor h-2.8rem px-2.5rem mx-auto rounded-full text-1rem mt-1.25rem">
            {{$t('metamaskView.btn3')}}
          </button>
        </div>
        <div v-else
             class="text-white light:text-blueDark">
          <div class=" keep-all c-text-black text-1rem leading-1.8rem max-w-30rem mx-auto mb-2rem">
            {{$t('metamaskView.p1')}}
          </div>
          <div class="flex items-center bg-inputBg
                    light:bg-colorF2 light:border-1 gradient-border
                    py-1rem lg:px-6rem px-2rem
                    max-w-50rem mx-auto rounded-12px c-text-bold
                    text-1rem lg:leading-2rem leading-1.6rem mb-2rem">
            {{ address }}
          </div>
          <div class="flex justify-center max-w-41rem mx-auto
                    light:bg-color62/10 light:p-1rem light:text-color62 light:rounded-12px">
            <div class="max-w keep-all text-left text-12px leading-20px md:text-0.9rem md:leading-1.2rem">
              {{$t('metamaskView.p2')}}
            </div>
          </div>
          <button class="c-text-black gradient-btn h-2.8rem px-2.5rem mx-auto rounded-full text-1rem mt-1.25rem"
                  @click="step=1">
            {{$t('metamaskView.btn1')}}
          </button>
        </div>
      </template>
      <div v-if="step===1"
           class="text-white light:text-blueDark max-w-20rem mx-auto sm:max-w-25rem sm:mx-auto">
        <div class="keep-all c-text-black text-2rem mb-1rem leading-2.9rem text-left sm:text-center">
          <span class="text-primaryColor ">{{$t('verifyView.p3')}}</span> <br class="sm:hidden">
          {{$t('verifyView.p4')}}
        </div>
        <button class="flex items-center justify-center c-text-black gradient-btn
                       h-3.6rem w-full rounded-full
                       w-full mb-2.3rem text-1rem mt-1.25rem"
                @click="step=2">
          {{$t('verifyView.btn2')}}
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
    </div>
  </div>
</template>

<script>
import { onCopy } from "@/utils/tool";

export default {
  name: "MetaMaskAccount",
  props: {
    address: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isRegister: true,
      step: 0
    }
  },
  methods: {
    onCopy,
    async send() {
    }
  },
  mounted () {
  },
}
</script>

<style scoped lang="scss">
</style>
