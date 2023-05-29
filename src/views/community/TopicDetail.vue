<template>
  <div class="h-full overflow-auto 2md:px-15px" ref="detailPageRef" @scroll="pageScroll">
    <div v-if="scroll>30 || width>640"
         class="fixed w-full top-0 left-0 z-1 px-15px h-70px flex justify-center items-center 2md:hidden
                bg-primaryBg light:bg-white border-b-1 border-headerBorder light:border-headerBorderLight">
      <button @click="$router.go(-1)" class="absolute left-15px">
        <i class="icon-back w-20px h-20px"></i>
      </button>
      <span class="text-20px c-text-black">{{showingCommunity.communityName}}</span>
    </div>
    <div v-else
         class="fixed w-full top-0 left-0 z-1 px-15px h-70px flex justify-center items-center 2md:hidden">
      <button @click="$router.go(-1)" class="absolute left-15px">
        <img class="w-20px h-20px" src="~@/assets/icon-back.svg" alt="">
      </button>
    </div>
    <div class="container mx-auto w-full sm:max-w-50rem">
      <div class="hidden 2md:flex h-70px items-center ">
        <button @click="$router.go(-1)"
                class="w-40px h-40px bg-white/20 rounded-full flex items-center justify-center">
          <img class="w-20px h-20px" src="~@/assets/icon-back.svg" alt="">
        </button>
      </div>
    </div>
    <div class="sm:pt-85px 2md:pt-0 pb-20px">
      <div class="2md:grid grid-cols-3 gap-15px container mx-auto sm:max-w-50rem">
        <div class="col-span-2 sm:border-1 border-color8B/30 light:border-color7F rounded-16px">
          <div class="relative bg-blockBg light:bg-white sm:rounded-t-16px
                      flex flex-col">
            <c-image :src="showingCommunity.banner"
                     class="w-full h-160px min-h-160px max-h-160px object-cover"></c-image>
            <div class="flex justify-between items-center bg-color1A h-40px px-15px">
              <span class="c-text-black text-16px text-white">#DAO HK 2023</span>
              <div class="flex items-center">
                <i class="w-18px h-18px btn-icon-tip"></i>
                <span class="px-8px font-700 text-12px text-color7D">$0.82</span>
              </div>
            </div>
          </div>
          <div class="px-15px">
            <div class="flex justify-between items-center my-15px">
              <span class="text-12px flex items-center text-white light:text-color62 h-28px px-10px rounded-full
                           bg-color62 light:bg-colorF7F9">
                {{$t('community.distanceStartTime')}}：
                <van-count-down class="text-12px text-white light:text-color62"
                                :time="countdown(new Date('2023-05-17 00:00:00').getTime()/1000)">
                  <template #default="timeData">
                    {{ timeData.days }} {{$t('common.day')}}
                    {{ timeData.hours }} {{$t('common.hour')}}
                    {{ timeData.minutes }} {{$t('common.minute')}}
                    {{ timeData.seconds }} {{$t('common.second')}}
                  </template>
                </van-count-down>
              </span>
              <div class="flex justify-between items-center">
                <div class="flex items-center ml-11px">
                  <div class="-ml-11px" v-for="p of participant.slice(0,3)" :key="p">
                    <img v-if="p.profileImg"
                         class="w-28px min-w-28px h-28px rounded-full
                                border-2px border-color62 light:border-white bg-color8B/10"
                         :src="p.profileImg" alt="">
                    <img v-else
                         class="w-28px min-w-28px h-28px rounded-full
                              border-2px border-color62 light:border-white bg-color8B/10"
                         src="~@/assets/icon-default-avatar.svg" alt="">
                  </div>
                  <span v-if="participant.length>3"
                        class="h-28px flex items-center pl-4px font-bold text-12px text-color99">
                    {{ participant[0].totalCount - 3 }}+
                  </span>
                </div>
              </div>
            </div>
            <div class="text-14px leading-20px text-left pb-15px">
              🎉  Welcome to the CrossSpace chill group, where everyone is encouraged to engage in lighthearted banter!
              🚀  And then the CrossSpace officials will generously shower crossers with
              🌧️  Seems quiet now with not many people around = =
              Is this the calm before the storm? Tsk tsk tsk.
              ⚡️  Come on, let the storm rage on even more fiercely!
              🔥   Let's get it!   🔥
            </div>
          </div>
          <div class="w-7/10 h-1px mx-auto bg-color8B/30 light:bg-color7F my-20px hidden 2md:block"></div>
          <div class="flex items-center justify-center gap-30px h-48px text-18px font-bold 2md:hidden
                border-b-0.5px border-color8B/30 light:border-color7F bg-primaryBg light:bg-white
                sticky top-70px 2md:top-0 z-9 shadow-tab">
            <button class="h-full px-10px"
                    :class="tabIndex===0?'active-tab text-color62':'text-color7D'"
                    @click="tabIndex=0">
              {{$t('community.post')}}
            </button>
            <button class="h-full px-10px"
                    :class="tabIndex===1?'active-tab text-color62':'text-color7D'"
                    @click="tabIndex=1">
              {{$t('community.award')}}
            </button>
          </div>
          <div class="px-15px">
            <template v-if="tabIndex===0">
              <div class="flex items-center justify-between pt-10px">
                <span class="c-text-black text-14px">Post (341)</span>
                <el-dropdown>
                  <button class="text-14px text-color62 flex items-center">
                    <span class="font-bold">{{postType[typeIndex]}}</span>
                    <img class="w-12px ml-4px" src="~@/assets/icon-arrow-primary.svg" alt="">
                  </button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item v-for="(type, index) of postType" :key="type"
                                        @click="typeIndex=index">
                <span :class="typeIndex===index?'text-color62':''">
                  {{type}}
                </span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              <div v-for="(post, index) of postsList" :key="post.postId"
                   class="py-20px border-b-1 border-color8B/30 light:border-colorD8">
                <Blog :post="post"
                      @click="gotoDetail(post, index)"
                      avatar-class="min-w-35px min-h-35px w-35px h-35px md:w-3rem md:h-3rem">
                </Blog>
              </div>
            </template>
            <template v-if="tabIndex===1">
              <div class="text-left font-bold c-text-black text-14px flex justify-between items-center py-10px">
                <span>{{$t('community.member')}}</span>
                <span>{{$t('community.token')}}</span>
              </div>
              <div v-for="(p, index) of participant" :key="index"
                   class="flex justify-between items-center py-10px gap-15px">
                <div class="flex-1 flex items-center truncate">
                  <img v-if="p.profileImg"
                       class="w-32px h-32px min-w-32px min-h-32px rounded-full bg-colorF7"
                       :src="p.profileImg" alt="">
                  <img v-else
                       class="w-32px h-32px min-w-32px min-h-32px rounded-full bg-colorF7"
                       src="~@/assets/icon-default-avatar.svg" alt="">
                  <span class="truncate ml-8px">{{p.twitterName}}</span>
                </div>
                <span>9.2(0.29$)</span>
              </div>
            </template>
          </div>
        </div>
        <div class="col-span-1 hidden 2md:block">
          <div class="border-1 border-color8B/30 light:border-color7F rounded-12px p-15px">
            <div class="text-left font-bold c-text-black text-16px">{{$t('community.award')}}</div>
            <div v-for="(p, index) of participant" :key="index"
                 class="flex justify-between items-center py-15px gap-15px">
              <div class="flex-1 flex items-center truncate">
                <img v-if="p.profileImg"
                     class="w-28px min-w-28px h-28px xl:w-1.2rem xl:min-w-1.2rem xl:h-1.2rem rounded-full
                        border-2 border-color62 light:border-white bg-color8B/10"
                     :src="p.profileImg" alt="">
                <img v-else
                     class="w-28px min-w-28px h-28px xl:w-1.2rem xl:min-w-1.2rem xl:h-1.2rem rounded-full
                              border-2 border-color62 light:border-white bg-color8B/10"
                     src="~@/assets/icon-default-avatar.svg" alt="">
                <span class="truncate ml-8px">{{p.twitterName}}</span>
              </div>
              <span>9.2(0.29$)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {TokenIcon} from "@/config";
import {formatAddress, isNumeric, onCopy} from "@/utils/tool";
import {useWindowSize} from "@vant/use";
import { mapState, mapGetters } from 'vuex'
import { getCommunityById } from '@/api/api'
import { notify } from "@/utils/notify";
import Blog from "@/components/Blog";
import communityModule from '@/store/community'

export default {
  name: "TopicDetail",
  components: {Blog},
  setup() {
    const { width } = useWindowSize();
    return {
      width
    }
  },
  data() {
    return {
      TokenIcon,
      tabIndex: 0,
      postType: ['trend'],
      typeIndex: 0,
      scroll: 0,
      communityId: '',
      participant: [{"twitterId":"3419530221","twitterName":"⭐Zvezda Crypto","twitterUsername":"C_Zvezdaa","profileImg":"https://pbs.twimg.com/profile_images/1653485193808826373/H0DBPYya_normal.jpg","createAt":"2023-05-12T14:23:42.000Z","id":359344,"curationId":"23ba1526c4af","amount":"0","isFeed":0,"token":"0x217dffF57E3b855803CE88a1374C90759Ea071bD","decimals":18,"tokenName":"Wrapped NULS","tokenSymbol":"WNULS","taskStatus":0,"totalCount":6},{"twitterId":"1397026760114335749","twitterName":"Leo.bnb Web 3 Camp","twitterUsername":"Leo69129849","profileImg":"https://pbs.twimg.com/profile_images/1479014955227631616/9uck0k8A_normal.jpg","createAt":"2023-05-12T12:52:43.000Z","id":359212,"curationId":"23ba1526c4af","amount":"0","isFeed":0,"token":"0x217dffF57E3b855803CE88a1374C90759Ea071bD","decimals":18,"tokenName":"Wrapped NULS","tokenSymbol":"WNULS","taskStatus":0,"totalCount":6},{"twitterId":"1654915931213004801","twitterName":"Abmustafa","twitterUsername":"Abmustafa340","profileImg":"https://pbs.twimg.com/profile_images/1655622288094507012/BF4L87Yl_normal.jpg","createAt":"2023-05-12T12:31:41.000Z","id":359189,"curationId":"23ba1526c4af","amount":"0","isFeed":0,"token":"0x217dffF57E3b855803CE88a1374C90759Ea071bD","decimals":18,"tokenName":"Wrapped NULS","tokenSymbol":"WNULS","taskStatus":0,"totalCount":6},{"twitterId":"1005908138237878272","twitterName":"Abdulkadir","twitterUsername":"Abdulkadir007ab","profileImg":"https://pbs.twimg.com/profile_images/1624717814748569602/CR0qcrvt_normal.jpg","createAt":"2023-05-12T12:26:04.000Z","id":359147,"curationId":"23ba1526c4af","amount":"0","isFeed":0,"token":"0x217dffF57E3b855803CE88a1374C90759Ea071bD","decimals":18,"tokenName":"Wrapped NULS","tokenSymbol":"WNULS","taskStatus":0,"totalCount":6},{"twitterId":"1086512818843774976","twitterName":"Donut","twitterUsername":"Adedotu69664225","profileImg":"https://pbs.twimg.com/profile_images/1566911992409071617/UFUsKISL_normal.jpg","createAt":"2023-05-12T12:24:36.000Z","id":359129,"curationId":"23ba1526c4af","amount":"0","isFeed":0,"token":"0x217dffF57E3b855803CE88a1374C90759Ea071bD","decimals":18,"tokenName":"Wrapped NULS","tokenSymbol":"WNULS","taskStatus":0,"totalCount":6},{"twitterId":"419295898","twitterName":"Aliu Herpheezy","twitterUsername":"herpheezy","profileImg":"https://pbs.twimg.com/profile_images/1251775841073278981/Qn3vPT3R_normal.jpg","createAt":"2023-05-12T11:52:33.000Z","id":359108,"curationId":"23ba1526c4af","amount":"0","isFeed":0,"token":"0x217dffF57E3b855803CE88a1374C90759Ea071bD","decimals":18,"tokenName":"Wrapped NULS","tokenSymbol":"WNULS","taskStatus":0,"totalCount":6}],
      postsList: [{"postId":"1658034493284917251","twitterId":"54315838","name":"Gesvin Romero","username":"gesvin","reputation":-1,"ethAddress":null,"content":"Cómo ChatGPT Transforma el Aprendizaje #Infografía 🔥 \nChatGPT es una inteligencia artificial con el potencial de transformar el aprendizaje y empoderar a los estudiantes. Más información &gt;&gt; http://gesvinromero.com/2023/04/17/ia-como-chatgpt-transforma-el-aprendizaje-infografia/ 🚀\n#InteligenciaArtificial Vía @gesvin💥\nhttps://pbs.twimg.com/media/FwHiA3TWcAMJLKY.jpg","postTime":"2023-05-15T09:00:02.000Z","profileImg":"https://pbs.twimg.com/profile_images/507897581934895104/sq45Lj_A_normal.jpeg","tags":"[\"peanut\",\"Infografía\",\"InteligenciaArtificial\",\"ChatGPT\",\"iweb3\"]","steemId":null,"retweetInfo":null,"pageInfo":"{\"title\":\"IA: Cómo ChatGPT Transforma el Aprendizaje | Infografía\",\"description\":\"¡Hola amigos! hoy compartimos una interesante infografía sobre “Cómo ChatGPT transforma el Aprendizaje» Un gran saludo. Visto en: gesvinromero.com ChatGPT es una inteligencia artificial con el pote…\"}","location":"null","space_id":null,"isCurated":1,"isPromoted":0,"longContentStatus":0,"isDel":0,"spaceTitle":null,"spaceState":null,"spaceStartedAt":null,"spaceId":null,"spaceEndedAt":null,"quoteCount":1,"retweetCount":0,"replyCount":0,"likeCount":0,"followCount":0,"curationId":null,"curationType":null,"communityId":null,"communityName":null,"communityIcon":null,"quoted":0,"retweeted":0,"replied":0,"liked":0,"followed":0},{"postId":"1658034814853816321","twitterId":"2387692261","name":"Oink my God","username":"OinkMyGod","reputation":-1,"ethAddress":null,"content":"¿Qué hacer cuando un cliente no está satisfecho? 🤔 Esta situación puede ser una oportunidad para mejorar tu atención a clientes o la gestión de tu equipo. ✅\n\nTe explicamos 10 maneras (probadas) para recuperar un cliente insatisfecho.⬇️\nhttps://oinkmygod.com/blog/recuperar-cliente-insatisfecho/","postTime":"2023-05-15T09:01:19.000Z","profileImg":"https://pbs.twimg.com/profile_images/1301098884484214785/_ZjGEl5y_normal.jpg","tags":"[\"peanut\",\"iweb3\"]","steemId":null,"retweetInfo":null,"pageInfo":"{\"title\":\"Cómo recuperar a un cliente insatisfecho: 10 argumentos de peso\",\"description\":\"We want to win them back! Te contamos cómo recuperar a un cliente insatisfecho para no perderlo nunca jamás.\"}","location":"null","space_id":null,"isCurated":1,"isPromoted":0,"longContentStatus":0,"isDel":0,"spaceTitle":null,"spaceState":null,"spaceStartedAt":null,"spaceId":null,"spaceEndedAt":null,"quoteCount":1,"retweetCount":0,"replyCount":0,"likeCount":0,"followCount":0,"curationId":null,"curationType":null,"communityId":null,"communityName":null,"communityIcon":null,"quoted":0,"retweeted":0,"replied":0,"liked":0,"followed":0},{"postId":"1658034920080523265","twitterId":"273621658","name":"Jordi San Ildefonso","username":"jordisanildefon","reputation":-1,"ethAddress":null,"content":"Elon Musk va a por WhatsApp: Twitter estrena chats cifrados y prepara notas de voz y vídeo https://www.elespanol.com/omicrono/software/20230510/elon-musk-whatsapp-twitter-estrena-cifrados-prepara/762673735_0.html","postTime":"2023-05-15T09:01:44.000Z","profileImg":"https://pbs.twimg.com/profile_images/1648430239394181120/hD7WkXLF_normal.jpg","tags":"[\"peanut\",\"iweb3\",\"steem\"]","steemId":null,"retweetInfo":null,"pageInfo":"{\"url\":\"https://www.elespanol.com/omicrono/software/20230510/elon-musk-whatsapp-twitter-estrena-cifrados-prepara/762673735_0.html\",\"title\":\"Elon Musk va a por WhatsApp: Twitter estrena chats cifrados y prepara notas de voz y video\",\"siteName\":\"El Español\",\"description\":\"La sección de mensajes directos de Twitter se renueva con un buen número de funciones para rivalizar con las principales apps de mensajería.\",\"mediaType\":\"article\",\"contentType\":\"text/html\",\"images\":[\"https://s1.eestatic.com/2023/03/30/actualidad/752435508_232071062_1200x630.jpg\"],\"videos\":[],\"favicons\":[\"https://s1.eestatic.com/2022/10/04/32x32.png\",\"https://s1.eestatic.com/2022/10/04/96x96.png\",\"https://s1.eestatic.com/2022/10/04/180x180.png\",\"https://s1.eestatic.com/2020/02/26/favicon.ico\"]}","location":"null","space_id":null,"isCurated":1,"isPromoted":0,"longContentStatus":0,"isDel":0,"spaceTitle":null,"spaceState":null,"spaceStartedAt":null,"spaceId":null,"spaceEndedAt":null,"quoteCount":1,"retweetCount":0,"replyCount":0,"likeCount":0,"followCount":0,"curationId":null,"curationType":null,"communityId":null,"communityName":null,"communityIcon":null,"quoted":0,"retweeted":0,"replied":0,"liked":0,"followed":0},{"postId":"1657875326851227648","twitterId":"949404200","name":"🐝 | khariszone.eth","username":"KharismaPramS","reputation":1110,"ethAddress":"0xe342aA98EF275791C4Df2b71F2e9F2DDb409A777","content":"@RYI_Unity UPDATE:\n\nBeta testing currently ongoing for @RyiPay version 8.0 on the #Apple iOS🤩🔐\n\nUser-friendly interface ✅\n\nExtra Speed and Security ✅\n\n#Beta test is looking promising all round,and We are excited to see how it performs in real-world transactions\n\n\nhttps://pbs.twimg.com/media/FwH00aFagAItj-R.jpg\nhttps://pbs.twimg.com/media/FwH00aEaEAA3a-O.jpg","postTime":"2023-05-14T22:27:34.000Z","profileImg":"https://pbs.twimg.com/profile_images/1654542207515492358/A0BsRdjs_normal.png","tags":"[\"Apple\",\"Beta\",\"iweb3\"]","steemId":"kharismaprams","retweetInfo":null,"pageInfo":null,"location":"null","space_id":null,"isCurated":1,"isPromoted":0,"longContentStatus":0,"isDel":0,"spaceTitle":null,"spaceState":null,"spaceStartedAt":null,"spaceId":null,"spaceEndedAt":null,"quoteCount":1,"retweetCount":0,"replyCount":0,"likeCount":0,"followCount":0,"curationId":null,"curationType":null,"communityId":null,"communityName":null,"communityIcon":null,"quoted":0,"retweeted":0,"replied":0,"liked":0,"followed":0},{"postId":"1657745478522658816","twitterId":"1377276171075739652","name":"Suia","username":"Suia2023","reputation":-1,"ethAddress":null,"content":"❤️To thank Sui community for your long-term support, we are giving away a $SUIA gift to all $SUI Holders.\n\n📸Snapshot on 5.14\n💎IF you Hold 5 SUI in your wallet \n🎁Claim Gift at https://suia.io/ on 5.18\n\nTell your 3 #Suinami friends to follow @Suia2023, don't miss the gift\nhttps://pbs.twimg.com/media/FwF-QUaaIAICPgm.jpg","postTime":"2023-05-14T13:51:36.000Z","profileImg":"https://pbs.twimg.com/profile_images/1638452280411451392/Q2mmukw3_normal.jpg","tags":"[\"peanut\",\"Suinami\",\"iweb3\",\"wormhole3\",\"steemit\",\"krsuccess\",\"sui\"]","steemId":null,"retweetInfo":null,"pageInfo":"{\"url\":\"https://suia.io/\",\"title\":\"Suia - Collect your Suia in the Sui world\",\"mediaType\":\"website\",\"contentType\":\"text/html\",\"images\":[],\"videos\":[],\"favicons\":[\"https://suia.io/favicon.ico\"]}","location":"null","space_id":null,"isCurated":1,"isPromoted":0,"longContentStatus":0,"isDel":0,"spaceTitle":null,"spaceState":null,"spaceStartedAt":null,"spaceId":null,"spaceEndedAt":null,"quoteCount":1,"retweetCount":0,"replyCount":0,"likeCount":0,"followCount":0,"curationId":null,"curationType":null,"communityId":null,"communityName":null,"communityIcon":null,"quoted":0,"retweeted":0,"replied":0,"liked":0,"followed":0},{"postId":"1657039944416653318","twitterId":"14607172","name":"BUZZNET","username":"BUZZNET","reputation":-1,"ethAddress":null,"content":"La gente se está aprovechando de las nuevas estaciones de autopago en muchas grandes tiendas, pero después de ver esto, probablemente se asusten.","postTime":"2023-05-12T15:08:03.000Z","profileImg":"https://pbs.twimg.com/profile_images/582911298037506048/FREtN23L_normal.png","tags":"[\"peanut\",\"iweb3\"]","steemId":null,"retweetInfo":null,"pageInfo":null,"location":"null","space_id":null,"isCurated":1,"isPromoted":0,"longContentStatus":0,"isDel":0,"spaceTitle":null,"spaceState":null,"spaceStartedAt":null,"spaceId":null,"spaceEndedAt":null,"quoteCount":1,"retweetCount":0,"replyCount":0,"likeCount":0,"followCount":0,"curationId":null,"curationType":null,"communityId":null,"communityName":null,"communityIcon":null,"quoted":0,"retweeted":0,"replied":0,"liked":0,"followed":0},{"postId":"1657001757921398784","twitterId":"1414473829770883072","name":"SecondLive","username":"SecondLiveReal","reputation":-1,"ethAddress":null,"content":"💸 The 8th Treasures Hunt is ON now! \n\n👗Wear @betfury_gaming uniform to hunt coins worth $3000 $BFG + $BEAN\n\n📍DappRadar Metaverse Space Entry: https://secondlive.world/space/18204\n\n⏰12-14 UTC, May 12 - May 14 Don't be late or you'll miss out⌛️ #FCFS \n\n#ExploreMetaverse @MUA_MUADAO\nhttps://pbs.twimg.com/amplify_video_thumb/1657001471899213824/img/BP9FTrItu74SDQEf.jpg","postTime":"2023-05-12T12:36:19.000Z","profileImg":"https://pbs.twimg.com/profile_images/1619579609909190659/OYICgr0T_normal.jpg","tags":"[\"peanut\",\"FCFS\",\"ExploreMetaverse\",\"metaverse\",\"nft\",\"casino\",\"ama\",\"iweb3\"]","steemId":null,"retweetInfo":null,"pageInfo":"{\"url\":\"https://secondlive.world/space/18204\",\"title\":\"SecondLive - Space | SecondLive\",\"description\":\"SecondLive spaces,personal space and mvb space entries\",\"mediaType\":\"website\",\"contentType\":\"text/html\",\"images\":[],\"videos\":[],\"favicons\":[\"https://secondlive.world/favicon.ico\"]}","location":"null","space_id":null,"isCurated":1,"isPromoted":0,"longContentStatus":0,"isDel":0,"spaceTitle":null,"spaceState":null,"spaceStartedAt":null,"spaceId":null,"spaceEndedAt":null,"quoteCount":1,"retweetCount":0,"replyCount":0,"likeCount":0,"followCount":0,"curationId":null,"curationType":null,"communityId":null,"communityName":null,"communityIcon":null,"quoted":0,"retweeted":0,"replied":0,"liked":0,"followed":0},{"postId":"1657277014599176192","twitterId":"759333340633665536","name":"imToken - Crypto Wallet","username":"imTokenOfficial","reputation":-1,"ethAddress":null,"content":"🍾You're invited to imToken's #Sweet7 Anniversary celebration! 🎂  \n\n🎉With non-stop giveaways and special events that you won't want to miss.  \n\nMark your calendars now👇\nhttps://pbs.twimg.com/media/Fv_SS87aUAEqsVr.jpg","postTime":"2023-05-13T06:50:05.000Z","profileImg":"https://pbs.twimg.com/profile_images/1620618258876604416/TaeDcu5u_normal.jpg","tags":"[\"peanut\",\"Sweet7\",\"sweet7\",\"iweb3\"]","steemId":null,"retweetInfo":null,"pageInfo":null,"location":"null","space_id":null,"isCurated":1,"isPromoted":0,"longContentStatus":0,"isDel":0,"spaceTitle":null,"spaceState":null,"spaceStartedAt":null,"spaceId":null,"spaceEndedAt":null,"quoteCount":2,"retweetCount":0,"replyCount":0,"likeCount":0,"followCount":0,"curationId":null,"curationType":null,"communityId":null,"communityName":null,"communityIcon":null,"quoted":0,"retweeted":0,"replied":0,"liked":0,"followed":0},{"postId":"1658000357660954629","twitterId":"1540007805973053440","name":"CH90","username":"CH90_DAO","reputation":-1,"ethAddress":null,"content":"在加密市场掀起了抄底的浪潮\n您不想错过这个前所未有的机会吧？\n\n@CH90将隆重举办季度线下活动 Bond and Born！\n\n非常期待您的到来！🥳\n\n让我们一同探讨加密话题 🧐\n脑力激荡🤯\n探寻新机遇🤩\n\n持续关注我们，更详细的精彩活动将会接踵公布！\n\n#CH90BondandBorn #CH90Dao #BondandBorn #创生0715\nhttps://pbs.twimg.com/media/FwJmfBxacAAcuVH.jpg","postTime":"2023-05-15T06:44:24.000Z","profileImg":"https://pbs.twimg.com/profile_images/1540012689287966720/Dp2NbjUe_normal.jpg","tags":"[\"peanut\",\"CH90BondandBorn\",\"CH90Dao\",\"BondandBorn\",\"创生0715\",\"马来西亚\",\"iweb3\",\"wormhole3\",\"CH90Bondandborn\"]","steemId":null,"retweetInfo":null,"pageInfo":null,"location":"null","space_id":null,"isCurated":1,"isPromoted":0,"longContentStatus":0,"isDel":0,"spaceTitle":null,"spaceState":null,"spaceStartedAt":null,"spaceId":null,"spaceEndedAt":null,"quoteCount":1,"retweetCount":0,"replyCount":0,"likeCount":0,"followCount":0,"curationId":null,"curationType":null,"communityId":null,"communityName":null,"communityIcon":null,"quoted":0,"retweeted":0,"replied":0,"liked":0,"followed":0},{"postId":"1656765644317024257","twitterId":"1617430194167635969","name":"Rez Karim","username":"rezkhere","reputation":-1,"ethAddress":null,"content":"Google just released ChatGPT's strongest competitor yet -  Bard\n\nIt's free to use and comes with 10X more features. \n\nHere are some of the craziest things only Bard can do ( ChatGPT cannot) 🧵","postTime":"2023-05-11T20:58:05.000Z","profileImg":"https://pbs.twimg.com/profile_images/1617431690779164675/X7DSmp-W_normal.jpg","tags":"[\"peanut\",\"ChatGPT\",\"Bard\",\"Google\",\"AI\",\"BardAI\",\"iweb3\",\"steemit\",\"wherein\"]","steemId":null,"retweetInfo":null,"pageInfo":null,"location":"null","space_id":null,"isCurated":1,"isPromoted":0,"longContentStatus":0,"isDel":0,"spaceTitle":null,"spaceState":null,"spaceStartedAt":null,"spaceId":null,"spaceEndedAt":null,"quoteCount":1,"retweetCount":0,"replyCount":0,"likeCount":0,"followCount":0,"curationId":null,"curationType":null,"communityId":null,"communityName":null,"communityIcon":null,"quoted":0,"retweeted":0,"replied":0,"liked":0,"followed":0},{"postId":"1657786625580056579","twitterId":"1555305770648047622","name":"Tyche Protocol","username":"tychezone","reputation":-1,"ethAddress":null,"content":"Are you ready for our mint on #Zksync tomorrow with @omnisea ? \n\nSupply : 5000 NFT\n\nPrice : \n🔸 Whitelist : 0.015 $ETH\n🔸 Public : 0.019 $ETH\n\nDuration :\n🔸 Whitelist :  8PM UTC May 15\n🔸 Freemint :  4PM UTC May 16\n🔸 Public :  10PM UTC May 16\n\nLink : https://omnisea.org/Tyche\nhttps://pbs.twimg.com/media/FwGjhlXWYAAPEfU.jpg","postTime":"2023-05-14T16:35:06.000Z","profileImg":"https://pbs.twimg.com/profile_images/1567634850030538753/ZxetGTTb_normal.jpg","tags":"[\"peanut\",\"Zksync\",\"iweb3\",\"wormhole3\",\"kr\",\"aaa\",\"zzan\",\"krsuccess\",\"TwitFi\",\"TwitDao\"]","steemId":null,"retweetInfo":null,"pageInfo":"{\"url\":\"https://omnisea.org/Tyche\",\"title\":\"Omnisea | New Drops\",\"description\":\"Omnisea - New Drops\",\"mediaType\":\"website\",\"contentType\":\"text/html\",\"images\":[],\"videos\":[],\"favicons\":[\"https://omnisea.org/assets/img/logotype.png\",\"https://omnisea.org/assets/img/apple-touch-icon-114x114.png\",\"https://omnisea.org/assets/img/apple-touch-icon-72x72.png\",\"https://omnisea.org/assets/img/apple-touch-icon-114x114.png\"]}","location":"null","space_id":null,"isCurated":1,"isPromoted":0,"longContentStatus":0,"isDel":0,"spaceTitle":null,"spaceState":null,"spaceStartedAt":null,"spaceId":null,"spaceEndedAt":null,"quoteCount":1,"retweetCount":0,"replyCount":0,"likeCount":0,"followCount":0,"curationId":null,"curationType":null,"communityId":null,"communityName":null,"communityIcon":null,"quoted":0,"retweeted":0,"replied":0,"liked":0,"followed":0},{"postId":"1657902614258827264","twitterId":"768100685862752257","name":"— sotzseky","username":"sotzseky","reputation":-1,"ethAddress":null,"content":"EigenLayer Stage 1 Testnet\n\nDiscord: https://discord.com/invite/eigenlayer\nNetwork: Goerli\nFaucet : https://goerlifaucet.com/\nDetail:\nhttps://docs.eigenlayer.xyz/guides/get-testnet-tokens\n\n#eigenlayer #testnet #ethereum \nhttps://pbs.twimg.com/media/FwHEt7VakAAA_CG.jpg","postTime":"2023-05-15T00:16:00.000Z","profileImg":"https://pbs.twimg.com/profile_images/1653464028952539136/K5Ye_MY5_normal.jpg","tags":"[\"eigenlayer\",\"testnet\",\"ethereum\",\"iweb3\"]","steemId":null,"retweetInfo":null,"pageInfo":null,"location":"null","space_id":null,"isCurated":1,"isPromoted":0,"longContentStatus":0,"isDel":0,"spaceTitle":null,"spaceState":null,"spaceStartedAt":null,"spaceId":null,"spaceEndedAt":null,"quoteCount":1,"retweetCount":0,"replyCount":0,"likeCount":0,"followCount":0,"curationId":null,"curationType":null,"communityId":null,"communityName":null,"communityIcon":null,"quoted":0,"retweeted":0,"replied":0,"liked":0,"followed":0}]
    }
  },
  computed: {
    ...mapState('community', ['showingCommunity', 'configs']),
    ...mapGetters(['getAccountInfo']),
  },
  methods: {
    formatAddress,
    onCopy,
    pageScroll() {
      this.scroll = this.$refs.detailPageRef.scrollTop
    },
    countdown(time) {
      if(!time || !isNumeric(time)) return 0
      return time*1000 - new Date().getTime()
    },
    gotoDetail(post, index) {
      console.log(post)
      this.selectedPost = post
      this.selectedPostIndex = index
      this.$store.commit('postsModule/saveCurrentShowingDetail', post);
      this.$router.push('/post-detail/' + post.postId);
    },
  },
  mounted () {
    const communityId = this.$route.params.communityId;
    this.communityId = communityId
    if (!communityId) {
      return this.$router.go(-1);
    }
    getCommunityById(this.getAccountInfo?.twitterId, communityId).then(res => {
      if (res && res.communityId) {
        this.$store.commit(res.communityId + '/saveShowingCommunity', res);
      }
    }).catch(e => {
      notify({error: e, type: 'error'})
    })
  },
}
</script>

<style scoped lang="scss">
.active-tab {
  position: relative;
  z-index: 1;
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    height: 3px;
    width: 22px;
    background: #7851FF;
    border-radius: 3px;
    z-index: -1;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
