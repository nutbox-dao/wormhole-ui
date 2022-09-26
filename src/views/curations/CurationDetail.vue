<template>
  <div>
    <div class="md:border-b-1 border-dividerColor mb-1rem">
      <div class="relative container mx-auto max-w-50rem
                  md:px-1rem px-15px flex items-center
                  justify-between h-2.8rem">
        <div class="c-text-black text-1.5rem md:text-1rem mx-1.9rem">{{$t('curation.curationDetail')}}</div>
        <el-popover :width="270" trigger="click" popper-class="c-popper" ref="copyUrlPopper">
          <template #reference>
            <button class="w-24px h-24px icon-share"></button>
          </template>
          <template #default>
            <div class="gradient-border border-1 gradient-border-color3 rounded-8px
                        flex items-center justify-center py-14px cursor-pointer"
                 @click="$refs.copyUrlPopper.hide(), onCopy('https://test.wormhole3.io/#/curation-detail/' + detailCuration.curationId)">
              <img class="w-20px h-20px 2xl:w-1rem 2xl:h-1rem mr-10px"
                   src="~@/assets/icon-copy.svg" alt="">
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
        <div class="flex ">
          <div>
            {{$t('curationsView.t1')}}
          </div>
          <button class="mx-3 underline" @click="$router.push('/signup')">{{$t('common.registerNow')}}</button>
        </div>
      </template>
    </el-alert>
    <!-- title -->
    <div class="container mx-auto max-w-50rem pb-2rem px-15px mt-1rem">
      <div class="grid grid-cols-3 gap-1.5rem">
        <div v-loading="loading1" class="col-span-3 xl:col-span-2 bg-blockBg rounded-15px py-1.5rem text-left">
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
              <div class="flex md:flex-col md:justify-center md:items-start" @click="gotoUserPage">
                <a class="c-text-black text-16px 2xl:text-0.8rem leading-24px 2xl:leading-1rem mr-0.8rem">{{detailCuration && detailCuration.twitterName}}</a>
                <span class="text-15px 2xl:text-0.75rem text-color8B leading-22px 2xl:leading-1.1rem">@{{detailCuration && detailCuration.twitterUsername}}</span>
              </div>
            </div>
            <div class="ml-3.4rem md:ml-80px mt-1.2rem">
              <div class="font-600 text-1rem mb-0.6rem">{{$t('curation.description')}}</div>
              <div class="text-color8B font-400 text-15px leading-24px 2xl:text-0.75rem 2xl:leading-1rem whitespace-pre-line"
                   v-html="formatEmojiText(content)">
              </div>
            </div>
          </div>
          <!-- <div class="border-t-1 border-color8B/30 mt-3rem px-1.25rem">
            <div class="gradient-border border-1 rounded-12px mt-1rem overflow-hidden expand-box
                        flex flex-col"
                 :class="isExpand?'active max-h-300px':'max-h-50px'">
              <div class="flex items-center justify-center relative cursor-pointer h-50px min-h-50px"
                   @click="isExpand=!isExpand">
                <img class="w-26px 2xl:w-1.3rem mr-1rem"
                     src="~@/assets/icon-twitter-white.svg" alt="">
                <span class="gradient-text gradient-text-purple-white font-600 text-15px 2xl:text-0.75rem">
                  Quote Tweet on Twitter
                </span>
                <img class="absolute right-1rem"
                     src="~@/assets/icon-select-white.svg" alt="">
              </div>
              <div class="flex-1 bg-black border-t-1 border-color8B/30 overflow-auto">
                <div class="min-h-10rem">
                </div>
              </div>
            </div>
          </div> -->
        </div>
        <!-- token -->
        <div class="col-span-3 xl:col-span-1" v-if="detailCuration">
          <div v-loading="loading1" class="gradient-bg gradient-bg-opacity-80 rounded-15px py-0.5rem px-1.5rem min-h-4rem">
            <div class="flex justify-between items-center">
              <span>{{$t('curation.reward')}}</span>
              <div class="flex items-center">
                <!-- <span class="text-primaryColor font-500">PosW</span>
                <img class="w-20px 2xl:w-1rem ml-0.5rem" src="~@/assets/icon-question-purple.svg" alt=""> -->
              </div>
            </div>
            <div class="w-full h-1px bg-white mt-0.8rem mb-1.6rem"></div>
            <div class="flex justify-between items-center mb-2rem">
              <span>Token</span>
              <div class="flex items-center">
                <img v-if="tokenIcon" class="w-1.5rem mr-0.6rem rounded-full" :src="tokenIcon" alt="">
                <img v-else class="w-1.5rem mr-0.6rem rounded-full" src="~@/assets/icon-eth-white.svg" alt="">
                <span class="font-700 gradient-text gradient-text-purple-white text-1.4rem">{{(detailCuration && detailCuration.amount) ? (detailCuration.amount.toString() / (10 ** detailCuration.decimals)) : '0'}} {{detailCuration && detailCuration.tokenSymbol}}</span>
              </div>
            </div>
            <div class="text-primaryColor text-12px 2xl:text-0.6rem">{{$t('curation.rewardOnChain')}}</div>
          </div>
          <!-- curators list -->
          <div v-loading="loading2" class="border-1 border-color8B/30 rounded-15px p-2 mt-1rem text-left min-h-8rem">
            <div class="text-primaryColor mb-10px">{{$t('curation.curators')}}  {{detailCuration && detailCuration.totalCount}}</div>
            <div v-if="participant.length===0" class="flex flex-col justify-center items-center py-1rem">
              <img class="w-6rem" src="~@/assets/no-data.svg" alt="">
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
            <div v-if="participant.length > 10" class="text-right mt-0.6rem cursor-pointer text-12px 2xl:text-0.6rem"
                 @click="showSubmissions=true">
              {{$t('curation.viewAll')}}  >
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
               custom-class="c-dialog-fullscreen c-dialog-no-shadow bg-primaryBg">
      <Submissions :records="participant" @close="showSubmissions=false"></Submissions>
    </el-dialog>

  </div>
</template>

<script>
import TweetAttendTip from "@/components/TweetAttendTip";
import { mapState, mapGetters } from "vuex";
import { getCurationById, getCurationParticipant, getWheatherUserJoinedCuration } from "@/api/api";
import { getDateString, parseTimestamp, formatAmount } from '@/utils/helper'
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import { ERC20List } from "@/config";
import {onCopy} from "@/utils/tool";
import Submissions from "@/views/curations/Submissions";
import { getCurationInfo, claimReward } from '@/utils/curation'
import {formatEmojiText} from "@/utils/tool";

export default {
  name: "CurationDetail",
  components: {TweetAttendTip, Submissions},
  data() {
    return {
      position: document.body.clientWidth < 768?'bottom':'center',
      modalVisible: false,
      showSubmissions: false,
      isExpand: false,
      loading1: false,
      loading2: false,
      loading: false,
      participant: []
    }
  },
  computed: {
    ...mapState('curation', ['detailCuration']),
    ...mapGetters(['getAccountInfo']),
    title() {
      if (this.detailCuration && this.detailCuration.content) {
        return this.detailCuration.content.split('\n')[0]
      }else{
        return '---'
      }
    },
    content() {
      if (this.detailCuration && this.detailCuration.content) {
        return this.detailCuration.content.replace(this.title, '').trim()
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
  },
  mounted () {
    const id = this.$route.params.id;
    const account = this.getAccountInfo

    if (this.detailCuration && this.detailCuration.curationId === id) {
      getWheatherUserJoinedCuration(this.detailCuration.curationId, account?.twitterId).then(res=> {
        this.detailCuration.joined = res
      })

      getCurationInfo(this.detailCuration.curationId).then(res => {
        console.log(62, res);
      })
    }else {
      this.$store.commit('curation/saveDetailCuration', null)
      this.loading1 = true
      getCurationById(id, account?.twitterId).then(res => {
        if (res) {
          this.$store.commit('curation/saveDetailCuration', res)
        }
      }).finally(() => {
        this.loading1 = false
      })
    }

    this.loading2 = true
      getCurationParticipant(id).then(res => {
        this.participant = res ?? []
      }).catch(console.log).finally(() => {
        this.loading2 = false
      })
  },
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
</style>
