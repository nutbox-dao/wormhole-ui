<template>
  <div class="container max-w-50rem mx-auto px-15px">
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-15px pt-40px">
      <div class="opacity-0 absolute -top-200vh">
        <qrcode-vue id="qr-canvas" :value="inviteLink" :size="200" background="transparent"/>
      </div>
      <div class="col-span-1 sm:hidden">
        <div class="text-left">
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
      <div class="col-span-1 xl:col-span-2">
        <div class="max-w-400px mx-auto bg-white text-blueDark light:shadow-color1A rounded-20px">
          <div class="p-20px border-b-0.5px border-color8B/30 light:border-colorF7
                  min-h-110px flex items-end justify-start relative">
            <div class="whitespace-pre-line text-14px leading-18px text-left mr-70px">
              <strong class="text-colorA2 c-text-black">{{getAccountInfo['twitterUsername']}}</strong>
              {{$t('ref.inviteP1')}}
            </div>
            <img class="w-60px h-60px min-w-60px min-h-60px rounded-full absolute right-25px top-25px shadow-color1A"
                 :src="getAccountInfo.profileImg" alt="">
          </div>
          <div class="px-1/5 pb-1/10 pt-1/10">
            <img v-if="qrSrc"
                 class="w-full h-full object-contain" :src="qrSrc" alt="">
            <img class="w-4/5 mx-auto mt-1/10" src="~@/assets/logo.svg" alt="">
          </div>
        </div>
      </div>
      <div class="col-span-1 xl:col-span-3 text-left text-14px leading-20px flex flex-col justify-center">
        <div class="hidden sm:block mb-20px text-left">
          <div class="text-left">
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
        <div>权益说明：</div>
        <ul class="list-disc pl-20px mt-8px">
          <li>被邀请人成功注册后，会享受到策展奖励服务费8折优惠；</li>
          <li>您会享有被邀请人在平台每一笔策展奖励服务费的25%～50%作为佣金；</li>
          <li>您的被邀请人如果邀请其他伙伴成功注册，您也会享有第二级被邀请人每一笔策展奖励服务费的25%作为佣金。</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import {mapGetters} from "vuex";
import {onCopy} from "@/utils/tool";
export default {
  name: "InviteLink",
  components: {QrcodeVue},
  data() {
    return {
      qrSrc: ''
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
