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
        <div class="text-left">
          <div class="inline leading-20px text-14px text-left">
            {{ $t('ref.referralDesc') }}
          </div>
        </div>
        <div class="text-left mt-1rem">
          <div class="inline leading-20px text-14px text-left">
            {{$t('ref.refereeCode')}}:
            <span class="mx-8px">{{getAccountInfo.twitterId}}</span>
          </div>
          <button class="h-20px" @click="onCopy(getAccountInfo.twitterId)">
            <i class="icon-copy w-16px h-16px"></i>
          </button>
        </div>
        <div class="text-left">
          <div class="inline leading-20px text-14px text-left">
            {{$t('ref.myReferral')}}:
            <span class="mx-8px">{{inviteLink}}</span>
          </div>
          <button class="h-20px" @click="onCopy(inviteLink)">
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
      <div class="col-span-1 xl:col-span-3 text-left text-14px leading-20px flex flex-col justify-center">
        <div class="hidden sm:block mb-20px text-left">
          <div class="text-left">
            <div class="inline leading-20px text-14px text-left">
              {{ $t('ref.referralDesc') }}
            </div>
          </div>
          <div class="text-left mt-1rem">
            <div class="inline leading-20px text-14px text-left">
              {{$t('ref.refereeCode')}}:
              <span class="mx-8px">{{getAccountInfo.twitterId}}</span>
            </div>
            <button class="h-20px" @click="onCopy(getAccountInfo.twitterId)">
              <i class="icon-copy w-16px h-16px"></i>
            </button>
          </div>
          <div class="text-left">
            <div class="inline leading-20px text-14px text-left">
              {{$t('ref.referre')}}:
              <span class="mx-8px">{{inviteLink}}</span>
            </div>
            <button class="h-20px" @click="onCopy(inviteLink)">
              <i class="icon-copy w-16px h-16px"></i>
            </button>
          </div>
        </div>
        <div>{{ $t('ref.tipTitle') }}</div>
        <ul class="list-disc pl-20px mt-8px">
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

export default {
  name: "InviteLink",
  components: {QrcodeVue},
  data() {
    return {
      qrSrc: '',
      downloadImgUrl: '',
      modalVisible: false
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
        aLink.download = 'invite-link'
        aLink.style.display = 'none'
        aLink.href = this.downloadImgUrl
        document.body.appendChild(aLink)
        aLink.click();
        document.body.removeChild(aLink)
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.getQrImg()
    })
  }
}
</script>

<style scoped>

</style>
