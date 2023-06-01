<template>
  <div class="h-70px flex justify-between items-center px-15px xl:px-1rem 2xl:px-2rem
              border-b-1 border-headerBorder light:border-headerBorderLight">
    <router-link to="/">
      <img class="h-1.7rem black-filter" src="~@/assets/logo.svg" alt="">
    </router-link>
    <div class="relative flex-1 flex justify-end" ref="searchRef">
      <div class="search-bar relative bg-transparent flex items-center rounded-full mr-0.4rem">
        <input type="text" :placeholder="$t('search')"
               v-model="searchText"
               @keypress="onSearch"
               class="bg-transparent relative px-10px py-4px rounded-full text-12px" >
        <button v-if="searchText.trim().length>0"
                @click="clearSearchList"
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
              <div class="c-text-black text-left text-color8B light:text-color7D my-10px text-16px">{{ $t('user') }}</div>
              <div v-for="(item,index) of searchList.slice(0, showSearchUserNum)" :key="item.twitterId"
                   @click="$emit('gotoUser', item);showSearchList=false"
                   class="border-b-1 border-color8B/30 light:border-colorF4
                                    flex items-center py-6px cursor-pointer">
                <img class="w-40px h-40px rounded-full mr-10px"
                     :src="item.profileImg" alt=""
                     @error="replaceEmptyImg">
                <div class="text-left text-white light:text-color7D">
                  <div class="mb-5px font-bold">{{item.twitterName}} @{{item.twitterUsername}}</div>
                  <div class="text-12px">Twitter Reputation:{{item.reputation}}</div>
                </div>
              </div>
              <div class="text-center my-8px">
                <button v-if="!userListIsFinished" class="text-color66"
                        @click.stop="viewMoreUser">{{$t('common.viewMore')}}</button>
              </div>
              <div class="c-text-black text-left text-color8B light:text-color7D mt-20px mb-10px text-16px">{{ $t('community.community') }}</div>

              <div v-for="(item,index) of searchCommunityList.slice(0, showSearchCommunityNum)" :key="item.communityId"
                   @click.stop="$emit('gotoCommunity', item);showSearchList=false"
                   class="border-b-1 border-color8B/30 light:border-colorF4
                                    flex items-center py-6px cursor-pointer">
                <img class="w-40px h-40px rounded-full mr-10px"
                     :src="item.icon" alt=""
                     @error="replaceEmptyImg">
                <div class="text-left text-color8B light:text-color7D">
                  <div class="mb-5px font-bold">{{item.communityName}}</div>
                </div>
              </div>
              <div class="text-center my-8px">
                <button v-if="!communityListIsFinished" class="text-color66"
                        @click.stop="viewMoreCommunity">{{$t('common.viewMore')}}</button>
              </div>
              <!--                      tag-->
              <div class="c-text-black text-left text-color8B light:text-color7D mt-20px mb-10px text-16px">{{ $t('topicsView.topics') }}</div>
              <div class="flex flex-wrap items-center gap-5px">
                <button class="border-1 border-color62 w-max text-12px
                               h-24px px-6px rounded-full whitespace-nowrap"
                     :class="selectedTag === tag?'bg-color62 light:bg-color62 text-white':
                     'bg-blockBg text-white light:text-color62 light:bg-colorF7'"
                     v-for="tag of seachTagList.slice(0, showSearchTagNum)" :key="tag"
                     @click.stop="$emit('setSelectTag', selectedTag);showSearchList=false">
                  #{{ tag.replace('#', '') }}
                </button>
              </div>
              <div class="text-center my-8px">
                <button v-if="!tagListIsFinished" class="text-color66"
                        @click.stop="viewMoreTag">{{$t('common.viewMore')}}</button>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
import {searchTags, searchUsers, searchCommunityByName} from "@/api/api";
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import {mapState} from "vuex";
import {useClickAway} from "@vant/use";
import {ref} from "vue";

export default {
  name: "HeaderWeb",
  setup() {
    const searchRef = ref();
    const showSearchList = ref(false);
    useClickAway(searchRef, () => {
      showSearchList.value = false
    });
    return {
      searchRef,
      showSearchList
    };
  },
  computed: {
    ...mapState('postsModule', ['selectedTag']),
  },
  data() {
    return {
      searchText: '',
      searchList: [],
      seachTagList: [],
      searchCommunityList: [], //id,communityId, communityName, icon, banner
      userListIsFinished: false,
      showSearchUserNum: 5,
      communityListIsFinished: false,
      showSearchCommunityNum: 5,
      tagListIsFinished: false,
      showSearchTagNum: 15
    }
  },
  methods: {
    replaceEmptyImg(e) {
      e.target.src = emptyAvatar;
    },
    async onSearch(e) {
      if(this.searchText.trim().length > 0 && e.keyCode === 13) {
        const [users, communities, tags] = await Promise.all([searchUsers(this.searchText), searchCommunityByName(this.searchText), searchTags(this.searchText)])
        this.showSearchList = true
        this.searchList = []
        this.seachTagList = []
        this.searchCommunityList = []
        if (users && users.length > 0) {
          this.searchList = users
          this.userListIsFinished = this.searchList.length<=5
        }
        if (tags && tags.length > 0) {
          this.seachTagList = tags
          this.tagListIsFinished = this.seachTagList.length<=15
        }
        if (communities && communities.length > 0) {
          this.searchCommunityList = communities
          this.communityListIsFinished = this.searchCommunityList.length<=5
        }
      }
    },
    clearSearchList() {
      this.searchText = ''
      this.searchList = []
      this.seachTagList = []
      this.searchCommunityList = []
    },
    viewMoreUser() {
      if(this.userListIsFinished) return
      this.showSearchUserNum += 5
      this.userListIsFinished = (this.showSearchUserNum>=this.searchList.length)
    },
    viewMoreCommunity() {
      if(this.communityListIsFinished) return
      this.showSearchCommunityNum += 5
      this.communityListIsFinished = (this.showSearchCommunityNum>=this.searchCommunityList.length)
    },
    viewMoreTag() {
      if(this.tagListIsFinished) return
      this.showSearchTagNum += 15
      this.tagListIsFinished = (this.showSearchTagNum>=this.seachTagList.length)
    }
  }
}
</script>

<style scoped>

</style>
