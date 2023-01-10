<template>
  <div class="relative text-left pb-3rem sm:pb-1.5rem  flex flex-col text-14px 2xl:text-0.8rem h-max">
    <button class="absolute right-20px top-20px"
            @click="$emit('close')">
      <i class="w-18px h-18px 2xl:w-1rem 2xl:h-1rem icon-close"></i>
    </button>
    <template v-if="step===0">
      <div class="mx-auto c-text-black text-20px xl:text-1.2rem mt-3rem mb-2rem">
        {{$t('ny.giveCard')}}
      </div>
      <el-carousel indicator-position="none" :autoplay="false" arrow="always"
                   :initial-index="cardIndex"
                   @change="cardChange">
        <el-carousel-item v-for="(item, index) in cards" :key="item">
          <div class="text-center">
            <div class="relative w-max mx-auto">
              <img class="h-280px" :src="item.img" alt="">
              <div class="absolute top-15px left-20px font-bold text-shadow-lg opacity-70 text-white">
                {{BLESS_CARD_NAME[index]}}
              </div>
              <div class="absolute bottom-30px right-30px text-shadow-lg font-bold text-white opacity-70">
                {{$t('common.balance')}}: {{ blessCardBalance[index + 1] }}
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
      <div class="flex flex-col items-center">
        <el-input-number class="c-number-input w-10rem mx-auto"
                         :min="1"
                         :step="1" step-strictly
                         v-model="giveNum"/>
        <div class="w-18rem flex items-center mx-auto mt-1rem">
          <span class="whitespace-nowrap mr-5px">{{$t('ny.to')}}</span>
          <div class="w-full border-1 bg-black/40 border-1 border-color8B/30
                    light:bg-white light:border-colorE3 hover:border-primaryColor
                    rounded-8px h-34px 2xl:h-1.7rem">
            <input class="bg-transparent h-full w-full px-15px"
                   v-model="giveTo"
                   v-on:change="checkInfo"
                   :placeholder="'@'+$t('ny.giveTo')">
            <button @click="verify">verify</button>
            <span v-show="showUserNotExist">{{ $t('ny.userNotExist') }}</span>
          </div>
        </div>
        <ConnectMainchainBTNVue v-if="chainId !== CHAIN_ID"/>
        <button v-else class="bg-tag-gradient gradient-btn-disabled-grey mt-2rem
                     flex items-center justify-center
                     w-10rem rounded-12px h-44px 2xl:h-2.2rem text-white font-bold"
                :disabled="giveEnable || giveLoading"
                @click="onGive">
          {{$t('ny.give')}}
          <c-spinner v-show="giveLoading" class="w-16px h-16px 2xl:w-1rem 2xl:h-1rem ml-0.5rem"></c-spinner>
        </button>
      </div>
    </template>
    <template v-if="step===1">
      <div class="text-center mt-5rem">
        <div class="relative w-max mx-auto">
          <img class="h-240px" :src="cards[cardIndex].img" alt="">
          <div class="absolute top-15px left-20px font-bold text-shadow-lg opacity-70 text-white">
            {{BLESS_CARD_NAME[cardIndex]}}
          </div>
          <div class="absolute bottom-30px right-30px text-shadow-lg font-bold text-white opacity-70">
            {{$t('common.balance')}}: {{blessCardBalance[cardIndex + 1]}}
          </div>
        </div>
        <div class="whitespace-pre-line font-bold leading-24px mt-1rem">
          {{$t('ny.giveToDesc', {tweetName: giveTo})}}
        </div>
      </div>
      <div class="border-1 bg-black/40 border-1 border-color8B/30 min-h-134px w-full max-w-300px mx-auto
                  flex flex-col light:bg-white light:border-colorE3 hover:border-primaryColor rounded-8px">
        <div class="flex-1 flex flex-col relative">
          <div contenteditable
               class="desc-input z-1 flex-1 px-1rem pt-5px whitespace-pre-line leading-24px 2xl:leading-1rem"
               ref="contentRef"
               @blur="getBlur"
               @paste="onPasteEmojiContent">
          </div>
        </div>
        <div class="py-2 flex justify-between items-center px-1rem">
          <el-popover ref="descEmojiPopover"
                      trigger="click" width="300"
                      :teleported="false" :persistent="false">
            <template #reference>
              <img class="w-1.8rem h-1.8rem lg:w-1.4rem lg:h-1.4rem" src="~@/assets/icon-emoji.svg" alt="">
            </template>
            <template #default>
              <div class="h-310px lg:h-400px ">
                <EmojiPicker :options="{
                                imgSrc:'/emoji/',
                                locals: $i18n.locale==='zh'?'zh_CN':'en',
                                hasSkinTones:false,
                                hasGroupIcons:false}"
                             @select="(e) =>selectEmoji(e,'desc')" />
              </div>
            </template>
          </el-popover>
          <span class="font-600 text-color62">#{{$t('ny.springFestival')}}</span>
        </div>
      </div>
      <button class="bg-tag-gradient gradient-btn-disabled-grey mt-2rem mx-auto
                     flex items-center justify-center
                     w-10rem rounded-12px h-44px 2xl:h-2.2rem text-white font-bold"
              @click="onShare">
        {{$t('ny.shareTweet')}}
        <c-spinner v-show="shareLoading" class="w-16px h-16px 2xl:w-1rem 2xl:h-1rem ml-0.5rem"></c-spinner>
      </button>
    </template>
  </div>
</template>

<script>
import card0 from '@/assets/red-envelope/card0.png'
import card1 from '@/assets/red-envelope/card1.png'
import card2 from '@/assets/red-envelope/card2.png'
import card3 from '@/assets/red-envelope/card3.png'
import card4 from '@/assets/red-envelope/card4.png'
import {formatEmojiText, onPasteEmojiContent} from "@/utils/tool";
import { EmojiPicker } from 'vue3-twemoji-picker-final'
import { send11155ToUser } from '@/utils/asset'
import { mapState, mapGetters } from 'vuex'
import { getUserInfoByUserId } from '@/utils/twitter'
import { getUserInfo } from '@/api/api'
import { ethers } from 'ethers'
import { notify } from '@/utils/notify'
import { NEW_YEAR_CARD_CONTRACT, CHAIN_ID, BLESS_CARD_NAME } from '@/ny-config'
import ConnectMainchainBTNVue from './ConnectMainchainBTN.vue'

export default {
  name: "GiveCardModal",
  components: {EmojiPicker, ConnectMainchainBTNVue},
  props: {
    selectIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      step: 0,
      cards: [
        {label: 'SBF Rabbit', balance: 0, img: card0},
        {label: 'MashiMaro', balance: 0, img: card1},
        {label: 'BTC Rabbit', balance: 0, img: card2},
        {label: 'Rabbit Trader', balance: 0, img: card3},
        {label: 'Leek Rabbit', balance: 0, img: card4},
      ],
      giveNum: 1,
      CHAIN_ID,
      giveTo: '',
      giveLoading: false,
      cardIndex: 0,
      BLESS_CARD_NAME,
      contentRange: null,
      tweetContent: '',
      shareLoading: false,
      toAddress: '',
      giveEnable: false,
      showUserNotExist: false
    }
  },
  watch: {
    giveNum(newValue, oldValue) {
      this.checkInfo()
    }
  },
  computed: {
    ...mapState('newYear', ['blessCardBalance']),
    ...mapState('web3', ['chainId']),
    ...mapGetters(['getAccountInfo'])
  },
  mounted() {
    this.cardIndex = this.selectIndex
  },
  methods: {
    getBlur() {
      const sel = window.getSelection();
      this.contentRange = sel.getRangeAt(0);
    },
    onPasteEmojiContent,
    formatEmojiText,
    selectEmoji(e) {
      const newNode = document.createElement('img')
      newNode.alt = e.i
      newNode.src = e.imgSrc
      newNode.className = 'inline-block w-18px h-18px mx-2px'
      if(!this.contentRange) return
      this.contentRange.insertNode(newNode)
      this.$refs.descEmojiPopover.hide()
    },
    formatElToTextContent(el) {
      el.innerHTML = el.innerHTML.replaceAll('<div>', '\n')
      el.innerHTML =el.innerHTML.replaceAll('</div>', '\n')
      el.innerHTML =el.innerHTML.replaceAll('<br>', '')
      let content = ''
      for(let i of el.childNodes) {
        if(i.nodeName==='#text') {
          content += i.textContent
        } else if(i.nodeName === 'IMG') {
          content += i.alt
        }
      }
      return content
    },
    cardChange(index) {
      this.cardIndex = index
      this.checkInfo()
    },
    checkInfo() {
      console.log(3);
      const cardBalance = this.blessCardBalance[this.cardIndex+1];
      if (cardBalance < this.giveNum) {
        this.giveEnable = false
        return false
      }
      if (!ethers.utils.isAddress(this.toAddress)) {
        this.giveEnable = false;
        return false
      }
      this.giveEnable = true;
      return true;
    },
    async onGive() {
      this.step = 1;
      return;
      if (!this.checkInfo()) return;
      try{
        this.giveLoading = true
        const id = this.cardIndex + 1;
        const tx = await send11155ToUser(NEW_YEAR_CARD_CONTRACT, id, this.giveNum, this.getAccountInfo.ethAddress, this.toAddress)
        if (ethers.utils.isAddress(this.giveTo)) {
          this.$emit('close')
        }else {
          this.step=1
        }
      } catch (e) {
        console.log(64, e);
        notify({message: this.$t('err.transErr'), duration: 3000, type: 'error'})
      } finally {
        this.giveLoading = false
      }
    },
    onShare() {
      this.tweetContent = this.formatElToTextContent(this.$refs.contentRef)
      window.open('https://twitter.com/intent/tweet?text=' + this.tweetContent + '%0a%23iweb3 %23Spring_Festival')
      this.$emit('close')
    },
    async verify() {
      this.showUserNotExist = false;
      if (!this.giveTo) {
        return;
      }
      const usernameRex = '^@?[0-9a-zA-Z\_]+$'
      const match = this.giveTo.match(usernameRex)
      if (ethers.utils.isAddress(this.giveTo)) {
        this.toAddress = this.giveTo
      }else if (match) {
        try{
          this.isChecking = true
          const user = await getUserInfo(this.giveTo);
          if (user && user.code === 3) {
            const account = user.account;
            const { ethAddress } = account;
            this.toAddress = ethAddress
          }else {
            this.showUserNotExist = true;
            notify({message: this.$t('tips.userNotExist'), duration: 3000, type: 'info'})
          }
        } catch (e) {
          if (e === 'log out') {
            this.$router.replace('/square')
          }
        } finally {
          this.isChecking = false
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
