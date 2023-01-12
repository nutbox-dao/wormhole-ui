<template>
  <div class="container px-15px mx-auto max-w-50rem md:max-w-48rem">
    <div class="mt-2rem">
      <el-carousel height="14rem" indicator-position="outside">
        <el-carousel-item v-for="item in 4" :key="item">
          <div class="gradient-bg-color3 rounded-8px h-full flex justify-between items-center p-2rem">
            <img class="h-4/5 absolute right-2rem" src="~@/assets/logo.png" alt="">
            <div class="w-full xs:w-2/3 text-left z-2">
              This first banner is reserved for wormhole3 to introduce itself.
              The 2nd to 4th banners are used for project owners who want to advertise themselves.

              This is the introduction of wormhole3. And need some UI design.
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
         v-if="loading && (!curationsList || curationsList.length === 0)">
      <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
    </div>
    <div v-else>
      <div class="flex justify-between items-center">
        <span class="font-bold">{{$t('curation.recommendedCurations')}}</span>
        <button class="gradient-text gradient-text-purple-white">>>></button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-1rem py-1rem">
        <CurationItem v-for="(curation, index) of 10" :key="index"
                      class="col-span-1 "
                      blog-rp-class="hidden"
                      :show-btn-group="false"
                      :curation="testData"
                      :content-type="'none'"
                      @getCard="getCardVisible=true"
                      @click="gotoDetail(curation)"/>
      </div>
      <div class="mb-2rem">
        <button class="px-20px min-w-10rem h-44px 2xl:h-2.2rem bg-tag-gradient rounded-12px"
        @click="$router.push('/curations')">
          {{$t('common.viewMore')}}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import CurationItem from "@/components/CurationItem";
import {mapState} from "vuex";
import {getCurations} from "@/api/api";
import {showError} from "@/utils/notify";
export default {
  name: "CurationsRecommend",
  components: {CurationItem},
  data() {
    return {
      loading: true,
      curationsList: [],
      testData:  {
        "curationId": "8a04b53165af",
        "creatorTwitter": "1564127353290526721",
        "creatorETH": "0x23298d8002226991abc8988496b2cad9f9d6face",
        "description": "Zodiac Elites 2023, Never Miss it\n生肖之美2023，让我们一起来关注。\n",
        "token": "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        "amount": "5000000",
        "decimals": 6,
        "maxCount": 9999999,
        "endtime": 1672992000,
        "tweetId": "1610528457859149824",
        "createdTime": "2023-01-04T07:36:39.000Z",
        "tasks": 13,
        "authorId": "1484524518592991234",
        "spaceId": null,
        "curationType": 1,
        "chainId": 137,
        "tokenName": "(PoS) Tether USD",
        "tokenSymbol": "USDT",
        "curationStatus": 2,
        "createStatus": 1,
        "creatorProfileImg": "https://pbs.twimg.com/profile_images/1608203173566550019/TBIQtd91_normal.jpg",
        "creatorTwitterName": "xPass+ | Metaverse Travel Lab",
        "creatorTwitterUsername": "xPass_Plus",
        "creatorSteemId": "zodiacelitesnft",
        "username": "ZodiacElitesNFT",
        "name": "Zodiac Elites NFT",
        "profileImg": "https://pbs.twimg.com/profile_images/1609963755974320128/HbvxGpJ5_normal.jpg",
        "ethAddress": "0xD9aC04808e2771b74Dc489Ffe1CA7F4Df229b16a",
        "postId": "1610528457859149824",
        "content": "Do you know? These designs are very meaningful\n你知道吗？ 这些设计很有深意\nhttps://pbs.twimg.com/media/Flm-gMOaUAAc6IQ.jpg",
        "postTime": "2023-01-04T07:36:39.000Z",
        "tags": "[\"iweb3\"]",
        "steemId": "wh0xtravel",
        "retweetInfo": null,
        "pageInfo": null,
        "hostIds": null,
        "speakerIds": null,
        "spaceTitle": null,
        "spaceState": null,
        "spaceStartedAt": null,
        "spaceEndedAt": null,
        "totalCount": 65,
        "curatorProfile": ["https://pbs.twimg.com/profile_images/1558088810172653568/lJlb86_T_normal.jpg", "https://pbs.twimg.com/profile_images/1600704983292612608/soc4jc7R_normal.jpg", "https://pbs.twimg.com/profile_images/1573804650058244096/ZniHzlCS_normal.jpg"]
      }
    }
  },
  mounted() {

  },
  methods: {

    gotoDetail(curation) {
      this.$store.commit('curation/saveDetailCuration', curation);
      this.$router.push('/curation-detail/' + curation.curationId);
    }
  }
}
</script>

<style scoped>

</style>
