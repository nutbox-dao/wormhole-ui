<template>
  <div class="h-full overflow-hidden flex flex-col
              container mx-auto text-left max-w-43rem fade-in c-text-medium p-15px break-word">
    <button @click="$router.go(-1)"
            class="w-20px xs:w-40px h-40px xs:bg-white/20 xs:light:bg-colorF7 rounded-full
                         flex items-center justify-center">
      <i class="icon-back w-20px h-20px"></i>
    </button>
    <div class="flex-1 overflow-auto px-5px text-14px">
      <div class="text-14px flex items-center gap-15px py-30px text-white">
        <button class="w-24px min-w-24px h-24px rounded-6px"
                :class="step>=1?'bg-color62':'bg-color4F light:bg-color7D'">1</button>
        <div class="h-1px w-full" :class="step>=2?'bg-color62':'bg-color4F light:bg-colorD6'"></div>
        <button class="w-24px min-w-24px h-24px rounded-6px"
                :class="step>=2?'bg-color62':'bg-color4F light:bg-color7D'">2</button>
        <div class="h-1px w-full" :class="step>=3?'bg-color62':'bg-color4F light:bg-colorD6'"></div>
        <button class="w-24px min-w-24px h-24px rounded-6px"
                :class="step>=3?'bg-color62':'bg-color4F light:bg-color7D'">3</button>
        <div class="h-1px w-full" :class="step>=4?'bg-color62':'bg-color4F light:bg-colorD6'"></div>
        <button class="w-24px min-w-24px h-24px rounded-6px"
                :class="step>=4?'bg-color62':'bg-color4F light:bg-color7D'">4</button>
      </div>
      <!-- step 1 -->
      <div v-show="step===1">
        <div class="text-36px c-text-black">
          Create  token
        </div>
        <div class="font-500 mt-30px text-16px">
          Step 1. Register your community token
        </div>
        <div class="mt-30px">
          <div class="text-16px">Token name</div>
          <div class="border-b-1 border-color4F light:border-colorD6 py-8px">
            <input class="w-full bg-transparent" type="text" placeholder="e.g.“Ethereum”" v-model="form.tokenName">
          </div>
          <div class="text-14 text-red-500 mt-10px" v-show="wrongName">
            Illegal input
          </div>
        </div>
        <div class="mt-40px">
          <div class="text-16px">Token symbol</div>
          <div class="border-b-1 border-color4F light:border-colorD6 py-8px">
            <input class="w-full bg-transparent" type="text" placeholder="e.g.“Eth”" v-model="form.tokenSymbol">
          </div>
          <div class="text-14 text-red-500 mt-10px" v-show="wrongSymbol">
            Illegal input
          </div>
        </div>
        <div class="mt-40px flex items-center justify-between gap-15px">
          <div class="text-16px whitespace-nowrap">Transaction begin</div>
          <div class="w-full max-w-300px overflow-hidden py-4px bg-blockBg light:bg-white light:shadow-color1A
                      rounded-5px flex items-center">
            <el-date-picker class="c-input-date bg-blockBg light:bg-white border-0"
                            v-model="form.startTime"
                            type="datetime" placeholder="Pick a day"/>
            <img class="w-20px mr-10px" src="~@/assets/icon-arrow-circle.svg" alt="">
          </div>
        </div>
        <div class="text-14 text-color99 mt-16px">
          Here we help you deploy a token contract which mean users can't transfer this token anyway. But you can provide a begin transfer time. User can transfer token after your setted begin time. The token can be transfered if you do not set this time.
        </div>
        <div>
          <div class="text-16px whitespace-nowrap mb-10px mt-30px">Token Model</div>
          <div class="bg-blockBg light:bg-white px-15px rounded-5px pb-20px relative ">
            <div class="relative overflow-auto pt-50px pb-20px">
              <div class="w-full min-w-780px c-progress-container relative flex justify-between items-center rounded-full h-5px ">
                <el-tooltip placement="top-start">
                  <template #content>
                    <span class="text-white light:text-blueDark">{{min}}</span>
                  </template>
                  <button class="absolute text-color8B left-0 top-14px text-12px">{{formatNum(min)}}</button>
                </el-tooltip>
                <el-tooltip placement="top-start">
                  <template #content>
                    <span class="text-white light:text-blueDark">{{max}}</span>
                  </template>
                  <button class="absolute text-color8B right-0 top-14px text-12px">{{formatNum(max)}}</button>
                </el-tooltip>
                <div class="c-progress-bar" v-for="(data, index) of (progressData ? progressData : [])" :key="index"
                     :style="{ flex: 1,  background: colorList[index]}" >
                <span class="progress-tooltip absolute left-1/2 transform -translate-x-1/2 bottom-8px
                             text-color8B light:text-color62
                             px-15px py-8px rounded-full shadow-popper-tip whitespace-nowrap">
                  {{data.amount}}</span>
                  <el-tooltip v-if="index<progressData.length-1" placement="top-start">
                    <template #content>
                      <span class="text-white light:text-blueDark whitespace-nowrap">{{data.stopHeight}}</span>
                    </template>
                    <button class="absolute text-color8B right-0 transform translate-x-1/2 top-14px text-12px whitespace-nowrap">
                      {{formatNum(data.stopHeight)}}
                    </button>
                  </el-tooltip>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-1 xs:grid-cols-2 mt-40px gap-x-100px gap-y-20px">
              <div class="col-span-1 flex justify-between items-center">
                <span class="text-color8B light:text-color7D">Total supply</span>
                <span>{{ formatAmount(supply) }}</span>
              </div>
            </div>
          </div>
        </div>
        <button class="flex items-center gap-20px mt-30px" @click="gotoNutbox">
          <span class="text-20px">Advanced Token Model</span>
          <img src="~@/assets/community-create.svg" alt="">
        </button>
        <div class="text-14 text-color99 mt-16px">
          If you need set your own token distribution strategy, you can go to nutbox to create your community.
        </div>
        <div class="flex gap-20px">
          <button class="bg-color62 disabled:bg-blockBg light:disabled:bg-black/35 px-30px h-40px text-16px font-bold
                       mt-40px rounded-8px text-white"
                  @click="deployToken">Create</button>
        </div>
      </div>
      <!-- step 2 -->
      <div v-show="step===2">
        <div class="text-36px c-text-black">
          Community info
        </div>
        <div class="font-500 mt-30px text-16px">
          Step 2. Register your community info
        </div>
        <div class="mt-30px">
          <div class="text-16px">Community name</div>
          <div class="border-b-1 border-color4F light:border-colorD6 py-8px">
            <input class="w-full bg-transparent" type="text" placeholder="e.g.“Mferc”">
          </div>
        </div>
        <div class="mt-40px">
          <div class="text-16px">Official link</div>
          <div class="border-b-1 border-color4F light:border-colorD6 py-8px">
            <input class="w-full bg-transparent" type="text" placeholder="e.g.“https://www.wormhole.io”">
          </div>
        </div>
        <div class="mt-40px">
          <div class="text-16px">Twitter link</div>
          <div class="border-b-1 border-color4F light:border-colorD6 py-8px">
            <input class="w-full bg-transparent" type="text" placeholder="e.g.“https://twitter.com/wormhole_3”">
          </div>
        </div>
        <div class="mt-40px">
          <div class="text-16px">Discord link</div>
          <div class="border-b-1 border-color4F light:border-colorD6 py-8px">
            <input class="w-full bg-transparent" type="text" placeholder="e.g.“https://discord.com/invite/6QbcvSEDWF”">
          </div>
        </div>
        <div class="mt-40px">
          <div class="text-16px">YouTube link</div>
          <div class="border-b-1 border-color4F light:border-colorD6 py-8px">
            <input class="w-full bg-transparent" type="text" placeholder="e.g.“https://www.youtube.com/@Wormhole3/featured”">
          </div>
        </div>
        <div class="mt-40px">
          <div class="text-16px mb-8px">Description</div>
          <div class="border-1 border-color4F light:border-colorD6 rounded-5px">
            <textarea class="w-full bg-transparent p-10px"
                      cols="30" rows="3"
                      placeholder="Community description"></textarea>
          </div>
        </div>
        <div class="mt-40px">
          <div class="flex items-center justify-between gap-15px">
            <div class="text-16px whitespace-nowrap">Category tag</div>
            <div class="w-full max-w-300px overflow-hidden py-4px px-10px bg-blockBg light:bg-white light:shadow-color1A
                        rounded-5px flex items-center h-40px">
              <span class="text-16px font-bold text-color99 mr-10px">#</span>
              <input class="bg-transparent w-full" type="text" v-model="inputTag">
              <button :disabled="!inputTag.trim()" @click="form.categoryTags.push(inputTag)">
                <img class="w-20px" src="~@/assets/icon-add-primary.svg" alt="">
              </button>
            </div>
          </div>
          <div class="flex flex-wrap gap-15px py-20px border-b-1 border-color4F light:border-colorD6">
            <button v-for="(tag, index) of form.categoryTags" :key="index"
                    class="px-15px h-30px rounded-full relative text-white"
                    :style="{background: colorList[index]}">
              {{tag}}
              <span class="bg-color62 absolute -top-10px w-18px h-18px rounded-full p-4px"
                    @click="deleteTag(form.categoryTags, index)">
                <img class="w-full" src="~@/assets/icon-close-white.svg" alt="">
              </span>
            </button>
          </div>
        </div>
        <div class="flex items-center justify-between py-30px border-b-1 border-color4F light:border-colorD6">
          <div class="text-16px mb-8px">Token Logo</div>
          <div class="flex items-center gap-20px">
            <el-upload
                class="bg-blockBg bg-blockBg light:bg-white w-100px h-100px flex justify-center items-center rounded-full"
                action="#"
                :show-file-list="false"
                :http-request="(options)=> addUploadImg(options, 'token')">
              <img v-if="tokenLogoPreviewSrc"
                   :src="tokenLogoPreviewSrc" alt=""
                   class="w-full h-full object-cover" />
              <img v-else class="w-20px h-20px" src="~@/assets/icon-add.svg" alt="">
            </el-upload>
            <button class="bg-color62 text-white h-30px px-15px rounded-8px flex items-center justify-center gap-8px"
                    :disabled="!tokenLogoPreviewSrc || tokenLogoUploadLoading" @click="onUpload('token')">
              <span>Upload</span>
              <c-spinner class="w-1.5rem h-1.5rem ml-0.5rem" v-show="tokenLogoUploadLoading"></c-spinner>
            </button>
          </div>
        </div>
        <div class="flex items-center justify-between py-30px">
          <div class="text-16px mb-8px">Community Logo</div>
          <div class="flex items-center gap-20px">
            <el-upload
                class="bg-blockBg bg-blockBg light:bg-white w-100px h-100px flex justify-center items-center rounded-full"
                action="#"
                :show-file-list="false"
                :http-request="(options)=> addUploadImg(options, 'logo')">
              <img v-if="logoPreviewSrc"
                   :src="logoPreviewSrc" alt=""
                   class="w-full h-full object-cover" />
              <img v-else class="w-20px h-20px" src="~@/assets/icon-add.svg" alt="">
            </el-upload>
            <button class="bg-color62 text-white h-30px px-15px rounded-8px flex items-center justify-center gap-8px"
                    :disabled="!logoPreviewSrc || logoUploadLoading" @click="onUpload('logo')">
              <span>Upload</span>
              <c-spinner class="w-1.5rem h-1.5rem ml-0.5rem" v-show="logoUploadLoading"></c-spinner>
            </button>
          </div>
        </div>
        <div class="flex flex-col md:flex-row md:items-center justify-between py-30px">
          <div class="text-16px mb-8px whitespace-nowrap text-left">Community Poster</div>
          <div class="flex-1 flex items-center justify-between md:justify-end gap-20px">
            <el-upload
                class="bg-blockBg bg-blockBg light:bg-white w-300px h-70px flex justify-center items-center rounded-12px overflow-hidden"
                action="#"
                :show-file-list="false"
                :http-request="(options)=> addUploadImg(options, 'poster')">
              <img v-if="posterPreviewSrc"
                   :src="posterPreviewSrc" alt=""
                   class="w-full h-full object-cover" />
              <img v-else class="w-20px h-20px" src="~@/assets/icon-add.svg" alt="">
            </el-upload>
            <button class="bg-color62 text-white h-30px px-15px rounded-8px flex items-center justify-center gap-8px"
                    :disabled="!posterPreviewSrc || posterUploadLoading" @click="onUpload('poster')">
              <span class="whitespace-nowrap">Upload</span>
              <c-spinner class="w-1.5rem h-1.5rem ml-0.5rem" v-show="posterUploadLoading"></c-spinner>
            </button>
          </div>
        </div>
        <div class="flex gap-20px">
          <button class="border-1 border-color62 text-color62 px-30px h-40px text-16px font-bold
                       mt-40px rounded-8px"
                  @click="step=1">Back</button>
          <button class="bg-color62 disabled:bg-blockBg light:disabled:bg-black/35 px-30px h-40px text-16px font-bold
                       mt-40px rounded-8px text-white"
                  @click="step=3">Confirm</button>
        </div>
      </div>
      <!-- step 3 -->
      <div v-show="step===3">
        <div class="text-36px c-text-black">
          Points claimable
        </div>
        <div class="font-500 mt-30px text-16px">
          Step 3. Points claimable
        </div>
        <div class="text-color8B light:text-color7D mt-20px">
          将策展奖励合约添加到积分代币的转账白名单中
        </div>
        <div class="flex gap-20px">
          <button class="border-1 border-color62 text-color62 px-30px h-40px text-16px font-bold
                       mt-40px rounded-8px"
                  @click="step=2">Back</button>
          <button class="bg-color62 disabled:bg-blockBg light:disabled:bg-black/35 px-30px h-40px text-16px font-bold
                       mt-40px rounded-8px text-white"
                  @click="step=4">Confirm</button>
        </div>
      </div>
      <!-- step 4 -->
      <div v-show="step===4">
        <div class="text-36px c-text-black">
          Pool
        </div>
        <div class="font-500 mt-30px text-16px">
          Step 3. mining Pool
        </div>
        <div class="mt-30px">
          <div class="text-16px">Social mining Pool</div>
          <div class="border-b-1 border-color4F light:border-colorD6 py-8px">
            <input class="w-full bg-transparent" type="text" placeholder="100%Content mining">
          </div>
        </div>
        <div class="mt-40px">
          <div class="text-16px">Official Twitter</div>
          <div class="border-b-1 border-color4F light:border-colorD6 py-8px">
            <input class="w-full bg-transparent" type="text" placeholder="@ twitter ID">
          </div>
        </div>
        <div class="mt-40px">
          <div class="text-16px">On-chain Community tag</div>
          <div class="border-b-1 border-color4F light:border-colorD6 py-8px flex items-center">
            <span class="text-16px font-bold text-color99 mr-10px">#</span>
            <input class="w-full bg-transparent" v-model="form.chainTag"
                   type="text" placeholder="chain tag">
          </div>
        </div>
        <div class="flex gap-20px">
          <button class="border-1 border-color62 text-color62 px-30px h-40px text-16px font-bold
                       mt-40px rounded-8px"
                  @click="step=3">Back</button>
          <button class="bg-color62 disabled:bg-blockBg light:disabled:bg-black/35 px-30px h-40px text-16px font-bold
                       mt-40px rounded-8px text-white"
          >Submit</button>
        </div>
      </div>
    </div>
    <el-dialog v-model="cropperModal"
               class="c-dialog c-dialog-lg c-dialog-center">
      <div class="cropper-container max-h-full h-500px bg-blockBg light:bg-white light:shadow-color1A">
        <canvas id="cropper-canvas"></canvas>
        <VueCropper
            ref="cropper"
            :class="uploadType==='poster'?'':'cropper-rounded-circle'"
            :infoTrue="true"
            :autoCrop="true"
            :img="cropperImgSrc"
            :fixedNumber="cropFixedNumber"
            :autoCropWidth="cropImgSize[0]"
            :fixed="true"
            :centerBox="true"
            outputType="png"
            mode="cover"
        ></VueCropper>
      </div>
      <div class="flex justify-center items-center gap-20px py-20px font-bold text-white">
        <button class="h-40px w-100px border-1 border-color62 text-color62 rounded-8px" @click="onCancel">Cancel</button>
        <button class="h-40px w-100px bg-color62 rounded-8px" @click="completeCropAndUpload">Complete</button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'
import { uploadImage, formatAmount } from "@/utils/helper";
import { getDistribution } from "@/utils/nutbox/utils"
import { createCommunity } from "@/utils/nutbox/community"

export default {
  name: "CommunityCreate",
  components: {VueCropper},
  data() {
    return {
      colorList: [
        '#7B61FF',
        '#DB75FF',
        '#FF7575',
        '#FFD875',
        '#7CBF4D',
        '#70ACFF',
        '#CC85FF',
        '#FF9500',
        '#00C7D9',
        '#9D94FF',
        '#DAD0ED',
        '#2780FD',
        '#00B9CD',
        '#91CF94',
        '#F4F5CE',
        '#FCB62E',
        '#FF9C26',
        '#FF7366',
        '#F57BA3',
        '#6456FF',
        '#70ACFF',
        '#5AD9E8',
        '#9DAC00',
        '#FFE14D',
        '#FFCD7A'
      ],
      wrongName: false,
      wrongSymbol: false,
      wrongTime: false,
      step: 1,
      form: {
        tokenName: '',
        tokenSymbol: '',
        startTime: '',
        categoryTags: [],
        tokenLogo: '',
        chainTag: ''
      },
      inputTag: '',
      uploadType: 'token',
      tokenLogoFile: null,
      tokenLogoPreviewSrc: '',
      logoFile: null,
      logoPreviewSrc: '',
      posterFile: null,
      posterPreviewSrc: '',
      logoUploadLoading: false,
      tokenLogoUploadLoading: false,
      posterUploadLoading: false,
      cropperModal: false,
      cropperImgSrc: '',
      cropFixedNumber: [1, 1],
      cropImgSize: [200, 200],
      progressData: [
        {amount: 10, background: "rgba(255, 149, 0, 0.25)", percentage: 10000000, startHeight: "17256610", stopHeight: "27256610"}
      ],
      supply: 0,
      deployingToken: false,
      uploadingCommunityInfo: false,
      createingPooling: false,
      approveingTransfer: false
    }
  },
  computed: {
    min () {
      if (!this.progressData || this.progressData.length === 0) return 0
      return this.progressData[0].startHeight
    },
    max () {
      if (!this.progressData || this.progressData.length === 0 || this.progressData[this.progressData.length - 1].stopHeight >= 999999999999999) return this.$t('commen.max')
      return this.progressData[this.progressData.length - 1].stopHeight
    },
  },
  methods: {
    formatAmount,
    formatNum (num) {
      if (!this.isNumeric(num)) return 'Max'
      num = parseFloat(num).toFixed(2)
      if (num < 1e5) {
        return num
      }
      if (num < 1e6) {
        return `${(parseFloat(num) / 1e3).toFixed(2)}K`
      }
      if (num < 1e9) {
        return `${(parseFloat(num) / 1e6).toFixed(2)}M`
      }
      return `${(parseFloat(num) / 1e9).toFixed(2)}G`
    },
    isNumeric (val) {
      return val !== null && val !== '' && !isNaN(val)
    },
    deleteTag(list, index) {
      list.splice(index, 1)
    },
    async addUploadImg (options, type) {
      this.uploadType = type
      const reader = new FileReader()
      reader.readAsDataURL(options.file)
      reader.onload = (res) => {
        this.cropperImgSrc = res.target.result
        this.cropperModal = true
        if(type==='poster') {
          this.cropFixedNumber = [30, 7]
          this.cropImgSize = [1200, 280]
        } else {
          this.cropFixedNumber = [1, 1]
          this.cropImgSize = [200, 200]
        }
      }
    },
    onCancel () {
      this.cropperModal = false
      if (this.logoUploadLoading) {
        this.logoUploadLoading = false
      }
      if (this.tokenLogoUploadLoading) {
        this.tokenLogoUploadLoading = false
      }
      if (this.posterUploadLoading) this.posterUploadLoading = false
    },
    clipCircleImg (imgSrc) {
      return new Promise(resolve => {
        const canvas = document.getElementById('cropper-canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.src = imgSrc
        img.onload = () => {
          const cw = canvas.width = img.width
          const ch = canvas.height = img.height
          ctx.beginPath()
          ctx.arc(cw / 2, ch / 2, ch / 2, 0, Math.PI * 2)
          ctx.closePath()
          ctx.clip()
          ctx.drawImage(img, 0, 0)
        }
        const timer = setInterval(function () {
          if (img.complete) {
            clearInterval(timer)
            resolve(canvas)
          }
        }, 50)
      })
    },
    completeCropAndUpload () {
      if (this.uploadType==='logo') {
        this.$refs.cropper.getCropData(async (data) => {
          const canvas = await this.clipCircleImg(data)
          this.logoPreviewSrc = canvas.toDataURL('image/png')
          this.cropperModal = false
          canvas.toBlob(async data => {
            this.logoFile = data
          })
        })
      } else if (this.uploadType === 'token') {
        this.$refs.cropper.getCropData(async (data) => {
          const canvas = await this.clipCircleImg(data)
          this.tokenLogoPreviewSrc = canvas.toDataURL('image/png')
          this.cropperModal = false
          canvas.toBlob(async data => {
            this.tokenLogoFile = data
          })
        })
      } else if(this.uploadType === 'poster') {
        this.$refs.cropper.getCropData((data) => {
          this.posterPreviewSrc = data
          this.cropperModal = false
        })
        this.$refs.cropper.getCropBlob(async (data) => {
          this.posterFile = data
        })
      }
    },
    async onUpload(type) {
      if(type==='token') {
        this.tokenLogoUploadLoading = true
        this.form.icon = await uploadImage(this.tokenLogoFile)
        this.tokenLogoUploadLoading = false
      }
      if(type==='logo') {
        this.logoUploadLoading = true
        this.form.logo = await uploadImage(this.logoFile)
        this.logoUploadLoading = false
      }
      if(type==='poster') {
        this.posterUploadLoading = true
        this.form.poster = await uploadImage(this.posterFile)
        this.posterUploadLoading = false
      }
    },
    gotoNutbox() {
      window.open('https://arbi.nutbox.app/#/community/index', '__blank')
    },
    async deployToken() {
      try{
        this.deployingToken = true
        // check token info
        const v1 = /^[\x00-\x7F]+$/.test(this.form.tokenName)
        if (!v1) {
          this.wrongName = true;
          return;
        }
        this.wrongName = false
        const v2 = /^[\x00-\x7F]+$/.test(this.form.tokenSymbol)

        if (!v2) {
          this.wrongSymbol = true;
          return;
        }
        this.wrongSymbol = false;

        // check datetime
        const startStamp = new Date(this.form.startTime).getTime()
        const now = new Date().getTime()
        if (now > startStamp) {
          this.wrongTime = true
          return;
        }
        this.wrongTime = false
        this.form.startTime = startStamp

        // deploy token
        // const createdCommunity = await createCommunity('Arbitrum', this.form, this.progressData)
        // console.log(2345, createdCommunity)
        this.step = 2
      } catch (e) {
        console.log('create nutbox community fail:', e)
      } finally {
        this.deployingToken = false
      }
    }
  },
  async mounted () {
    getDistribution("Arbitrum").then(progress => {
      this.supply = progress.reduce((t, p) => t += (parseInt(p.stopHeight) - parseInt(p.startHeight) + 1) * parseFloat(p.amount), 0)
      this.progressData = progress
    }).catch(e => {
      console.log(333, e)
    });
  },
}
</script>

<style scoped lang="scss">
.c-progress-container {
  .c-progress-bar {
    height: 100%;
    position: relative;
    border-right: 2px solid transparent;
  }
  .c-progress-bar:nth-of-type(1) {
    border-top-left-radius: 1rem;
    border-bottom-left-radius: 1rem;
  }
  .c-progress-bar:last-child {
    border-top-right-radius: 1rem;
    border-bottom-right-radius: 1rem;
    border: none;
  }
}
</style>
