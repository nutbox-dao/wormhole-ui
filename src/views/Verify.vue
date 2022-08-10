<template>
  <div class="w-full h-full overflow-auto">
    <div class="lg:p-3rem p-2rem max-w-40rem mx-auto">
      <div class="text-white" v-if="!showRegisterModal">
        <div class=" keep-all c-text-black text-2rem max-w-30rem mx-auto mb-2rem">
          Below is the password
          to your new wallet:
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
            Please save this private key in a very secure location. We will never keep this key, so if you dont save it, nobody can find back this account.
          </div>
        </div>
        <!-- <div class="flex justify-start items-center mt-1.5rem max-w-41rem mx-auto">
          <el-checkbox v-model="checked" size="lg" class="c-checkbox" />
          <div class="c-text-black text-1.5rem leading-1.5rem underline ml-1rem cursor-pointer" @click="checked=true">
            Ok, I saved it.
          </div>
        </div> -->
        <button class="c-text-black gradient-btn h-2.8rem px-1.5rem mx-auto rounded-full text-1rem mt-1.25rem"
                @click="showRegisterModal = true">
          Ok, I saved it.
        </button>
      </div>
      <div class="text-white" v-else>
        <div class="keep-all c-text-black text-2rem max-w-20rem mx-auto sm:max-w-30rem sm:mx-auto mb-2.3rem leading-2.9rem text-left sm:text-center">
          <span class="text-primaryColor ">Great,</span> <br class="sm:hidden">
          now let's verify your Twitter handle
        </div>
        <button class="flex items-center justify-center c-text-black gradient-btn h-2.8rem px-1.5rem mx-auto rounded-full w-full max-w-12rem mb-2.3rem text-1rem mt-1.25rem"
                @click="attachKeyToServer" :disabled="attachServer">
          <c-spinner class="w-2.4rem h-2.4rem ml-1rem" v-show="attachServer"></c-spinner>
          Go to bind
        </button>

        <div class="flex justify-center max-w-41rem mx-auto">
          <div class="max-w keep-all text-left">
            After you've tweeted the bind message
          </div>
        </div>

        <router-link to="/login">
          <div class="c-text-black text-15px leading-24px 2xl:text-1rem 2xl:leading-1.5rem underline">
            Log in here
          </div>
        </router-link>
      </div>
    </div>
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
      showRegisterModal: false
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
</style>
