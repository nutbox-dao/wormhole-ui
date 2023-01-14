<template>
  <div class="container px-15px mx-auto max-w-50rem md:max-w-48rem">
    <div class="my-2rem">
      <el-carousel height="14rem" :autoplay="true"
                   ref="bannerRef"
                   indicator-position="none"
                   :initial-index="bannerIndex"
                   @change="bannerChange">
        <el-carousel-item>
          <div @click="gotoUrl(wh3Info)"
               class="cursor-pointer gradient-bg-color3 rounded-8px overflow-hidden
                      h-full flex justify-between items-center">
            <img class="w-full h-full object-cover object-center" :src="wh3Info.poster" alt="">
          </div>
        </el-carousel-item>
        <el-carousel-item v-for="item in banners" :key="item">
          <div @click="gotoUrl(item)"
               class="cursor-pointer gradient-bg-color3 rounded-8px overflow-hidden
                      h-full flex justify-between items-center">
            <img class="w-full h-full object-cover object-center" :src="item.poster" alt="">
            <!-- <div class="w-full xs:w-2/3 text-left z-2">
              This first banner is reserved for wormhole3 to introduce itself.
              The 2nd to 4th banners are used for project owners who want to advertise themselves.

              This is the introduction of wormhole3. And need some UI design.
            </div> -->
          </div>
        </el-carousel-item>
      </el-carousel>
      <div class="flex justify-center items-center gap-8px mt-1rem">
        <button v-if="wh3Info" @click="$refs.bannerRef.setActiveItem(0)">
          <img v-if="bannerIndex===0" class="w-20px h-20px" src="~@/assets/logo.png" alt="">
          <img v-else class="w-20px h-20px" src="~@/assets/icon-logo-grey.svg" alt="">
        </button>
        <button v-for="(banner, index) of banners" :key="index"
                @click="$refs.bannerRef.setActiveItem(index+1)"
                class="w-20px h-12px rounded-4px block"
                :class="index+1===bannerIndex?'bg-color62':'border-1 border-colorA0'"></button>
      </div>
    </div>
    <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
         v-if="loading && (!curations || curations.length === 0)">
      <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
    </div>
    <div v-else>
      <div class="flex justify-between items-center">
        <span class="font-bold">{{$t('curation.recommendedCurations')}}</span>
        <button class="gradient-text gradient-bg-color3"
                @click="$router.push('/curations')">>>></button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-1rem py-1rem">
        <CurationRecommendItem v-for="(curation, index) of curations" :key="index"
                               class="col-span-1 recommend-curation"
                               :show-btn-group="false"
                               :curation="curation"
                               :content-type="'none'"
                               @getCard="getCardVisible=true"
                               @click="gotoDetail(curation)"/>
      </div>
      <div class="mb-2rem">
        <button class="px-20px min-w-10rem h-44px 2xl:h-2.2rem bg-tag-gradient rounded-12px text-white font-bold"
        @click="$router.push('/curations')">
          {{$t('common.viewMore')}}
        </button>
      </div>
    </div>
    <!-- create curation   -->
    <button
        class="flex items-center justify-center bg-color62 sm:hidden
               h-44px w-44px min-w-44px 2xl:w-2.2rem 2xl:min-w-2.2rem 2xl:h-2.2rem
               rounded-full mt-0.5rem c-text-bold fixed bottom-2rem right-1.5rem sm:right-2.5rem z-2"
        @click="createCuration">
      <img class="w-20px min-w-20px h-20px 2xl:w-1rem 2xl:h-1rem" src="~@/assets/icon-add-white.svg" alt="">
    </button>
  </div>
</template>

<script>
import CurationRecommendItem from "@/components/CurationRecommendItem";
import {mapState} from "vuex";
import { getRecommendedCurations, getBanner } from "@/api/api";
import {showError} from "@/utils/notify";

export default {
  name: "CurationsRecommend",
  components: {CurationRecommendItem},
  data() {
    return {
      curations:[],
      banners: [],
      bannerIndex: 0,
      wh3Info: {
        poster: '',
        url: 'https://alpha.wormhole3.io'
      },
      loading: true
    }
  },
  mounted() {
    this.updatePage()
    setInterval(() => {
      this.updatePage()
    }, 60000);

  },
  methods: {
    bannerChange(value) {
      this.bannerIndex = value
    },
    gotoDetail(curation) {
      this.$store.commit('curation/saveDetailCuration', curation);
      this.$router.push('/curation-detail/' + curation.curationId);
    },
    gotoUrl(banner) {
      window.open(banner.url)
    },
    updatePage() {
      getRecommendedCurations().then(curations => {
        this.curations = curations;
        this.loading = false
      }).catch();
      getBanner().then(banners => {
        this.loading = false
        this.banners = banners
      }).catch();
    },
    createCuration() {
      if (this.getAccountInfo?.twitterId) {
        this.$router.push('/create-curation')
      }else {
        this.$store.commit('saveShowLogin', true)
      }
    }
  }
}
</script>

<style scoped>

</style>
