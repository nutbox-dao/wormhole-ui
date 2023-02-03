<template>
  <div class="text-14px xl:text-0.8rem">
    <!-- title -->
    <div class="container mx-auto max-w-50rem pb-2rem pt-1rem">
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-1.5rem">
        <div class="col-span-1 xl:col-span-2 px-15px">
          <div class="h-min min-h-146px text-left  overflow-hidden relative">
            <!-- curation info -->
            <div v-if="detailCuration">
              <div v-if="detailCuration.creatorTwitter !== detailCuration.authorId" class="flex items-center mb-1rem">
                <img class="w-42px min-w-42px h-42px md:w-3rem md:h-3rem md:w-min-3rem
                            mr-15px md:mr-1rem rounded-full cursor-pointer"
                     @error="replaceEmptyImg"
                     @click="gotoUserPage(detailCuration && detailCuration.creatorTwitterUsername)"
                     :src="detailCuration.creatorProfileImg && detailCuration.creatorProfileImg.replace('normal', '200x200')" alt="">
                <div >
                  <div class="flex justify-center items-center">
                  <span class="c-text-black text-18px 2xl:text-0.8rem leading-18px 2xl:leading-1rem mr-0.8rem cursor-pointer"
                        @click="gotoUserPage(detailCuration && detailCuration.creatorTwitterUsername)">
                    {{detailCuration && detailCuration.creatorTwitterName}}
                  </span>
                    <ContentTags :is-quote="isQuote" :is-reply="isReply" :content-type="contentType"/>
                  </div>
                  <div class="text-12px 2xl:text-0.7rem text-color8B light:text-color7D leading-18px 2xl:leading-1.1rem">
                    @{{detailCuration && detailCuration.creatorTwitterUsername}}
                  </div>
                </div>
              </div>
              <template v-if="contentType==='tweet'">
                <Blog :post="detailCuration" @click="gotoTweet"
                      avatar-class="w-30px min-w-30px h-30px md:w-2.4rem md:h-2.4rem md:w-min-2.4rem"
                      class="border-1 border-color8B/30 light:border-black light:bg-white px-15px pt-10px pb-15px rounded-15px">
                  <template #bottom-btn-bar><div></div></template>
                  <template #curation-tag>
                    <div class="flex gap-x-0.8rem font-200 text-0.6rem flex-wrap text-color8B light:text-color7D blog-tag">
                      <button class="border-1 border-white light:border-blueDark py-3px px-6px rounded-full mt-10px
                                     whitespace-nowrap cursor-pointer text-white light:text-blueDark"
                              v-for="cTag of JSON.parse(detailCuration.topics || '[]')" :key="cTag"
                              @click.stop="onSelectTag(cTag)">
                        {{cTag}}
                      </button>
                    </div>
                  </template>
                </Blog>
              </template>
              <template v-else-if="contentType==='space'">
                <Space :space="space" @click="gotoTweet"
                       class="h-146px md:min-h-10rem dark:bg-tag-gradient light:bg-color15 rounded-15px cursor-pointer "></Space>
                <div class="flex gap-x-0.8rem font-200 text-0.6rem flex-wrap text-color8B light:text-color7D blog-tag">
                  <button class="border-1 border-white light:border-blueDark py-3px px-6px rounded-full mt-10px
                                     whitespace-nowrap cursor-pointer text-white light:text-blueDark"
                          v-for="cTag of JSON.parse(detailCuration.topics || '[]')" :key="cTag"
                          @click.stop="onSelectTag(cTag)">
                    {{cTag}}
                  </button>
                </div>
              </template>
              <template v-else>
                <div class="px-1.25rem pb-2rem border-b-1 border-color8B/30">
                  <div class="c-text-black text-1.5rem sm:text-24px">
                    {{title}}
                  </div>
                  <div class="flex items-center flex-wrap gap-1rem mt-1rem">
                    <span class="px-10px py-6px bg-white/10 rounded-full text-12px lg:text-0.7rem leading-18px">
                      {{status}}
                    </span>
                        <span class="px-10px py-6px bg-white/10 rounded-full text-12px lg:text-0.7rem leading-18px">
                      {{time}}
                    </span>
                  </div>
                </div>
              </template>

            </div>
            <div v-if="loading1"
                 class="bg-color62/20 absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
              <img class="w-5rem mx-auto" src="~@/assets/profile-loading.gif" alt="" />
            </div>
          </div>
          <!-- tips -->
          <div class="border-0 light:border-1 gradient-border gradient-border-color91 mt-1rem rounded-15px overflow-hidden">
            <div class="h-min bg-color62 text-white text-left cursor-pointer tip-bg">
              <div class="text-white light:text-blueDark pl-60px sm:pl-60px pr-18px font-bold min-h-54px
                        flex-1 flex justify-between items-center truncate relative"
                   @click.stop="showTipModal">
                <el-carousel v-if="tips && tips.length>0"
                             class="w-full hidden sm:block"
                             height="54px" indicator-position="none" :loop="true"
                             direction="vertical" :autoplay="true"
                             :interval="2500">
                  <el-carousel-item v-for="item in tips" :key="item" class="flex items-center">
                    <div class="flex-1 c-text-black text-12px xl:text-0.7rem text-white">{{tipStr(item)}}</div>
                  </el-carousel-item>
                </el-carousel>
                <van-notice-bar class="w-full bg-transparent px-0 sm:hidden"
                                scrollable :speed="100"
                                v-if="tips && tips.length>0">
                  <template #default>
                    <span v-for="item in tips" :key="item"
                          class="mr-4rem c-text-black text-12px xl:text-0.7rem text-white">{{tipStr(item)}}</span>
                  </template>
                </van-notice-bar>
                <span v-else class="text-14px absolute w-full h-full top-0 left-0 flex items-center justify-center font-bold text-white">
                {{ detailCuration?.curationType == 1 ? this.$t('curation.tipToUser', {user: detailCuration.username}) : this.$t('curation.tipToSpeaker') }}
              </span>
                <button v-if="top3Tip && top3Tip.length > 0" @click.stop="tipCollapse=!tipCollapse"
                        class="ml-10px bg-black rounded-full text-white h-24px min-w-60px flex items-center justify-center
                             leading-18px text-12px 2xl:text-0.7rem 2xl:leading-0.8rem px-3px">Top3</button>
              </div>
              <el-collapse-transition>
                <div v-show="tipCollapse" class="pb-10px px-18px">
                  <div class="px-25px py-6px bg-white text-black rounded-10px">
                    <div class="h-32px flex justify-between items-center text-12px"
                         v-for="(tip, index) of top3Tip" :key="'tops' + tip.hash">
                      <div class="flex items-center">
                        <img class="w-18px" :src="top3Icons[index]" alt="">
                        <span>{{tip.fromUsername}}</span>
                      </div>
                      <span>{{tip.amount}} STEEM</span>
                    </div>
                  </div>
                </div>
              </el-collapse-transition>
            </div>
          </div>

          <!-- popups -->
          <template v-if="contentType==='space' && (space.spaceState === 2 || (space.spaceState > 2 && popups.length>0))">
            <PopUpsCard :popups="popups" :space="space" :showCreate="space.spaceState === 2" @createPopUpVisible='createPopUpVisible=true'></PopUpsCard>
          </template>
          <!-- quests -->
          <div class="h-min bg-blockBg px-18px py-12px light:bg-black text-white light:border-1 light:border-colorE3
                      rounded-12px overflow-hidden text-left mt-1rem">
            <div class="flex justify-between items-center">
              <div class="h-40px flex items-center c-text-black">
                <span class="text-16px xl:text-0.9rem whitespace-nowrap">
                  {{ isQuote === 1 ? 'Quote': (isReply ? 'Reply' : 'Retweet') }} to Earn
                </span>
                <button class="ml-20px" @click="quotesCollapse=!quotesCollapse">
                  <img class="w-14px"
                       :class="quotesCollapse?'transform rotate-180':''"
                       src="~@/assets/icon-arrow.svg" alt="">
                </button>
              </div>
              <img v-if="(quoted+replyed+retweeted+liked+followed)===(isQuote+isReply+isRetweet+isLike+isFollow)"
                   class="w-26px min-w-26px"
                   src="~@/assets/icon-progress-down.svg" alt="">
              <el-progress v-else type="circle" width="26"
                           color="#7851FF"
                           class="task-progress"
                           stroke-width="2"
                           :percentage="(quoted+replyed+retweeted+liked+followed)/(isQuote+isReply+isRetweet+isLike+isFollow)*100">
                <span class="text-white text-12px">{{quoted+replyed+retweeted+liked+followed}}/{{isQuote+isReply+isRetweet+isLike+isFollow}}</span>
              </el-progress>
            </div>
            <el-collapse-transition>
              <div v-show="quotesCollapse"
                   :class="endAndNotComplete?'opacity-90':''"
                   class="text-white py-0.5rem font-bold">
                <button @click="preQuoteOrReply"
                        :disabled="endAndNotComplete"
                        class="bg-color1D w-full min-h-40px py-11px px-12px flex items-center rounded-10px mb-10px">
                  <i v-if="isQuoting || isRepling || isRetweeting" class="w-16px h-16px rounded-full bg-colorEA mr-10px">
                    <img class="w-16px h-16px" src="~@/assets/icon-loading.svg" alt="">
                  </i>
                  <template v-else>
                    <i v-if="isQuote===1" class="w-16px min-w-16px h-16px mr-10px"
                       :class="quoted?'btn-icon-quote-active':'btn-icon-quote'"></i>
                    <i v-else-if="isReply===1" class="w-16px min-w-16px h-16px mr-10px"
                       :class="replyed?'btn-icon-reply-active':'btn-icon-reply'"></i>
                    <i v-else-if="isRetweet===1" class="w-16px min-w-16px h-16px mr-10px"
                       :class="retweeted?'btn-icon-retweet-active':'btn-icon-retweet'"></i>
                  </template>
                  <span class="text-12px xl:text-0.7rem leading-18px 2xl:leading-0.9rem">Click to {{isQuote === 1 ? 'Quote' : (isReply ? 'Reply' : 'Retweet')}}</span>
                </button>
                <button v-if="isLike" @click="like" :disabled="endAndNotComplete"
                        class="bg-color1D w-full min-h-40px py-11px px-12px flex items-center rounded-10px mb-10px">
                  <i v-if="isLiking" class="w-16px h-16px rounded-full bg-colorEA mr-10px">
                    <img class="w-16px h-16px" src="~@/assets/icon-loading.svg" alt="">
                  </i>
                  <i v-else class="w-16px min-w-16px h-16px mr-10px"
                     :class="liked?'btn-icon-like-active':'btn-icon-like'"></i>
                  <span class="text-12px xl:text-0.7rem text-left leading-14px">
                      Like (or Verify your Like)
                  </span>
                </button>
                <button v-if="isFollow" @click="follow" :disabled="endAndNotComplete"
                        class="bg-color1D w-full min-h-40px py-11px px-12px flex items-center rounded-10px mb-10px">
                  <i v-if="isFollowing" class="w-16px h-16px rounded-full bg-colorEA mr-10px">
                    <img class="w-16px h-16px" src="~@/assets/icon-loading.svg" alt="">
                  </i>
                  <i v-else class="w-16px min-w-16px h-16px mr-10px"
                     :class="followed?'btn-icon-follow-active':'btn-icon-follow'"></i>
                  <span class="text-12px xl:text-0.7rem text-left leading-14px">
                      Follow @{{detailCuration.username + (followers ? followers.reduce((s, f) => s + ' & @' + f.username, '') : '')}} (or Verify your Follow)
                    </span>
                </button>
              </div>
            </el-collapse-transition>
            <div v-if="!quotesCollapse" class="w-full h-1px bg-color8B/30 light:bg-colorE3 mb-16px"></div>
            <div class="flex items-center justify-between h-40px xl:h-2rem">
              <div class="flex items-center ml-11px">
                <div class="-ml-11px" v-for="p of participant.slice(0,3)" :key="p">
                  <img v-if="p.profileImg"
                       class="w-28px min-w-28px h-28px xl:w-1.2rem xl:min-w-1.2rem xl:h-1.2rem rounded-full
                              border-2 border-color62 light:border-white"
                       @error="replaceEmptyImg"
                       :src="p.profileImg" alt="">
                  <img v-else
                       class="w-28px min-w-28px h-28px xl:w-1.2rem xl:min-w-1.2rem xl:h-1.2rem rounded-full
                              border-2 border-color62 light:border-white"
                       src="~@/assets/icon-default-avatar.svg" alt="">

                </div>
                <span v-if="participant.length>3"
                      class=" min-w-28px h-28px xl:min-w-1.2rem xl:h-1.2rem rounded-full px-4px
                             rounded-full -ml-10px flex justify-center items-center
                             border-2 border-blockBg bg-primaryColor
                             light:border-white light:bg-color62 light:text-white text-10px">+{{ participant[0].totalCount - 3 }}</span>
                <button class="ml-10px whitespace-nowrap" v-if="participant.length>0" @click="showSubmissions=true">
                  {{$t('curation.allParticipants')}} >>
                </button>
              </div>
              <ChainTokenIconLarge height="26px" width="26px"
                                   class="bg-color62"
                                   :token="{symbol: detailCuration?.tokenSymbol, address: detailCuration?.token}"
                                   :chainName="detailCuration ? detailCuration.chainId?.toString() : ''">
                <template #amount>
                      <span v-if="detailCuration?.curationStatus > 0 && (detailCuration?.taskRecord === detailCuration?.tasks)"
                            class="pl-30px pr-8px h-20px whitespace-nowrap flex items-center text-12px 2xl:text-0.8rem font-bold">
                        {{formatAmount(detailCuration?.myRewardAmount / (10 ** detailCuration?.decimals))+'/'+formatAmount(detailCuration?.amount / ( 10 ** detailCuration?.decimals)) + " " + detailCuration?.tokenSymbol}}
                      </span>
                      <span v-else
                            class="pl-30px pr-8px h-20px whitespace-nowrap flex items-center text-12px 2xl:text-0.8rem font-bold">
                        {{formatAmount(detailCuration?.amount / ( 10 ** detailCuration?.decimals)) + " " + detailCuration?.tokenSymbol}}
                      </span>
                </template>
              </ChainTokenIconLarge>
            </div>
          </div>
          <!-- Details -->
          <div class="c-text-black mt-18px mb-10px text-16px leading-16px text-left">{{$t('curation.details')}}</div>
          <div class="light:text-color21 text-left leading-18px text-12px mb-14px whitespace-pre-line">{{detailCuration?.description}}</div>
          <div class="h-min border-1 border-color8B/30 light:border-black light:bg-white
                      rounded-15px overflow-hidden relative">
            <div class="px-1.25rem py-13px text-left relative">
              <div class="flex justify-between items-center">
                <span class="text-16px 2xl:text-0.9rem c-text-black">{{ $t('curation.prize') }}</span>
                <button class="h-26px xl:1.3rem px-1rem bg-primaryColor/20 light:bg-black light:text-white text-color62 rounded-6px">
                  {{detailCuration ? formatAmount(detailCuration.amount / (10 ** detailCuration.decimals)) + ' ' + detailCuration.tokenSymbol : ''}}
                </button>
              </div>
              <!-- max count -->
              <div class="flex justify-between items-center mt-1rem">
                <span class="text-16px 2xl:text-0.9rem c-text-black">{{ $t('curation.maxCount') }}</span>
                <button class="h-26px xl:1.3rem px-1rem bg-primaryColor/20 light:bg-black light:text-white text-color62 rounded-6px">
                  {{detailCuration ? (detailCuration.maxCount > 1e6 ? $t('common.max') : detailCuration.maxCount) : '0'}}
                </button>
              </div>
              <!-- min reputation -->
              <div class="flex justify-between items-center mt-1rem">
                <span class="text-16px 2xl:text-0.9rem c-text-black">{{ $t('curation.minReputation') }}</span>
                <button class="h-26px xl:1.3rem px-1rem bg-primaryColor/20 light:bg-black light:text-white text-color62 rounded-6px">
                  {{detailCuration ? (detailCuration.minReputation <= 0 ? $t('common.max') : detailCuration.minReputation) : '0'}}
                </button>
              </div>
              <!-- ended -->
              <div v-if="detailCuration?.endtime < (new Date().getTime() / 1000)" class="flex justify-between items-center mt-1rem">
                <span class="text-16px 2xl:text-0.9rem c-text-black">End Time</span>
                <button class="h-26px xl:1.3rem px-1rem bg-color62/20 border-1 border-color62 light:text-black text-color7D rounded-5px ">
                  {{endtime}}
                </button>
              </div>
              <!-- ongoing -->
              <div v-else class="flex justify-between items-center mt-1rem">
                <span class="text-16px 2xl:text-0.9rem c-text-black">Expiration</span>
                <button class="h-26px xl:1.3rem px-1rem border-1 border-color52 light:text-black  rounded-5px">
                  {{endtime}}
                </button>
              </div>
              <div v-if="loading1"
                   class="bg-color62/20 absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center rounded-12px">
                <img class="w-5rem mx-auto" src="~@/assets/profile-loading.gif" alt="" />
              </div>
            </div>
            <template v-if="contentType==='space'">
              <div class="text-left mt-1rem relative">
                <SpeakerCollapse :space="space"/>
                <div v-if="loading5"
                     class="bg-color62/20 absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center rounded-12px">
                  <img class="w-5rem mx-auto" src="~@/assets/profile-loading.gif" alt="" />
                </div>
              </div>
            </template>
          </div>
          <template v-if="detailCuration">
            <!-- Related Curations mobile -->
            <div v-if="relatedCurations && relatedCurations.length > 0"
                 class="border-t-1 border-color8B/30 light:border-colorE3 mt-2rem pt-1rem">
              <div class="text-left text-14px 2xl:text-1rem font-bold mb-1rem">{{$t('curation.relatedCurations')}}</div>
              <div class="mb-1rem"
                   @click="gotoCuration(rc)"
                   v-for="rc of relatedCurations" :key="rc.curationId">
                <RelatedCurationItemVue class="bg-block light:bg-white border-1 border-color8B/30 light:border-colorE3
                                             rounded-12px overflow-hidden"
                                        :curation="rc">
                </RelatedCurationItemVue>
              </div>
            </div>
            <div class="min-h-100px relative mt-1rem" v-if="loading1">
              <div class="bg-color62/20 absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center rounded-12px">
                <img class="w-5rem mx-auto" src="~@/assets/profile-loading.gif" alt="" />
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- modals -->
    <van-popup class="c-tip-drawer 2xl:w-2/5"
               v-model:show="showLowerReputation"
               :position="position">
      <div class="modal-bg w-full md:w-560px 2xl:max-w-28rem
      max-h-80vh 2xl:max-h-28rem overflow-auto flex flex-col
      rounded-t-1.5rem md:rounded-b-1.5rem pt-1rem md:py-2rem">
        <div class="flex-1 overflow-auto px-1rem xl:px-2.5rem no-scroll-bar">
          <div class="text-left px-1.25rem pb-3rem sm:pb-1.5rem flex flex-col text-14px 2xl:text-0.8rem overflow-auto">
            <div class="flex-1">
              <div class="text-20px 2xl:text-1rem c-text-black mb-1rem">Attention</div>
              <div>
                {{ $t('curation.lowerReputation') }}
              </div>
            </div>
            <div class="flex items-center justify-center gap-x-1rem mt-1rem">
              <button class="c-text-black bg-color84 light:bg-colorD6 light:text-white 
                         w-full h-44px 2xl:h-2.2rem px-2.5rem mx-auto rounded-full text-16px 2xl:text-0.8rem mr-1.25rem"
                      @click.stop="showLowerReputation=false">{{ $t('common.cancel') }}</button>
              <button class="gradient-btn gradient-btn-disabled-grey flex items-center justify-center
                            h-44px 2xl:h-2.2rem w-full rounded-full text-16px 2xl:text-0.8rem"
                      @click.stop="isRetweet ? retweet() : confirmQuest()">
                      {{ $t('common.confirm') }}
                </button>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
    <van-popup class="md:w-600px bg-black light:bg-transparent"
               :class="position==='center'?'rounded-12px':'rounded-t-12px'"
               v-model:show="showSubmissions"
               :position="position">
      <transition name="el-zoom-in-bottom">
        <div v-if="showSubmissions"
             class="dark:bg-glass light:bg-white rounded-t-12px">
          <Submissions :records="participant" :state="detailCuration.curationStatus" @close="showSubmissions=false"></Submissions>
        </div>
      </transition>
    </van-popup>
    <van-popup class="md:w-600px bg-black light:bg-transparent"
               :class="position==='center'?'rounded-12px':'rounded-t-12px'"
               v-model:show="showTip"
               :position="position">
      <transition name="el-zoom-in-bottom">
        <div v-if="showTip"
             class="relative dark:bg-glass light:bg-colorF7 rounded-t-12px overflow-hidden min-h-60vh">
          <button class="absolute right-20px top-24px"
                  @click="showTip=false">
            <i class="w-18px h-18px 2xl:w-1rem 2xl:h-1rem icon-close"></i>
          </button>
          <TipModalVue class="pt-70px 2xl:pt-3.5rem h-60vh"
                       :tipToUser="detailCuration"
                       :parent-tweet-id="detailCuration.tweetId"
                       @close="showTip=false"
                       @back="showTip=false"></TipModalVue>
        </div>
      </transition>
    </van-popup>
    <van-popup class="md:w-600px bg-black light:bg-transparent"
               :class="position==='center'?'rounded-12px':'rounded-t-12px'"
               v-model:show="speakerTipVisible"
               :position="position">
      <transition name="el-zoom-in-bottom">
        <div v-if="speakerTipVisible"
             class="relative dark:bg-glass light:bg-colorF7 rounded-t-12px overflow-hidden">
          <SpeakerTipModal class="h-60vh"
                           :space="space"
                           :parentTweetId="detailCuration.tweetId"
                           @close="speakerTipVisible=false"/>
        </div>
      </transition>
    </van-popup>
    <van-popup class="md:w-600px bg-black light:bg-transparent"
               :class="position==='center'?'rounded-12px':'rounded-t-12px'"
               v-model:show="createPopUpVisible"
               :position="position">
      <transition name="el-zoom-in-bottom">
        <div v-if="createPopUpVisible"
             class="relative dark:bg-glass light:bg-colorF7 rounded-t-12px overflow-hidden min-h-80vh">
          <CreatePopUpModal @close="createPopUpVisible=false"/>
        </div>
      </transition>
    </van-popup>
    <!-- quote & reply -->
    <van-popup class="c-tip-drawer 2xl:w-2/5"
               v-model:show="showTweetEditor"
               teleport="body"
               :position="position">
      <div class="modal-bg w-full md:w-560px 2xl:max-w-28rem
      max-h-80vh 2xl:max-h-28rem overflow-auto flex flex-col
      rounded-t-1.5rem md:rounded-b-1.5rem pt-1rem md:py-2rem">
        <div class="flex-1 overflow-auto px-1rem xl:px-2.5rem no-scroll-bar">
          <div class="flex-1 px-1.5rem mt-0.5rem flex flex-col">
            <div class="flex-1">
              <div class="mt-0.5rem mb-2rem">{{$t('curation.quoteOrReplyTip')}}</div>
              <div class="border-1 bg-black/40 border-1 border-color8B/30
                          light:bg-white light:border-colorE3 hover:border-primaryColor
                          rounded-8px">
                <div contenteditable
                    class="desc-input px-1rem pt-1rem min-h-6rem whitespace-pre-line leading-24px xl:leading-1.2rem"
                    ref="contentRef"
                    @blur="getBlur('desc')"
                    @paste="onPasteEmojiContent"
                    @keydown="showQuoteContentTip=false"
                    v-html="contentEl"></div>
                <div class="py-2 border-color8B/30 flex justify-between">
                  <el-popover ref="descEmojiPopover" :placement="position"
                              trigger="click" width="300"
                              :teleported="false"
                              :persistent="false">
                    <template #reference>
                      <img class="w-1.8rem h-1.8rem lg:w-1.4rem lg:h-1.4rem mx-8px" src="~@/assets/icon-emoji.svg" alt="">
                    </template>
                    <div class="h-310px">
                      <EmojiPicker :options="{
                                      imgSrc:'/emoji/',
                                      locals: $i18n.locale==='zh'?'zh_CN':'en',
                                      hasSkinTones:false,
                                      hasGroupIcons:false}"
                                      @select="selectEmoji" />
                    </div>
                  </el-popover>
                </div>
              </div>
            </div>
            <span v-show="showQuoteContentTip" class="mt-0.4rem text-redColor text-0.8rem">
              {{ quoteTipStr }}
            </span>
            <div class="text-center mb-1.4rem mt-1.6rem flex items-center justify-center">
              <button class="c-text-black bg-color84 light:bg-colorD6 light:text-white 
                         w-full h-44px 2xl:h-2.2rem px-2.5rem mx-auto rounded-full text-16px 2xl:text-0.8rem mr-1.25rem"  
                  @click.stop="showTweetEditor=false">
                    {{ $t('common.cancel') }}
              </button>
              <button class="gradient-btn h-44px 2xl:h-2.2rem w-full rounded-full text-16px 2xl:text-0.8rem 
                          flex items-center justify-center mx-auto"
                    :disabled="isQuoting || isRepling"  
                    @click.stop="quoteOrReply">
                      {{ isQuote ? $t('curation.quote') : $t('curation.reply') }}
                    <c-spinner class="w-1.5rem h-1.5rem ml-0.5rem" v-show="isQuoting || isRepling"></c-spinner>
                </button>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import TweetAttendTip from "@/components/TweetAttendTip";
import { mapState, mapGetters } from "vuex";
import { getCurationById, getCurationRecord, popupsOfCuration, popupRecords,
   getSpaceInfoById, getCurationsOfTweet, getAllTipsOfCuration } from "@/api/api";
import { getDateString, parseTimestamp, formatAmount, parseTimestampToUppercase, sleep, stringLength } from '@/utils/helper'
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import { ERC20List, errCode, EVM_CHAINS } from "@/config";
import Submissions from "@/views/curations/Submissions";
import Blog from "@/components/Blog";
import ChainTokenIconLarge from "@/components/ChainTokenIconLarge.vue";
import Space from "@/components/Space";
import CurationItem from "@/components/CurationItem";
import RelatedCurationItemVue from "@/components/RelatedCurationItem.vue";
import SpeakerCollapse from "@/components/SpeakerCollapse";
import SpeakerTipModal from "@/components/SpeakerTipModal";
import CreatePopUpModal from "@/components/CreatePopUpModal";
import PopUpsCard from "@/components/PopUpsCard";
import TipModalVue from "@/components/TipModal.vue";
import { notify } from "@/utils/notify";
import { newPopups, likeCuration, followCuration, quoteCuration, replyCuration, retweetCuration, checkMyCurationRecord} from '@/utils/curation'
import iconTop1 from '@/assets/icon-top1.svg'
import iconTop2 from '@/assets/icon-top2.svg'
import iconTop3 from '@/assets/icon-top3.svg'
import ContentTags from "@/components/ContentTags";
import {onCopy, formatEmojiText, onPasteEmojiContent} from "@/utils/tool";
import { EmojiPicker } from 'vue3-twemoji-picker-final'

export default {
  name: "CurationDetail",
  components: {
    TweetAttendTip, Submissions, Blog, Space, TipModalVue,
    CurationItem, SpeakerCollapse, SpeakerTipModal,RelatedCurationItemVue,
    CreatePopUpModal, PopUpsCard, ChainTokenIconLarge,ContentTags,EmojiPicker
  },
  data() {
    return {
      position: document.body.clientWidth < 768?'bottom':'center',
      showSubmissions: false,
      isExpand: false,
      loading1: false, // curation total
      loading2: false, // particpant
      loading3: false, // popups
      loading4: false, // tips
      loading5: false, // space info
      loading: false,
      participant: [],
      space: {},
      popups: [],
      tips: [],
      relatedCurations: [],
      speakerTipVisible: false,
      createPopUpVisible: false,
      showTip: false,
      showLowerReputation: false,
      updateInterval: null,
      timeIntrerval: null,
      tipCollapse: false,
      quotesCollapse: true,
      isQuoting: false,
      isRepling: false,
      isRetweeting: false,
      isLiking: false,
      isFollowing:false,
      top3Icons: [iconTop1, iconTop2, iconTop3],
      endtime: '',
      showTweetEditor: false,
      contentEl: '',
      tweetLength: 0,
      contentRange: null,
      showQuoteContentTip: false,
      quoteTipStr: ''
    }
  },
  computed: {
    ...mapState('curation', ['detailCuration', 'getPendingPopup']),
    ...mapGetters(['getAccountInfo']),
    title() {
      if (this.detailCuration && this.detailCuration.content) {
        return this.detailCuration.content.split('\n')[0].slice(0, 50)
      }else{
        return '---'
      }
    },
    contentType() {
      if (!this.detailCuration) return 'space';
      return this.detailCuration.curationType === 1 ? 'tweet' : 'space'
    },
    content() {
      if (this.detailCuration && this.detailCuration.content) {
        return this.detailCuration.content
      }else{
        return '---'
      }
    },
    followers() {
      if (this.detailCuration && this.detailCuration.followers && this.detailCuration.followers.length > 2) {
        let followers = JSON.parse(this.detailCuration.followers) 
        return followers;
      }
      return []
    },
    // 已结束未完成
    endAndNotComplete() {
      return this.detailCuration?.endtime < (new Date().getTime() / 1000)
      return this.participant.length > 3  &&
          ((this.quoted+this.replyed+this.liked+this.followed)<
              (this.isQuote+this.isReply+this.isLike+this.isFollow))
      // return true
    },
    isQuote() {
      if (!this.detailCuration) return false;
      return this.detailCuration.tasks & 1;
    },
    isReply() {
      if (!this.detailCuration) return false;
      return (this.detailCuration.tasks & 2) / 2
    },
    isRetweet() {
      if (!this.detailCuration) return false;
      return (this.detailCuration.tasks & 16) /16
    },
    isLike() {
      if (!this.detailCuration) return false;
      return (this.detailCuration.tasks & 4) / 4
    },
    isFollow() {
      if (!this.detailCuration) return false;
      return (this.detailCuration.tasks & 8) / 8
    },
    quoted() {
      if(!this.detailCuration || !this.getAccountInfo) return false
      return this.detailCuration?.taskRecord & 1;
    },
    replyed() {
      if(!this.detailCuration || !this.getAccountInfo) return false
      return (this.detailCuration?.taskRecord & 2) / 2
    },
    retweeted() {
      if(!this.detailCuration || !this.getAccountInfo) return false
      return (this.detailCuration?.taskRecord & 16) / 16
    },
    liked() {
      if(!this.detailCuration || !this.getAccountInfo) return false
      return (this.detailCuration?.taskRecord & 4) / 4
    },
    followed() {
      if(!this.detailCuration || !this.getAccountInfo) return false
      return (this.detailCuration.taskRecord & 8) / 8
    },
    status() {
      if (!this.detailCuration) return ''
      const curationStatus = this.detailCuration.curationStatus;
      const createStatus = this.detailCuration.createStatus;
      if (createStatus === 0) {
        return this.$t('curation.invalidStatus')
      }else{
        if (curationStatus === 0) {
          return this.$t('curation.ongoing')
        }else if(curationStatus === 1) {
          return this.$t('curation.complete')
        } else if (curationStatus === 2) {
          return this.$t('curation.complete')
        }
      }
    },
    showReward() {
      if (!this.detailCuration) return false;
      const curationStatus = this.detailCuration.curationStatus;
      const createStatus = this.detailCuration.createStatus;
      if (createStatus && curationStatus > 0) {
        return true;
      }
      return false;
    },
    tokenIcon() {
      const token = this.detailCuration && this.detailCuration.token
      if(!token) return
      for (let t of ERC20List) {
        if(token === t.address) {
          return t.icon
        }
      }
      return
    },
    top3Tip() {
      if (this.tips && this.tips.length > 0) {
        const steemTips = this.tips.filter(t => t.chainName == 'STEEM');
        return steemTips.sort((a, b) => b.amount - a.amount).slice(0, 3)
      }
      return []
    },
    time() {
      if (!this.detailCuration || !this.detailCuration.createdTime || !this.detailCuration.endtime) return '';
      const local = new Date().getTimezoneOffset() / -60;
      let start = new Date(this.detailCuration.createdTime);
      let end = new Date(this.detailCuration.endtime * 1000)
      return getDateString(start, local, 0) + ' ~ ' + getDateString(end, local, 0)
    }
  },
  watch: {
    $route(newValue, oldValue) {
      const newId = this.$route.params.id;
      if (this.$route.name == 'curation-detail' && newId && newId.match(/^[0-9a-fA-F]+$/)) {
        this.loadCuration()
      }
    }
  },
  methods: {
    onCopy,
    formatAmount,
    onPasteEmojiContent,
    formatEmojiText,
    getBlur() {
      const sel = window.getSelection();
      this.contentRange = sel.getRangeAt(0);
    },
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
      let tweetLength = 0;
      for(let i of el.childNodes) {
        if(i.nodeName==='#text') {
          tweetLength += stringLength(i.textContent);
          content += i.textContent
        } else if(i.nodeName === 'IMG') {
          tweetLength+=2;
          content += i.alt
        }
      }
      this.tweetLength = tweetLength
      return content
    },
    onSelectTag(tag) {
      this.$store.commit('curation/saveSelectedTag', tag)
    },
    onSelectTag(tag) {
      this.$store.commit('curation/saveSelectedTag', tag)
      this.$router.go(-1)
    },
    gotoTweet() {
      window.open('https://twitter.com/' + this.detailCuration.username + '/status/' + this.detailCuration.tweetId)
    },
    createTime(p) {
      if (!this.detailCuration || !this.detailCuration.createdTime || !this.detailCuration.endtime) return '';
      return parseTimestamp(p.createAt)
    },
    replaceEmptyImg(e) {
      e.target.src = emptyAvatar;
    },
    gotoUserPage(username) {
        this.$router.push({path : '/account-info/@' + username})
    },
    tipStr(tip) {
      if (tip.chainName === 'STEEM') {
        return `@${tip.fromUsername} tips ${tip.emoji ? (tip.emoji + '(' + tip.amount + ' STEEM)') : (tip.amount + ' STEEM')} to @${tip.toUsername}`
      }else {
        let chainName;
        for (let chain in EVM_CHAINS) {
          if (EVM_CHAINS[chain].id === parseInt(tip.chainName)) {
            chainName = chain;
            break;
          }
        }
        return `@${tip.fromUsername} tips ${formatAmount(tip.amount / (10 ** tip.decimals))} ${tip.symbol}(${chainName}) to @${tip.toUsername}`
      }
    },
    checkLogin() {
      if(!this.getAccountInfo || !this.getAccountInfo.twitterId) {
        this.$store.commit('saveShowLogin', true)
        let count = 0
        const interval = setInterval(() => {
          if (count++ > 60) {
            clearInterval(interval);
            return;
          }
          if (this.getAccountInfo && this.getAccountInfo.twitterId) {
            this.loadCuration()
            clearInterval(interval)
          }
        }, 1000);
        return false;
      }
      return true
    },
    showTipModal() {
      if (!this.checkLogin() || !this.detailCuration) return
      if (this.detailCuration.curationType === 1) {
        this.showTip=true
      }else
        this.speakerTipVisible=true
    },
    async preQuoteOrReply() {
      if (!this.checkLogin()) return
      if (this.isRepling || this.isQuoting || this.isRetweeting || this.retweeted || this.quoted || this.replyed) return;
      // check reputation
      if (this.detailCuration.minReputation > 0) {
        if (this.getAccountInfo.reputation < this.detailCuration.minReputation) {
          this.showLowerReputation = true;
          return;
        }
      }
      if (this.isRetweet) {
        this.retweet()
      }else {
        this.contentRange = null;
        this.contentEl = '';
        this.showTweetEditor = true;
      }
    },
    async confirmQuest() {
      this.showLowerReputation = false;
      this.showTweetEditor = true
    },
    async retweet() {
      this.showLowerReputation = false;
      try{
        this.isRetweeting = true;
        const result = await retweetCuration(twitterId, this.detailCuration.curationId);
        let nyCard = result.nyCard;
        if (nyCard && nyCard.cardId > 0) {
          this.$store.commit('saveNewCardId', nyCard.cardId)
          this.$store.commit('saveGetCardVisible', true)
        }
        this.detailCuration.taskRecord = this.detailCuration.taskRecord | 16
        this.showTweetEditor = false
      } catch (e) {
        if (e === 'log out') {
          this.$store.commit('saveShowLogin', true)
          return;
        }else if (e === errCode.TWEET_NOT_FOUND) {
          notify({message: this.$t('tips.tweetNotFound'), type: 'info', duration: 5000})
          return;
        }
        notify({message:this.$t('err.serverErr'), type:'error'})
      } finally {
        this.isRetweeting = false
      }
    },
    async quoteOrReply() {
      this.showLowerReputation = false;
      const content = this.formatElToTextContent(this.$refs.contentRef)
      if (content.length < 10) {
        this.showQuoteContentTip = true;
        this.quoteTipStr = this.$t('curation.inputMoreWords')
        return;
      }
      
      
      try{
        const twitterId = this.getAccountInfo?.twitterId;
        const userInfo = {
          name: this.getAccountInfo?.twitterName,
          username: this.getAccountInfo?.twitterUsername,
          profileImg: this.getAccountInfo?.profileImg,
          steemId: this.getAccountInfo?.steemId
        }
        if (this.isQuote) {
          this.isQuoting = true;
          const result = await quoteCuration(twitterId, userInfo, content, this.detailCuration.curationId)
          let nyCard = result.nyCard;

          if (nyCard && nyCard.cardId > 0) {
            this.$store.commit('saveNewCardId', nyCard.cardId)
            this.$store.commit('saveGetCardVisible', true)
          }
          this.detailCuration.taskRecord = this.detailCuration.taskRecord | 1
          this.showTweetEditor = false
        }else if (this.isReply) {
          this.isRepling = true
          const result = await replyCuration(twitterId, userInfo, content, this.detailCuration.curationId)
          let nyCard = result.nyCard;

          if (nyCard && nyCard.cardId > 0) {
            this.$store.commit('saveNewCardId', nyCard.cardId)
            this.$store.commit('saveGetCardVisible', true)
          }
          this.detailCuration.taskRecord = this.detailCuration.taskRecord | 2
          this.showTweetEditor = false
        }
      } catch (e) {
        if (e === 303) {
          this.showQuoteContentTip = true;
          this.quoteTipStr = this.$t('curation.inputRelatedWords')
          return
        }
        if (e === 'log out') {
          this.$store.commit('saveShowLogin', true)
          return;
        }else if (e === errCode.TWEET_NOT_FOUND) {
          notify({message: this.$t('tips.tweetNotFound'), type: 'info', duration: 5000})
          return;
        }
        notify({message:this.$t('err.serverErr'), type:'error'})
      } finally {
        this.isQuoting = false
        this.isRepling = false
        this.isRetweeting = false
      }
    },
    async like() {
      if (!this.checkLogin() || this.liked || this.isLiking) return
      try{
        this.isLiking = true
        let result = await likeCuration({...this.detailCuration, twitterId: this.getAccountInfo.twitterId});
        let nyCard = result.nyCard;

        if (nyCard && nyCard.cardId > 0) {
          this.$store.commit('saveNewCardId', nyCard.cardId)
          this.$store.commit('saveGetCardVisible', true)
        }
        this.detailCuration.taskRecord = this.detailCuration.taskRecord | 4
      } catch (e) {
        if (e === 'log out') {
          this.$store.commit('saveShowLogin', true)
          return;
        }else if (e === errCode.TWEET_NOT_FOUND) {
          notify({message: this.$t('tips.tweetNotFound'), type: 'info', duration: 5000})
          return;
        }
        notify({message:this.$t('err.serverErr'), type:'error'})
      } finally {
        this.isLiking = false
      }
    },
    async follow() {
      if (!this.checkLogin() || this.followed || this.isFollowing) return
      try{
        this.isFollowing = true
        const result = await followCuration({...this.detailCuration, twitterId: this.getAccountInfo.twitterId})
        if (!result) {
          return;
        }
        let nyCard = result.nyCard;

        if (nyCard && nyCard.cardId > 0) {
          this.$store.commit('saveNewCardId', nyCard.cardId)
          this.$store.commit('saveGetCardVisible', true)
        }
        this.detailCuration.taskRecord = this.detailCuration?.taskRecord | 8
      } catch (e) {
        if (e === 'log out') {
          this.$store.commit('saveShowLogin', true)
          return;
        }
        notify({message:this.$t('err.serverErr'), type:'error'})
      } finally {
        this.isFollowing = false
      }
    },
    gotoCuration(curation) {
      const id = curation.curationId
      this.$store.commit('curation/saveDetailCuration', {})
      this.participant = [];
      this.space = {};
      this.popups = [];
      this.tips = [];
      this.relatedCurations = [];
      this.$router.replace('/curation-detail/' + id);
    },
    updateCurationInfos() {
      if (this.detailCuration && this.detailCuration.curationId) {
        const id = this.detailCuration.curationId;
        // update curation paricipant info
        getCurationRecord(id).then(res => {
          this.participant = res ?? []
        }).catch(console.log).finally(() => {
          this.loading2 = false
        })

        // update popup info
        popupsOfCuration(this.getAccountInfo ? this.getAccountInfo.twitterId : null, id).then(res => {
          this.popups = res
        }).catch(console.log).finally(() => {
          this.loading3 = false
        })

        // update tip info
        getAllTipsOfCuration(id).then(res => {
          if (!res) return;
          if(this.contentType === 'space') {
            this.tips = res
          }else {
            this.tips = res.filter(r => {
              return r.toTwitterId === this.detailCuration.authorId
            })
          }
        })

        // update space host profile
        if (this.detailCuration.spaceId) {
          getSpaceInfoById(this.detailCuration.spaceId).then(res => {
            if (res && res.spaceId) {
              this.space = res
            }
          }).finally(() => {
            this.loading5 = false;
          })
        }else {
          this.loading5 = false
        }
      }
    },
    async loadCuration() {
      const id = this.$route.params.id;
      const account = this.getAccountInfo

      if (this.getPendingPopup) {
        newPopups(pendingPopup).then(res => {
        }).catch(e => {
          if (e === 'log out') {
            notify({message: this.$t('tips.accessTokenExpire'), type:'info'})
          }
        }).finally(() => {
          // this.$store.commit('curation/savePendingPopup', null)
        })
      }

      if (this.detailCuration && this.detailCuration.curationId === id) {
        this.updateCurationInfos()
        await sleep(3)
      }else {
        this.$store.commit('curation/saveDetailCuration', null)
        this.loading1 = true
        this.loading2 = true
        this.loading3 = true
        this.loading4 = true
        this.loading5 = true
      }
      getCurationById(id, account?.twitterId).then(res => {
        if (res) {
          getCurationsOfTweet(res.tweetId).then(res => {
            const cs = res ?? []
            this.relatedCurations = cs.filter(c => c.curationId !== this.detailCuration.curationId)
          })
          this.$store.commit('curation/saveDetailCuration', res)
          this.updateCurationInfos()
        }
      }).catch(e => {console.log('Get curation fail:', e);}).finally(() => {
        this.loading1 = false
      })
    }
  },
  mounted () {
    this.loadCuration()
    this.updateInterval = setInterval(this.updateCurationInfos, 10000);
    this.timeIntrerval = setInterval(() => {
      this.endtime = parseTimestampToUppercase(this.detailCuration?.endtime)
    }, 1000)
  },
  beforeUnmount () {
    clearInterval(this.updateInterval)
    clearInterval(this.timeIntrerval)
  },
  unmounted() {
    clearInterval(this.updateInterval)
    clearInterval(this.timeIntrerval)
  }
}
</script>

<style scoped lang="scss">
.expand-box {
  transition: max-height 500ms;
}
.icon-share {
  background-image: url("~@/assets/icon-share-white.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  &:hover {
    background-image: url("~@/assets/icon-share-primary.svg");
  }
  &:focus {
    background-image: url("~@/assets/icon-share-primary.svg");
  }
}
.light .icon-share {
  background-image: url("~@/assets/icon-share-light.svg");
  &:hover {
    background-image: url("~@/assets/icon-share-primary.svg");
  }
  &:focus {
    background-image: url("~@/assets/icon-share-primary.svg");
  }
}
.tip-bg {
  background-image: url("~@/assets/tips-img.svg");
  background-repeat: no-repeat;
  background-size: 24px 24px;
  background-position: 18px 15px;
}
.token-tag {
  clip-path: polygon(20px 0, 100% 0, 100% 100%, 0 100%);
}
</style>
