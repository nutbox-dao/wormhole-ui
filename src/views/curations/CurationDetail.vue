<template>
  <div>
    <div class="md:border-b-1 border-dividerColor md:mb-1rem">
      <div class="relative container mx-auto max-w-50rem
                  md:px-1rem px-15px flex items-center
                  justify-between h-2.8rem">
        <div class="c-text-black text-1.5rem md:text-1rem md:mx-1.9rem">{{$t('curation.curationDetail')}}</div>
        <el-popover :width="270" trigger="click" popper-class="c-popper" ref="copyUrlPopper">
          <template #reference>
            <button class="w-24px h-24px icon-share"></button>
          </template>
          <template #default>
            <div class="gradient-border border-1 gradient-border-color3 rounded-8px
                        flex items-center justify-center py-14px cursor-pointer"
                 @click="$refs.copyUrlPopper.hide(), onCopy('https://alpha.wormhole3.io/#/curation-detail/' + detailCuration.curationId)">
              <i class="icon-copy w-20px h-20px 2xl:w-1rem 2xl:h-1rem mr-10px"></i>
              <span class="text-15px 2xl:text-0.75rem leading-22px 2xl:leading-1.1rem font-600">
                {{$t('curationsView.shareCuration')}}
              </span>
            </div>
          </template>
        </el-popover>
      </div>
    </div>
    <el-alert type="warning" v-if="!getAccountInfo?.twitterId">
      <template #default>
        <div class="flex flex-wrap justify-center">
          <div>{{$t('curationsView.t1')}}</div>
          <button class="md:mx-3 underline whitespace-nowrap" @click="$router.push('/signup')">{{$t('common.registerNow')}}</button>
        </div>
      </template>
    </el-alert>
    <!-- title -->
    <div class="container mx-auto max-w-50rem pb-2rem px-15px mt-1rem">
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-1.5rem">
        <div class="col-span-1 xl:col-span-2">
          <div v-loading="loading1"
               class="bg-blockBg h-min
                    light:bg-white light:border-1 light:border-colorE3
                    rounded-15px py-1.5rem text-left">
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
            <!-- curation info -->
            <div class="px-1.25rem pt-1rem" v-if="detailCuration">
              <div class="flex items-center">
                <img class="w-2.6rem md:h-2.6rem md:w-50px md:h-50px md:min-h-50px md:mr-30px mr-0.8rem rounded-full cursor-pointer"
                     @error="replaceEmptyImg"
                     @click="gotoUserPage(detailCuration && detailCuration.twitterUsername)"
                     :src="detailCuration && detailCuration.profileImg" alt="">
                <div class="flex md:flex-col md:justify-center md:items-start cursor-pointer" @click="gotoUserPage(detailCuration && detailCuration.twitterUsername)">
                  <a class="c-text-black text-16px 2xl:text-0.8rem leading-24px 2xl:leading-1rem mr-0.8rem">{{detailCuration && detailCuration.creatorTwitterName}}</a>
                  <span class="text-15px 2xl:text-0.75rem text-color8B light:text-color7D leading-22px 2xl:leading-1.1rem">@{{detailCuration && detailCuration.creatorTwitterUsername}}</span>
                </div>
              </div>
              <template v-if="contentType==='tweet'">
                <Blog :post="detailCuration">
                  <template #bottom-btn-bar><div></div></template>
                </Blog>
              </template>
              <template v-if="contentType==='space'">
                <Space :space="detailCuration" class="min-h-15rem bg-color7D/10 rounded-15px mt-10px"></Space>
              </template>
            </div>
          </div>
          <div v-if="contentType==='space'"
               class="bg-blockBg h-min light:bg-white light:border-1 light:border-colorE3
                    rounded-15px text-left mt-1rem">
            <div class="text-white light:text-blueDark px-1.25rem font-bold h-4rem
                              flex-1 flex justify-between items-center truncate"
                 @click="speakerTipVisible=true">
              <div class="flex-1 truncate flex items-center">
                <i class="w-18px h-18px icon-coin mr-10px"></i>
                <span class="flex-1 truncate">
                  ijooo tiped 44 STEEM to @superfactory
                </span>
              </div>
              <div v-if="taskIsOver"
                   class="ml-10px border-1 border-color62 h-2rem min-w-4rem flex items-center justify-center
                          leading-18px rounded-full px-3px">Top3</div>
            </div>
            <template v-if="taskIsOver">
              <div class="px-1.25rem py-4px hover:bg-color62/30 flex justify-between items-center"
                   v-for="i of 3" :key="i">
                <div class="flex items-center">
                  <img class="w-2rem mr-10px" src="~@/assets/icon-default-avatar.svg" alt="">
                  <span>username</span>
                </div>
                <span>144 STEEM</span>
              </div>
            </template>
          </div>
          <template v-if="contentType==='space'">
            <div class="bg-blockBg h-min light:bg-white light:border-1 light:border-colorE3 rounded-15px text-left mt-1rem">
              <el-collapse class="border-0 no-border-collapse pb-0">
                <el-collapse-item name="">
                  <template #title>
                    <div class="px-1.25rem pb-1rem w-full">
                      <div class="flex-1">
                        <div class="text-white light:text-blueDark font-bold
                              flex-1 flex justify-between items-center truncate">
                          🎉    Pop-Ups
                        </div>
                      </div>
                      <div class="flex justify-between items-center leading-2rem mb-0.5rem" v-for="i of 2" :key="i">
                        <div class="flex-1 flex items-center">
                          <div class="text-color8B font-bold min-w-4rem">04:38</div>
                          <div class="text-white">Reply on Tweet -></div>
                        </div>
                        <div class="flex whitespace-nowrap items-center justify-end min-w-1/3 text-white">
                          <img class="border-1 border-color-62 rounded-full w-1.6rem mr-10px"
                               src="~@/assets/icon-eth-white.svg" alt="">
                          <span>100 USDT</span>
                        </div>
                      </div>
                      <button class="bg-color62 w-full rounded-15px h-2.5rem leading-2rem text-white"
                              @click.stop="createPopUpVisible=true">
                        Click to add
                      </button>
                    </div>
                  </template>
                  <div class="text-white light:text-blueDark py-0.5rem border-t-1 border-color8B/30">
                    <div class="px-1.25rem py-4px hover:bg-color62/30 flex justify-between items-start"
                         v-for="i of ['going', 'participated', 'ended']" :key="i">
                      <template v-if="i==='going'">
                        <div class="flex items-center">
                          <div class="text-color8B font-bold min-w-4rem">04:38</div>
                          <div>Reply on Tweet -></div>
                        </div>
                      </template>
                      <template v-if="i==='participated'">
                        <div class="flex items-center">
                          <div class="min-w-4rem">
                            <img class="w-1.6rem" src="~@/assets/icon-success-green.svg" alt="">
                          </div>
                          <div>Reply on Tweet -></div>
                        </div>
                      </template>
                      <template v-if="i==='ended'">
                        <div class="flex items-start">
                          <span class="text-redColor font-bold min-w-4rem">Ened</span>
                          <div class="">
                            <div>Reply on Tweet -></div>
                            <div class="flex flex-wrap">
                              <div class="opacity-70 mr-10px whitespace-nowrap">My prize: 8.3     SIL</div>
                              <div class="opacity-50 whitespace-nowrap">all 323 participants >></div>
                            </div>
                          </div>
                        </div>
                      </template>
                      <div class="flex whitespace-nowrap items-center justify-end min-w-1/3">
                        <img class="border-1 border-color-62 rounded-full w-1.6rem"
                             src="~@/assets/icon-eth-white.svg" alt="">
                        <span>100 USDT</span>
                      </div>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </template>
          <div class="bg-blockBg h-min light:bg-white light:border-1 light:border-colorE3
                    rounded-15px text-left mt-1rem">
            <el-collapse class="border-0 no-border-collapse pb-0">
              <el-collapse-item name="">
                <template #title>
                  <div class="flex-1 flex justify-between items-center text-white
                              light:text-blueDark px-1.25rem font-bold">
                    <div>
                      <span class="c-text-black mr-6px">0/3</span>
                      <span>Quote to Earn</span>
                    </div>
                    <div class="flex whitespace-nowrap items-center justify-end min-w-1/3 text-white">
                      <img class="border-1 border-color-62 rounded-full w-1.6rem mr-10px"
                           src="~@/assets/icon-eth-white.svg" alt="">
                      <span>100 USDT</span>
                    </div>
                  </div>
                </template>
                <div class="text-white light:text-blueDark py-0.5rem border-t-1 border-color8B/30">
                  <div class="px-1.25rem py-4px hover:bg-color62/30 flex items-center">
                    <i class="w-1.2rem h-1.2rem mr-10px" :class="isQuote?'icon-checked':'icon-msg'"></i>
                    <span>Click to Quote</span>
                  </div>
                  <div class="px-1.25rem py-4px hover:bg-color62/30 flex items-center">
                    <i class="w-1.2rem h-1.2rem mr-10px" :class="isLike?'icon-checked':'icon-like'"></i>
                    <span>Like (or Verify your Like)</span>
                  </div>
                  <div class="px-1.25rem py-4px hover:bg-color62/30 flex items-center">
                    <i class="w-1.2rem h-1.2rem mr-10px" :class="isFollow?'icon-checked':'icon-follow'"></i>
                    <span>Follow @user (or Verify your Follow)</span>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>

          </div>
          <div class="bg-blockBg h-min px-1.25rem py-1rem light:bg-white light:border-1 light:border-colorE3 rounded-15px text-left mt-1rem">
            <div>
              <div class="font-bold">📝 Description</div>
              <div>Our first giveaway event, come and grab your airdrop</div>
            </div>
            <div class="flex justify-between items-center py-1rem">
              <span>🎁 Prize</span>
              <span>100 USDT</span>
            </div>
            <div class="flex justify-between items-center">
              <span>📅 Expiration</span>
              <span>1 DAY 27 MIN 05 S</span>
            </div>
          </div>
          <template v-if="contentType==='space'">
            <div class="xl:hidden bg-blockBg h-min light:bg-white light:border-1 light:border-colorE3 rounded-15px text-left mt-1rem">
              <SpeakerCollapse @showTip="speakerTipVisible=true"/>
            </div>
          </template>
          <!-- Related Curations web -->
          <div class="hidden xl:block py-1rem rounded-15px mt-1rem" v-if="detailCuration && detailCuration.name">
            <div class="text-left pt-0.5rem pb-1rem text-1.2rem font-bold">📢  Related Curations</div>
            <div class="max-h-15rem overflow-hidden relative py-10px rounded-15px bg-blockBg mb-1rem"
                 v-for="i of 3" :key="i">
              <CurationItem :curation="detailCuration"
                            class="bg-blockBg light:bg-white rounded-15px
                                   sm:bg-transparent sm:border-b-1 sm:border-listBgBorder mb-1rem md:mb-0">
              </CurationItem>
              <div class="absolute bg-color62/70 text-white bottom-0 left-0 w-full py-10px text-center">
                view more >
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-1 xl:col-span-1" v-if="detailCuration">
          <!-- token -->
<!--          <div v-loading="loading1" class="gradient-bg gradient-bg-color3 rounded-15px py-0.5rem px-1.5rem min-h-4rem light:shadow-popper-tip">-->
<!--            <div class="flex justify-between items-center">-->
<!--              <span class="text-colorF7">{{$t('curation.reward')}}</span>-->
<!--              <div class="flex items-center">-->
<!--                &lt;!&ndash; <span class="text-primaryColor font-500">PosW</span>-->
<!--                <img class="w-20px 2xl:w-1rem ml-0.5rem" src="~@/assets/icon-question-purple.svg" alt=""> &ndash;&gt;-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="w-full h-1px bg-white mt-0.8rem mb-1.6rem"></div>-->
<!--            <div class="flex justify-between items-center mb-2rem">-->
<!--              <span class="text-colorF7">Token</span>-->
<!--              <div class="flex items-center">-->
<!--                <img v-if="tokenIcon" class="w-1.5rem mr-0.6rem rounded-full" :src="tokenIcon" alt="">-->
<!--                <img v-else class="w-1.5rem mr-0.6rem rounded-full" src="~@/assets/icon-eth-white.svg" alt="">-->
<!--                <span class="font-700 text-white text-1.4rem">{{(detailCuration && detailCuration.amount) ? (detailCuration.amount.toString() / (10 ** detailCuration.decimals)) : '0'}} {{detailCuration && detailCuration.tokenSymbol}}</span>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="text-colorE0/80 text-12px 2xl:text-0.6rem">{{$t('curation.rewardOnChain')}}</div>-->
<!--          </div>-->
          <div class="hidden xl:block bg-blockBg h-min light:bg-white light:border-1 light:border-colorE3 rounded-15px text-left ">
            <div class="text-white light:text-blueDark p-0.5rem">
              <div class="text-1.2rem c-text-black my-6px">Host</div>
              <div class="flex justify-between items-center">
                <div class="flex items-center py-5px">
                  <img class="w-34px h-34px 2xl:w-1.7rem 2xl:h-1.7rem rounded-full"
                       src="~@/assets/icon-default-avatar.svg" alt="">
                  <span class="text-12px leading-18px 2xl:text-0.7rem 2xl:leading-1rem ml-15px truncate">Supermonday</span>
                </div>
                <button class="border-1 border-color62 px-1rem rounded-full text-color62">Tip</button>
              </div>
              <div class="text-1.2rem c-text-black my-6px">Speaker</div>
              <div class="flex justify-between items-center" v-for="i of 5" :key="i">
                <div class="flex items-center py-5px">
                  <img class="w-34px h-34px 2xl:w-1.7rem 2xl:h-1.7rem rounded-full"
                       src="~@/assets/icon-default-avatar.svg" alt="">
                  <span class="text-12px leading-18px 2xl:text-0.7rem 2xl:leading-1rem ml-15px truncate">Supermonday</span>
                </div>
                <button class="border-1 border-color62 px-1rem rounded-full text-color62">Tip</button>
              </div>
            </div>

          </div>
          <!-- curators list -->
          <div v-loading="loading2" class="border-1 border-color8B/30 rounded-15px p-2 mt-1rem text-left min-h-8rem">
            <div class="flex justify-between items-center mb-10px p-0.5rem">
              <div class="text-primaryColor light:text-color62">{{$t('curation.curators')}}  {{detailCuration && detailCuration.totalCount}}</div>
              <div v-if="participant.length > 10" class="text-right cursor-pointer text-12px 2xl:text-0.6rem"
                   @click="showSubmissions=true">
                {{$t('curation.viewAll')}}  >
              </div>
            </div>
            <div v-if="participant.length===0" class="flex flex-col justify-center items-center py-1rem">
              <div class="icon-list-no-data w-6rem h-4rem"></div>
              <div class="text-color84/30 font-600">{{$t('common.none')}}</div>
            </div>
            <!-- <div class="flex items-center py-6px cursor-pointer" @click="gotoUserPage(p.twitterUsername)" v-for="p of participant.slice(0, 10)" :key="p.twitterUsername">
              <img class="w-34px h-34px 2xl:w-1.7rem 2xl:h-1.7rem rounded-full"
                   @error="replaceEmptyImg"
                   :src="p.profileImg" alt="">
              <div class="text-12px leading-18px 2xl:text-0.7rem 2xl:leading-1rem ml-15px">
                <div>{{p.twitterUsername}} </div>
                <div class="text-color8B">{{createTime(p)}}</div>
              </div>
              <div class="flex items-center">
                <span class="font-700 text-15px leading-18px 2xl:text-0.75rem 2xl:leading-1rem">{{ formatAmount(p.amount / (10 ** p.decimals)) }} {{ p.tokenSymbol }} </span>
                <img class="w-15px h-15px 2xl:w-0.75rem 2xl:h-0.75rem ml-5px"
                     src="~@/assets/icon-question-white.svg" alt="">
              </div>
            </div> -->
            <div v-else class="flex justify-between items-center py-6px cursor-pointer"
                @click="gotoUserPage(record.twitterUsername)"
                 v-for="record of (participant.slice(0, 10) ?? [])" :key="record.id">
              <div class="flex items-center flex-1 overflow-hidden mr-8px">
                <img class="w-34px h-34px 2xl:w-1.7rem 2xl:h-1.7rem rounded-full"
                     @error="replaceEmptyImg"
                     :src="record.profileImg" alt="">
                <div class="flex-1 text-12px leading-18px 2xl:text-0.7rem 2xl:leading-1rem ml-15px truncate">
                  <div class="w-full truncate">{{record.twitterUsername}}</div>
                  <div class="text-color8B">{{createTime(record)}}</div>
                </div>
              </div>
              <div class="flex items-center" v-show="showReward">
                <span class="font-700 text-15px leading-18px 2xl:text-0.75rem 2xl:leading-1rem whitespace-nowrap">
                  {{ formatAmount(record.amount / (10 ** detailCuration.decimals)) }} {{ detailCuration.tokenSymbol }}
                </span>
                <!-- <img class="w-15px h-15px 2xl:w-0.75rem 2xl:h-0.75rem ml-5px"
                     src="~@/assets/icon-question-white.svg" alt=""> -->
              </div>
            </div>
          </div>
          <!-- operate button -->
          <div v-if="!getAccountInfo || !getAccountInfo.twitterId" class="xl:mt-2rem px-6px xl:relative xl:bottom-0 xl:w-full
                      fixed bottom-2rem left-0 right-0 z-2001
                      sm:inset-x-auto sm:left-1/2 sm:transform sm:-translate-x-1/2
                      flex sm:flex-col justify-between items-start sm:items-center">
              <div class="flex-1 w-full text-center">
                <button class="flex items-center justify-center gradient-btn
                   gradient-btn-shadow h-2.7rem px-1rem mx-auto
                   rounded-full c-text-black text-1.2rem xl:w-full"
                        @click="$router.push('/login')">
                  {{$t('signIn')}}
                </button>
              </div>
          </div>
          <div v-else-if="detailCuration.createStatus === 0">
          </div>
          <div v-else class="xl:mt-2rem px-6px xl:relative xl:bottom-0 xl:w-full
                      fixed bottom-2rem left-0 right-0 z-2001
                      sm:inset-x-auto sm:left-1/2 sm:transform sm:-translate-x-1/2
                      flex sm:flex-col justify-between items-start sm:items-center">
            <template v-if="btnStatus===0">
              <div class="flex-1 w-full text-center">
                <button class="flex items-center justify-center gradient-btn
                   gradient-btn-shadow h-2.7rem px-1rem mx-auto
                   rounded-full c-text-black text-1.2rem xl:w-full"
                        @click="modalVisible=true">
                  {{$t('curation.attendCuration')}}
                </button>
              </div>
            </template>
            <template v-if="btnStatus===1">
              <button class="flex items-center justify-center gradient-btn xl:mb-10px
                             gradient-btn-shadow h-2.7rem px-1rem
                             rounded-full c-text-black text-1.2rem xl:w-full"
                      disabled
                      @click="modalVisible=true">
                {{$t('curation.attended')}}
              </button>
              <div class="text-color8B c-text-black text-14px 2xl:text-1rem h-2.7rem flex items-center">
                {{$t('curation.toBeReward')}}
              </div>
            </template>
            <template v-if="btnStatus===2">
              <div class="text-color8B c-text-black text-14px 2xl:text-1rem w-full">
                {{$t('curation.unattend')}}
              </div>
            </template>
            <template v-if="btnStatus===3">
              <button class="flex items-center justify-center gradient-btn
                             gradient-btn-shadow h-2.7rem px-1rem
                             rounded-full c-text-black text-1.2rem xl:w-full"
                      disabled
                      @click="modalVisible=true">
                      {{$t('curation.attended')}}
              </button>
              <div class="flex items-end justify-between flex-col sm:flex-row sm:items-center xl:w-full xl:mt-20px">
                <span class="text-color8B c-text-black text-14px 2xl:text-0.75rem whitespace-nowrap">
                  {{$t('curation.reward')}} ({{detailCuration ? detailCuration.tokenSymbol : ''}})
                </span>
                <span class="c-text-black text-primaryColor text-24px leading-36px 2xl:text-1.2rem 2xl:leading-2rem ml-1rem">
                  {{ formatAmount(detailCuration ? ((detailCuration.joined ?? 0) / (10 ** (detailCuration.decimals ?? 18))) : 0) }}
                </span>
              </div>
            </template>
          </div>
          <!-- Related Curations mobile -->
          <div class="xl:hidden py-1rem rounded-15px mt-1rem" v-if="relatedCurations && relatedCurations.length > 0">
            <div class="text-left pt-0.5rem pb-1rem text-1.2rem font-bold">📢  Related Curations</div>
            <div class="max-h-15rem overflow-hidden relative py-10px rounded-15px bg-blockBg mb-1rem"
                 v-for="rc of relatedCurations" :key="rc.curationId">
              <CurationItem :curation="rc"
                            class="bg-blockBg light:bg-white rounded-15px
                                   sm:bg-transparent sm:border-b-1 sm:border-listBgBorder mb-1rem md:mb-0">
              </CurationItem>
              <div class="absolute bg-color62/70 text-white bottom-0 left-0 w-full py-10px text-center">
                view more >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-popup class="c-tip-drawer 2xl:w-2/5"
               v-model:show="modalVisible"
               :position="position">
      <div class="modal-bg w-full md:w-560px 2xl:max-w-28rem
      max-h-80vh 2xl:max-h-28rem overflow-auto flex flex-col
      rounded-t-1.5rem md:rounded-b-1.5rem pt-1rem md:py-2rem">
        <div v-if="position === 'bottom'"
             @click="modalVisible=false"
             class="w-6rem h-8px bg-color73 rounded-full mx-auto mb-1rem"></div>
        <div class="flex-1 overflow-auto px-1rem xl:px-2.5rem no-scroll-bar">
          <TweetAttendTip class="py-2rem md:py-0"
                          :curation="detailCuration"
                          @close="modalVisible=false"/>
        </div>
      </div>
    </van-popup>

    <el-dialog v-model="showSubmissions" fullscreen
               class="c-dialog-fullscreen c-dialog-no-shadow bg-primaryBg light:bg-primaryBgLight">
      <Submissions :records="participant" @close="showSubmissions=false"></Submissions>
    </el-dialog>
    <el-dialog v-model="speakerTipVisible"
               :show-close="false"
               :destroy-on-close="true"
               class="c-dialog c-dialog-center max-w-500px bg-glass border-1 border-color84/30 rounded-1.6rem">
      <div class="relative">
        <div class="w-max p-1rem ml-auto mr-0" @click="speakerTipVisible=false">
          <i class="w-1.2rem h-1.2rem icon-close"></i>
        </div>
        <SpeakerTipModal/>
      </div>
    </el-dialog>
    <el-dialog v-model="createPopUpVisible"
               :show-close="false"
               :destroy-on-close="true"
               class="c-dialog c-dialog-center max-w-500px bg-glass border-1 border-color84/30 rounded-1.6rem">
      <div class="relative">
        <div class="w-max p-1rem ml-auto mr-0" @click="createPopUpVisible=false">
          <i class="w-1.2rem h-1.2rem icon-close"></i>
        </div>
        <CreatePopUpModal/>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TweetAttendTip from "@/components/TweetAttendTip";
import { mapState, mapGetters } from "vuex";
import { getCurationById, getCurationRecord, popupsOfCuration, popupRecords, getSpaceInfoById, getCurationsOfTweet } from "@/api/api";
import { getDateString, parseTimestamp, formatAmount } from '@/utils/helper'
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import { ERC20List } from "@/config";
import {onCopy} from "@/utils/tool";
import Submissions from "@/views/curations/Submissions";
import {formatEmojiText} from "@/utils/tool";
import Blog from "@/components/Blog";
import Space from "@/components/Space";
import CurationItem from "@/components/CurationItem";
import SpeakerCollapse from "@/components/SpeakerCollapse";
import SpeakerTipModal from "@/components/SpeakerTipModal";
import CreatePopUpModal from "@/components/CreatePopUpModal";
import {testData} from "@/views/square/test-data";

export default {
  name: "CurationDetail",
  components: {
    TweetAttendTip, Submissions, Blog, Space,
    CurationItem, SpeakerCollapse, SpeakerTipModal,
    CreatePopUpModal
  },
  data() {
    return {
      position: document.body.clientWidth < 768?'bottom':'center',
      modalVisible: false,
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
      contentType: 'space',
      speakerTipVisible: false,
      createPopUpVisible: false,
      testData,
      updateInterval: null,
      relatedCurations: [],
      taskIsOver: false,
      isQuote: false,
      isLike: false,
      isFollow:false
    }
  },
  computed: {
    ...mapState('curation', ['detailCuration']),
    ...mapGetters(['getAccountInfo']),
    title() {
      if (this.detailCuration && this.detailCuration.content) {
        return this.detailCuration.content.split('\n')[0].slice(0, 50)
      }else{
        return '---'
      }
    },
    content() {
      if (this.detailCuration && this.detailCuration.content) {
        return this.detailCuration.content
      }else{
        return '---'
      }
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
          return this.$t('curation.end')
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
    btnStatus() {
      if (!this.detailCuration || !this.detailCuration.content) return 1
      const createStatus = this.detailCuration.createStatus;
      const curationStatus = this.detailCuration.curationStatus;
      const joined = this.detailCuration.joined;
      if (createStatus === 0) {
        return 1;
      }else {
        if (curationStatus === 0 && joined) {
          return 1
        }else if(curationStatus === 0 && !joined) {
          return 0;
        }else if(curationStatus === 1 && joined) {
          return 1;
        }else if (curationStatus === 1 && !joined) {
          return 2;
        }else if(curationStatus === 2 && joined) {
          return 3;
        }else if(curationStatus === 2 && !joined) {
          return 2;
        }
      }
    },
    time() {
      if (!this.detailCuration || !this.detailCuration.createdTime || !this.detailCuration.endtime) return '';
      const local = new Date().getTimezoneOffset() / -60;
      let start = new Date(this.detailCuration.createdTime);
      let end = new Date(this.detailCuration.endtime * 1000)
      return getDateString(start, local, 0) + ' ~ ' + getDateString(end, local, 0)
    },
  },
  methods: {
    formatEmojiText,
    onCopy,
    formatAmount,
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
    updateCurationInfos() {
      if (this.detailCuration && this.detailCuration.curationId) {
        const id = this.detailCuration.curationId;
        // update curation paricipant info
        getCurationRecord(id).then(res => {
          console.log('participant', res);
          this.participant = res ?? []
        }).catch(console.log).finally(() => {
          this.loading2 = false
        })

        // update popup info
        popupsOfCuration().then(res => {
          console.log('popups', res);
          this.popups = res
        }).catch(console.log).finally(() => {
          this.loading3 = false
        })

        // update tip info


        // update space host profile
        if (this.detailCuration.spaceId) {
          getSpaceInfoById(this.detailCuration.spaceId).then(res => {
            console.log('space', res);
            this.space = res
          }).finally(() => {
            this.loading5 = false;
          })
        }else {
          this.loading5 = false
        }
      }
    }
  },
  mounted () {
    const id = this.$route.params.id;
    const account = this.getAccountInfo

    if (this.detailCuration && this.detailCuration.curationId === id) {
      this.updateCurationInfos()
    }else {
      this.$store.commit('curation/saveDetailCuration', null)
      this.loading1 = true
    }
    getCurationById(id, account?.twitterId).then(res => {
      console.log('curation detail: ', res);
      if (res) {
        this.updateCurationInfos()
        getCurationsOfTweet(res.tweetId).then(res => {
          this.relatedCurations = res ?? []
        })
        this.$store.commit('curation/saveDetailCuration', res)
      }
    }).finally(() => {
      this.loading1 = false
    })
      this.loading2 = true
      this.loading3 = true
      this.loading4 = true
      this.loading5 = true

    this.updateInterval = setInterval(this.updateCurationInfos, 15000);
  },
  beforeUnmount () {
    clearInterval(this.updateInterval)
  },
  unmounted() {
    clearInterval(this.updateInterval)
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
</style>
