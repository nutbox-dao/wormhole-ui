<template>
  <div class="text-14px xl:text-0.8rem px-15px">
    <div class="md:border-b-1 border-dividerColor my-30px md:mt-0">
      <div class="relative container mx-auto max-w-50rem md:px-1rem px-15px
                  flex items-center justify-start h-20px md:h-2.8rem">
        <span class="text-16px xl:text-1rem c-text-black relative whitespace-nowrap light:text-black">
          {{$t('curationsView.createCuration')}}
        </span>
      </div>
    </div>
    <div class="container mx-auto max-w-600px xl:max-w-30rem">
      <Steps class="mx-15px" :total-step="2" :current-step="currentStep"/>
      <div class="text-left text-12px leading-18px xl:text-14px xl:leading-1rem
                  text-colorF1 bg-tip-gradient light:text-color62 light:bg-colorF1
                  px-16px py-10px rounded-8px my-11px xl:my-0.8rem">
        {{$t('curation.createStepTip')}}
      </div>
    </div>
    <div v-if="currentStep<=2" v-loading="loading"
         class="container mx-auto max-w-600px xl:max-w-30rem bg-blockBg light:bg-white rounded-20px
                px-20px sm:px-4.5rem py-24px mb-2rem">
      <!-- set up -->
      <div class="text-14px leading-21px 2xl:text-0.7rem mb-10px text-left font-600 -mt-5px">
        {{$t('curation.selectCategoryTip')}}
      </div>
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
        <div class="mt-1.8rem relative" v-if="form.category==='tweet'">
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
          <div class="mb-6px font-bold">{{$t('curation.relatedTweet')}}</div>
          <div class="border-1 bg-black/40 border-1 border-color8B/30 min-h-134px
                      flex flex-col light:bg-white light:border-colorE3 hover:border-primaryColor rounded-8px">
            <div class="flex-1 flex flex-col relative">
              <div contenteditable
                   class="desc-input z-1 flex-1 px-1rem pt-5px whitespace-pre-line leading-24px 2xl:leading-1rem"
                   ref="descContentRef"
                   @blur="getBlur('desc')"
                   @paste="onPaste"
                   v-html="formatEmojiText(form.newContent)">
              </div>
            </div>
            <div class="py-2 flex justify-between items-center px-1rem">
              <el-popover ref="descEmojiPopover"
                          trigger="click" width="300"
                          :teleported="false" :persistent="false">
                <template #reference>
                  <img class="w-1.8rem h-1.8rem lg:w-1.4rem lg:h-1.4rem" src="~@/assets/icon-emoji.svg" alt="">
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
              <span class="font-600 text-color62">#iweb3</span>
            </div>
          </div>
        </div>
        <!-- preview tweet -->
        <template v-if="form.category==='tweet' && form.createType==='related'">
          <div class="mt-1.8rem">
            <div class="mb-6px font-bold">{{$t('curation.relatedTweet')}}</div>
            <div v-if="linkIsVerified" class="overflow-hidden relative rounded-12px"
                 :class="expandPreview?'':'max-h-134px'">
              <Blog :post="form.postData"
                    class="bg-blockBg light:bg-white rounded-8px border-1 border-listBgBorder light:border-colorE3">
                <template #bottom-btn-bar><div></div></template>
              </Blog>
              <button v-if="!expandPreview" @click.stop="expandPreview=!expandPreview"
                      class="absolute bg-view-more text-white bottom-0 left-0 w-full h-40px
                           flex items-center justify-center text-center rounded-12px">
              </button>
            </div>
            <div v-else class="overflow-hidden relative rounded-8px h-134px px-1/5 pt-10px
                               flex items-center justify-center
                               c-text-black text-center text-14px leading-22px
                               border-1 border-listBgBorder light:border-colorE3 text-color8B/30">
              <span v-if="linkIsError" class="text-redColor">{{wrongLinkDes}}</span>
              <span v-else>{{$t('curation.pastLinkTip')}}</span>
            </div>
          </div>
        </template>
        <!-- preview space -->
        <div class="mt-1.8rem" v-if="form.category==='space'">
          <div class="mb-6px font-bold">{{$t('curation.relatedTweet')}}</div>
          <div v-if="linkIsVerified" class="h-134px overflow-hidden relative">
            <Space class="rounded-12px h-full mb-1rem md:mb-0"
                   :space="form.space"/>
          </div>
          <div v-else class="overflow-hidden relative rounded-8px h-134px px-1/5 pt-10px
                               flex items-center justify-center
                               c-text-black text-center text-14px leading-22px
                               border-1 border-listBgBorder light:border-colorE3 text-color8B/30">
            <span v-if="linkIsError" class="text-redColor">{{wrongLinkDes}}</span>
            <span v-else>{{$t('curation.pastLinkTip')}}</span>
          </div>
        </div>
        <!-- related link -->
        <div class="mt-5px relative" v-if="form.category==='space'|| form.createType === 'related'">
          <div class="bg-color62/20 light:bg-colorF1 border-1 border-color62 pl-15px
                      rounded-8px h-44px 2xl:h-2rem flex items-center relative"
               :class="checkingTweetLink?'hover:border-color8B/30':''">
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
            <Blog :post="form.postData"
                  class="bg-blockBg light:bg-white rounded-15px
                       border-1 border-listBgBorder"
                  :class="expandPreview?'pb-30px':''">
              <template #bottom-btn-bar><div></div></template>
            </Blog>
            <button @click.stop="expandPreview=!expandPreview"
                 class="absolute bg-color62/70 text-white bottom-0 left-0 w-full h-30px flex
                 items-center justify-center text-center">
              <span v-if="!expandPreview">view more ></span>
              <img v-else class="w-1.2rem transform rotate-180"
                   src="~@/assets/icon-arrow.svg" alt="">
            </button>
          </div>
        </div>
        <!-- description -->
        <div class="mt-1.8rem">
          <div class="flex justify-between items-center">
            <div class="mb-6px font-bold">{{$t('curation.desc')}}</div>
            <span class="text-color8B light:text-color7D/50">{{form.description.length}}/100</span>
          </div>
          <div class="relative border-1 bg-black/40 border-1 border-color8B/30
                      light:bg-white light:border-colorE3 hover:border-primaryColor
                      rounded-8px min-h-44px 2xl:min-h-2rem flex items-center">
            <el-input v-model="form.description"
                      :rows="4" :maxlength="100"
                      class="border-0 c-textarea rounded-8px overflow-hidden"
                      type="textarea"
                      :placeholder="$t('curation.createDescTip')"/>
          </div>
        </div>
        <!-- edit speaker -->
        <div class="mt-1.8rem" v-if="form.category==='space'">
          <div class="mb-6px font-bold">{{$t('curation.speakers')}}</div>
          <div class="p-20px light:bg-colorF7 border-1 border-color8B/30 light:border-colorE3 rounded-12px">
            <!-- Host-->
            <div class="mb-6px font-500">{{$t('curation.host')}}</div>
            <div v-if="form.host.name"
                 class="flex items-center cursor-pointer">
              <div class="w-44px h-44px min-w-44px min-h-44px xl:w-2.2rem xl:h-2.2rem xl:min-w-2.2rem xl:min-h-2.2rem
                          border-2 gradient-border gradient-border-color3 rounded-full relative">
                <img v-if="form.host.avatar"
                     class="w-full h-full border-2px border-blockBg light:border-white rounded-full"
                     :src="form.host.avatar" alt="">
                <img v-else
                     class="w-full h-full border-2px border-blockBg light:border-white rounded-full "
                     src="~@/assets/icon-default-avatar.svg" alt="">
                <img class="absolute -top-4px -left-4px bg-block light:bg-white w-16px h-16px
                            border-2 border-white rounded-full cursor-pointer"
                     @click="form.host={}"
                     src="~@/assets/icon-close-primary.svg" alt="">
              </div>
              <div class="ml-5px text-12px xl:text-0.7rem">
                <div class="mb-2px">{{form.host.name}}</div>
                <div>@{{form.host.username}}</div>
              </div>
            </div>
            <i v-else @click="showAddSpeakerModal('host','add')"
                 class="icon-add-circle w-44px h-44px min-w-44px min-h-44px
                        xl:w-2.2rem xl:h-2.2rem xl:min-w-2.2rem xl:min-h-2.2rem cursor-pointer"></i>
            <!-- Co-Host-->
            <div class="mb-6px font-500 mt-20px 2xl:mt-1rem">
              {{$t('curation.coHosts')}}
              <span class="text-color8B/70">{{$t('curation.optional')}}</span>
            </div>
            <div class="flex flex-wrap">
              <div class="flex items-center mr-10px relative cursor-pointer"
                   v-for="(coHost, index) of form.coHost" :key="index">
                <div class="w-44px h-44px min-w-44px min-h-44px xl:w-2.2rem xl:h-2.2rem xl:min-w-2.2rem xl:min-h-2.2rem
                          border-2 gradient-border gradient-border-color3 rounded-full relative">
                  <img v-if="coHost.avatar"
                       class="w-full h-full border-2px border-blockBg light:border-white rounded-full"
                       :src="coHost.avatar" alt="">
                  <img v-else
                       class="w-full h-full border-2px border-blockBg light:border-white rounded-full "
                       src="~@/assets/icon-default-avatar.svg" alt="">
                  <img class="absolute -top-4px -left-4px bg-block light:bg-white w-16px h-16px
                            border-2 border-white rounded-full cursor-pointer"
                       @click="deleteSpeaker('coHost', index)"
                       src="~@/assets/icon-close-primary.svg" alt="">
                </div>
                <div class="ml-5px text-12px xl:text-0.7rem">
                  <div class="mb-2px">{{coHost.name}}</div>
                  <div>@{{coHost.username}}</div>
                </div>
              </div>
              <i @click="showAddSpeakerModal('coHost','add')"
                   v-show="form.coHost.length < 3"
                   class="icon-add-circle w-44px h-44px min-w-44px min-h-44px
                          xl:w-2.2rem xl:h-2.2rem xl:min-w-2.2rem xl:min-h-2.2rem cursor-pointer"></i>
            </div>
            <!-- Speakers-->
            <div class="mb-6px font-500 mt-20px 2xl:mt-1rem">
              {{$t('curation.speakers')}}
              <span class="text-color8B/70">{{$t('curation.optional')}}</span>
            </div>
            <div class="flex flex-wrap">
              <div class="flex items-center mr-10px relative cursor-pointer"
                   v-for="(speaker, index) of form.speakers" :key="index"
                   @click="showAddSpeakerModal('speaker','edit', index)">
                <div class="w-44px h-44px min-w-44px min-h-44px xl:w-2.2rem xl:h-2.2rem xl:min-w-2.2rem xl:min-h-2.2rem
                          border-2 gradient-border gradient-border-color3 rounded-full relative">
                  <img v-if="speaker.avatar"
                       class="w-full h-full border-2px border-blockBg light:border-white rounded-full"
                       :src="speaker.avatar" alt="">
                  <img v-else
                       class="w-full h-full border-2px border-blockBg light:border-white rounded-full "
                       src="~@/assets/icon-default-avatar.svg" alt="">
                  <img class="absolute -top-4px -left-4px bg-block light:bg-white w-16px h-16px
                            border-2 border-white rounded-full cursor-pointer"
                       @click="deleteSpeaker('speaker', index)"
                       src="~@/assets/icon-close-primary.svg" alt="">
                </div>
                <div class="ml-5px text-12px xl:text-0.7rem">
                  <div class="mb-2px">{{speaker.name}}</div>
                  <div>@{{ speaker.username }}</div>
                </div>
              </div>
              <i @click="showAddSpeakerModal('speaker','add')"
                   v-show="form.coHost.length < 3"
                   class="icon-add-circle w-44px h-44px min-w-44px min-h-44px
                          xl:w-2.2rem xl:h-2.2rem xl:min-w-2.2rem xl:min-h-2.2rem cursor-pointer"></i>
            </div>
          </div>
        </div>
        <!-- schedule -->
        <div class="mt-1.8rem">
          <div class="mb-6px font-bold">{{$t('curation.endTime')}}</div>
          <div class="mb-6px text-color62 italic">{{$t('curation.startTimeTip')}}</div>
          <div class="relative border-1 bg-black/40 border-1 border-color8B/30
                      light:bg-white light:border-colorE3 hover:border-primaryColor
                      rounded-8px h-44px 2xl:h-2rem flex items-center">
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
          <button class="h-40px 2xl:h-2rem rounded-full px-1.5rem w-full gradient-btn"
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
                        light:bg-white light:border-colorE3 hover:border-primaryColor
                        rounded-8px h-44px 2xl:h-2rem">
              <input class="bg-transparent h-full w-full px-15px"
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
        <div class="mt-1.8rem">
          <div class="mb-6px">{{$t('curation.chain')}}</div>
          <div class="w-full border-1 bg-black/40 border-1 border-color8B/30
                  flex items-center justify-between
                  light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                  rounded-12px h-40px 2xl:h-2rem">
            <el-select v-model="form.chain" class="w-full" size="large">
              <el-option label="Steem" value="steem"></el-option>
              <div class="w-full h-1px bg-color8B/30 my-0.5rem"></div>
              <div class="flex justify-between items-center px-1.5rem ">
                <span class="c-text-black">Other</span>
                <span class="text-color8B">Only available for registered Wormhole3 users</span>
              </div>
              <el-option
                  v-for="item in chainOptions"
                  :disabled="false"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </div>
        </div>
        <div class="mt-1.8rem" v-if="form.chain!=='steem'">
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
                             @click="updateSelectBalance(customToken);selectedToken = customToken;$refs.elPopover.hide()">
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
        <div class="mt-0.4rem text-right font-400 flex justify-end items-center">
          <div>{{$t('common.balance')}}: </div>
          <div class="font-bold ml-5px">{{ formatAmount(selectBalance) }}</div>
        </div>
        <!-- posw des -->
        <div class="mt-1.8rem">
          <div class="mb-6px font-bold">{{$t('curation.rewardsMethod')}}</div>
          <div class="border-1 border-color8B/30 light:border-colorE3 rounded-8px 2xl:2.5rem"
               :class="rewardsTipCollapse?'bg-colorF7':''">
            <div class="flex items-center h-44px 2xl:h-2.2rem px-15px">
              <span class="text-15px 2xl:text-0.75rem">
                {{$t('curation.autoMethod')}}
              </span>
              <img class="w-16px h-16px min-w-16px min-h-16px 2xl:w-1rem 2xl:h-1rem ml-5px cursor-pointer"
                   @click="rewardsTipCollapse=!rewardsTipCollapse"
                   src="~@/assets/icon-question-grey.svg" alt="">
            </div>
            <el-collapse-transition>
              <div v-show="rewardsTipCollapse"
                   class="px-15px mb-10px text-color8B light:text-color7D text-12px leading-20px 2xl:text-0.7rem 2xl:leading-1rem">
                {{$t('curation.autoMethodTip')}}
              </div>
            </el-collapse-transition>
          </div>
        </div>
        <!-- submit -->
        <div class="mt-1.8rem flex flex-col sm:flex-row justify-between text-15px gap-20px">
          <button class="w-full h-40px 2xl:h-2rem rounded-full px-1.5rem border-1 border-color8B/30 light:border-white
                         light:border-color7D text-color8B light:text-color7D"
                  @click="currentStep=1">{{$t('common.previous')}}</button>
          <button class="w-full h-40px 2xl:h-2rem rounded-full px-1.5rem gradient-btn text-15px"
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
        <div class="flex-1 overflow-auto px-1.5rem no-scroll-bar">
          <component :is="modalComponent"
                     :token="selectedToken"
                     :amount="form.amount"
                     :chainName="form.chain"
                     :address="form.address"
                     :approveContract="EVM_CHAINS[form.chain]?EVM_CHAINS[form.chain].curation:''"
                     :selectCategoryType="selectCategory"
                     @create="createCuration"
                     @confirmComplete="onComplete"
                     @confirmChangeCategory="changeCategory"
                     @close="modalVisible=false;loading=false"></component>
        </div>
      </div>
    </van-popup>
    <el-dialog v-model="addSpeakerVisible"
               destroy-on-close
               :show-close="false"
               :close-on-click-modal="true"
               class="c-dialog c-dialog-center max-w-500px bg-glass border-1 border-color84/30 rounded-1.6rem">
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
import { postErr, applyAirdrop, getDropRecord } from '@/api/api'
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
import { randomCurationId, creteNewCuration, newCurationWithTweet, newCuration } from '@/utils/curation'
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
  components: {Steps, SendTokenTip, TwitterCompleteTip, TweetAndStartCuration,
    EmojiPicker, Blog, Space, AddSpeakerModal, AssetsOptions, SelectCategoryTip},
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
        tweetId: '',
        description: '',
        newContent: '',  // this is for new tweet content
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
        isLike: false,
        postData: {},
        space: {},
        author: {}
      },
      addSpeakerVisible: false,
      addSpeakerType: 'host',
      operateType: 'add',
      addSpeakerData: {avatar: '', name: '', title: ''},
      editSpeakerIndex: 0,
      followName: '',
      linkIsVerified: false,
      linkIsError: false,
      wrongLinkDes: 'Invalid link',
      checkingTweetLink: false,
      selectedToken: {},
      tokenList: ERC20List,
      modalVisible: false,
      modalComponent: markRaw(SendTokenTip),
      popperWidth: 200,
      customToken: null,
      curation: {},
      descEditContent: '',
      descRange: null,
      titleRange: null,
      progress: 0,
      progressing: false,
      selectedBalance: 0,
      testData,
      postData: {},
      space: {},
      TweetLinRex: 'https://twitter.com/[a-zA_Z0-9\_]+/status/([0-9]+)',
      author: {},
      chainOptions: [
        {label: 'Ethereum', value: 'ethereum'},
        {label: 'BSC', value: 'bsc'},
        {label: 'Polygon', value: 'polygon'},
      ],
      expandPreview: false,
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
    checkLogin() {
      if(!this.getAccountInfo || !this.getAccountInfo.twitterId) {
        this.$store.commit('saveShowLogin', true)
        return false;
      }
      return true
    },
    async checkLink() {
      if (!this.checkLogin()) return
      const link = this.form.link;
      const match = link.match(this.TweetLinRex);
      if (!match) {
        this.wrongLinkDes = this.$t('curation.invalidLink');
        this.linkIsError = true
        return;
      }
      try{
        this.checkingTweetLink = true;
        const tweet = await getTweetById(match[1]);
        console.log(235, tweet);
        if (tweet.data) {
          this.form.tweetId = tweet.data.id
          this.form.postData = parseTweet(tweet)
          if (this.form.category === 'space') {
            const spaceId = getSpaceIdFromUrls(tweet.data.entities.urls)
            if (!spaceId) {
              this.wrongLinkDes = this.$t('curation.spaceIdWrong');
              this.linkIsError = true
              return;
            }
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
              if (author.id !== this.form.postData.twitterId) {
                this.wrongLinkDes = this.$t('curation.tweetSpaceAuthorDismatch')
                this.linkIsError = true
                return;
              }
              this.form.space = {
                spaceId,
                authorName: author.name,
                authorUsername: author.username,
                authorProfileImg: author.profile_image_url,
                spaceTitle: space.data.title,
                spaceState: space.data.state,
                scheduledStart: space.data.scheduled_start,
                startedAt: space.data.started_at,
                authorId: author.id
              }
              this.form.host = {
                ...author,
                avatar: author.profile_image_url?.replace('normal', '200x200')
              }
              this.form.author = author
              this.linkIsVerified = true;
            }else {
              this.wrongLinkDes = this.$t('curation.spaceIdWrong');
              this.linkIsError = true
              this.form.space = {};
              this.form.author = {};
              this.form.postData = {};
            }
          }else {
            if (tweet.data.conversation_id !== tweet.data.id) {
              this.wrongLinkDes = this.$t('curation.replyCanntCurate');
              this.linkIsError = true
              this.form.tweetId = '';
              this.form.postData = {};
              return;
            }
            this.form.author = this.form.postData;
            this.linkIsVerified = true;
          }
        }
      } catch (e) {
        console.log('Fetch data from twitter fail:', e);
        if (e === 'log out') {
          console.log(5);
          this.$router.replace('/square')
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
        if(this.addSpeakerType === 'speaker') this.form.speakers.splice(index, 1)
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
      if (this.form.category === 'tweet' && this.form.createType==='new') {
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
      }
    },
    disabledDate(time) {
      let date = Date.now();
      if (this.form.category === 'space' && this.form.space && this.form.space.scheduledStart) {
        const startTime = this.form.space.scheduledStart;
        date = new Date(startTime).getTime();
      }
      return time.getTime() + 86400000 < date || time.getTime() >date + 86400000*7
    },
    checkCreateData() {
      if (!this.form.description ||this.form.description.length === 0) {
        console.log(1);
        notify({message: this.$t('tips.missingInput'), duration: 5000, type: 'error'})
        return false;
      }
      if(this.form.category === 'tweet' && this.form.createType==='new') {
        if (!this.form.newContent || this.form.newContent.length === 0) {
          notify({message: this.$t('tips.missingInput'), duration: 5000, type: 'error'})
          return false
        }
      }else {
        if (!this.form.author) {
        console.log(2);
          notify({message: this.$t('tips.missingInput'), duration: 5000, type: 'error'})
          return false
        }
        if (!this.form.link || !this.form.endtime) {
        console.log(3);
          notify({message: this.$t('tips.missingInput'), duration: 5000, type: 'error'})
          return false
        }
        if (this.form.category === 'tweet' && !this.form.postData?.postId) {
        console.log(4);
          notify({message: this.$t('tips.missingInput'), duration: 5000, type: 'error'})
          return false
        }
        if (this.form.category === 'space' && !this.form.space?.spaceId) {
        console.log(5);
          notify({message: this.$t('tips.missingInput'), duration: 5000, type: 'error'})
          return false
        }
      }
      return true
    },
    onNext() {
      if (!this.checkLogin()) return

      this.form.newContent = this.formatElToTextContent(this.$refs.descContentRef)
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
      try {
        const res = await getTokenInfo(this.form.chain, this.form.token)
        console.log(53, res);
        this.customToken = {...res, address: this.form.token}
        this.selectedToken = this.customToken
        this.updateSelectBalance(this.customToken)
      }catch(e) {
        console.log(63, e);
      }
    },
    async updateSelectBalance(token) {
      this.selectBalance = await getERC20TokenBalance(token.address, this.account)

    },
    selectBalance(balance) {
      this.selectedBalance = balance
    },
    checkRewardData() {
      if (!this.form.address || (this.form.maxCount <= 0 && !this.form.isLimit) || !this.form.amount) {
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
        if (this.form.amount === 0 || this.selectedBalance < this.form.amount) {
          notify({message: this.$t('curation.insuffientBalance'), duration: 5000, type: 'error'})
          return;
        }

        this.modalComponent = markRaw(SendTokenTip)
        this.modalVisible = true
      } catch (e) {
        
      } finally {
        this.loading = false
      }

    },
    // created curation on chain
    async createCuration() {
      try{
        this.loading = true
        alert(1)
        const curation = {
          curationId: randomCurationId(),
          creatorETH: this.form.address,
          content: this.form.description,
          amount: ethers.utils.parseUnits(this.form.amount.toString(), this.selectedToken.decimals ?? 18),
          maxCount: this.form.isLimit ? 9999999 : this.form.maxCount,
          endtime: parseInt(new Date(this.form.endtime).getTime() / 1000),
          token: this.form.token
        }
        alert(2)

        let pendingCuration;

        let tasks = this.form.mandatoryTask === 'quote' ? 1 : 2;
        tasks = tasks | (this.form.isLike ? 4 : 0);
        tasks = tasks | (this.form.isFollow ? 8 : 0);
        let transHash = '';
        alert(3)

        if (this.form.category === 'tweet' && this.form.createType === 'new') {
          // create new tweet
          pendingCuration = {
            ...curation,
            amount: curation.amount.toString(),
            twitterId: this.getAccountInfo.twitterId,
            transHash,
            authorId:this.form.author.id,
            chainId: EVM_CHAINS[this.form.chain].id,
            tasks,
            content: this.form.description
          }
        alert(4)
        }else {
        alert(5)
          pendingCuration = {
            ...curation,
            ...this.form.space,
            authorId: this.form.postData.twitterId,
            authorName: this.form.postData.name,
            authorUsername: this.form.postData.username,
            authorProfile: this.form.postData.profileImg,
            authorVerified: this.form.postData.verified,
            authorFollowers: this.form.postData.followers,
            authorFollowing: this.form.postData.following,
            amount: curation.amount.toString(),
            twitterId: this.getAccountInfo.twitterId,
            transHash,
            tweetId: this.form.tweetId,
            chainId: EVM_CHAINS[this.form.chain].id,
            curationType: this.form.category === 'tweet' ? 1 : 2,
            tasks,
            hostIds: this.form.host.id ? [this.form.host.id].concat(this.form.coHost ? this.form.coHost.map(h => h.id) : []) : [],
            speakerIds: this.form.speakers ? this.form.speakers.map(s => s.id) : [],
            tweetContent: this.form.postData?.content,
            content: this.form.description,
            tags: this.form.postData?.tags,
          }
        }
        alert(6)
            alert(pendingCuration)
        if (!pendingCuration.curationId || !pendingCuration.amount || !pendingCuration.maxCount || !pendingCuration.endtime || !pendingCuration.twitterId || !pendingCuration.authorId || !pendingCuration.tweetId) {
            console.log('Null param:',pendingCuration)
            alert(pendingCuration)
            notify({message: this.$t('tips.missingInput'), type: 'info', duration: 5000});
            return;
        }
        alert(7)
        // write in contract
        transHash = await creteNewCuration(this.form.chain, curation);
        alert(8)
        pendingCuration.transHash = transHash;

        // const pendingCuration = {...curation, amount: curation.amount.toString(), transHash: hash, twitterId: this.getAccountInfo.twitterId};
        this.$store.commit('curation/savePendingTweetCuration', pendingCuration)
        this.$store.commit('curation/saveDraft', null);
        // post to backend
        if (this.form.category === 'tweet' && this.form.createType === 'new') {
          await newCuration(pendingCuration);
          this.curation = pendingCuration
          this.currentStep = 3;
          this.$store.commit('curation/savePendingTweetCuration', null)
        }else {
          await newCurationWithTweet(pendingCuration);
          this.$store.commit('curation/savePendingTweetCuration', null)
          this.$router.replace('/')
        }
      } catch (e) {
        if (e === 'log out') {
          this.$router.replace('/')
        }
        console.log('Create curation error:', e);
        
        notify({message: e, duration: 5000, type: 'error'})
        // postErr('Curation', 'create', `${e}`)
      } finally {
        this.loading = false
        this.modalVisible=false
      }
    },
    onPost() {
      // transfer text to uri
      const content = this.form.newContent + ' #iweb3\n' + this.$t('curation.moreDetail') +  ' => ' + CURATION_SHORT_URL + this.curation.curationId
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
      this.$router.go(-1)
    }
  },
  async mounted () {
    if (this.getDraft) {
      this.form = this.getDraft
      this.linkIsVerified = true;
    }
    chainChanged()
    accountChanged()
    await this.updateToken()
    // if (ethers.utils.isAddress(this.form.token)) {
    //   this.selectedToken = this.customToken
    // }else {
    //   this.selectedToken = this.tokenList[0]
    // }
    // this.updateSelectBalance(this.selectedToken)

    const pendingCuration = this.getPendingTweetCuration;
    if (pendingCuration && pendingCuration.transHash) {
      try {
        if (this.form.category === 'tweet' && this.form.createType === 'new') {
          await newCuration(pendingCuration);
          this.curation = pendingCuration
          this.currentStep = 3;
        }else {
          await newCurationWithTweet(pendingCuration);
        }
        console.log('Sended the last curation');
        this.$store.commit('curation/saveDraft', null);
        this.$store.commit('curation/savePendingTweetCuration', null)
      }catch (err) {
        if (err === 'log out') {
           this.$router.replace('/')
        }
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
