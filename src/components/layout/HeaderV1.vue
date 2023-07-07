<template>
  <div class="py-20px border-b-1 border-headerBorder light:border-headerBorderLight
                  h-70px 2xl:h-88px flex items-center c-page-header">
    <div class="container max-w-50rem w-full mx-auto flex justify-between items-center px-15px relative">
      <router-link to="/">
        <img class="h-1.7rem black-filter" src="~@/assets/logo.svg" alt="">
      </router-link>
      <div class="flex-1 flex justify-end items-center relative">
        <div class="relative flex-1 flex justify-end">
          <div class="search-bar relative bg-transparent flex items-center rounded-full mr-0.4rem">
            <input type="text" :placeholder="$t('search')"
                   v-model="searchText"
                   @keypress="onSearch"
                   class="bg-transparent relative px-10px py-4px rounded-full text-12px" >
            <button v-if="searchText.trim().length>0"
                    @click="searchText='', $emit('clearSearchList')"
                    class="absolute right-5px bg-color8B/30 p-2px rounded-full">
              <img class="w-12px h-12px" src="~@/assets/icon-close-white.svg" alt="">
            </button>
          </div>
          <el-collapse-transition>
            <div v-show="showSearchList"
                 class="z-999 fixed right-15px left-15px top-55px
                              xs:absolute xs:right-0 xs:left-auto xs:top-45px">
              <div class="w-300px mx-auto text-14px">
                <div class="bg-blockBg light:bg-white border-1 border-color8B/30
                                  light:border-colorF4 rounded-12px p-12px shadow-lg
                                  max-h-500px overflow-auto no-scroll-bar">
                  <div v-show="searchList.length === 0">
                    {{ $t('noRelatedUser') }}
                  </div>
                  <div v-for="(item,index) of searchList" :key="index"
                       @click="$emit('gotoUser', item)"
                       class="border-b-1 border-color8B/30 light:border-colorF4
                                    flex items-center py-6px cursor-pointer">
                    <img class="w-40px h-40px rounded-full mr-10px"
                         :src="item.profileImg" alt=""
                         @error="replaceEmptyImg">
                    <div class="text-left text-color8B light:text-color7D">
                      <div class="mb-5px font-bold">{{item.twitterName}} @{{item.twitterUsername}}</div>
                      <div class="text-12px">Twitter Reputation:{{item.reputation}}</div>
                    </div>
                  </div>
                  <!--                      tag-->
                  <div class="flex flex-wrap items-center gap-5px">
                    <div class="border-1 border-color62 py-3px px-6px rounded-6px mt-10px
                                    whitespace-nowrap cursor-pointer light:text-color46 w-max flex"
                         :class="selectedTag === tag?'bg-color62 text-white':'light:text-color46 bg-color62/20'"
                         v-for="tag of seachTagList" :key="tag"
                         @click.stop="$emit('setSelectTag', selectedTag)">
                      #{{ tag.replace('#', '') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-collapse-transition>
        </div>
        <div class="flex justify-end items-center relative" v-if="!getAccountInfo">
          <button @click="$emit('login')"
                  class="flex justify-center items-center mr-1 min-w-70px px-13px bg-color62
                         text-white c-text-black text-0.8rem h-25px 2xl:h-1.4rem rounded-full">
            {{$t('signIn')}}
          </button>
        </div>
        <template v-else>
          <button class="flex items-center justify-center bg-ny-btn-gradient hidden sm:flex
                       h-30px px-15px rounded-full mr-0.8rem
                       font-bold text-12px leading-18px 2xl:text-0.7rem 2xl:leading-0.9rem"
                  @click="$emit('createCuration')">
            <span class="whitespace-nowrap text-white">{{ $t('curation.create') }}</span>
            <img class="ml-5px w-14px min-w-14px h-14px"
                 src="~@/assets/icon-add-white.svg" alt="">
          </button>
          <router-link :to="`/profile/@${getAccountInfo.twitterUsername}`"
                       class="w-35px h-35px xl:h-40px xl:w-40px mr-0.4rem relative p-2px">
            <img class="w-full h-full rounded-full"
                 :src="profileImg" @error="replaceEmptyImg" alt="">
            <el-progress class="absolute -top-1px -left-1px" type="circle"
                         :width="width>1280?42:37"
                         :color="isDark?'#8208e9':'#02f900'"
                         :show-text="false"
                         :stroke-width="3"
                         :percentage="rc/MAX_RC * 100">
            </el-progress>
            <el-progress class="absolute -top-2px -left-2px" type="circle"
                         :width="width>1280?44:39"
                         :color="isDark?'#00fa97':'#8644ef'"
                         :show-text="false"
                         :stroke-width="2"
                         :percentage="vp/MAX_VP * 100">
            </el-progress>
          </router-link>
          <router-link :to="`/wallet/@${getAccountInfo.twitterUsername}/wallet`">
            <i class="w-20px h-20px xl:h-1.4rem xl:w-1.4rem mr-0.4rem icon-wallet black-filter"></i>
          </router-link>
        </template>
        <div class="relative">
          <button class="bg-transparent h-2rem w-1.6rem flex items-center"
                  @click.stop="showMenu=!showMenu">
            <img class="w-17px h-17px xl:h-1.2rem xl:w-1.2rem black-filter" src="~@/assets/icon-menu-toggle.svg" alt="">
          </button>
          <div class="menu-box w-150px 2xl:w-10rem z-9999" @click.stop
               :class="showMenu?'active shadow-popper-tip':''">
            <div class="px-12px py-8px border-1 border-listBgBorder
                            bg-blockBg light:bg-white light:border-0 light:shadow-popper-tip
                            rounded-12px w-full h-full
                            flex flex-col justify-between
                            font-400 text-12px  xl:text-0.75rem">
              <!--                  <router-link :to="'/account-info/'+accountInfo.twitterUsername" v-if="accountInfo && accountInfo.ethAddress" @click.stop="showMenu=false"-->
              <!--                               class="flex-1 flex justify-center items-center cursor-pointer hover:text-primaryColor">Web3 ID</router-link>-->
              <router-link to="/faq" @click.stop="showMenu=false"
                           class="h-46px min-h-46px flex-1 flex justify-between items-center cursor-pointer hover:text-primaryColor">
                <span>{{$t('faq')}}</span>
                <i class="w-14px min-w-14px h-14px icon-faq"></i>
              </router-link>
              <router-link to="/userguide" @click.stop="showMenu=false"
                           class="h-46px min-h-46px flex-1 flex justify-between items-center cursor-pointer hover:text-primaryColor">
                <span>{{$t('userguide')}}</span>
                <i class="w-14px min-w-14px h-14px icon-userguide"></i>
              </router-link>

              <div @click="showMenu=false,onCopy('https://alpha.wormhole3.io/square?referee=' + getAccountInfo.twitterId)"
                   v-if="getAccountInfo && getAccountInfo.twitterUsername"
                   class="h-46px min-h-46px flex-1 flex justify-between items-center cursor-pointer hover:text-primaryColor">
                <span>{{$t('ref.referre')}}</span>
                <i class="w-14px min-w-14px h-14px icon-referral"></i>
              </div>
              <div class="h-46px min-h-46px flex-1 flex justify-between items-center cursor-pointer hover:text-primaryColor"
                   @click="showMenu=false,$emit('changeTheme')">
                <span>{{isDark?'Light Mode':'Dark Mode'}}</span>
                <i v-if="isDark" class="w-16px min-w-16px h-16px icon-theme-light"></i>
                <i v-else class="w-14px min-w-14px h-14px icon-theme-dark"></i>
              </div>
              <button class="h-46px min-h-46px flex-1 flex justify-between items-center cursor-pointer hover:text-primaryColor"
                      @click="showMenu=false,$emit('onSelectLang')">
                <span>CN / EN</span>
                <i class="w-14px min-w-14px h-14px icon-exchange"></i>
              </button>
              <div v-if="getAccountInfo && getAccountInfo.twitterUsername"
                   class="h-46px min-h-46px flex-1 flex justify-between items-center cursor-pointer hover:text-primaryColor"
                   @click="showMenu=false,$emit('signout')">
                <span>{{$t('logout')}}</span>
                <i class="w-14px min-w-14px h-14px icon-logout"></i>
              </div>
              <div class="flex items-center">
                <button class="h-24px w-24px mr-20px" @click="showMenu=false,$emit('gotoDC')">
                  <img class="w-14px min-w-14px h-14px" src="~@/assets/icon-discord.svg" alt="">
                </button>
                <button class="h-24px w-24px" @click="showMenu=false,$emit('gotoTwitter')">
                  <img class="w-14px min-w-14px h-14px" src="~@/assets/icon-twitter.svg" alt="">
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {searchTags, searchUsers, searchCommunityByName} from "@/api/api";
import {onCopy} from "@/utils/tool";
import i18n from "@/lang";
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import { MAX_VP, MAX_RC } from '@/config';
import {useWindowSize} from "@vant/use";

export default {
  name: "HeaderV1",
  props: {
    showSearchList: {
      type: Boolean,
      default: false
    },
    getAccountInfo: {
      type: Object,
      default: () => {return {}}
    },
    isDark: {
      type: Boolean,
      default: true
    },
    profileImg: {
      type: String,
      default: ''
    },
    selectedTag: {
      type: String,
      default: ''
    },
    rc: {
      type: Number,
      default: 0
    },
    vp: {
      type: Number,
      default: 0
    }
  },
  setup() {
    const {width} = useWindowSize()
    return {
      width
    }
  },
  data() {
    return {
      showMenu: false,
      searchText: '',
      searchList: [],
      seachTagList: [],
      searchComList: [], // id, communityId, communityName,icon,banner
      MAX_RC,
      MAX_VP
    }
  },
  methods: {
    onCopy,
    replaceEmptyImg(e) {
      e.target.src = emptyAvatar;
    },
    async onSearch(e) {
      if(this.searchText.trim().length > 0 && e.keyCode === 13) {
        const [users, communities, tags] = await Promise.all([searchUsers(this.searchText), searchCommunityByName(this.searchText), searchTags(this.searchText)])
        this.$emit('showSearchList')
        this.searchList = []
        this.seachTagList = []
        this.searchComList = []
        if (users && users.length > 0) {
          this.searchList = users
        }
        if (tags && tags.length > 0) {
          this.seachTagList = tags
        }
        if (communities && communities.length > 0) {
          this.searchComList = communities
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
