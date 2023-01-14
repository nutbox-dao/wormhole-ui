<template>
  <div class="relative text-left pb-1.5rem  flex flex-col text-14px 2xl:text-0.8rem overflow-auto ny-modal-bg">
    <button class="fixed right-20px top-20px z-99"
            @click="close">
      <img class="w-26px h-26px min-w-26px" src="~@/assets/red-envelope/icon-close.svg" alt="">
    </button>
    <div class="relative h-100px min-h-100px flex items-center justify-center mt-1rem">
      <div class="ny-gradient-text italic mx-auto c-text-black text-36px xl:text-1.8rem">
        {{$t('ny.congratulations')}}
      </div>
      <img class="h-100px absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
           src="~@/assets/red-envelope/modal-title-bg.png" alt="">
    </div>
    <div class="px-15px sm:w-8/10 mx-auto text-center flex flex-col items-center">
      <div class="relative w-220px ny-card-text get-card">
        <img v-if="newCardId === 4" src="~@/assets/red-envelope/rare-card.png" alt="">
        <img v-else src="~@/assets/red-envelope/lucky-card.png" alt="">
        <div class="w-full px-18px absolute top-36px flex flex-col items-center">
          <img class="w-full rounded-8px"
               :src="require(`@/assets/red-envelope/card${newCardId}.png`)" alt="">
          <div class="flex items-center justify-between px-10px mt-20px w-full">
            <img src="~@/assets/red-envelope/icon-title-tag.svg" alt="">
            <span class=" text-20px">{{ BLESS_CARD_NAME[newCardId] }}</span>
            <img class="transform rotate-180" src="~@/assets/red-envelope/icon-title-tag.svg" alt="">
          </div>
          <button class="bg-white px-15px h-30px red-download-btn flex justify-center items-center rounded-full mt-4px"
                  @click="onDownload">
            <img class="w-14px h-14px mr-4px" src="~@/assets/red-envelope/icon-download-red.svg" alt="">
            <span class="whitespace-nowrap font-bold text-14px">{{$t('ny.downloadImg')}}</span>
          </button>
        </div>
      </div>
      <div class="my-20px text-left whitespace-pre-line ny-color4E sm:px-1/10">
        {{ BLESS_CARD_DESC[newCardId] }}
      </div>
      <div class="flex gap-6px xs:gap-16px w-full">
        <button class="flex-1 h-44px 2xl:h-2.2rem font-bold text-color62 rounded-full
                       border-1 border-color62"
                @click="goteCollection">
          {{$t('ny.checkCollections')}}
        </button>
        <button class="flex-1 ny-gradient-btn rounded-full font-bold h-44px 2xl:h-2.2rem"
                @click="close">
          {{$t('ny.get')}}
        </button>
      </div>
      <button class="flex justify-center items-center max-w mx-auto h-38px 2xl:h-1.8rem mt-10px
                     border-b-2px border-colorBlue">
        <img src="~@/assets/icon-twitter-blue.svg" alt="">
        <span class="text-colorBlue font-bold" @click="share">{{$t('ny.shareTweet')}}</span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { BLESS_CARD_NAME, BLESS_CARD_DESC } from '@/ny-config'
import { getUserNYCards } from '@/utils/new-year'

export default {
  name: "GetCardModal",
  data() {
    return {
      BLESS_CARD_NAME,
      BLESS_CARD_DESC,
      cardUrls: [
        'https://cdn.wherein.mobi/wormhole3/newyear/card0.png',
        'https://cdn.wherein.mobi/wormhole3/newyear/card1.png',
        'https://cdn.wherein.mobi/wormhole3/newyear/card2.png',
        'https://cdn.wherein.mobi/wormhole3/newyear/card3.png',
        'https://cdn.wherein.mobi/wormhole3/newyear/card4.png',
      ]
    }
  },
  computed: {
    ...mapState(['newCardId']),
    ...mapState('newYear', ['blessCardBalance']),
    ...mapGetters(['getAccountInfo']),
    balance() {
      return this.blessCardBalance[this.newCardId] + 1;
    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.$store.commit('saveGetCardVisible', false)
    },
    goteCollection() {
      this.$router.push('/red-envelope');
      this.close();
    },
    share() {
      const name = BLESS_CARD_NAME[this.newCardId];
      window.open(`https://twitter.com/intent/tweet?text=I get a ${name} cards to participate in @wormhole_3 Lunar New Year campaign.%0aCome join us here: https://alpha.wormhole3.io.`);
      this.close()
    },
    onDownload() {
      let canvas = document.createElement('canvas')
      let context = canvas.getContext('2d')
      let aLink = document.createElement('a')
      aLink.download = 'card'
      aLink.style.display = 'none'
      let img = new Image;
      img.setAttribute('crossOrigin', 'anonymous')
      img.src= this.cardUrls[this.newCardId]
      img.onload = function(){
        canvas.width = img.width
        canvas.height = img.height
        context.drawImage(img,0,0);
        aLink.href = canvas.toDataURL('image/jpeg')
        document.body.appendChild(aLink)
        aLink.click();
        document.body.removeChild(aLink)
      }
    },
  },
  mounted () {
    if(this.getAccountInfo && this.getAccountInfo.ethAddress) {
      getUserNYCards(this.getAccountInfo.ethAddress).catch()
    }
  },
}
</script>

<style scoped lang="scss">
.red-download-btn {
  box-shadow: 0px 2px 10px rgba(201, 7, 85, 0.69);
  span {
    background: linear-gradient(180deg, #F5319D 0%, #FC6767 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
}
</style>
