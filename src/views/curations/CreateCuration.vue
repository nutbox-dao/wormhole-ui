<template>
  <div>
    <div class="md:border-b-1 border-dividerColor mb-1rem">
      <div class="relative container mx-auto max-w-50rem md:px-1rem px-15px flex items-center md:justify-start justify-center h-2.8rem">
        <div class="c-text-black text-1.5rem md:text-1rem mx-1.9rem">{{$t('curationsView.createCuration')}}</div>
      </div>
    </div>
    <div v-if="currentStep<=2" v-loading="loading"
         class="container mx-auto max-w-600px xl:max-w-30rem bg-blockBg light:bg-white rounded-20px px-2rem sm:px-4.5rem py-2rem mb-2rem">
      <Steps :total-step="2" :current-step="currentStep"/>
      <!-- set up -->
      <div v-if="currentStep===1" class="text-left text-14px 2xl:text-0.7rem">
        <!-- title -->
        <!-- <div class="mt-1.8rem">
          <div class="mb-6px">{{$t('curation.title')}}</div>
          <div class="bg-black border-1 border-color8B/30
                      light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                      rounded-12px h-40px 2xl:h-2rem flex items-center relative">
            <div contenteditable
                 class="bg-transparent w-full px-0.5rem overflow-hidden whitespace-nowrap text-15px leading-24px 2xl:text-0.75rem 2xl:leading-1rem"
                 ref="titleRef"
                 @keydown="keydown"
                 @blur="getBlur('title')"
                 @paste="onPaste"
                 v-html="formatEmojiText(form.title)"></div>
            <el-popover ref="titleEmojiPopover" trigger="click" width="300" :teleported="false" :persistent="false">
              <template #reference>
                <img class="w-1.8rem h-1.8rem lg:w-1.4rem lg:h-1.4rem mx-8px" src="~@/assets/icon-emoji.svg" alt="">
              </template>
              <div class="h-310px lg:h-400px">
                <EmojiPicker :options="{
                                imgSrc:'/emoji/',
                                locals: $i18n.locale==='zh'?'zh_CN':'en',
                                hasSkinTones:false}"
                             @select="(e) =>selectEmoji(e,'title')" />
              </div>
            </el-popover>
          </div>
        </div> -->
        <div class="mt-1.8rem relative">
          <div class="mb-6px c-text-black">{{$t('curation.category')}}</div>
          <div class="bg-black border-1 border-color8B/30
                      light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                      rounded-12px h-40px 2xl:h-2rem flex items-center relative">
            <el-select v-model="form.category" class="w-full" size="large">
              <el-option label="Tweet" value="tweet"></el-option>
              <el-option label="Space" value="space"></el-option>
            </el-select>
          </div>
        </div>
        <div class="mt-1.8rem relative">
          <div class="mb-6px c-text-black">{{$t('curation.select')}}</div>
          <div class="bg-black border-1 border-color8B/30
                      light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                      rounded-12px h-40px 2xl:h-2rem flex items-center relative">
            <el-select v-model="form.createType" class="w-full" size="large">
              <el-option label="Create New" value="new"></el-option>
              <el-option label="Related" value="related"></el-option>
            </el-select>
          </div>
        </div>
        <!-- create new content -->
        <div class="mt-1.8rem relative" v-if="form.category==='tweet' && form.createType==='new'">
          <div class="mb-6px flex items-center">
            <div class="mr-7px">{{$t('curation.descriptionTitle')}}</div>
            <el-popover placement="bottom"
                        popper-class="c-popper"
                        width="100%"
                        trigger="click">
              <template #reference>
                <img class="w-14px h-14px 2xl:w-0.8rem 2xl:h-0.8rem" src="~@/assets/icon-warning-grey.svg" alt="">
              </template>
              <div class="max-w-500px 2xl:max-w-540px mx-auto rounded-12px overflow-hidden"
                   style="box-shadow: 0px 3px 23px rgba(65, 0, 203, 0.4);">
                <div class="border-2 gradient-border gradient-border-color3 rounded-12px overflow-hidden">
                  <div class="bg-black light:bg-white p-14px">
                    <div class="italic text-12px leading-24px 2xl:text-0.6rem 2xl:leading-1.2rem
                            text-color7D light:text-blueDark">
                      {{$t('curation.description')}}
                    </div>
                  </div>
                </div>
              </div>
            </el-popover>
          </div>
          <div class="border-1 bg-black/40 border-1 border-color8B/30
                      light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                      rounded-12px">
            <div contenteditable
                 class="desc-input p-1rem min-h-6rem whitespace-pre-line text-15px leading-24px 2xl:text-0.75rem 2xl:leading-1rem"
                 ref="descContentRef"
                 @blur="getBlur('desc')"
                 @paste="onPaste"
                 v-html="formatEmojiText(form.description)"></div>
            <div class="py-2 border-t-1 border-color8B/30">
              <el-popover ref="descEmojiPopover"
                          trigger="click" width="300"
                          :teleported="false" :persistent="false">
                <template #reference>
                  <img class="w-1.8rem h-1.8rem lg:w-1.4rem lg:h-1.4rem mx-8px" src="~@/assets/icon-emoji.svg" alt="">
                </template>
                <div class="h-310px lg:h-400px">
                  <EmojiPicker :options="{
                                imgSrc:'/emoji/',
                                locals: $i18n.locale==='zh'?'zh_CN':'en',
                                hasSkinTones:false,
                                hasGroupIcons:false}"
                               @select="(e) =>selectEmoji(e,'desc')" />
                </div>
              </el-popover>
            </div>
          </div>
        </div>
        <!-- related link -->
        <div class="mt-1.8rem relative" v-if="form.createType === 'related'">
          <div class="mb-6px c-text-black">{{$t('curation.relatedContent')}}</div>
          <div class="bg-black border-1 border-color8B/30
                      light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                      rounded-12px h-40px 2xl:h-2rem flex items-center relative">
            <input class="bg-transparent h-full w-full px-0.5rem"
                   v-model="form.link"
                   type="text" :placeholder="$t('curation.pasteLink')">
            <button class="text-color62 c-text-black mx-10px whitespace-nowrap"
                    @click="checkLink">{{$t('curation.verify')}}</button>
          </div>
        </div>
        <!-- preview tweet -->
        <div class="mt-1.8rem" v-if="form.category==='tweet' && linkIsVerified">
          <div class="mb-6px c-text-black">{{$t('curation.preview')}}</div>
          <div class="max-h-15rem overflow-hidden relative rounded-15px">
            <Blog :post="testData[0]"
                  class="bg-blockBg light:bg-white rounded-15px
                       border-1 border-listBgBorder mb-1rem md:mb-0">
              <template #bottom-btn-bar><div></div></template>
            </Blog>
            <div class="absolute bg-color62/70 text-white bottom-0 left-0 w-full py-10px text-center">
              view more >
            </div>
          </div>

        </div>
        <!-- preview space -->
        <div class="mt-1.8rem" v-if="form.category==='space' && linkIsVerified">
          <div class="mb-6px c-text-black">{{$t('curation.preview')}}</div>
          <div class="h-15rem overflow-hidden relative">
            <Space class="bg-blockBg light:bg-white rounded-15px h-full
                        border-1 border-listBgBorder mb-1rem md:mb-0"
                    :space="space"/>
          </div>
        </div>
        <!-- edit speaker -->
        <div class="mt-1.8rem" v-if="form.category==='space'">
          <div class="mb-6px c-text-black">{{$t('curation.details')}}</div>
          <!-- Host-->
          <div class="mb-6px c-text-black mt-1rem">{{$t('curation.host')}}</div>
          <div v-if="form.host.name" class="flex items-center"
               @click="showAddSpeakerModal('host','edit')">
            <img v-if="form.host.avatar" class="w-4rem h-4rem rounded-2rem" :src="form.host.avatar" alt="">
            <img v-else class="w-4rem h-4rem" src="~@/assets/icon-default-avatar.svg" alt="">
            <div class="ml-10px">
              <div class="mb-6px">{{form.host.name}}</div>
              <div>@{{form.host.username}}</div>
            </div>
          </div>
          <div v-else @click="showAddSpeakerModal('host','add')"
               class="w-4rem h-4rem c-text-black text-2rem cursor-pointer
                      bg-color7D rounded-15px flex justify-center items-center">
            +
          </div>
          <!-- Co-Host-->
          <div class="mb-6px c-text-black mt-1rem">{{$t('curation.coHosts')}}({{$t('curation.optional')}})</div>
          <div class="flex flex-wrap">
            <div class="flex items-center mr-10px relative"
                 v-for="(coHost, index) of form.coHost" :key="index"
                 @click="showAddSpeakerModal('coHost','edit', index)">
              <div class="absolute -top-5px -left-5px bg-white/20 rounded-full p-3px"
                   @click.stop="deleteSpeaker('speaker', index)">
                <i class="icon-close w-1.2rem h-1.2rem"></i>
              </div>
              <img v-if="coHost.avatar" class="w-4rem h-4rem rounded-2rem" :src="coHost.avatar" alt="">
              <img v-else class="w-4rem h-4rem" src="~@/assets/icon-default-avatar.svg" alt="">
              <div class="ml-10px">
                <div class="mb-6px">{{coHost.name}}</div>
                <div>@{{coHost.username}}</div>
              </div>
            </div>
            <div @click="showAddSpeakerModal('coHost','add')"
                v-show="form.coHost.length < 3"
                 class="w-4rem h-4rem c-text-black text-2rem cursor-pointer
                      bg-color7D rounded-15px flex justify-center items-center">
              +
            </div>
          </div>
          <!-- Speakers-->
          <div class="mb-6px c-text-black mt-1rem">{{$t('curation.speakers')}}({{$t('curation.optional')}})</div>
          <div class="flex flex-wrap">
            <div class="flex items-center mr-10px relative"
                 v-for="(speaker, index) of form.speakers" :key="index"
                 @click="showAddSpeakerModal('speaker','edit', index)">
              <div class="absolute -top-5px -left-5px bg-white/20 rounded-full p-3px"
                   @click.stop="deleteSpeaker('speaker', index)">
                <i class="icon-close w-1.2rem h-1.2rem"></i>
              </div>
              <img v-if="speaker.avatar" class="w-4rem h-4rem rounded-2rem" :src="speaker.avatar" alt="">
              <img v-else class="w-4rem h-4rem" src="~@/assets/icon-default-avatar.svg" alt="">
              <div class="ml-10px">
                <div class="mb-6px">{{speaker.name}}</div>
                <div>{{speaker.title}}</div>
              </div>
            </div>
            <div @click="showAddSpeakerModal('speaker','add')"
                v-show="form.speakers.length < 10"
                 class="w-4rem h-4rem c-text-black text-2rem cursor-pointer
                      bg-color7D rounded-15px flex justify-center items-center">
              +
            </div>
          </div>
        </div>
        <!-- requirements -->
        <div class="mt-1.8rem relative">
          <div class="mb-6px c-text-black">{{$t('curation.requirements')}}</div>
          <div class="bg-black border-1 border-color8B/30
                      light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                      rounded-12px h-40px 2xl:h-2rem flex justify-between items-center relative">
            <el-select v-model="form.mandatoryTask" class="w-full text-white" size="large">
              <el-option label="Quote" value="quote"></el-option>
              <el-option label="Reply" value="reply"></el-option>
            </el-select>
            <div class="text-color62 px-10px">{{$t('curation.required')}}*</div>
          </div>
          <div class="bg-black border-1 border-color8B/30 px-15px
                      light:bg-colorF2 light:border-colorE3
                      rounded-12px min-h-40px 2xl:min-h-2rem relative"
               :class="form.isFollow?'pb-10px':''"
               @click="form.isFollow=!form.isFollow">
            <div class="flex justify-between items-center h-40px 2xl:h-2rem">
              <span>{{$t('curation.follow')}}</span>
              <span class="w-16px h-16px min-w-16px min-h-16px rounded-full border-5"
                    :class="form.isFollow?'border-color62 bg-white':'border-color8B/40 bg-color8B/40'"></span>
            </div>
            <template v-if="form.isFollow">
              <div class="flex flex-wrap items-center">
                <span v-for="item of form.followList" :key="item"
                      class="bg-color62 py-4px px-8px rounded-4px mx-10px my-5px">{{item}}</span>
              </div>
              <div class="bg-black border-1 border-color8B/30 px-15px
                      light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                      rounded-12px min-h-40px 2xl:min-h-2rem relative">
                <div class="flex items-center w-full" @click.stop>
                  <input class="bg-transparent h-40px 2xl:h-2rem w-full"
                         v-model="followName"
                         placeholder="@username">
                  <button class="px-10px py-5px border-1 border-color62 text-color62 rounded-full"
                          @click.stop="form.followList.push(followName)">Add</button>
                </div>
              </div>
            </template>
          </div>
          <div class="bg-black border-1 border-color8B/30 px-15px
                      light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                      rounded-12px h-40px 2xl:h-2rem flex justify-between items-center relative"
               @click="form.isLike=!form.isLike">
            <span>{{$t('curation.like')}}</span>
            <span class="w-16px h-16px min-w-16px min-h-16px rounded-full border-5"
                  :class="form.isLike?'border-color62 bg-white':'border-color8B/40 bg-color8B/40'"></span>
          </div>
        </div>
        <!-- schedule -->
        <div class="mt-1.8rem">
          <div class="mb-6px">{{$t('curation.schedule')}}</div>
          <div class="mb-6px text-primaryColor italic">{{$t('curation.startTimeTip')}}</div>
          <div class="relative border-1 bg-black/40 border-1 border-color8B/30
                      light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                      rounded-12px h-40px 2xl:h-2rem flex items-center">
            <div class="flex-1">
              <el-date-picker
                  class="c-input-date"
                  popper-class="c-date-popper"
                  prefix-icon="none"
                  clear-icon="none"
                  v-model="form.endtime"
                  type="datetime"
                  placeholder="End time"
                  :disabled-date="disabledDate"
              />
            </div>
            <img class="absolute right-0.8rem" src="~@/assets/icon-date.svg" alt="">
          </div>
        </div>
        <div class="text-right mt-2rem">
          <button class="h-40px 2xl:h-2rem rounded-full px-1.5rem  gradient-btn"
                  @click="onNext">{{$t('common.next')}}</button>
        </div>
      </div>
      <!-- reward -->
      <div v-if="currentStep===2" class="text-left text-14px 2xl:text-0.7rem">
        <div class="mt-1.8rem">
          <div class="mb-6px">{{$t('curation.connectWallet')}}</div>
          <div class="relative border-1 gradient-border gradient-border-color3 rounded-12px overflow-hidden">
            <div class="bg-black/30 light:bg-gradient-btn-purple light:bg-white h-50px 2xl:h-2.5rem
                      flex justify-center items-center cursor-pointer"
                 @click="connectWallet">
            <span class="font-600 text-15px 2xl:text-0.75rem
                         light:bg-gradient-text-light
                         gradient-text gradient-text-purple-white">
              {{showAccount ? showAccount : $t('common.connectMetamask')}}
            </span>
              <img class="absolute h-32px right-20px" src="~@/assets/icon-metamask.png" alt="">
              <div v-if="connectLoading"
                   class="absolute bg-black/70 light:bg-white/40 w-full h-full rounded-12px flex justify-center items-center">
                <img class="w-3rem" src="~@/assets/loading-points.svg" alt="">
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-1.8rem">
          <div class="mb-6px">{{$t('curation.maxCount')}}</div>
          <div class="mb-6px text-primaryColor italic">{{$t('curation.maxCountTip')}}</div>
          <div class="flex items-center flex-col sm:flex-row">
            <div class="w-full sm:w-4/7 border-1 bg-black/40 border-1 border-color8B/30
                        light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                        rounded-12px h-40px 2xl:h-2rem">
              <input class="bg-transparent h-full w-full px-0.5rem"
                    v-model="form.maxCount"
                     type="number" :placeholder="$t('curation.inputMaxCount')">
            </div>
            <div class="w-full sm:w-3/7 flex items-center sm:justify-center">
              <el-switch v-model="form.isLimit" />
              <span class="ml-10px font-600 whitespace-nowrap"
                    :class="form.isLimit?'text-primaryColor1':'text-color8B'">{{$t('curation.noLimited')}}</span>
            </div>
          </div>
        </div>
        <!-- posw des -->
        <div class="mt-1.8rem">
          <div class="mb-6px">{{$t('curation.rewardsMethod')}}</div>
          <div class="border-1 border-color8B/30 rounded-12px 2xl:2.5rem p-10px">
            <div class="text-primaryColor light:text-color62 font-600 text-15px 2xl:text-0.75rem">
              {{$t('curation.autoMethod')}}
            </div>
            <div class="mt-1rem text-color8B light:text-color7D text-12px leading-20px 2xl:text-0.6rem 2xl:leading-1rem">
              {{$t('curation.autoMethodTip')}}
            </div>
          </div>
        </div>
        <!-- token -->
        <div class="mt-1.8rem">
          <div class="mb-6px">{{$t('curation.rewardsAmount')}}</div>
          <div class="flex items-center flex-col sm:flex-row">
            <div ref="tokenPopper"
                 class="w-full sm:w-4/7 border-1 bg-black/40 border-1 border-color8B/30
                       light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                        rounded-12px h-40px 2xl:h-2rem">
              <input class="bg-transparent h-full w-full px-0.5rem"
                      v-model="form.amount"
                     type="number" :placeholder="$t('curation.inputRewardsAmount')">
            </div>
            <div class="w-full sm:w-3/7 mt-10px sm:pl-1.5rem sm:mt-0">
              <div class="border-1 bg-black/40 border-1 border-color8B/30
                          light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                          rounded-12px h-40px 2xl:h-2rem">
                <el-popover popper-class="c-popper" placement="top" :width="popperWidth" trigger="click" ref="elPopover">
                  <template #reference>
                    <div class="h-full w-full flex justify-between items-center cursor-pointer px-15px">
                      <div class="flex items-center">
                        <img v-if="selectedToken.icon" class="h-22px mr-15px rounded-full" :src="selectedToken.icon" alt="">
                        <img v-else class="h-22px mr-15px rounded-full" src="~@/assets/icon-eth-white.svg" alt="">
                        <span class="text-color8B text-15px">{{ selectedToken.symbol }}</span>
                      </div>
                      <img class="w-1rem" src="~@/assets/icon-select-arrow.svg" alt="">
                    </div>
                  </template>
                  <template #default>
                    <div class="border-1 border-color8B/30 bg-blockBg
                                light:bg-white light:border-colorE3 hover:border-primaryColor
                                rounded-12px py-10px overflow-x-hidden">
                      <div class="px-10px mb-10px">
                        <div class="w-full border-1 bg-black/40 border-1 border-color8B/30
                                    light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                                    rounded-12px h-40px 2xl:h-2rem">
                          <input class="bg-transparent h-full w-full px-0.5rem"
                                v-model="form.token"
                                @input="updateToken"
                                 type="text" :placeholder="$t('curation.inputErc20')">
                        </div>
                      </div>
                      <div v-if="customToken"
                           class="h-full w-full flex items-center cursor-pointer border-b-1 border-color8B/10 py-3 px-10px
                           overflow-x-hidden hover:bg-black/30 light:hover:bg-black/10">
                        <img class="h-34px mr-15px" src="~@/assets/icon-eth-white.svg" alt="">
                        <div class="flex-1 flex flex-col text-color8B light:text-blueDark overflow-x-hidden"
                             @click="selectedToken = customToken;$refs.elPopover.hide()">
                          <span class="text-15px">{{customToken.symbol}}</span>
                          <span class="text-12px whitespace-nowrap overflow-hidden overflow-ellipsis">
                            {{customToken.address}}
                          </span>
                        </div>
                      </div>
                      <div v-for="token of tokenList" :key="token.address"
                            @click="updateSelectBalance(token);selectedToken=token;$refs.elPopover.hide()"
                           class="h-full w-full flex items-center cursor-pointer border-b-1 border-color8B/10 py-3 px-10px
                           overflow-x-hidden hover:bg-black/30 light:hover:bg-black/10">
                        <img class="h-34px mr-15px rounded-full" :src="token.icon" alt="">
                        <div class="flex-1 flex flex-col text-color8B light:text-blueDark overflow-x-hidden">
                          <span class="text-15px">{{token.symbol}}</span>
                          <span class="text-12px whitespace-nowrap overflow-hidden overflow-ellipsis">
                            {{token.address}}
                          </span>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-popover>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-1.8rem w-full h-1px bg-color8B/30"></div>
        <div class="mt-1.8rem text-right font-400">
          <div>{{$t('common.balance')}} ({{selectedToken.symbol}})</div>
          <div class="mt-0.6rem text-24px 2xl:text-1.2rem">{{ formatAmount(selectBalance) }}</div>
        </div>
        <!-- submit -->
        <div class="mt-1.8rem flex justify-between text-15px">
          <button class="h-40px 2xl:h-2rem rounded-full px-1.5rem border-1 border-white light:border-color7D light:text-color7D"
                  @click="currentStep=1">{{$t('common.preview')}}</button>
          <button class="h-40px 2xl:h-2rem rounded-full px-1.5rem gradient-btn text-15px"
                  @click="onSubmit">
                  <span>{{$t('common.submit')}}</span>
                </button>
        </div>
      </div>
    </div>
    <!-- post tweet -->
    <div v-else class="mt-1.5rem">
      <div class="flex justify-center items-center mb-1rem">
        <img class="w-20px h-20px 2xl:w-1rem 2xl:h-1rem"
             src="~@/assets/icon-success-green.svg" alt="">
        <span class="text-greenColor text-15px font-500 ml-10px">{{$t('curation.createdOk')}}</span>
      </div>
      <div v-loading="loading"
           class="container mx-auto max-w-600px xl:max-w-30rem bg-blockBg
                  light:bg-white light:border-colorE3 hover:border-primaryColor
                  rounded-20px px-2rem sm:px-4.5rem py-2rem mb-2rem">
        <TweetAndStartCuration :curation-content="curation.content"
                               :curation-id="curation.curationId"
                               @onPost="onPost"/>
      </div>
    </div>
    <!-- create curation modal -->
    <van-popup v-if="modalVisible" class="c-tip-drawer 2xl:w-2/5"
               v-model:show="modalVisible"
               :close-on-click-overlay="false"
               :position="position">
      <div class="modal-bg w-full md:max-w-560px 2xl:max-w-28rem
      max-h-80vh 2xl:max-h-28rem overflow-auto flex flex-col
      rounded-t-1.5rem md:rounded-b-1.5rem pt-1rem md:py-2rem">
        <div v-if="position === 'bottom'"
             @click="modalVisible=false"
             class="w-6rem h-8px bg-color73 rounded-full mx-auto mb-1rem"></div>
        <div class="flex-1 overflow-auto px-1.5rem no-scroll-bar">
          <component :is="modalComponent"
                     :token="selectedToken"
                     :amount="form.amount"
                     @createCuration="createCuration"
                     @confirmComplete="onComplete"
                     @close="modalVisible=false;loading=false"></component>
        </div>
      </div>
    </van-popup>
    <el-dialog v-model="addSpeakerVisible"
               destroy-on-close
               :show-close="false"
               :close-on-click-modal="true"
               class="c-dialog c-dialog-center max-w-34rem bg-glass border-1 border-color84/30 rounded-1.6rem">
      <AddSpeakerModal class="p-2rem"
                       :speaker-type="addSpeakerType"
                       :speaker-data="addSpeakerData"
                       @close="addSpeakerVisible=false"
                       @confirm="onConfirmSpeaker"/>
    </el-dialog>
  </div>
</template>

<script>
import Steps from "@/components/Steps";
import SendTokenTip from "@/components/SendTokenTip";
import TwitterCompleteTip from "@/components/TwitterCompleteTip";
import {markRaw, ref} from "vue";
import { newCuration, postErr, applyAirdrop, getDropRecord } from '@/api/api'
import { getTweetById, getSpaceById, getUserInfoByUserId } from '@/utils/twitter'
import { getSpaceIdFromUrls } from '@/utils/twitter-tool'
import { mapGetters, mapState } from 'vuex'
import { notify, showError } from "@/utils/notify";
import { setupNetwork, chainChanged, lockStatusChanged } from '@/utils/web3/web3'
import { getTokenInfo, getERC20TokenBalance } from '@/utils/asset'
import { accountChanged, getAccounts, updateAllUsersByPolling } from '@/utils/web3/account'
import { CHAIN_ID, ERC20List, CURATION_SHORT_URL } from "@/config";
import { ethers } from 'ethers'
import { sleep, formatAmount } from '@/utils/helper'
import { randomCurationId, creteNewCuration } from '@/utils/curation'
import TweetAndStartCuration from "@/components/TweetAndStartCuration";
import { EmojiPicker } from 'vue3-twemoji-picker-final'
import {formatEmojiText} from "@/utils/tool";
import Blog from "@/components/Blog";
import Space from "@/components/Space";
import AddSpeakerModal from "@/components/AddSpeakerModal";
import {testData} from "@/views/square/test-data";
import { dataToEsm } from "@rollup/pluginutils";

export default {
  name: "CreateCuration",
  components: {Steps, SendTokenTip, TwitterCompleteTip, TweetAndStartCuration, EmojiPicker, Blog, Space, AddSpeakerModal},
  data() {
    return {
      position: document.body.clientWidth < 768?'bottom':'center',
      currentStep: 1,
      connectLoading: false,
      loading: false,
      receiving: false,
      // we cancel title from 2022/10/12
      // get the first line of description as title
      form: {
        title: '',
        endtime: '',
        isLimit: true,
        maxCount: '',
        description: '',
        token: '',
        amount: '',
        category: 'space',
        createType: 'new',
        link: '',
        host: {},
        coHost: [],
        speakers: [],
        mandatoryTask: 'quote',
        isFollow: false,
        followList: [],
        isLike: false
      },
      addSpeakerVisible: false,
      addSpeakerType: 'host',
      operateType: 'add',
      addSpeakerData: {avatar: '', name: '', title: ''},
      editSpeakerIndex: 0,
      followName: '',
      linkIsVerified: false,
      checkingTweetLink: false,
      selectedToken: {},
      tokenList: ERC20List,
      modalVisible: false,
      modalComponent: markRaw(SendTokenTip),
      popperWidth: 200,
      customToken: null,
      curation: {},
      testTokens: [
        '0x871AD5aAA75C297EB22A6349871ce4588E3c0306',
        '0xa90f2c24fd9bb1934e98BBE9A9Db8CBd57c867f0',
        '0x622A71842cb6f2f225bEDa38E0BdD85331573182'
      ],
      descEditContent: '',
      descRange: null,
      titleRange: null,
      progress: 0,
      progressing: false,
      selectBalance: 0,
      testData,
      postData: {},
      space: {},
      TweetLinRex: 'https://twitter.com/[a-zA_Z0-9\_]+/status/([0-9]+)'
    }
  },
  computed: {
    ...mapState('web3', ['account', 'chainId']),
    ...mapGetters('curation', ['getDraft', 'getPendingTweetCuration']),
    ...mapGetters(['getAccountInfo']),
    showAccount() {
      if (this.account && this.chainId === CHAIN_ID)
        return this.account.slice(0, 12) + '...' + this.account.slice(this.account.length - 12, this.account.length);
      return false
    },
  },
  watch: {
    account(newValue, oldValue) {
      this.updateSelectBalance(this.selectedToken, newValue)
    }
  },
  methods: {
    formatEmojiText,
    formatAmount,
    async checkLink() {
      const link = this.form.link;
      const match = link.match(this.TweetLinRex);
      if (!match) {
        notify({message: this.$t('err.wrongTweetLink'), type: 'error', duration: 3000});
        return;
      }
      try{
        this.checkingTweetLink = true;
        const tweet = await getTweetById(match[1]);
        console.log(235, tweet);
        if (tweet.data) {
          if (this.form.category === 'space') {
            const spaceId = getSpaceIdFromUrls(tweet.data.entities.urls)
            const space = await getSpaceById(spaceId);
            if (space?.includes?.users) {
              console.log(66, space);
              let author;
              for (let u of space.includes.users) {
                if (u.id === space.data.creator_id) {
                  author = u
                  break;
                }
              }
              this.space = {
                authorName: author.name,
                authorUsername: author.username,
                authorProfileImg: author.profile_image_url,
                spaceTitle: space.data.title,
                spaceState: space.data.state
              }
            }
            this.linkIsVerified = true;
          }else {
            this.postData = {}
            this.linkIsVerified = true;
          }
        }
      } catch (e) {
        if (e === 'log out') {
          this.$route.replace('/square')
        }
      } finally {
        this.checkingTweetLink = false;
      }
    },  
    showAddSpeakerModal(speakerType, operateType, index=0) {
      this.addSpeakerType = speakerType
      this.operateType = operateType
      this.editSpeakerIndex = index
      if(operateType==='add') {
        this.addSpeakerData = {}
        this.addSpeakerVisible = true
      } else {
        if(this.addSpeakerType === 'host') this.fomr.host = {}
        if(this.addSpeakerType === 'coHost') this.form.coHost.splice(index, 1)
        if(this.addSpeakerType === 'speaker') this.form.speakers.splice(indes, 1)
      }
    },
    onConfirmSpeaker(data) {
      console.log(666, data);
      if (!data) {
        this.addSpeakerVisible = false;
        return;
      }
      if(this.addSpeakerType === 'host') this.form.host = data
      if(this.operateType==='add') {
        if(this.addSpeakerType === 'coHost') this.form.coHost.push(data)
        if(this.addSpeakerType === 'speaker') this.form.speakers.push(data)
      } else {
        // if(this.addSpeakerType === 'coHost') this.form.coHost[this.editSpeakerIndex] = data
        // if(this.addSpeakerType === 'speaker') this.form.speakers[this.editSpeakerIndex] = data
      }
      this.addSpeakerVisible = false
    },
    deleteSpeaker(addSpeakerType, index) {
      if(this.addSpeakerType === 'coHost') this.form.coHost.splice(index, 1)
      if(this.addSpeakerType === 'speaker') this.form.speakers.splice(index, 1)
    },
    selectEmoji(e, type) {
      const newNode = document.createElement('img')
      newNode.alt = e.i
      newNode.src = e.imgSrc
      newNode.className = 'inline-block w-18px h-18px mx-2px'
      if(type==='title') {
        if(!this.titleRange) return
        this.titleRange.insertNode(newNode)
        this.$refs.titleEmojiPopover.hide()
      } else if(type==='desc') {
        if(!this.descRange) return
        this.descRange.insertNode(newNode)
        this.$refs.descEmojiPopover.hide()
      }
    },
    onPaste(e) {
      e.preventDefault()
      let text
      let clp = e.clipboardData
      if (clp === undefined || clp === null) {
        text = window.clipboardData.getData('text') || ''
        if (text !== "") {
          text = formatEmojiText(text)
          let newNode = document.createElement('div')
          newNode.innerHTML = text;
          window.getSelection().getRangeAt(0).insertNode(newNode)
        }
      } else {
        text = clp.getData('text/plain') || ''
        if (text !== "") {
          text = formatEmojiText(text)
          document.execCommand('insertHtml', false, text)
        }
      }
    },
    keydown(e) {
      if(e.keyCode === 13) {
        e.preventDefault()
        return false
      }
    },
    getBlur(type) {
      const sel = window.getSelection();
      if(type==='desc' && sel) this.descRange = sel.getRangeAt(0);
      if(type==='title' && sel) this.titleRange = sel.getRangeAt(0);
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
      // this.$refs.descContentRef.innerHTML = this.$refs.descContentRef.innerHTML.replaceAll('<div>', '\n')
      // this.$refs.descContentRef.innerHTML =this.$refs.descContentRef.innerHTML.replaceAll('</div>', '\n')
      // this.$refs.descContentRef.innerHTML =this.$refs.descContentRef.innerHTML.replaceAll('<br>', '')
      // for(let i of this.$refs.descContentRef.childNodes) {
      //   if(i.nodeName==='#text') {
      //     this.form.description += i.textContent
      //   } else if(i.nodeName === 'IMG') {
      //     this.form.description += i.alt
      //   }
      // }
    },
    disabledDate(time) {
      return time.getTime() + 86400000 < Date.now() || time.getTime() > Date.now() + 86400000*7
    },
    async updateProgress(start, end, isFinnal) {
      if (isFinnal) {
        while(this.progress < 100) {
          this.progress += 1;
          await sleep(0.01);
        }
      }else {
        this.progressing = true;
        await sleep(0.1);
        this.progressing = false;
        if (this.progress < start) {
          while(this.progress < start && !this.progressing) {
            this.progress += 1;
            await sleep(0.05);
          }
        }
        while(this.progress < end && !this.progressing) {
            this.progress += 0.1;
            await sleep(0.03)
          }
      }
    },
    checkCreateData() {
      if (!this.form.endtime || !this.form.description) {
        notify({message: this.$t('tips.missingInput'), duration: 5000, type: 'error'})
        return false
      }

      if(new Date().getTime() >= new Date(this.form.endtime).getTime() + 60000) {
        notify({message: this.$t('tips.wrongEndTime'), duration: 5000, type: 'error'})
        return false
      }

      if (this.form.title.length + this.form.description.length > 270) {
        console.log('length:', this.form.title.length + this.form.description.length);
        notify({message: this.$t('tips.textLengthOut'), duration: 5000, type: 'error'})
        return false
      }
      return true
    },
    onNext() {
      this.form.description = this.formatElToTextContent(this.$refs.descContentRef)
      if (!this.checkCreateData()) {
        return;
      }
      this.$store.commit('curation/saveDraft', this.form);
      this.currentStep = 2
      this.$nextTick(() => {
        this.popperWidth = this.$refs.tokenPopper.clientWidth
      })
    },
    async connectWallet() {
      this.connectLoading = true
      try{
        if (await setupNetwork()) {
          await getAccounts(true);
        }
      } catch (e) {
        notify({message: 'Connect metamask fail', duration: 5000, type: 'error'})
      } finally {
        this.connectLoading = false
      }
    },
    async updateToken() {
      if (!ethers.utils.isAddress(this.form.token)) {
        this.customToken = null;
        return;
      }
      const res = await getTokenInfo(this.form.token)
      this.customToken = {...res, address: this.form.token}
      this.updateSelectBalance(this.customToken)
    },
    async updateSelectBalance(token) {
      this.selectBalance = await getERC20TokenBalance(token.address, this.account)

    },
    checkRewardData() {
      if (!this.account || (this.form.maxCount <= 0 && !this.form.isLimit) || !this.form.amount) {
        notify({message: this.$t('tips.missingInput'), duration: 5000, type: 'error'})
        return false
      }

      if(new Date().getTime() >= new Date(this.form.endtime).getTime() + 30000) {
        notify({message: this.$t('tips.wrongEndTime'), duration: 5000, type: 'error'})
        return false
      }

      if (!this.showAccount) {
        notify({message: this.$t('common.connectMetamask'), duration: 5000, type: 'error'})
        return false
      }

      return true
    },
    async onSubmit() {
      if(!this.checkRewardData()) return;
      try{
        this.loading = true
        const balance = await getERC20TokenBalance(this.selectedToken.address, this.account)
        if (balance < this.form.amount) {
          notify({message: this.$t('curation.insuffientBalance'), duration: 5000, type: 'error'})
          return;
        }
        this.$store.commit('curation/saveDraft', this.form);

        this.modalComponent = markRaw(SendTokenTip)
        this.modalVisible = true
      } catch (e) {
        postErr('Curation', 'onSubmit', `${e}`)
        notify({message: this.$t('common.serverError'), duration: 5000, type: 'error'})
      } finally {
        this.loading = false
      }

    },
    // created curation on chain
    async createCuration() {
      try{
        this.loading = true

        const curation = {
          curationId: randomCurationId(),
          creatorETH: this.account,
          content: this.form.description,
          amount: ethers.utils.parseUnits(this.form.amount.toString(), this.selectedToken.decimals ?? 18),
          maxCount: this.form.isLimit ? 9999999 : this.form.maxCount,
          endtime: parseInt(new Date(this.form.endtime).getTime() / 1000),
          token: this.selectedToken.address
        }

        this.curation = curation

        // this.currentStep = 3;
        // return;
        // write in contract
        const hash = await creteNewCuration(curation);
        const pendingCuration = {...curation, amount: curation.amount.toString(), transHash: hash, twitterId: this.getAccountInfo.twitterId};
        this.$store.commit('curation/savePendingTweetCuration', pendingCuration)
        // post to backend
        await newCuration(pendingCuration);
        this.$store.commit('curation/saveDraft', null);
        this.currentStep = 3;
        this.$store.commit('curation/savePendingTweetCuration', null)
      } catch (e) {
        console.log('Create curation error:', e);
        notify({message: this.$t('curation.crateFail'), duration: 5000, type: 'error'})
        postErr('Curation', 'create', `${e}`)
      } finally {
        this.loading = false
        this.modalVisible=false
      }
    },
    onPost() {
      // transfer text to uri
      const content = this.curation.content + ' #iweb3\n' + this.$t('curation.moreDetail') +  ' => ' + CURATION_SHORT_URL + this.curation.curationId
      // if (content.length > 280) {
      //   notify({message: this.$t('tips.textLengthOut'), duration: 5000, type: 'error'})
      //   return;
      // }

      let url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(content)
      window.open(url, '__blank')
      this.modalComponent = markRaw(TwitterCompleteTip)
      this.modalVisible =true
    },
    onComplete() {
      this.$store.commit('curation/saveDraft', null)
      this.$router.replace('/curations')
    }
  },
  async mounted () {
    if (this.getDraft) {
      this.form = this.getDraft
    }
    chainChanged()
    accountChanged()
    await this.updateToken()
    if (ethers.utils.isAddress(this.form.token)) {
      this.selectedToken = this.customToken
    }else {
      this.selectedToken = this.tokenList[0]
    }
    this.updateSelectBalance(this.selectedToken)

    const pendingCuration = this.getPendingTweetCuration;
    if (pendingCuration && pendingCuration.transHash) {
      try {
        await newCuration(pendingCuration);
        this.curation = pendingCuration
        this.currentStep = 3;
        this.$store.commit('curation/saveDraft', null);
        this.$store.commit('curation/savePendingTweetCuration', null)
      }catch (err) {
        console.log('upload curation to server fail:', err);

      }
    }
  },
}
</script>

<style scoped lang="scss">
.receive-btn {
  background-image: linear-gradient(to right, var(--primary-custom), var(--primary-custom));
  background-repeat: no-repeat;
}
</style>
