<template>
  <div>
    <div class="md:border-b-1 border-dividerColor mb-1rem">
      <div class="relative container mx-auto max-w-50rem md:px-1rem px-15px flex items-center md:justify-start justify-center h-2.8rem">
        <div class="c-text-black text-1.5rem md:text-1rem mx-1.9rem">{{$t('curationsView.createCuration')}}</div>
      </div>
    </div>
    <div v-if="currentStep<=2" v-loading="loading"
         class="container mx-auto max-w-600px xl:max-w-30rem bg-blockBg rounded-20px px-2rem sm:px-4.5rem py-2rem mb-2rem">
      <Steps :total-step="2" :current-step="currentStep"/>
      <div v-if="currentStep===1" class="text-left text-14px 2xl:text-0.7rem">
        <div class="mt-1.8rem">
          <div class="mb-6px">Title</div>
          <div class="border-1 bg-black border-1 border-color8B/30 rounded-12px h-40px 2xl:h-2rem">
            <input class="bg-transparent h-full w-full px-0.5rem"
                  v-model="form.title"
                   type="text" placeholder="Enter a quest title…">
          </div>
        </div>
        <div class="mt-1.8rem">
          <div class="mb-6px">Schedule (UTC+08:00)</div>
          <div class="mb-6px text-primaryColor italic">The default start time is the creation time.</div>
          <div class="relative border-1 bg-black border-1 border-color8B/30 rounded-12px h-40px 2xl:h-2rem flex items-center">
            <div class="flex-1">
              <el-date-picker
                  class="c-input-date"
                  popper-class="c-date-popper"
                  prefix-icon="none"
                  clear-icon="none"
                  v-model="form.endTime"
                  type="datetime"
                  placeholder="End time"
                  :disabled-date="disabledDate"
              />
            </div>
            <img class="absolute right-0.8rem" src="~@/assets/icon-date.svg" alt="">
          </div>
        </div>
        <div class="mt-1.8rem">
          <div class="mb-6px">Description</div>
          <div class="border-1 bg-black border-1 border-color8B/30 rounded-12px">
            <textarea v-model="form.description" class="bg-transparent  w-full p-0.5rem" rows="12" placeholder="Enter Description…"/>
          </div>
        </div>
        <div class="text-right mt-4rem">
          <button class="h-40px 2xl:h-2rem rounded-full px-1.5rem  gradient-btn"
                  @click="onNext">Next</button>
        </div>
      </div>
      <div v-if="currentStep===2" class="text-left text-14px 2xl:text-0.7rem">
        <div class="mt-1.8rem">
          <div class="mb-6px">Connect Wallet</div>
          <div class="relative border-1 gradient-border gradient-border-color3 rounded-12px h-50px 2xl:2.5rem
          flex justify-center items-center"
               @click="connectLoading=true">
            <span class="font-600 text-15px 2xl:text-0.75rem gradient-text gradient-text-purple-white">Metamask</span>
            <img class="absolute h-32px right-20px" src="~@/assets/icon-metamask.png" alt="">
            <div v-if="connectLoading"
                 class="absolute bg-black/70 w-full h-full rounded-12px flex justify-center items-center">
              <img class="w-3rem" src="~@/assets/loading-points.svg" alt="">
            </div>
          </div>
        </div>
        <div class="mt-1.8rem">
          <div class="mb-6px">Number of Rewards</div>
          <div class="flex items-center flex-col sm:flex-row">
            <div class="w-full sm:w-4/7 border-1 bg-black border-1 border-color8B/30 rounded-12px h-40px 2xl:h-2rem">
              <input class="bg-transparent h-full w-full px-0.5rem"
                     type="text" placeholder="Enter number of rewards">
            </div>
            <div class="w-full sm:w-3/7 sm:pl-3rem flex items-center">
              <el-switch v-model="form.isLimit" />
              <span class="ml-10px font-600"
                    :class="form.isLimit?'text-primaryColor1':'text-color8B'">No limited</span>
            </div>
          </div>
        </div>
        <div class="mt-1.8rem">
          <div class="mb-6px">Rewards Method</div>
          <div class="border-1 border-color8B/30 rounded-12px 2xl:2.5rem p-10px">
            <div class="gradient-text gradient-text-purple-white font-600 text-15px 2xl:text-0.75rem">
              Proof of Subjective Work (PoSW)
            </div>
            <div class="mt-1rem text-color8B text-12px leading-20px 2xl:text-0.6rem 2xl:leading-1.2rem">
              If it is a PoSW quest, the reward will be issued to the participants according to the review.
              If it is other quest, the rewards will be automatically.
            </div>
          </div>
        </div>
        <div class="mt-1.8rem">
          <div class="mb-6px">Number of Rewards</div>
          <div class="flex items-center flex-col sm:flex-row">
            <div ref="tokenPopper"
                 class="w-full sm:w-4/7 border-1 bg-black border-1 border-color8B/30 rounded-12px h-40px 2xl:h-2rem">
              <input class="bg-transparent h-full w-full px-0.5rem"
                     type="text" placeholder="Enter number of rewards">
            </div>
            <div class="w-full sm:w-3/7 mt-10px sm:pl-1.5rem sm:mt-0">
              <div class="border-1 bg-black border-1 border-color8B/30 rounded-12px h-40px 2xl:h-2rem">
                <el-popover popper-class="c-popper" :width="popperWidth" trigger="click">
                  <template #reference>
                    <div class="h-full w-full flex justify-between items-center cursor-pointer px-15px">
                      <div class="flex items-center">
                        <img class="h-22px mr-15px" src="~@/assets/icon-eth-white.svg" alt="">
                        <span class="text-color8B text-15px">ETH</span>
                      </div>
                      <img class="w-1rem" src="~@/assets/icon-select-arrow.svg" alt="">
                    </div>
                  </template>
                  <template #default>
                    <div class="border-1 border-color8B/30 bg-blockBg rounded-12px py-10px overflow-x-hidden">
                      <div class="px-10px mb-10px">
                        <div class="w-full border-1 bg-black border-1 border-color8B/30
                             rounded-12px h-40px 2xl:h-2rem">
                          <input class="bg-transparent h-full w-full px-0.5rem"
                                 type="text" placeholder="Enter a contract address">
                        </div>
                      </div>
                      <div v-for="i of 4" :key="i"
                           class="h-full w-full flex items-center cursor-pointer border-b-1 border-color8B/10 py-3 px-10px
                           overflow-x-hidden hover:bg-black/30">
                        <img class="h-34px mr-15px" src="~@/assets/icon-eth-white.svg" alt="">
                        <div class="flex-1 flex flex-col text-color8B overflow-x-hidden">
                          <span class="text-15px">ETH</span>
                          <span class="text-12px whitespace-nowrap overflow-hidden overflow-ellipsis">
                            0xxxxxxxxxxxxxx
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
          <div>Total amount (ETH)</div>
          <div class="mt-0.6rem text-24px 2xl:text-1.2rem">100</div>
        </div>
        <div class="mt-1.8rem flex justify-between text-15px">
          <button class="h-40px 2xl:h-2rem rounded-full px-1.5rem border-1 border-white"
                  @click="currentStep=1">Preview</button>
          <button class="h-40px 2xl:h-2rem rounded-full px-1.5rem gradient-btn text-15px"
                  @click="onSubmit">Submit</button>
        </div>
      </div>
    </div>
    <div v-else class="mt-1.5rem">
      <div class="flex justify-center items-center mb-1rem">
        <img class="w-20px h-20px 2xl:w-1rem 2xl:h-1rem"
             src="~@/assets/icon-success-green.svg" alt="">
        <span class="text-greenColor text-15px font-500 ml-10px">Create Curation Success!</span>
      </div>
      <div v-loading="loading"
           class="container mx-auto max-w-600px xl:max-w-30rem bg-blockBg rounded-20px px-2rem sm:px-4.5rem py-2rem mb-2rem">
        <div class="text-left font-600 text-15px 2xl:text-0.75rem mb-6px">Tweet and start curation</div>
        <div class="bg-black/40 rounded-1rem h-min-10rem p-1rem relative">
          <div class="text-left break-all text-14px leading-22px 2xl:text-0.8rem 2xl:leading-1.2rem">
            <span class="text-text8F">{Enter curation twitter content here}more details3</span>
            <span class="text-primaryColor"> => https://wh3.io/1t2g3f4y#iweb</span>
          </div>
        </div>
        <div class="italic text-12px text-left mt-6px leading-15px">
          tips: Twitter content must include the #iweb3 hashtag and the curation short URL.
        </div>
        <div class="mt-1.5rem">
          <button class="flex items-center justify-center rounded-full gradient-btn mr-0 ml-auto
                  text-12px 2xl:text-0.9rem h-40px 2xl:h-2.2rem px-1rem"
                  @click="onPost">
            <img class="w-1rem h-1rem mr-0.4rem"
                 src="~@/assets/icon-twitter-white.svg" alt=""/>
            <span class="text-text8F">{{$t('postView.goTweet')}}</span>
          </button>
        </div>
      </div>
    </div>
    <van-popup class="c-tip-drawer 2xl:w-2/5"
               v-model:show="modalVisible"
               :position="position">
      <div class="modal-bg w-full md:max-w-560px 2xl:max-w-28rem
      max-h-80vh 2xl:max-h-28rem overflow-auto flex flex-col
      rounded-t-1.5rem md:rounded-b-1.5rem pt-1rem md:py-2rem">
        <div v-if="position === 'bottom'"
             @click="modalVisible=false"
             class="w-6rem h-8px bg-color73 rounded-full mx-auto mb-1rem"></div>
        <div class="flex-1 overflow-auto px-1.5rem no-scroll-bar">
          <component :is="modalComponent"
                     @confirmApprove="onApprove"
                     @confirmComplete="onComplete"
                     @close="modalVisible=false"></component>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Steps from "@/components/Steps";
import SendTokenTip from "@/components/SendTokenTip";
import TwitterCompleteTip from "@/components/TwitterCompleteTip";
import {markRaw, ref} from "vue";
import { newCuration, updateCurationCreateStatus } from '@/api/api'
import { mapGetters } from 'vuex'
import { notify } from "@/utils/notify";

export default {
  name: "CreateCuration",
  components: {Steps, SendTokenTip, TwitterCompleteTip},
  data() {
    return {
      position: document.body.clientWidth < 768?'bottom':'center',
      currentStep: 1,
      connectLoading: false,
      loading: false,
      form: {
        title: '',
        endTime: '',
        isLimit: false,
        description: '',
        token: ''
      },
      modalVisible: false,
      modalComponent: markRaw(SendTokenTip),
      popperWidth: 200
    }
  },
  computed: {
    ...mapGetters('curation', ['getDraft'])
  },
  methods: {
    disabledDate(time) {
      return time.getTime() + 86400000 < Date.now() || time.getTime() > Date.now() + 86400000*7
    },
    checkCreateData() {
      if (!this.form.title || !this.form.endTime || !this.form.description) {
        notify({message: this.$t('tips.missingInput'), duration: 5000, type: 'error'})
        return false
      }
      if (this.form.title.length + this.form.description.length > 240) {
        notify({message: this.$t('tips.textLengthOut'), duration: 5000, type: 'error'})
        return false
      }
      return true
    },
    onNext() {
      console.log(523, this.form);
      console.log(66, new Date(this.form.endTime).getTime());
      if (!this.checkCrateData()) {
        return;
      }
      this.$store.commit('curation/saveDraft', this.form);
      this.currentStep = 2
      this.$nextTick(() => {
        this.popperWidth = this.$refs.tokenPopper.clientWidth
      })
    },
    onSubmit() {
      this.modalVisible = markRaw(SendTokenTip)
      this.modalVisible = true
    },
    onApprove() {
      this.modalVisible = false
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.currentStep = 3
      }, 3000)
    },
    onPost() {
      this.modalComponent = markRaw(TwitterCompleteTip)
      this.modalVisible =true
    },
    onComplete() {
      this.modalVisible = false
      this.loading = true
      setTimeout(() => {
        this.$router.replace('/curations')
      }, 3000)
    }
  },
  mounted () {
    if (this.getDraft) {
      this.form = this.getDraft
    }
  },
}
</script>

<style scoped>

</style>
