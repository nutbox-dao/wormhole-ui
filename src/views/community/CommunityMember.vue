<template>
  <div class="py-20px">
    <div class="c-text-black text-1.8rem mb-3rem min-h-1rem"
         v-if="listLoading && (!memberList || memberList.length === 0)">
      <img class="w-5rem mx-auto py-3rem" src="~@/assets/profile-loading.gif" alt="" />
    </div>
    <div v-else-if="!listLoading && (!memberList || memberList.length === 0)" class="py-2rem">
      <img class="w-50px mx-auto" src="~@/assets/no-data.svg" alt="" />
      <div class="text-color8B light:text-color7D text-12px mt-15px">{{$t('common.none')}}</div>
    </div>
    <van-list v-else
              :loading="listLoading"
              :finished="listFinished"
              :immediate-check="false"
              :loading-text="$t('common.loading')"
              :finished-text="memberList.length!==0?$t('common.noMore'):''"
              @load="onLoad">
      <div class="flex justify-between items-center px-15px c-text-black text-14px py-10px">
        <span class="w-3/7 text-left">{{$t('community.member')}}</span>
        <span class="w-2/7 text-right">{{$t('community.joinTime')}}</span>
        <span class="w-2/7 text-right">{{$t('community.communityToken')}}</span>
      </div>
      <div class="flex justify-between items-center px-15px text-14px py-10px"
           v-for="(item, index) of memberList" :key="index">
        <div class="flex items-center w-3/7 truncate">
          <img class="w-32px min-w-32px h-32px rounded-full mr-5px"
               :src="item.profileImg || defaultAvatar" alt="">
          <span class="truncate">{{item.twitterUsername}}</span>
        </div>
        <span class="w-2/7 text-right">2021-09-12</span>
        <span class="w-2/7 text-right">9.2(0.29$)</span>
      </div>
    </van-list>
  </div>
</template>

<script>
import defaultAvatar from '@/assets/icon-default-avatar.svg'
export default {
  name: "CommunityMember",
  data() {
    return {
      defaultAvatar,
      listLoading: false,
      listFinished: false,
      memberList: []
      // memberList: [{"twitterId":"3419530221","twitterName":"⭐Zvezda Crypto","twitterUsername":"C_Zvezdaa","profileImg":"https://pbs.twimg.com/profile_images/1653485193808826373/H0DBPYya_normal.jpg","createAt":"2023-05-12T14:23:42.000Z","id":359344,"curationId":"23ba1526c4af","amount":"0","isFeed":0,"token":"0x217dffF57E3b855803CE88a1374C90759Ea071bD","decimals":18,"tokenName":"Wrapped NULS","tokenSymbol":"WNULS","taskStatus":0,"totalCount":6},{"twitterId":"1397026760114335749","twitterName":"Leo.bnb Web 3 Camp","twitterUsername":"Leo69129849","profileImg":"https://pbs.twimg.com/profile_images/1479014955227631616/9uck0k8A_normal.jpg","createAt":"2023-05-12T12:52:43.000Z","id":359212,"curationId":"23ba1526c4af","amount":"0","isFeed":0,"token":"0x217dffF57E3b855803CE88a1374C90759Ea071bD","decimals":18,"tokenName":"Wrapped NULS","tokenSymbol":"WNULS","taskStatus":0,"totalCount":6},{"twitterId":"1654915931213004801","twitterName":"Abmustafa","twitterUsername":"Abmustafa340","profileImg":"https://pbs.twimg.com/profile_images/1655622288094507012/BF4L87Yl_normal.jpg","createAt":"2023-05-12T12:31:41.000Z","id":359189,"curationId":"23ba1526c4af","amount":"0","isFeed":0,"token":"0x217dffF57E3b855803CE88a1374C90759Ea071bD","decimals":18,"tokenName":"Wrapped NULS","tokenSymbol":"WNULS","taskStatus":0,"totalCount":6},{"twitterId":"1005908138237878272","twitterName":"Abdulkadir","twitterUsername":"Abdulkadir007ab","profileImg":"https://pbs.twimg.com/profile_images/1624717814748569602/CR0qcrvt_normal.jpg","createAt":"2023-05-12T12:26:04.000Z","id":359147,"curationId":"23ba1526c4af","amount":"0","isFeed":0,"token":"0x217dffF57E3b855803CE88a1374C90759Ea071bD","decimals":18,"tokenName":"Wrapped NULS","tokenSymbol":"WNULS","taskStatus":0,"totalCount":6},{"twitterId":"1086512818843774976","twitterName":"Donut","twitterUsername":"Adedotu69664225","profileImg":"https://pbs.twimg.com/profile_images/1566911992409071617/UFUsKISL_normal.jpg","createAt":"2023-05-12T12:24:36.000Z","id":359129,"curationId":"23ba1526c4af","amount":"0","isFeed":0,"token":"0x217dffF57E3b855803CE88a1374C90759Ea071bD","decimals":18,"tokenName":"Wrapped NULS","tokenSymbol":"WNULS","taskStatus":0,"totalCount":6},{"twitterId":"419295898","twitterName":"Aliu Herpheezy","twitterUsername":"herpheezy","profileImg":"https://pbs.twimg.com/profile_images/1251775841073278981/Qn3vPT3R_normal.jpg","createAt":"2023-05-12T11:52:33.000Z","id":359108,"curationId":"23ba1526c4af","amount":"0","isFeed":0,"token":"0x217dffF57E3b855803CE88a1374C90759Ea071bD","decimals":18,"tokenName":"Wrapped NULS","tokenSymbol":"WNULS","taskStatus":0,"totalCount":6}]
    }
  },
  methods: {
    onLoad() {

    }
  }
}
</script>

<style scoped>

</style>
