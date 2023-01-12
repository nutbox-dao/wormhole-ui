<template>
  <div class="relative text-left pb-3rem sm:pb-1.5rem  flex flex-col text-14px 2xl:text-0.8rem overflow-auto">
    <button class="absolute right-20px top-20px"
            @click="close">
      <i class="w-18px h-18px 2xl:w-1rem 2xl:h-1rem icon-close"></i>
    </button>
    <div class="gradient-text gradient-text-right mx-auto c-text-black text-20px xl:text-1.2rem mt-3rem">
      {{$t('ny.congratulations')}}
    </div>
    <div class="my-20px px-15px sm:w-8/10 mx-auto text-center">
      <div class="relative w-20rem max-w-240px mx-auto">
        <img class="w-full"
             :src="require(`@/assets/red-envelope/card${newCardId}.png`)" alt="">
        <div class="absolute top-20px left-20px text-white font-bold text-20px opacity-50">{{ BLESS_CARD_NAME[newCardId] }}</div>
        <div class="absolute bottom-30px right-30px text-white font-bold text-20px ">{{ $t('common.balance') }}: {{ balance }}</div>
      </div>
      <div class="my-20px text-left whitespace-pre-line">
        {{ BLESS_CARD_DESC[newCardId] }}
      </div>
      <div class="flex flex-col">
        <button class="bg-red-gradient text-white font-bold h-44px 2xl:h-2.2rem w-10rem mx-auto rounded-8px"
                @click="close">
          {{$t('ny.get')}}
        </button>
        <button class="underline mt-20px font-bold" @click="goteCollection">
          {{$t('ny.checkCollections')}}
        </button>
      </div>
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
      BLESS_CARD_DESC
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
      this.$store.commit('saveGetCardVisible', false)
    },
    goteCollection() {
      this.$router.push('/red-envelope');
      this.close();
    }
  },
  mounted () {
    if(this.getAccountInfo && this.getAccountInfo.ethAddress) {
      getUserNYCards(this.getAccountInfo.ethAddress).catch()
    }
  },
}
</script>

<style scoped>

</style>
