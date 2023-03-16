<template>
  <div class="">
    <img class="fixed top-0 right-0 w-3/10 z-2" src="~@/assets/word-cloud-bg1.png" alt="">
    <div class="word-cloud-page max-h-700px">
      <div class="container mx-auto text-left max-w-50rem px-15px">
        <div class="text-34px mt-2rem text-center sm:hidden whitespace-pre-line">
          {{imgUrl?$t('wordCloud.title'): $t('wordCloud.discoverPersona')}}
        </div>
        <div class="flex flex-col items-center sm:flex-row sm:py-100px 2xl:py-200px" :class="imgUrl?'flex-col-reverse':''">
          <div class="w-full sm:w-3/5 flex flex-col justify-center items-start ">
            <div class="sm:h-3/4 w-full">
              <div class=" text-2.5rem mb-2rem hidden sm:block whitespace-pre-line">
                {{imgUrl?$t('wordCloud.title'): $t('wordCloud.discoverPersona')}}
              </div>
              <div v-if="!loading && imgUrl"
                   class="w-full flex justify-center sm:justify-start items-center gap-20px mt-2rem sm:mt-3rem">
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
              <div v-else
                   class="whitespace-pre-line text-12px leading-16px mt-15px sm:text-16px sm:leading-24px
                          justify-center sm:justify-start
                          text-center sm:text-left text-color8B light:text-color33">
                {{$t('wordCloud.desc')}}
              </div>
            </div>
          </div>
          <div class="w-full sm:w-2/5 flex items-center justify-center sm:justify-end mt-15px">
            <div v-if="!loading && imgUrl"
                 class="w-full h-full bg-white/10 min-h-300px lg:min-h-400px px-15px relative
                        flex items-center justify-center">
              <img class="w-full" :src="imgUrl" alt="">
            </div>
            <div v-else
                 class="w-full relative flex flex-col items-center" @click="onAuth">
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

export default {
  name: "Index",
  data() {
    return {
      loading: false,
      imgUrl: null,
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
      const content = 'I generated my twitter persona from @wormhole_3. Come to generate yours.\n' + `https://wordcloud-test.wormhole3.io/wordcloud?id=${id}${this.getAccountInfo ? ('&referee=' + this.getAccountInfo.twitterId) : ''}`

      let url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(content)
      window.open(url, '__blank')
      } catch (error) {
        
      } finally{

      }
    }
  },
  async mounted () {
    await this.$router.isReady();
    const referee = this.$route.query.referee;
    if (referee) {
      this.$store.commit('saveReferee', referee);
    }
    if (this.getAccountInfo) {
      this.imgUrl = this.getAccountInfo.wordCloudUrl
    }
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
    background-size: 15% auto, 50% auto;
    background-position: 5% 20%, 10% 40%;
  }
}
.word-item {
  position: absolute;
  padding: 6px 12px;
  font-size: 14px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(0.4);
}
.word-item-show {
  transition: all 3000ms;
  transition-delay: 500ms;
  &:nth-child(1) {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(1.7);
  }
  &:nth-child(2) {
    left: 28%;
    top: 40%;
    transform: translate(-50%, -50%) scale(1.52);
  }
  &:nth-child(3) {
    left: 55%;
    top: 38%;
    transform: translate(-50%, -50%) scale(1.5);
  }
  &:nth-child(4) {
    left: 80%;
    top: 44%;
    transform: translate(-50%, -50%) scale(1.47);
  }
  &:nth-child(5) {
    left: 84%;
    top: 55%;
    transform: translate(-50%, -50%) scale(1.42);
  }
  &:nth-child(6) {
    left: 71%;
    top: 62%;
    transform: translate(-50%, -50%) scale(1.36);
  }
  &:nth-child(7) {
    left: 74%;
    top: 74%;
    transform: translate(-50%, -50%) scale(1.3);
  }
  &:nth-child(8) {
    left: 52%;
    top: 74%;
    transform: translate(-50%, -50%) scale(1.25);
  }
  &:nth-child(9) {
    left: 43%;
    top: 59%;
    transform: translate(-50%, -50%) scale(1.21);
  }
  &:nth-child(10) {
    left: 30%;
    top: 67%;
    transform: translate(-50%, -50%) scale(1.17);
  }
  &:nth-child(11) {
    left: 13%;
    top: 65%;
    transform: translate(-50%, -50%) scale(1.11);
  }
  &:nth-child(12) {
    left: 12%;
    top: 50%;
    transform: translate(-50%, -50%) scale(1.05);
  }
  &:nth-child(13) {
    left: 24%;
    top: 55%;
    transform: translate(-50%, -50%) scale(1);
  }
  &:nth-child(14) {
    left: 50%;
    top: 24%;
    transform: translate(-50%, -50%) scale(0.95);
  }
  &:nth-child(15) {
    left: 34%;
    top: 26%;
    transform: translate(-50%, -50%) scale(0.9);
  }
  &:nth-child(16) {
    left: 68%;
    top: 30%;
    transform: translate(-50%, -50%) scale(0.88);
  }
  &:nth-child(17) {
    left: 11%;
    top: 30%;
    transform: translate(-50%, -50%) scale(0.81);
  }
  &:nth-child(18) {
    left: 90%;
    top: 34%;
    transform: translate(-50%, -50%) scale(0.81);
  }
  &:nth-child(19) {
    left: 15%;
    top: 76%;
    transform: translate(-50%, -50%) scale(0.81);
  }
  &:nth-child(20) {
    left: 27%;
    top: 77%;
    transform: translate(-50%, -50%) scale(0.81);
  }
}
</style>
