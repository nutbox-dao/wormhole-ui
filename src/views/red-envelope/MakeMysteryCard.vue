<template>
  <div class="relative text-left pb-3rem sm:pb-2rem flex flex-col text-14px 2xl:text-0.8rem
              text-color4E bg-white rounded-20px">
    <button class="absolute right-20px top-20px"
            @click="$emit('close')">
      <img class="w-26px h-26px min-w-26px" src="~@/assets/red-envelope/icon-close.svg" alt="">
    </button>
    <div class="mx-auto c-text-black text-20px xl:text-1.2rem mt-2rem mb-1.5rem text-blueDark">
      {{$t('ny.makeMysteryCard')}}
    </div>
    <div v-if="step===0" class="px-15px xs:px-40px">
      <div class="grid grid-cols-1 sm:grid-cols-2">
        <div class="col-span-1 sm:pr-26px sm:min-h-546px">
          <div class="card-box h-full flex flex-col justify-center items-center py-2rem">
            <div class="relative w-220px mx-auto cursor-pointer card
                      text-14px leading-18px 2xl:text-1rem 2xl:leading-1.2rem text-white">
              <img class="w-full cursor-pointer" src="~@/assets/red-envelope/mystery-card.png" alt="">
              <img class="w-57px absolute top-16/100 left-1/2 transform -translate-x-1/2 rounded-14px"
                   :src="logoPreviewSrc" alt="">
              <div v-if="form.tokenNum > 0"
                   class="absolute top-10px right-10px font-bold text-shadow-lg opacity-70">
                + {{formatAmount(form.tokenNum / (form.cardNum ?? 1))}} {{selectedToken.symbol}}
              </div>
              <div class="absolute top-40/100 left-1/2 transform -translate-x-1/2 brand-name
                          text-16px font-bold text-color62">
                {{form.brandName || 'Brand name'}}
              </div>
              <div v-if="type==='token'"
                   class="absolute top-55/100 left-1/2 transform -translate-x-1/2 amount
                          font-bold text-14px lg:text-16px text-color62">
                +  {{formatAmount(form.tokenNum / (form.cardNum ?? 1))}} {{form.tokenSymbol}}
              </div>
              <div v-if="type==='nft'"
                   class="absolute top-55/100 left-1/2 transform -translate-x-1/2 amount
                          font-bold text-14px lg:text-16px text-color62">
                + {{form.nftNum}} NFT
              </div>
              <div v-if="type==='none'"
                   class="absolute top-55/100 left-1/2 transform -translate-x-1/2 amount
                          font-bold text-14px lg:text-16px text-color62">
                ~
              </div>
            </div>
            <div class="text-color62 mt-1rem w-3/5 mx-auto text-center break-word">
              {{form.brandDesc || $t('ny.brandDefaultDesc')}}
            </div>
          </div>
        </div>
        <div class="col-span-1 h-full flex flex-col justify-between mt-10px sm:mt-0"
             ref="formRef">
          <div>
            <div class="font-bold mb-4px">{{$t('ny.brandName')}}</div>
            <div class="w-full bg-colorF2 rounded-8px h-34px mb-10px">
              <input class="bg-transparent h-full w-full px-15px text-color86"
                     v-model="form.brandName"
                     :placeholder="$t('ny.brandName')">
            </div>
            <div class="flex mb-10px">
              <div class="">
                <span class="font-bold">{{$t('ny.logo')}}</span>
                <div class="w-80px min-w-80px h-80px rounded-8px bg-colorF2 mt-4px relative overflow-hidden">
                  <img v-if="logoPreviewSrc"
                       class="w-full h-full"
                       :src="logoPreviewSrc" alt="">
                  <el-upload action="#" list-type="picture" ref="uploadLogoRef"
                             :on-change="onUploadLogo"
                             :auto-upload="false" :limit="1" :show-file-list="false">
                    <template #trigger>
                      <button class="absolute w-full h-full top-0 left-0
                                 flex items-center justify-center
                                 light:border-colorE3 hover:border-primaryColor">
                        <img v-if="!logoPreviewSrc" class="w-20px h-20px" src="~@/assets/icon-add.svg" alt="">
                      </button>
                    </template>
                  </el-upload>
                  <div v-if="logoUploadLoading"
                       class="w-full h-full bg-inputBg/20 absolute top-0 left-0 flex items-center justify-center">
                    <c-spinner class="w-30px h-30px"></c-spinner>
                  </div>
                </div>
              </div>
              <div class="flex-1 ml-6px relative">
                <div class="flex justify-between items-center">
                  <span class="font-bold">{{$t('ny.description')}}</span>
                  <span>{{form.brandDesc.length}}/180</span>
                </div>
                <div class="relative mt-4px rounded-8px bg-colorF2 h-80px">
                  <el-input v-model="form.brandDesc"
                            :rows="4" :maxlength="180"
                            class="border-0 ny-c-textarea bg-colorF2 rounded-8px text-color4E
                                 overflow-hidden h-full break-word"
                            type="textarea"
                            :placeholder="$t('ny.createDescTip')"/>
                </div>
              </div>
            </div>

            <div class="font-bold mb-4px">{{$t('ny.cardType')}}</div>
            <div class="flex rounded-8px overflow-hidden mb-10px gap-1px bg-colorF2 py-3px px-4px h-34px">
              <button class="flex-1 rounded-8px h-full"
                      :class="type==='token'?'bg-white text-color62':''"
                      @click="type='token'">
                Token
              </button>
              <!--            <button class="flex-1 rounded-8px h-full"-->
              <!--                    :class="type==='nft'?'bg-white text-color62':''"-->
              <!--                    @click="type='nft'">-->
              <!--              NFT-->
              <!--            </button>-->
              <button class="flex-1 rounded-8px h-full"
                      :class="type==='none'?'bg-white text-color62':''"
                      @click="type='none';clearTokenInput()">
                None
              </button>
            </div>
            <template v-if="type==='token'">
              <div class="font-bold mb-4px">{{$t('ny.tokenAmount')}}</div>
              <div class="flex items-center justify-between mb-4px">
                <div class="flex-1 bg-colorF2 rounded-8px h-34px">
                  <input class="bg-transparent h-full w-full px-15px text-color86"
                         v-model="form.tokenNum"
                         type="number"
                         :placeholder="$t('ny.enterAmountTip')">
                </div>
                <button class="flex-1 ml-5px max-w-130px bg-colorF2 rounded-8px overflow-hidden h-34px">
                  <el-popover popper-class="c-popper"
                              placement="bottom-end"
                              :width="popperWidth"
                              trigger="click" ref="tokenPopover">
                    <template #reference>
                      <button class="h-full w-full flex justify-between items-center cursor-pointer px-12px">
                  <span class="flex items-center">
                    <span v-if="Object.keys(selectedToken).length===0" class="text-color8B/70 whitespace-nowrap">
                      {{$t('ny.select')}}
                    </span>
                    <template v-else>
                      <img v-if="TokenIcon[selectedToken.symbol]" class="w-22px min-w-22px h-22px mr-5px rounded-full"
                           :src="TokenIcon[selectedToken.symbol]" alt="">
                      <img v-else class="w-22px min-w-22px mr-5px rounded-full"
                           src="~@/assets/icon-token-default.svg" alt="">
                      <span class="text-color8B text-15px whitespace-nowrap">{{ selectedToken.symbol }}</span>
                    </template>
                  </span>
                        <img class="w-16px" src="~@/assets/icon-select-arrow.svg" alt="">
                      </button>
                    </template>
                    <template #default>
                      <div class="border-1 border-color8B/30 bg-white max-h-240px flex flex-col overflow-hidden
                              light:bg-white light:border-colorE3 hover:border-primaryColor
                              rounded-12px py-10px overflow-x-hidden">
                        <div class="px-10px mb-10px">
                          <div class="w-full border-1 bg-white border-1 border-color8B/30
                                  light:border-colorE3 hover:border-primaryColor
                                  rounded-12px h-40px 2xl:h-2rem text-color4E">
                            <input class="bg-transparent h-full w-full px-0.5rem text-color4E"
                                   v-model="searchToken"
                                   @input="updateToken"
                                   type="text" :placeholder="$t('curation.inputErc20')">
                          </div>
                        </div>
                        <div class="flex-1 overflow-auto">
                          <div v-if="customToken"
                               class="h-full w-full flex items-center cursor-pointer border-b-1 border-color8B/10 light:border-colorE3
                              py-3 px-10px overflow-x-hidden hover:bg-black/10">
                            <img v-if="TokenIcon[customToken.symbol]" class="h-34px mr-15px rounded-full" :src="TokenIcon[customToken.symbol]" alt="">
                            <img v-else class="h-34px mr-15px" src="~@/assets/icon-token-default.svg" alt="">
                            <div class="flex-1 flex flex-col text-color8B light:text-blueDark overflow-x-hidden"
                                 @click="selectedToken = customToken;$refs.tokenPopover.hide()">
                              <span class="text-15px">{{customToken.symbol}}</span>
                              <span class="text-12px whitespace-nowrap overflow-hidden overflow-ellipsis">
                            {{customToken.address}}
                          </span>
                            </div>
                          </div>
                          <div v-for="token of tokenList" :key="token.address"
                               @click="selectedToken=token;$refs.tokenPopover.hide()"
                               class="h-full w-full flex items-center cursor-pointer border-b-1 border-color8B/10 py-3 px-10px
                           overflow-x-hidden hover:bg-black/10">
                            <img v-if="TokenIcon[token.symbol]" class="h-34px mr-15px rounded-full" :src="TokenIcon[token.symbol]" alt="">
                            <img v-else class="h-34px mr-15px" src="~@/assets/icon-token-default.svg" alt="">
                            <div class="flex-1 flex flex-col text-color8B light:text-blueDark overflow-x-hidden">
                              <span class="text-15px">{{token.symbol}}</span>
                              <span class="text-12px whitespace-nowrap overflow-hidden overflow-ellipsis">
                            {{token.address}}
                          </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </el-popover>
                </button>
              </div>
              <div v-if="type!=='none'" class="text-right text-color8B light:text-color7D mb-10px">
                {{$t('ny.tokenBalance')}}: {{ formatAmount(tokenBalance) }}
              </div>
            </template>
            <template v-if="type==='nft'">
              <div class="font-bold mb-4px">{{$t('ny.nftAddress')}}</div>
              <div class="flex-1 bg-colorF2 rounded-8px h-34px mb-10px">
                <input class="bg-transparent h-full w-full px-15px"
                       v-model="form.nftAddress"
                       :placeholder="$t('ny.enterNftAddressTip')">
              </div>
              <div class="flex gap-10px mb-10px">
                <div>
                  <div class="font-bold mb-4px">{{$t('ny.nftId')}}</div>
                  <div class="flex-1 bg-colorF2 rounded-8px h-34px">
                    <input class="bg-transparent h-full w-full px-15px"
                           v-model="form.nftId"
                           :placeholder="$t('ny.enterNftIdTip')">
                  </div>
                </div>
                <div>
                  <div class="font-bold mb-4px">{{$t('ny.nftNum')}}</div>
                  <div class="flex-1 bg-colorF2 rounded-8px h-34px">
                    <input class="bg-transparent h-full w-full px-15px"
                           v-model="form.nftNum"
                           :disabled="nftNumDisabled"
                           :placeholder="$t('ny.enterNftNumTip')">
                  </div>
                </div>
              </div>
              <div v-if="type!=='none'" class="text-right text-color8B light:text-color7D mb-10px">
                {{$t('ny.tokenBalance')}}: {{ formatAmount(tokenBalance) }}
              </div>
            </template>
            <div class="font-bold mb-4px">{{$t('ny.cardNum')}}</div>
            <div class="w-full bg-colorF2 rounded-8px h-34px mb-10px">
              <input class="bg-transparent h-full w-full px-15px"
                     v-model="form.cardNum"
                     type="number"
                     :placeholder="$t('ny.enterCardNumTip')">
            </div>
            <div class="mt-10px text-right font-bold text-16px">
              {{$t('ny.mintTip1', {amount: form.cardNum + '*1 USDT'})}}
            </div>
            <div class="mt-10px text-color86 text-right">
              {{$t('ny.uBalance')}}: {{ formatAmount(usdtBalance) }}
            </div>
            <div class="mt-10px text-right">
              {{$t('ny.mintTip2')}}
            </div>
          </div>
          <div>
            <ConnectMainchainBTNVue class="my-1rem w-full" v-if="chainId !== CHAIN_ID"/>
            <div v-else class="flex justify-center items-center my-1rem gap-10px">
              <button class="ny-gradient-btn gradient-btn-disabled-grey
                             flex items-center justify-center
                             flex-1 rounded-full h-44px 2xl:h-2.2rem text-white font-bold"
                      :disabled="approveLoading || approveStep === 2 || accountMismatch"
                      @click="approve">
                {{$t('ny.approveStep', {step: approveStep})}}
                <c-spinner v-show="approveLoading" class="w-16px h-16px 2xl:w-1rem 2xl:h-1rem ml-0.5rem"></c-spinner>
              </button>
              <button class="ny-gradient-btn gradient-btn-disabled-grey
                             flex items-center justify-center
                             flex-1 rounded-full h-44px 2xl:h-2.2rem text-white font-bold"
                      :disabled="approveLoading || approveStep < 2 || mintLoading || accountMismatch"
                      @click="mint">
                {{$t('ny.mint')}}
                <c-spinner v-show="mintLoading"
                           class="w-16px h-16px 2xl:w-1rem 2xl:h-1rem ml-0.5rem"></c-spinner>
              </button>
            </div>
            <div v-if="accountMismatch" class="text-center">
              {{ $t('ny.accountMismatch') }}
            </div>
          </div>
        </div>
      </div>

    </div>
    <div v-if="step===1" class="px-15px xs:px-40px">
      <div class="grid grid-cols-1 sm:grid-cols-2">
        <div class="col-span-1 sm:pr-26px sm:min-h-546px">
          <div class="card-box h-full flex flex-col justify-center items-center py-2rem">
            <div class="relative w-220px mx-auto cursor-pointer card
                      text-14px leading-18px 2xl:text-1rem 2xl:leading-1.2rem text-white">
              <img class="w-full cursor-pointer" src="~@/assets/red-envelope/mystery-card.png" alt="">
              <img class="w-57px absolute top-16/100 left-1/2 transform -translate-x-1/2 rounded-14px"
                   :src="logoPreviewSrc" alt="">
              <div v-if="form.tokenNum > 0"
                   class="absolute top-10px right-10px font-bold text-shadow-lg opacity-70">
                + {{formatAmount(form.tokenNum / (form.cardNum ?? 1))}} {{selectedToken.symbol}}
              </div>
              <div class="absolute top-40/100 left-1/2 transform -translate-x-1/2 brand-name
                          text-16px font-bold text-color62">
                {{form.brandName || 'Brand name'}}
              </div>
              <div v-if="type==='token'"
                   class="absolute top-55/100 left-1/2 transform -translate-x-1/2 amount
                          font-bold text-14px lg:text-16px text-color62">
                + {{ formatAmount(form.tokenNum) }} {{form.tokenSymbol}}
              </div>
              <div v-if="type==='nft'"
                   class="absolute top-55/100 left-1/2 transform -translate-x-1/2 amount
                          font-bold text-14px lg:text-16px text-color62">
                + {{form.nftNum}} NFT
              </div>
              <div v-if="type==='none'"
                   class="absolute top-55/100 left-1/2 transform -translate-x-1/2 amount
                          font-bold text-14px lg:text-16px text-color62">
                ~
              </div>
            </div>
            <div class="text-color62 mt-1rem w-3/5 mx-auto text-center break-word">
              {{form.brandDesc || $t('ny.brandDefaultDesc')}}
            </div>
          </div>
        </div>
        <div class="col-span-1 font-bold flex flex-col justify-between">
          <div class="mt-10px sm:mt-0">
            <div class="mb-10px xs:mb-20px flex items-center sm:items-start sm:flex-col">
              <span class="text-color86 mr-10px">{{$t('ny.cardNum')}}:</span>
              <span class="sm:mt-8px text-color1D text-20px">{{form.cardNum}}</span>
            </div>
            <div class="mb-10px xs:mb-20px flex items-center sm:items-start sm:flex-col">
              <span class="text-color86 mr-10px">{{$t('ny.specialRewards')}}:</span>
              <span class="mt-8px text-color1D text-20px">{{ formatAmount(form.tokenNum) }} {{form.tokenSymbol}}</span>
            </div>
            <div class="mb-10px xs:mb-20px flex items-center sm:items-start sm:flex-col">
              <span class="text-color86 mr-10px">{{$t('ny.commonRewards')}}:</span>
              <span class="mt-8px text-color1D text-20px">{{ buyAmount }} USDT</span>
            </div>
            <div class="mb-10px xs:mb-20px flex items-center sm:items-start sm:flex-col">
              <div class="text-color86 mr-10px">{{$t('ny.tokenNftAddress')}}:</div>
              <div class="mt-8px text-color1D text-20px">{{type==='token'?form.tokenAddress:form.nftAddress}}</div>
            </div>
            <div v-if="type === 'nft'"
                 class="mb-10px xs:mb-20px flex items-center sm:items-start sm:flex-col">
              <span class="text-color86 mr-10px">{{$t('ny.nftId')}}:</span>
              <span class="mt-8px text-color1D text-20px">{{form.nftId}}</span>
            </div>
            <div class="mt-10px">{{ form.brandDesc ?? WormholeInfo }}</div>
          </div>
          <div class="flex justify-center sm:justify-end">
            <button class="bg-colorBlue gradient-btn-disabled-grey mt-1.5rem
                     flex items-center justify-center whitespace-nowrap px-20px
                     min-w-10rem rounded-full h-44px 2xl:h-2.2rem text-white font-bold"
                    @click="onShare">
              <img class="w-20px mr-10px" src="~@/assets/icon-twitter-white.svg" alt="">
              {{$t('ny.shareTweet')}}
              <c-spinner v-show="shareLoading" class="w-16px h-16px 2xl:w-1rem 2xl:h-1rem ml-0.5rem"></c-spinner>
            </button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="cropperModalVisible"
               destroy-on-close
               :show-close="false"
               :close-on-click-modal="true"
               class="c-dialog c-dialog-center max-w-500px bg-glass border-1 border-color84/30 rounded-1.6rem">
      <div class="h-400px">
        <vueCropper
            ref="cropper"
            :infoTrue="true"
            :autoCrop="true"
            :img="cropperImgSrc"
            :fixedNumber="cropFixedNumber"
            :autoCropWidth="cropImgSize[0]"
            :fixed="true"
            :centerBox="true"
            outputType="png"
        ></vueCropper>
      </div>
      <div class="flex justify-center items-center gap-10px my-20px">
        <button class="font-bold w-10rem rounded-8px border-1 border-color8B/30 light:border-colorF4 h-34px 2xl:h-1.7rem"
                @click="cancelCropImg">{{ $t('ny.cancel') }}</button>
        <button class="bg-tag-gradient text-white font-bold rounded-8px w-10rem border-1 border-color8B/30 light:border-colorF4
                       h-34px 2xl:h-1.7rem"
                @click="completeCropAndUpload">{{ $t('ny.complete') }}</button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import { uploadImage, formatAmount } from '@/utils/helper'
import { mapState, mapGetters } from 'vuex'
import { getUSDTBalance, checkUSDTApproved, approveUSDTToCollect, mintBlindBox, getUserNYCards, getUserActivityInfo } from '@/utils/new-year'
import { accountChanged, getAccounts } from "@/utils/web3/account";
import { ethers } from 'ethers'
import { newBlindCards, getBlindCardsByIds } from '@/api/api'
import { NEW_YEAR_CARD_CONTRACT, CHAIN_ID, BLESS_CARD_NAME, CHAIN_NAME, COLLECT_BLESS_CONTRACT, USDT_CONTRACT, WormholeInfo } from '@/ny-config'
import { TokenIcon, EVM_CHAINS } from "@/config";
import { getTokenInfo, checkNFTType, getApprovement, getERC20TokenBalance } from "@/utils/asset";
import { notify } from '@/utils/notify'
import ConnectMainchainBTNVue from './ConnectMainchainBTN.vue'

export default {
  name: "MakeMysteryCard",
  components: {VueCropper, ConnectMainchainBTNVue},
  data() {
    return {
      TokenIcon,
      step: 0,
      type: 'token',
      form: {
        twitterId: '',
        ids: [],
        brandName: '',
        type: 'erc20',
        tokenAddress: '',
        tokenSymbol: 'NUT',
        tokenDecimals: 18,
        tokenAmount: 0,
        tokenNum: '',
        nftAddress: '',
        nftNum: '',
        nftId: '',
        cardNum: '',
        logoUrl: '',
        brandDesc: '',
        creator: ''
      },
      nftNumDisabled: false,
      cropperModalVisible: false,
      cropperImgSrc: '',
      cropFixedNumber: [1, 1],
      cropImgSize: [200, 200],
      logoPreviewSrc: '',
      logoUploadLoading: false,
      approveLoading: false,
      mintLoading: false,
      shareLoading: false,
      CHAIN_ID,
      tokenApproveNum: 0,
      popperWidth: 300,
      EVM_CHAINS,
      selectedToken: {},
      searchToken: '',
      selectedChainName: CHAIN_NAME,
      customToken: null,
      tokenBalance: 0,
      WormholeInfo
    }
  },
  computed: {
    ...mapState('newYear', ['blessCardBalance', 'approvedUSDT', 'usdtBalance']),
    ...mapState('web3', ['chainId', 'account']),
    ...mapGetters(['getAccountInfo']),
    ...mapGetters('curation', ['getCustomTokens']),
    ...mapGetters('newYear', ['getMintedBoxCache']),
    buyAmount () {
      return (this.form.cardNum * 1)
    },
    usdtApprovement() {
      return this.buyAmount <= parseFloat(this.approvedUSDT)
    },
    accountMismatch() {
      return this.getAccountInfo.ethAddress !== this.account
    },
    approveStep() {
      let count = 0;
      if (this.usdtApprovement) {
        count++
        if (this.form.tokenAddress === USDT_CONTRACT) {
          return 2;
        }
      }
      if (this.type === 'none') {
        count++
      }else {
        if (this.tokenApproveNum >= this.form.tokenNum) {
          count++
        }
      }
      return count
    },
    tokenList() {
      const customToken = this.getCustomTokens ? (this.getCustomTokens[this.selectedChainName] ?? {}) : {}
      return Object.values(customToken).concat(Object.values(this.EVM_CHAINS[this.selectedChainName].assets))
    }
  },
  watch: {
    selectedToken(newValue, oldValue) {
      if (newValue && newValue.symbol) {
        this.form.tokenType = 'erc20';
        this.form.tokenAddress = newValue.address;
        this.form.tokenDecimals = newValue.decimals;
        this.form.tokenSymbol = newValue.symbol;
        getApprovement(CHAIN_NAME, this.form.tokenAddress,this.getAccountInfo.ethAddress, COLLECT_BLESS_CONTRACT).then(t => {
            this.tokenApproveNum = t
        })
        getERC20TokenBalance(CHAIN_NAME, newValue.address, this.getAccountInfo.ethAddress).then(b => {
          this.tokenBalance = b
        })
      }else {
        this.tokenApproveNum = 0;
        this.tokenBalance = 0;
      }
    }
  },
  methods: {
    formatAmount,
    async updateToken() {
      if (!ethers.utils.isAddress(this.searchToken)) {
        this.customToken = null;
        return;
      }
      try {
        const res = await getTokenInfo(this.selectedChainName, this.searchToken)
        this.customToken = {...res, address: this.searchToken}
        let customToken = this.getCustomTokens ?? {};
        if (!customToken[this.selectedChainName]) {
          customToken[this.selectedChainName] = {}
        }
        customToken[this.selectedChainName][res.symbol] = this.customToken
        this.$store.commit('curation/saveCustomTokens', customToken)
        this.selectedToken = this.customToken
      }catch(e) {
        console.log(63, e);
      }
    },
    onUploadLogo(file) {
      // console.log('=========',file)
      this.logoUploadLoading = true
      const reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = (res) => {
        this.cropperImgSrc = res.target.result
        this.cropperModalVisible = true
      }
    },
    cancelCropImg() {
      this.$refs.uploadLogoRef.clearFiles()
      this.logoUploadLoading = false
      this.cropperModalVisible = false
    },
    completeCropAndUpload() {
      this.$refs.uploadLogoRef.clearFiles()
      this.$refs.cropper.getCropData((data) => {
        this.logoPreviewSrc = data
        this.cropperModalVisible = false
      })
      this.$refs.cropper.getCropBlob(async (data) => {
        try {
          await this.uploadImage(data)
          this.logoUploadLoading = false
        } catch (e) {
          console.log(53, e);
          this.coverImg = null
          this.form.poster = null
          this.logoUploadLoading = false
        }
      })
    },
    // 上传图片
    async uploadImage(data) {
      this.form.logoUrl = await uploadImage(data)
      console.log('logo:', this.form.logoUrl);
    },
    async approve() {
      try{
        this.approveLoading = true;
        if (!this.usdtApprovement) {
          await approveUSDTToCollect(this.getAccountInfo.ethAddress)
          getUSDTBalance(this.getAccountInfo.ethAddress).catch();
        }else if (this.tokenApproveNum < this.form.tokenNum) {

          getApprovement(CHAIN_NAME, this.form.tokenAddress,this.getAccountInfo.ethAddress, COLLECT_BLESS_CONTRACT).then(t => {
              this.tokenApproveNum = t
          })
        }
      } catch (e) {
        console.log('approve fail:', e``);
        notify({message: this.$t('curation.approveFail'), type: 'error'})
      } finally {
        this.approveLoading = false;
      }
    },
    clearTokenInput() {
      this.form.tokenType = 'none';
        this.form.tokenAddress = '';
        this.form.tokenDecimals = 18;
        this.form.tokenSymbol = '';
        this.selectedToken = {};

    },
    checkInfo() {
      if (this.form.brandName.length === 0 || this.form.brandDesc.length === 0) {
        notify({message: this.$t('ny.inputBrandInfo'), type: 'info'})
        return false;
      }
      if (this.form.logoUrl.length === 0) {
        notify({message: this.$t('ny.uploadLogo'), type: 'info'})
        return false;
      }

      if (this.form.cardNum < 1) {
          notify({message: this.$t('ny.inputCardNum'), type: 'info'})
          return false;
        }

      if (this.type === 'token') {
        if (!ethers.utils.isAddress(this.form.tokenAddress)) {
          notify({message: this.$t('ny.selectToken'), type: 'info'})
          return false;
        }
        if (this.form.tokenNum < 1) {
          notify({message: this.$t('ny.inputTokenNum'), type: 'info'})
          return false;
        }
      }

      var insufficientBalance = false
      if (this.form.tokenAddress === USDT_CONTRACT && this.type === 'token') {
        if (this.usdtBalance < this.buyAmount + this.form.tokenNum) {
          insufficientBalance = true;
        }
      }else {
        if (this.usdtBalance < this.buyAmount) {
          insufficientBalance = true;
        }
        if (this.tokenBalance < this.form.tokenNum && this.type === 'token') {
          insufficientBalance = true;
        }
      }
      if (insufficientBalance) {
        notify({message: this.$t('curation.insuffientBalance'), type: 'error'});
        return false;
      }
      return true;
    },

    async mint() {
      let id = 0
      if (this.type === 'none') {
        this.form.type = 'none'
        this.form.nftId = 0
      }else if(this.type === 'token') {
        this.form.type = 'erc20'
        this.form.nftId = 0
      }else if(this.type === 'nft') {
        this.form.type = 'erc1155'
        thif.form.tokenAddress = this.form.nftAddress
      }
      if (!this.checkInfo()) {
        return;
      }
      try{
        this.mintLoading = true
        const [ids, hash] = await mintBlindBox(this.getAccountInfo.ethAddress, this.form.tokenAddress, this.form.type, id, this.form.cardNum, this.type==='token' ? ethers.utils.parseUnits(this.form.tokenNum.toString(), this.form.tokenDecimals) : 0)
        this.form.ids = ids
        this.form.twitterId = this.getAccountInfo.twitterId;
        this.form.hash = hash
        this.form.tokenAmount = this.type === 'token' ? (this.form.tokenNum / this.form.cardNum) : 1;
        this.form.creator = this.getAccountInfo.ethAddress;
        getUserActivityInfo(this.getAccountInfo.ethAddress).catch();
        this.$store.commit('newYear/saveMintedBoxCache', this.form);
        await newBlindCards(this.form);
        this.$store.commit('newYear/saveMintedBoxCache', null)
        this.step = 1;
      } catch (e) {
        console.log('mint fail:', e);
      } finally {
        this.mintLoading = false
      }
    },
    onShare() {
      window.open(`https://twitter.com/intent/tweet?text=I hive minted ${this.form.cardNum} mystery cards on @wormhole_3 with some prize. You can join the game to draw these cards from: https://alpha.wormhole3.io.
      #iweb3`)
      this.$emit('close')
    }
  },
  mounted () {
    setTimeout(() => {
      this.popperWidth = this.$refs.formRef.clientWidth < 300? 300: this.$refs.formRef.clientWidth
    })
    if (!this.getAccountInfo || !this.getAccountInfo.twitterId) {
      return;
    }

    const b = this.getMintedBoxCache;
    if (b && b.twitterId && b.twitterId.length > 0) {
      // upload box info
      newBlindCards(b).catch();
    }
    const account = this.getAccountInfo.ethAddress
    getUSDTBalance(account).catch();
    checkUSDTApproved(account).catch();
    accountChanged().catch()
    getAccounts(true).then(wallet => {
      this.account = wallet
    }).catch();
    getUserActivityInfo(account).catch();
  },
}
</script>

<style scoped lang="scss">
.text-color4E {
  color: #4E5969;
}
.text-color86 {
  color: #86909C;
}
.text-color1D {
  color: #1D2129;
}
.card-box {
  background: #F2EEFF;
  border: 1px solid rgba(138, 104, 255, 0.4);
  border-radius: 14px;
  .card {
    box-shadow: 0px 9px 20px rgba(90, 43, 168, 0.35);
    border-radius: 14px;
  }
}
input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; }

input[type="number"]{ -moz-appearance: textfield; }
</style>
