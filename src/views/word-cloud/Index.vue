<template>
  <div class="">
    <img class="fixed top-0 right-0 w-3/5 sm:w-3/10 z-2" src="~@/assets/word-cloud-bg1.png" alt="">
    <div class="word-cloud-page max-h-700px">
      <div class="container mx-auto text-left max-w-50rem px-15px">
        <div v-if="!imgUrl"
             class="flex flex-col items-center sm:flex-row sm:py-100px 2xl:py-200px">
          <div class="w-full sm:w-3/5 flex flex-col justify-center items-start ">
            <div class="sm:h-3/4 w-full">
              <div class=" text-2.5rem mb-2rem hidden sm:block whitespace-pre-line">
                {{imgUrl?$t('wordCloud.title'): $t('wordCloud.discoverPersona')}}
              </div>
              <div class="whitespace-pre-line text-12px leading-16px mt-15px sm:text-16px sm:leading-24px
                          justify-center sm:justify-start
                          text-center sm:text-left text-color8B light:text-color33">
                {{$t('wordCloud.desc')}}
              </div>
            </div>
          </div>
          <div class="w-full sm:w-2/5 flex items-center justify-center sm:justify-end mt-15px">
            <div class="w-full relative flex flex-col items-center" @click="onAuth">
              <img class="hidden sm:block" src="~@/assets/word-cloud-bg3.png" alt="">
              <img class="sm:hidden" src="~@/assets/word-cloud-bg4.png" alt="">
              <button class="bg-color62 h-44px xl:h-2.8rem w-3/5 text-white rounded-full
                             flex items-center justify-center mt-20px"
                      :disabled="loading">
                <span>{{$t('wordCloud.getStart')}}</span>
                <c-spinner class="w-20px h-20px ml-4px" v-show="loading"></c-spinner>
              </button>
            </div>
          </div>
        </div>
        <div v-if="!loading && imgUrl"
             class="w-full h-full min-h-300px lg:min-h-400px  mx-auto px-15px relative
                    flex flex-col items-center justify-center py-1/5 sm:py-100px 2xl:py-200px">
          <div class="relative">
            <img class="w-350px" :src="imgUrl" alt="">
            <div></div>
            <div class="absolute top-130px pl-20px pr-60px text-12px text-color33/10
                        whitespace-pre-line leading-16px transform scale-90">
              {{$t('wordCloud.wordDesc')}}
            </div>
          </div>
          <div class="w-full flex justify-center items-center gap-20px mt-2rem">
            <button v-if="!getAccountInfo" class="w-1/3 bg-color62 h-44px xl:h-2.8rem w-3/5 text-white rounded-full
                               flex items-center justify-center"
                    @click="bind">
              <span>{{ $t('wordCloud.bindAndMint') }}</span>
              <c-spinner class="w-20px h-20px ml-4px" v-show="mintLoading"></c-spinner>
            </button>
            <button class="w-1/3 bg-color62 h-44px xl:h-2.8rem w-3/5 text-white rounded-full
                               flex items-center justify-center"
                    @click="share">
              <span>{{ $t('wordCloud.share') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { generateWordcloud, twitterLogin, twitterAuth } from '@/api/api'
import { checkAccessToken } from '@/utils/account'
import { randomWallet } from '@/utils/ethers'
import { createKeypair } from '@/utils/tweet-nacl'
import { notify } from "@/utils/notify";
import Cookie from 'vue-cookies'
import { sleep } from '@/utils/helper'
import cardBg from '@/assets/word-cloud-card.png'

export default {
  name: "Index",
  data() {
    return {
      loading: false,
      imgUrl: cardBg,
      wallet: null,
      pair: null,
      pendingAccount: null,
      mintLoading: false,
      shareLoading: false
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo'])
  },
  methods: {
    showNotify(message, duration, type) {
      notify({message, duration, type})
    },
    async onAuth() {
      if (this.imgUrl) {
        return;
      }
      try{
        this.loading = true
        let twitterId = ''
        if (this.getAccountInfo) {
          await checkAccessToken();
          twitterId = this.getAccountInfo.twitterId
        }else {
          // auth
          let isIOS = navigator.userAgent.toUpperCase().indexOf('IPHONE') >= 0
          let isAndroid = navigator.userAgent.toUpperCase().indexOf('ANDROID') >= 0


          console.log(navigator.userAgent);
          const source = this.$route.query?.utm_source

          this.loging = true
          if (isIOS && (source === "tokenpocket" || (navigator.userAgent.indexOf('TokenPocket_iOS') >= 0))) {
            console.log('token pocket');
          }else if (isAndroid || isIOS) {
            // const res = await twitterAuth(true);
            // window.location.href = res;
            // return;
          }

          const res = await twitterAuth();
          const params = res.split('?')[1].split('&')
          let state;
          for (let p of params) {
            const [key, value] = p.split('=');
            if (key === 'state') {
              state = value;
              break;
            }
          }

          setTimeout(() => {
            window.open(res, 'newwindow', 'height=700,width=500,top=0,left=0,toolbar=no,menubar=no,resizable=no,scrollbars=no,location=no,status=no')
          })

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
                Cookie.set('account-auth-info', JSON.stringify({...userInfo.account, pair: this.pair, wallet: this.wallet}), '300s')
                this.pendingAccount = userInfo.account
                twitterId = this.pendingAccount.twitterId
                break;
              }else if (userInfo.code === 3) { // log in
                this.$store.commit('saveAccountInfo', userInfo.account)
                this.pendingAccount = userInfo.account
                twitterId = userInfo.account.twitterId
                break;
              }
              count++;
              await sleep(1)
            }
            // time out
            if (count >= 80) {
              this.showNotify(this.$t('err.loginTimeout'), 5000, 'error')
              return;
            }
          }else {
            if (userInfo.code === 0) {
              // not registry
              // store auth info
                Cookie.set('account-auth-info', JSON.stringify({...userInfo.account, pair: this.pair, wallet: this.wallet}), '300s')
              this.pendingAccount = userInfo.account
              twitterId = this.pendingAccount.twitterId
            }else if (userInfo.code === 3) { // log in
              this.$store.commit('saveAccountInfo', userInfo.account)
              this.pendingAccount = userInfo.account
              twitterId = userInfo.account.twitterId
            }
          }
        }
        const url = await generateWordcloud(twitterId)
        if (this.getAccountInfo) {
          this.getAccountInfo.wordCloudUrl = url;
        }
        this.imgUrl = url;
      } catch (e) {
        console.log(535, e);
        this.showNotify(e, 5000, 'error')
      } finally {
        this.loading = false
      }
    },
    bind() {
      this.$store.commit('saveShowLogin', true)
    },
    async share() {
      try {
      if (!this.imgUrl) return;
      const temp = this.imgUrl.split('/')
      const id = temp[temp.length - 1]
      const content = 'Wow! this is my Twitter persona, interesting 🤣 How is yours?\n' + `https://wordcloud.wormhole3.io/wordcloud?id=${id}${this.getAccountInfo ? ('&referee=' + this.getAccountInfo.twitterId) : ''}`

      let url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(content)
      window.open(url, '__blank')
      } catch (error) {

      } finally{

      }
    }
  },
  async mounted () {
    // await this.$router.isReady();
    // const referee = this.$route.query.referee;
    // if (referee) {
    //   this.$store.commit('saveReferee', referee);
    // }
    // if (this.getAccountInfo) {
    //   this.imgUrl = this.getAccountInfo.wordCloudUrl
    // }
  },
}
</script>

<style scoped lang="scss">
.word-cloud-page {
  background-image:
      url("~@/assets/word-cloud-bg2.png"),
      url("~@/assets/word-cloud-bg2.png");
  background-size: 7% auto, 16% auto;
  background-position: 35% 30%, 20% 45%;
  background-repeat: no-repeat;
  background-blend-mode: overlay;
}
@media (max-width: 560px) {
  .word-cloud-page {
    background-size: 15% auto, 30% auto;
    background-position: 5% 5%, -20% 30%;
  }
}
</style>
