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
          <div class="absolute -top-200/100 opacity-0">
            <div class="relative" id="share-img">
              <img class="w-700px min-w-500px" src="~@/assets/word-cloud-share.png" alt="">
              <div class="absolute top-2/5 h-1/3 w-full px-1/10">
                <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-3/5">
                  <svg width="100%" height="100%" viewBox="0 0 210 210" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" opacity="0.400000006">
                      <g id="word-cloud-app备份-13" transform="translate(-270.000000, -796.000000)" :stroke="effectiveWordColor" stroke-width="5">
                        <g id="p1" transform="translate(-170.000000, -510.000000)">
                          <g id="编组-7" transform="translate(245.000000, 896.000000)">
                            <g id="编组-4" transform="translate(35.000000, 205.000000)">
                              <g id="500x300" transform="translate(15.000000, 147.000000)">
                                <path d="M340,240.5 C343.45178,240.5 346.57678,241.89911 348.838835,244.161165 C351.10089,246.42322 352.5,249.54822 352.5,253 C352.5,256.45178 351.10089,259.57678 348.838835,261.838835 C346.57678,264.10089 343.45178,265.5 340,265.5 C336.54822,265.5 333.42322,264.10089 331.161165,261.838835 C328.89911,259.57678 327.5,256.45178 327.5,253 C327.5,249.54822 328.89911,246.42322 331.161165,244.161165 C333.42322,241.89911 336.54822,240.5 340,240.5 Z M250,66.5 C276.647739,66.5 300.772739,77.3011304 318.235804,94.7641956 C335.69887,112.227261 346.5,136.352261 346.5,163 C346.5,189.647739 335.69887,213.772739 318.235804,231.235804 C300.772739,248.69887 276.647739,259.5 250,259.5 C223.352261,259.5 199.227261,248.69887 181.764196,231.235804 C164.30113,213.772739 153.5,189.647739 153.5,163 C153.5,136.352261 164.30113,112.227261 181.764196,94.7641956 C199.227261,77.3011304 223.352261,66.5 250,66.5 Z M250,131.5 C241.301515,131.5 233.426515,135.025758 227.726136,140.726136 C222.025758,146.426515 218.5,154.301515 218.5,163 C218.5,171.698485 222.025758,179.573485 227.726136,185.273864 C233.426515,190.974242 241.301515,194.5 250,194.5 C258.698485,194.5 266.573485,190.974242 272.273864,185.273864 C277.974242,179.573485 281.5,171.698485 281.5,163 C281.5,154.301515 277.974242,146.426515 272.273864,140.726136 C266.685257,135.13753 259.006472,131.639101 250.510716,131.504056 Z M160,60.5 C163.45178,60.5 166.57678,61.8991102 168.838835,64.1611652 C171.10089,66.4232203 172.5,69.5482203 172.5,73 C172.5,76.4517797 171.10089,79.5767797 168.838835,81.8388348 C166.57678,84.1008898 163.45178,85.5 160,85.5 C156.54822,85.5 153.42322,84.1008898 151.161165,81.8388348 C148.89911,79.5767797 147.5,76.4517797 147.5,73 C147.5,69.5482203 148.89911,66.4232203 151.161165,64.1611652 C153.42322,61.8991102 156.54822,60.5 160,60.5 Z" id="形状结合"></path>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
               <img :src="imgUrl" alt="">
              </div>
              <div class="absolute bottom-1/12 w-full flex items-center justify-between pl-1/10 pr-1/10">
                <div class="text-14px leading-20px text-color33/10 whitespace-pre-line mr-1/20">
                  {{$t('wordCloud.wordDesc')}}
                </div>
                <div class="border-1 border-color33 p-5px h-112px w-112px rounded-4px opacity-90">
                  <qrcode-vue :value="qrCodeUrl" :size="100" level="H" />
                </div>
              </div>
            </div>
          </div>
          <div class="relative">
            <img class="w-350px" :src="imgUrl" alt="">
            <div class="text-24px absolute top-64px pl-20px">{{$t('wordCloud.title')}}</div>
            <div class="absolute top-130px pl-20px pr-60px text-12px text-color33/10
                        whitespace-pre-line leading-16px transform scale-90">
              {{$t('wordCloud.wordDesc')}}
            </div>
            <div class="absolute top-210px h-1/3 w-full px-40px">
              <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-3/5">
                <svg width="100%" height="100%" viewBox="0 0 210 210" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" opacity="0.400000006">
                    <g id="word-cloud-app备份-13" transform="translate(-270.000000, -796.000000)" :stroke="effectiveWordColor" stroke-width="5">
                      <g id="p1" transform="translate(-170.000000, -510.000000)">
                        <g id="编组-7" transform="translate(245.000000, 896.000000)">
                          <g id="编组-4" transform="translate(35.000000, 205.000000)">
                            <g id="500x300" transform="translate(15.000000, 147.000000)">
                              <path d="M340,240.5 C343.45178,240.5 346.57678,241.89911 348.838835,244.161165 C351.10089,246.42322 352.5,249.54822 352.5,253 C352.5,256.45178 351.10089,259.57678 348.838835,261.838835 C346.57678,264.10089 343.45178,265.5 340,265.5 C336.54822,265.5 333.42322,264.10089 331.161165,261.838835 C328.89911,259.57678 327.5,256.45178 327.5,253 C327.5,249.54822 328.89911,246.42322 331.161165,244.161165 C333.42322,241.89911 336.54822,240.5 340,240.5 Z M250,66.5 C276.647739,66.5 300.772739,77.3011304 318.235804,94.7641956 C335.69887,112.227261 346.5,136.352261 346.5,163 C346.5,189.647739 335.69887,213.772739 318.235804,231.235804 C300.772739,248.69887 276.647739,259.5 250,259.5 C223.352261,259.5 199.227261,248.69887 181.764196,231.235804 C164.30113,213.772739 153.5,189.647739 153.5,163 C153.5,136.352261 164.30113,112.227261 181.764196,94.7641956 C199.227261,77.3011304 223.352261,66.5 250,66.5 Z M250,131.5 C241.301515,131.5 233.426515,135.025758 227.726136,140.726136 C222.025758,146.426515 218.5,154.301515 218.5,163 C218.5,171.698485 222.025758,179.573485 227.726136,185.273864 C233.426515,190.974242 241.301515,194.5 250,194.5 C258.698485,194.5 266.573485,190.974242 272.273864,185.273864 C277.974242,179.573485 281.5,171.698485 281.5,163 C281.5,154.301515 277.974242,146.426515 272.273864,140.726136 C266.685257,135.13753 259.006472,131.639101 250.510716,131.504056 Z M160,60.5 C163.45178,60.5 166.57678,61.8991102 168.838835,64.1611652 C171.10089,66.4232203 172.5,69.5482203 172.5,73 C172.5,76.4517797 171.10089,79.5767797 168.838835,81.8388348 C166.57678,84.1008898 163.45178,85.5 160,85.5 C156.54822,85.5 153.42322,84.1008898 151.161165,81.8388348 C148.89911,79.5767797 147.5,76.4517797 147.5,73 C147.5,69.5482203 148.89911,66.4232203 151.161165,64.1611652 C153.42322,61.8991102 156.54822,60.5 160,60.5 Z" id="形状结合"></path>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
              <vue-word-cloud
                  :words="words"
                  :color="getWordColor"
                  :spacing="1/2"
                  font-family="Roboto"
              />
<!--              <img src="~@/assets/word-cloud-demo.png" alt="">-->
            </div>
            <button class="absolute bottom-30px right-40px" @click="onDownload">
              <img class="h-30px w-30px" src="~@/assets/word-cloud-download.svg" alt="">
            </button>
          </div>
          <div class="w-full flex justify-center items-center gap-20px mt-2rem z-2">
            <button v-if="!getAccountInfo" class="w-1/3 bg-color62 h-44px xl:h-2.8rem w-3/5 text-white rounded-full
                               flex items-center justify-center"
                    @click="bind">
              <span>{{ $t('wordCloud.bindAndMint') }}</span>
              <c-spinner class="w-20px h-20px ml-4px" v-show="mintLoading"></c-spinner>
            </button>
            <button class="w-1/3 bg-color62 h-44px xl:h-2.8rem w-3/5 text-white rounded-full
                               flex items-center justify-center"
                    @click="share">
              <img class="h-18px mr-4px" src="~@/assets/icon-twitter-white.svg" alt="">
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
import QrcodeVue from 'qrcode.vue'
import domtoimage from 'dom-to-image';

export default {
  name: "Index",
  components: {QrcodeVue},
  data() {
    return {
      loading: false,
      imgUrl: null,
      wallet: null,
      pair: null,
      pendingAccount: null,
      mintLoading: false,
      shareLoading: false,
      effectiveWordCount: 8,
      words: ['你好', '爱情', '身份', '全部', '有意思', '我们', '你们', '查看', '没办法', '动作', '没有', 'I LOVE YOU', 'Hello', '有意思', '大家', '方式', '现在', '就是', '事实'],
      colors: ['#3A6BFF', '#20AFFF', '#5F32FF', '#06B966', '#EF4848', '#FF5400', '#FFB500'],
      effectiveWordColor: '#999999',
      qrCodeUrl: 'https://alpha.wormhole3.io/'
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
    },
    setWordsStyle() {
      this.effectiveWordColor = this.colors[Math.floor(Math.random()*7)]
      let initSize = 6
      this.words = this.words.map((item) => {
        if(initSize<=1) return [item, 1]
        return [item, initSize-=1]
      })
    },
    getWordColor(word, index) {
      return index < this.effectiveWordCount?this.effectiveWordColor: '#999999'
    },
    onDownload() {
      const node = document.getElementById('share-img');
      this.qrCodeUrl = `https://alpha.wormhole3.io/#/word-cloud${this.getAccountInfo ? ('?&referee=' + this.getAccountInfo.twitterId) : ''}`
      domtoimage.toPng(node)
        .then((dataUrl) => {
          let canvas = document.createElement('canvas')
          let context = canvas.getContext('2d')
          let aLink = document.createElement('a')
          aLink.download = 'my-twitter-persona'
          aLink.style.display = 'none'
          let img = new Image();
          img.setAttribute('crossOrigin', 'anonymous')
          img.src = dataUrl;
          document.body.appendChild(img);
          img.onload = function(){
            canvas.width = img.width
            canvas.height = img.height
            context.drawImage(img,0,0);
            aLink.href = canvas.toDataURL('image/png')
            document.body.appendChild(aLink)
            aLink.click();
            document.body.removeChild(aLink)
          }
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error);
        });
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
    this.setWordsStyle()
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
