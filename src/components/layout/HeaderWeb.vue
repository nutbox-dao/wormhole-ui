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
              <div v-for="(item,index) of searchList" :key="item.twitterId"
                   @click="$emit('gotoUser', item);showSearchList=false"
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
              <div class="c-text-black text-left text-color8B light:text-color7D my-10px text-16px">{{ $t('community.community') }}</div>
              <div v-for="(item,index) of searchCommunityList" :key="item.communityId"
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
              <!--                      tag-->
              <div class="c-text-black text-left text-color8B light:text-color7D my-10px text-16px">{{ $t('topicsView.topics') }}</div>
              <div class="flex flex-wrap items-center gap-5px">
                <div class="border-1 border-color62 py-3px px-6px rounded-6px mt-10px
                                    whitespace-nowrap cursor-pointer light:text-color46 w-max flex"
                     :class="selectedTag === tag?'bg-color62 text-white':'light:text-color46 bg-color62/20'"
                     v-for="tag of seachTagList" :key="tag"
                     @click.stop="$emit('setSelectTag', selectedTag);showSearchList=false">
                  #{{ tag.replace('#', '') }}
                </div>
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
      searchCommunityList: [] //id,communityId, communityName, icon, banner
    }
  },
  methods: {
    replaceEmptyImg(e) {
      e.target.src = emptyAvatar;
    },
    async onSearch(e) {
      if(this.searchText.trim().length > 0 && e.keyCode === 13) {
        const [users, communities, tags] = await Promise.all([searchUsers(this.searchText), searchCommunityByName(this.searchText), searchTags(this.searchText)])
        console.log(53, users, communities);
        this.showSearchList = true
        this.searchList = []
        this.seachTagList = []
        this.searchCommunityList = []
        if (users && users.length > 0) {
          this.searchList = users
        }
        if (tags && tags.length > 0) {
          this.seachTagList = tags
        }
        if (communities && communities.length > 0) {
          this.searchCommunityList = communities
        }
      }
    },
    clearSearchList() {
      this.searchText = ''
      this.searchList = []
      this.seachTagList = []
        this.searchCommunityList = []
    },
  }
}
</script>

<style scoped>

</style>
