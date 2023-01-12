<template>
  <div class="relative text-left pb-3rem sm:pb-2rem  flex flex-col text-14px 2xl:text-0.8rem
              text-white light:text-blueDark">
    <button class="absolute right-20px top-20px"
            @click="$emit('close')">
      <i class="w-18px h-18px 2xl:w-1rem 2xl:h-1rem icon-close"></i>
    </button>
    <div class="mx-auto c-text-black text-20px xl:text-1.2rem mt-2rem mb-1.5rem xs:mt-3rem xs:mb-2rem">
      {{$t('ny.makeMysteryCard')}}
    </div>
    <div v-if="step===0" class="px-15px xs:px-40px">
      <div class="grid grid-cols-1 xs:grid-cols-2 gap-1rem">
        <div class="col-span-1">
          <div class="relative w-1/2 xs:w-full mx-auto cursor-pointer
                      text-14px leading-18px 2xl:text-1rem 2xl:leading-1.2rem text-white">
            <img class="w-full cursor-pointer" src="~@/assets/red-envelope/mystery-card-back.png" alt="">
            <img class="w-4/5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-12px"
                 :src="logoPreviewSrc" alt="">
<!--            <img class="absolute w-20px bottom-15px left-15px"-->
<!--                 src="~@/assets/red-envelope/icon-reverse.png" alt="">-->
            <div v-if="form.tokenNum > 0"
                 class="absolute top-10px right-10px font-bold text-shadow-lg opacity-70">
              + {{formatAmount(form.tokenNum / (form.cardNum ?? 1))}} {{selectedToken.symbol}}
            </div>
            <div class="absolute bottom-15px right-15px text-shadow-lg font-bold opacity-70 max-w-1/2">
              {{form.brandName}}
            </div>
          </div>
        </div>
        <div class="col-span-1" ref="formRef">
          <div class="w-full border-1 bg-black/40 border-1 border-color8B/30
                    light:bg-white light:border-colorE3 hover:border-primaryColor
                    rounded-8px h-34px mb-10px">
            <input class="bg-transparent h-full w-full px-15px"
                   v-model="form.brandName"
                   :placeholder="$t('ny.brandName')">
          </div>
          <div class="font-bold mb-4px">{{$t('ny.cardType')}}</div>
          <div class="flex rounded-8px overflow-hidden mb-10px gap-1px">
            <button class="flex-1 rounded-l-8px h-34px"
                    :class="type==='token'?'bg-tag-gradient text-white':'bg-inputBg light:bg-colorF2 text-color7D'"
                    @click="type='token'">
              Token
            </button>
            <!-- <button class="flex-1 h-34px"
                    :class="type==='nft'?'bg-tag-gradient text-white':'bg-inputBg light:bg-colorF2 text-color7D'"
                    @click="type='nft'">
              NFT
            </button> -->
            <button class="flex-1 rounded-r-8px h-34px"
                    :class="type==='none'?'bg-tag-gradient text-white':'bg-inputBg light:bg-colorF2 text-color7D'"
                    @click="type='none';clearTokenInput()">
              None
            </button>
          </div>
          <template v-if="type==='token'">
            <button class="w-full bg-black/40 border-1 border-color8B/30 mb-10px
                         light:bg-white light:border-colorE3 flex items-center
                         rounded-8px overflow-hidden h-34px">
              <el-popover popper-class="c-popper"
                          placement="bottom-end"
                          :width="popperWidth"
                          trigger="click" ref="tokenPopover">
                <template #reference>
                  <button class="h-full w-full flex justify-between items-center cursor-pointer px-12px">
                  <span class="flex items-center">
                    <span v-if="Object.keys(selectedToken).length===0" class="text-color8B/70">{{$t('ny.select')}}</span>
                    <template v-else>
                      <img v-if="TokenIcon[selectedToken.symbol]" class="w-22px min-w-22px h-22px mr-15px rounded-full"
                           :src="TokenIcon[selectedToken.symbol]" alt="">
                      <img v-else class="w-22px min-w-22px mr-15px rounded-full"
                           src="~@/assets/icon-token-default.svg" alt="">
                      <span class="text-color8B text-15px">{{ selectedToken.symbol }}</span>
                    </template>
                  </span>
                    <img class="w-16px" src="~@/assets/icon-select-arrow.svg" alt="">
                  </button>
                </template>
                <template #default>
                  <div class="border-1 border-color8B/30 bg-blockBg max-h-240px flex flex-col overflow-hidden
                                light:bg-white light:border-colorE3 hover:border-primaryColor
                                rounded-12px py-10px overflow-x-hidden">
                    <div class="px-10px mb-10px">
                      <div class="w-full border-1 bg-black/40 border-1 border-color8B/30
                                    light:bg-colorF2 light:border-colorE3 hover:border-primaryColor
                                    rounded-12px h-40px 2xl:h-2rem">
                        <input class="bg-transparent h-full w-full px-0.5rem"
                               v-model="searchToken"
                               @input="updateToken"
                               type="text" :placeholder="$t('curation.inputErc20')">
                      </div>
                    </div>
                    <div class="flex-1 overflow-auto">
                      <div v-if="customToken"
                           class="h-full w-full flex items-center cursor-pointer border-b-1 border-color8B/10 light:border-colorE3
                              py-3 px-10px overflow-x-hidden hover:bg-black/30 light:hover:bg-black/10">
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
                           overflow-x-hidden hover:bg-black/30 light:hover:bg-black/10">
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

            <div class="w-full border-1 bg-black/40 border-1 border-color8B/30
                        flex items-center
                        light:bg-white light:border-colorE3 hover:border-primaryColor
                        rounded-8px h-34px mb-10px">
              <input class="bg-transparent h-full w-full px-15px"
                     v-model="form.tokenNum"
                     type="number"
                     :placeholder="$t('ny.tokenNum')">
<!--              <span class="whitespace-nowrap pr-15px font-bold">{{form.tokenSymbol}}</span>-->
            </div>
            <div class="w-full border-1 bg-black/40 border-1 border-color8B/30
                        light:bg-white light:border-colorE3 hover:border-primaryColor
                        rounded-8px h-34px mb-10px">
              <input class="bg-transparent h-full w-full px-15px"
                     v-model="form.cardNum"
                     type="number"
                     :placeholder="$t('ny.cardNum')">
            </div>
          </template>
          <template v-if="type==='nft'">
            <div class="w-full border-1 bg-black/40 border-1 border-color8B/30
                    light:bg-white light:border-colorE3 hover:border-primaryColor
                    rounded-8px h-34px mb-10px">
              <input class="bg-transparent h-full w-full px-15px"
                     v-model="form.nftAddress"
                     :placeholder="$t('ny.nftAddress')">
            </div>
            <div class="flex gap-10px">
              <div class="w-full border-1 bg-black/40 border-1 border-color8B/30
                    light:bg-white light:border-colorE3 hover:border-primaryColor
                    rounded-8px h-34px mb-10px">
                <input class="bg-transparent h-full w-full px-15px"
                       v-model="form.nftNum"
                       :disabled="nftNumDisabled"
                       :placeholder="$t('ny.nftNum')">
              </div>
              <div class="w-full border-1 bg-black/40 border-1 border-color8B/30
                    light:bg-white light:border-colorE3 hover:border-primaryColor
                    rounded-8px h-34px mb-10px">
                <input class="bg-transparent h-full w-full px-15px"
                       v-model="form.nftId"
                       :placeholder="$t('ny.nftId')">
              </div>
            </div>
            <div class="w-full border-1 bg-black/40 border-1 border-color8B/30
                        light:bg-white light:border-colorE3 hover:border-primaryColor
                        rounded-8px h-34px mb-10px">
              <input class="bg-transparent h-full w-full px-15px"
                     v-model="form.cardNum"
                     type="number"
                     :placeholder="$t('ny.cardNum')">
            </div>
          </template>
          <template v-if="type==='none'">
            <div class="w-full border-1 bg-black/40 border-1 border-color8B/30
                        light:bg-white light:border-colorE3 hover:border-primaryColor
                        rounded-8px h-34px mb-10px">
              <input class="bg-transparent h-full w-full px-15px"
                     v-model="form.cardNum"
                     type="number"
                     :placeholder="$t('ny.cardNum')">
            </div>
          </template>

          <div class="flex">
            <span class="mr-2rem font-bold">{{$t('ny.logo')}}</span>
            <div class="w-60px h-60px rounded-8px border-1 bg-black/40
                        hover:border-primaryColor light:hover:border-primaryColor
                        border-1 border-color8B/30 light:border-colorF4 relative overflow-hidden">
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
                    <i v-if="!logoPreviewSrc" class="w-20px h-20px icon-add"></i>
                  </button>
                </template>
              </el-upload>
              <div v-if="logoUploadLoading"
                   class="w-full h-full bg-inputBg/20 absolute top-0 left-0 flex items-center justify-center">
                <c-spinner class="w-30px h-30px"></c-spinner>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="">
        <div class="flex justify-end items-center">
          <span class="text-color8B light:text-color7D/50">{{form.brandDesc.length}}/180</span>
        </div>
        <div class="relative border-1 bg-black/40 border-1 border-color8B/30
                      light:bg-white light:border-colorE3 hover:border-primaryColor
                      rounded-8px min-h-44px 2xl:min-h-2rem flex items-center">
          <el-input v-model="form.brandDesc"
                    :rows="4" :maxlength="180"
                    class="border-0 c-textarea rounded-8px overflow-hidden"
                    type="textarea"
                    :placeholder="$t('ny.createDescTip')"/>
        </div>
      </div>
      <div class="mt-10px">
        {{$t('ny.mintTip1', {amount: form.cardNum + '*1 USDT'})}}
      </div>
      <div class="mt-10px text-color8B light:text-color7D">
        {{$t('ny.uBalance')}}: {{ formatAmount(usdtBalance) }}
      </div>
      <div v-if="type!=='none'" class="mt-10px text-color8B light:text-color7D">
        {{$t('ny.tokenBalance')}}: {{ formatAmount(tokenBalance) }}
      </div>
      <div class="mt-10px text-color8B light:text-color7D">
        {{$t('ny.mintTip2')}}
      </div>
      <ConnectMainchainBTNVue class="my-1rem" v-if="chainId !== CHAIN_ID"/>
      <div v-else class="flex justify-center items-center mt-1rem gap-10px">
        <button class="bg-tag-gradient gradient-btn-disabled-grey
                     flex items-center justify-center
                     w-10rem rounded-12px h-44px 2xl:h-2.2rem text-white font-bold"
                     :disabled="approveLoading || approveStep === 2 || accountMismatch"
                     @click="approve">
          {{$t('ny.approveStep', {step: approveStep})}}
          <c-spinner v-show="approveLoading" class="w-16px h-16px 2xl:w-1rem 2xl:h-1rem ml-0.5rem"></c-spinner>
        </button>
        <button class="bg-tag-gradient gradient-btn-disabled-grey
                     flex items-center justify-center
                     w-10rem rounded-12px h-44px 2xl:h-2.2rem text-white font-bold"
                :disabled="approveLoading || approveStep < 2 || mintLoading || accountMismatch"
                @click="mint">
          {{$t('ny.mint')}}
          <c-spinner v-show="mintLoading"
                     class="w-16px h-16px 2xl:w-1rem 2xl:h-1rem ml-0.5rem"></c-spinner>
        </button>
      </div>
      <div v-if="accountMismatch">
        {{ $t('ny.accountMismatch') }}
      </div>
    </div>
    <div v-if="step===1" class="px-15px xs:px-40px">
      <div class="grid grid-cols-1 xs:grid-cols-2 gap-1rem">
        <div class="col-span-1">
          <div class="relative w-1/2 xs:w-full mx-auto cursor-pointer
                      text-14px leading-18px 2xl:text-1rem 2xl:leading-1.2rem text-white">
            <img class="w-full cursor-pointer" src="~@/assets/red-envelope/mystery-card-back.png" alt="">
            <img class="w-4/5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-12px"
                 :src="logoPreviewSrc" alt="">
<!--            <img class="absolute w-20px bottom-15px left-15px"-->
<!--                 src="~@/assets/red-envelope/icon-reverse.png" alt="">-->
            <div v-if="form.tokenNum"
                 class="absolute top-10px right-10px font-bold text-shadow-lg opacity-70">
              + {{ formatAmount(form.tokenNum) }} {{form.tokenSymbol}}
            </div>
            <div class="absolute bottom-15px right-15px text-shadow-lg font-bold opacity-70 max-w-1/2">
              {{form.brandName}}
            </div>
          </div>
        </div>
        <div class="col-span-1 font-bold">
          <div class="mb-10px xs:mb-20px">
            <span class="text-color8B light:text-color7D mr-10px">{{$t('ny.cardNum')}}:</span>
            <span>{{form.cardNum}}</span>
          </div>
          <div class="mb-10px xs:mb-20px">
            <span class="text-color8B light:text-color7D mr-10px">{{$t('ny.specialRewards')}}:</span>
            <span>{{ formatAmount(form.tokenNum) }} {{form.tokenSymbol}}</span>
          </div>
          <div class="mb-10px xs:mb-20px">
            <span class="text-color8B light:text-color7D mr-10px">{{$t('ny.commonRewards')}}:</span>
            <span>{{ buyAmount }} USDT</span>
          </div>
          <div class="mb-10px xs:mb-20px">
            <div class="text-color8B light:text-color7D mr-10px">{{$t('ny.tokenNftAddress')}}:</div>
            <div class="mt-3px leading-16px">{{type==='token'?form.tokenAddress:form.nftAddress}}</div>
          </div>
          <div v-if="type === 'nft'" class="mb-10px xs:mb-20px">
            <span class="text-color8B light:text-color7D mr-10px">{{$t('ny.nftId')}}:</span>
            <span>{{form.nftId}}</span>
          </div>
        </div>
      </div>
      <div class="mt-10px">{{ form.brandDesc ?? WormholeInfo }}</div>
      <button class="bg-tag-gradient gradient-btn-disabled-grey mt-2rem mx-auto
                     flex items-center justify-center
                     w-10rem rounded-12px h-44px 2xl:h-2.2rem text-white font-bold"
              @click="onShare">
        {{$t('ny.shareTweet')}}
        <c-spinner v-show="shareLoading" class="w-16px h-16px 2xl:w-1rem 2xl:h-1rem ml-0.5rem"></c-spinner>
      </button>
    </div>
    <el-dialog v-model="cropperModalVisible"
               destroy-on-close
               :show-close="false"
               :close-on-click-modal="true"
               class="c-dialog c-dialog-center max-w-500px bg-glass border-1 border-color84/30 rounded-1.6rem">
      <div class="h-500px">
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
                @click="cropperModalVisible=false">{{ $t('ny.cancel') }}</button>
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
      WormholeInfo,
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
      console.log('=========',file)
      this.logoUploadLoading = true
      const reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = (res) => {
        this.cropperImgSrc = res.target.result
        this.cropperModalVisible = true
      }
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
      window.open(`https://twitter.com/intent/tweet?text=I hive minted ${this.form.cardNum} mystery cards on @wormhole_3 with some prize. You can join the game to draw these card from: https://alpha.wormhole3.io.
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

<style scoped>

</style>
