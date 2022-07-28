<template>
  <div class="w-full h-full overflow-auto">
    <div class="lg:p-3rem p-2rem max-w-40rem mx-auto">
      <div class="text-white" v-if="!showRegisterModal">
        <div class="gradient-text keep-all gradient-text-right c-text-bold text-1.6rem max-w-15rem sm:max-w-30rem mx-auto mb-2.3rem leading-2rem">
          Below is the password
          to your new wallet:
        </div>
        <div class="flex items-center bg-blockBg py-1rem lg:px-6rem px-2rem max-w-960px mx-auto rounded-12px c-text-bold lg:text-1.4rem text-1.2rem lg:leading-2rem leading-1.6rem mb-2.3rem">
          {{ ethAccount.privateKey }}
          <img class="w-1.3rem h-1.3rem ml-1rem cursor-pointer"
               @click="onCopy(ethAccount.privateKey)"
               src="~@/assets/icon-copy.svg" alt="">
        </div>
        <div class="flex justify-center max-w-41rem mx-auto">
          <div class="leading-1.5rem flex item-center mr-1rem">
            <img class="w-1.1rem h-1.1rem min-w-1.1rem my-0.2rem" src="~@/assets/icon-warning.svg" alt="">
          </div>
          <div class="max-w keep-all lg:text-1.2rem text-1rem font-bold lg:leading-1.5rem leading-1.3rem text-left">
            Please save this private key in a very secure location. We will never keep this key, so if you dont save it, nobody can find back this account.
          </div>
        </div>
        <!-- <div class="flex justify-start items-center mt-1.5rem max-w-41rem mx-auto">
          <el-checkbox v-model="checked" size="lg" class="c-checkbox" />
          <div class="c-text-black text-1.5rem leading-1.5rem underline ml-1rem cursor-pointer" @click="checked=true">
            Ok, I saved it.
          </div>
        </div> -->
        <button class="c-text-medium gradient-btn h-3.6rem px-1.5rem mx-auto rounded-full lg:text-1.6rem text-1.2rem mt-1.25rem"
                @click="showRegisterModal = true">
          Ok, I saved it.
        </button>
      </div>
      <div class="text-white" v-else>
        <div class="keep-all c-text-bold text-2rem max-w-20rem sm:max-w-40rem sm:mx-auto mb-2.3rem leading-2.9rem text-left">
          <span class="gradient-text gradient-text-right">Great,</span> <br>
          now let's verify your Twitter handle
        </div>
        <button class="c-text-medium gradient-btn h-3.6rem px-1.5rem mx-auto rounded-full w-full max-w-20rem lg:text-1.6rem mb-2.3rem text-1.2rem mt-1.25rem"
                @click="attachKeyToServer" :disabled="attachServer">
          <c-spinner class="w-2.4rem h-2.4rem ml-1rem" v-show="attachServer"></c-spinner>
          Go to bind
        </button>

        <div class="flex justify-center max-w-41rem mx-auto mb-1rem">
          <div class="max-w keep-all lg:text-1.2rem text-1rem font-bold lg:leading-1.5rem leading-1.3rem text-left">
            After you've tweeted the bind message
          </div>
        </div>

        <router-link to="/login">
          <div class="c-text-black text-1.5rem leading-1.5rem underline ml-1rem cursor-pointer">
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
        const pwd = box(generateBrainKey(this.ethAccount.privateKey), SendPwdServerPubKey, pair.privateKey)
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
