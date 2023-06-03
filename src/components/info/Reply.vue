<template>
  <div class="flex ">
    <div class="w-32px h-32px min-w-32px min-h-32px flex items-center justify-center mr-8px mt-15px">
      <img class="w-32px h-32px min-w-32px min-h-32px rounded-full"
           :src="infoData.profileImg" alt="">
    </div>
    <div class="flex-1 flex flex-col items-start py-15px border-b-1 border-color8B/30 light:border-color7F">
      <div class="flex items-center" >
        <span class="text-14px c-text-black mr-4px">{{ infoData.twitterName }}</span>
        <span class="text-12px leading-18px text-color8B light:text-color7D">
          @{{ infoData.twitterUsername }}
        </span>
        <span class="mx-4px text-color8B light:text-color7D"> · </span>
        <span class="whitespace-nowrap text-12px leading-18px 2xl:text-0.7rem 2xl:leading-1rem text-color8B light:text-color7D">
         {{ parseTimestamp(infoData.time) }}
        </span>
      </div>
      <div class="text-14px my-3px">
        <span class="text-color66 mr-6px">{{$t('curation.reply')}}</span>
        <button class="text-colorBlue">
          @{{getAccountInfo ? getAccountInfo.twitterUsername : " "}}
        </button>
      </div>
      <div class="w-full my-5px text-left text-14px leading-20px">
        这里是回复内容
      </div>
      <PostButtonGroup ref="postButtonRef"
                       class="mt-5px w-full"
                       :id="postData.postId"
                       :post="postData"></PostButtonGroup>
    </div>
  </div>
</template>

<script>
import {parseTimestamp} from "@/utils/helper";
import {mapGetters} from "vuex";
import PostButtonGroup from "@/components/PostButtonGroup.vue";
export default {
  name: "Reply",
  components: {PostButtonGroup},
  props: {
    infoData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      postData: {
        "postId": "1664087667859165185",
        "twitterId": "1135366114358116354",
        "name": "abcallen",
        "username": "abcallenhu",
        "reputation": 157,
        "ethAddress": "0xCA141D558E91885b1a244Ec6fbbCFfc5f06acD10",
        "content": "Participate in the event to share $10000PNUT🎉🎊😍\nbonus🎁 $10000PNUT \nHow to participate👇🎉\n✅Sign up for Wormhole3\nUser Guide: https://alpha.wormhole3.io/userguide\n✅Follow @wormhole_3 \n✅Post content with \n#iweb3 #Wormhole3\nFYI =&gt; https://alpha.wormhole3.io/curation-detail/c3457e3d9c9e\nhttps://pbs.twimg.com/media/FxgF5OHaEAIwmj2.jpg",
        "postTime": "2023-06-01T01:53:11.000Z",
        "profileImg": "https://pbs.twimg.com/profile_images/1658677806749061120/9AjwngZ-_normal.png",
        "tags": "[\"iweb3\",\"Wormhole3\"]",
        "steemId": "abcallenhu838",
        "retweetInfo": null,
        "pageInfo": null,
        "location": "null",
        "space_id": null,
        "isCurated": 1,
        "isPromoted": 0,
        "longContentStatus": 0,
        "isDel": 0,
        "spaceTitle": null,
        "spaceState": null,
        "spaceStartedAt": null,
        "spaceId": null,
        "spaceEndedAt": null,
        "quoteCount": 2,
        "retweetCount": 0,
        "replyCount": 0,
        "likeCount": 0,
        "followCount": 0,
        "curationId": "3785f23e9cf4",
        "communityId": "cab1b9a9ee34",
        "communityName": "Peanut",
        "communityIcon": "https://cdn.wherein.mobi/nutbox/v2/1645760918196",
        "reward": [
          {
            "token": "0x705931A83C9b22fB29985f28Aee3337Aa10EFE11",
            "amount": "0",
            "decimals": 18,
            "tokenName": "Peanut",
            "tokenSymbol": "PNUT",
            "chainId": 56,
            "tweetId": "1664087667859165185",
            "authorReward": null,
            "isPromotion": 1
          }
        ],
        "quoted": 0,
        "retweeted": 0,
        "replied": 0,
        "liked": 0,
        "followed": 0,
        "downVote": null
      }
    }
  },
  computed: {
    ...mapGetters(["getAccountInfo"]),
  },
  methods: {
    parseTimestamp
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>
