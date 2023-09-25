<template>
  <div class="container max-w-50rem mx-auto px-15px">
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-15px pt-40px">
      <div class="opacity-0 absolute -top-200vh">
        <qrcode-vue id="qr-canvas" :value="inviteLink" :size="200" background="transparent"/>
      </div>
      <div class="opacity-0 absolute -top-200vh w-640px h-800px min-w-640px min-h-800px max-w-640px max-h-800px">
        <div class="w-640px h-800px bg-white text-blueDark light:shadow-color1A rounded-20px
                    flex flex-col"
             id="share-link-img">
          <div class="px-50px pt-40px pb-30px border-b-0.5px border-color8B/30 light:border-colorF7
                   flex items-end justify-start relative gap-20px">
            <div class="whitespace-pre-line text-20px leading-34px text-left">
              <strong class="text-colorA2 c-text-black">{{getAccountInfo['twitterUsername']}}</strong>
              {{$t('ref.inviteP1')}}
            </div>
            <img class="w-120px h-120px min-w-120px min-h-120px max-w-120px max-h-120px rounded-full shadow-color1A"
                 :src='getAccountInfo.profileImg.replace("normal", "400x400")' alt="">
          </div>
          <div class="flex-1 flex flex-col justify-center items-center">
            <img v-if="qrSrc"
                 class="h-400px w-400px" :src="qrSrc" alt="">
            <img class="h-60px w-350px object-contain object-center mt-40px" src="~@/assets/logo.svg" alt="">
          </div>
        </div>
      </div>

      <div class="col-span-1 sm:hidden">
        <div class="inline leading-20px text-14px c-text-black text-center">
          {{ $t('ref.referralDesc') }}
        </div>
        <div class="text-center mt-1rem">
          <div>
            {{$t('ref.refereeCode')}}:
          </div>
          <div class="inline leading-20px text-left">
            <span class="mx-8px text-24px text-colorA2 c-text-black">{{getAccountInfo.twitterId}}</span>
            <button class="h-20px" @click="onCopy(getAccountInfo.twitterId)">
              <i class="icon-copy w-16px h-16px"></i>
            </button>
          </div>
        </div>
        <div class="text-center mt-10px">
          {{$t('ref.referre')}}:
        </div>
        <div class="leading-20px text-14px text-left border-1 border-colorA2 rounded-full
                      flex items-center px-20px py-8px justify-center w-min mx-auto">
          <span class="mx-8px xl:whitespace-nowrap">{{inviteLink}}</span>
          <button class="h-14px" @click="onCopy(inviteLink)">
            <i class="icon-copy w-16px h-16px"></i>
          </button>
        </div>
      </div>
      <div class="col-span-1 xl:col-span-2">
        <div class="relative max-w-400px mx-auto">
          <div class="bg-white text-blueDark light:shadow-color1A rounded-20px">
            <div class="p-20px border-b-0.5px border-color8B/30 light:border-colorF7
                  min-h-110px flex items-end justify-start relative">
              <div class="whitespace-pre-line text-14px leading-18px text-left mr-70px">
                <strong class="text-colorA2 c-text-black">{{getAccountInfo['twitterUsername']}}</strong>
                {{$t('ref.inviteP1')}}
              </div>
              <img class="w-60px h-60px min-w-60px min-h-60px rounded-full absolute right-25px top-25px shadow-color1A"
                   :src='getAccountInfo.profileImg.replace("normal", "400x400")' alt="">
            </div>
            <div class="px-1/5 pb-1/10 pt-1/10">
              <img v-if="qrSrc"
                   class="w-full h-full object-contain qr-img" :src="qrSrc" alt="">
              <img class="w-4/5 mx-auto mt-1/10" src="~@/assets/logo.svg" alt="">
            </div>
          </div>
          <button class="w-40px h-40px absolute right-15px bottom-15px"
                  @click="onDownload">
            <img src="~@/assets/word-cloud-download.svg" alt="">
          </button>
        </div>
      </div>
      <div class="col-span-1 xl:col-span-3 text-14px leading-20px flex flex-col justify-center">
        <div class="hidden sm:block mb-20px text-center">
          <div class="inline leading-20px text-14px c-text-black text-center">
            {{ $t('ref.referralDesc') }}
          </div>
          <div class="text-center mt-1rem">
            <div>
              {{$t('ref.refereeCode')}}:
            </div>
            <div class="inline leading-20px text-left">
              <span class="mx-8px text-24px text-colorA2 c-text-black">{{getAccountInfo.twitterId}}</span>
              <button class="h-20px" @click="onCopy(getAccountInfo.twitterId)">
                <i class="icon-copy w-16px h-16px"></i>
              </button>
            </div>
          </div>
          <div class="text-center mt-10px">
            {{$t('ref.referre')}}:
          </div>
          <div class="leading-20px text-14px text-left border-1 border-colorA2 rounded-full
                      flex items-center px-20px py-8px justify-center w-min mx-auto">
            <span class="mx-8px xl:whitespace-nowrap">{{inviteLink}}</span>
            <button class="h-14px" @click="onCopy(inviteLink)">
              <i class="icon-copy w-16px h-16px"></i>
            </button>
          </div>
        </div>
        <div v-if="!invitor" class="flex items-start justify-center mt-30px mb-30px gap-10px mx-auto">
          <span class="whitespace-nowrap h-34px flex items-center">{{$t('ref.myInviter')}}:</span>
          <div class="max-w-300px">
            <div class="border-1 border-colorA2 rounded-full px-15px h-34px">
              <input type="text" class="bg-transparent h-full w-full"
                    v-model="invitorCode"
                     :placeholder="$t('ref.inputTip')">
            </div>
            <div v-show="invitorNotRegistry" class="text-red-500 mt-10px text-12px leading-16px text-center break-word">
              {{ $t('ref.invitorNotRegistry') }}
            </div>
            <div v-show="wrongCode" class="text-red-500 mt-10px text-12px leading-16px text-center break-word">
              {{ $t('ref.wrongCode') }}
            </div>
            <div v-show="invitorRegisterAfterYou" class="text-red-500 mt-10px text-12px leading-16px text-center break-word">
              {{ $t('ref.invitorRegisterAfterYou') }}
            </div>
          </div>
          <button class="bg-color62 text-white h-34px px-10px rounded-full text-12px font-bold
                         flex items-center justify-center disabled:opacity-50"
                  :disabled="loading"
                  @click="addInvitor">
            {{$t('common.confirm')}}
            <c-spinner v-show="loading" class="w-16px h-16px 2xl:w-1rem 2xl:h-1rem ml-0.5rem"></c-spinner>
          </button>
        </div>
        <div v-else class="px-15px py-8px w-min mx-auto
                    flex items-center justify-center mt-30px gap-8px">
          <span class="whitespace-nowrap">{{$t('ref.myInviter')}}:</span>
          <img class="w-40px h-40px min-w-40px min-h-40px rounded-full shadow-color1A"
               :src='invitor.profileImg.replace("normal", "400x400")' alt="">
          <span class="text-16px font-bold">{{ invitor.twitterUsername }}</span>
        </div>
        <div>{{ $t('ref.tipTitle') }}</div>
        <ul class=" pl-20px mt-8px">
          <li>{{ $t('ref.tip1') }}</li>
          <li>{{ $t('ref.tip2') }}</li>
          <!-- <li>{{ $t('ref.tip3') }}</li> -->
        </ul>
        <div class="mt-1rem">
          {{ $t('ref.tip3') }}
        </div>
      </div>
    </div>
    <el-dialog class="c-dialog c-dialog-center c-dialog-no-shadow c-dialog-no-bg max-w-34rem "
               v-model="modalVisible"
               :destroy-on-close="true">
      <div class="relative">
        <img class="w-full max-w-500px mx-auto" :src="downloadImgUrl" alt="">
        <div class="absolute bottom-10px left-1/2 transform -translate-x-1/2 text-black/30 c-text-black">
          {{$t('wordCloud.downloadTip')}}
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import {mapGetters} from "vuex";
import {onCopy} from "@/utils/tool";
import domtoimage from 'dom-to-image';
import {useTimer} from "@/utils/hooks";
import { getMyInvitor, addInvitation } from '@/api/api';

export default {
  name: "InviteLink",
  components: {QrcodeVue},
  setup() {
    const { setTimer } = useTimer()
    return {setTimer}
  },
  data() {
    return {
      qrSrc: '',
      downloadImgUrl: '',
      modalVisible: false,
      loading: false,
      invitor: null,
      invitorNotRegistry: false,
      invitorRegisterAfterYou: false,
      wrongCode: false,
      invitorCode: null
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo']),
    inviteLink () {
      return 'https://alpha.wormhole3.io/square?referee=' + this.getAccountInfo.twitterId
    }
  },
  methods: {
    onCopy,
    getQrImg() {
      const canvas = document.getElementById('qr-canvas')
      if (!canvas) return
      this.qrSrc = canvas.toDataURL('image/png')
      this.loadDownloadImg()
    },
    loadDownloadImg() {
      if(this.downloadImgUrl) return
      return new Promise((resolve, reject) => {
        const node = document.getElementById('share-link-img');
        domtoimage.toPng(node).then((dataUrl) => {
          this.downloadImgUrl = dataUrl
          resolve()
        }).catch(function (error) {
          console.error('oops, something went wrong!', error);
          reject(error)
        });
      })
    },
    async onDownload() {
      this.loadingImg = true
      if(!this.downloadImgUrl) await this.loadDownloadImg()
      this.loadingImg = false
      let isIOS = navigator.userAgent.toUpperCase().indexOf('IPHONE') >= 0
      let isAndroid = navigator.userAgent.toUpperCase().indexOf('ANDROID') >= 0
      if(isAndroid || isIOS) {
        this.modalVisible = true
      } else {
        let aLink = document.createElement('a')
        aLink.download = 'Invitation'
        aLink.style.display = 'none'
        aLink.href = this.downloadImgUrl
        document.body.appendChild(aLink)
        aLink.click();
        document.body.removeChild(aLink)
      }
    },
    async addInvitor() {
      try{
        this.loading = true
        this.wrongCode = false
        this.invitorNotRegistry = false
        this.invitorRegisterAfterYou = false

        // check invitor 
        if (/[0-9]+/.test(this.invitorCode)) {
          await addInvitation(this.invitorCode, this.getAccountInfo.twitterId);
          this.invitor = await getMyInvitor(this.getAccountInfo.twitterId)
        }else {
          this.wrongCode = true
        }
      } catch(e) {
        if (e === 508) {
          this.invitorNotRegistry = true
        } else if (e === 501) {
          this.wrongCode = true
        } else if (e === 511) {
          this.invitorRegisterAfterYou = true;
        }
      } finally {
        this.loading = false
      }
    }
  },
  mounted() {
    this.setTimer(() => {
      this.getQrImg()
    })
    getMyInvitor(this.getAccountInfo.twitterId).then(invitor => {
      this.invitor = invitor
    })
  }
}
</script>

<style scoped>

</style>
