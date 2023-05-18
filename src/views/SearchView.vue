<template>
  <div class="flex flex-col h-full overflow-hidden">
    <div class="pt-22px">
      <div class="h-48px flex justify-between items-center px-15px
                border-b-1 border-color8B/30 light:border-colorD6">
        <button @click="$emit('close')">
          <i class="icon-back w-20px h-20px"></i>
        </button>
        <div class="flex-1 flex items-center rounded-full mx-10px
                  border-2 border-color62 h-34px">
          <input type="text"
                 ref="searchInputRef"
                 :placeholder="$t('search')"
                 v-model="searchText"
                 @keypress="onSearch"
                 class="search-input bg-transparent relative px-10px py-4px w-full h-full rounded-full text-12px" >
          <button v-if="searchText.trim().length>0"
                  @click="clearSearchList"
                  class="bg-color8B/30 p-2px rounded-full mr-8px">
            <img class="w-12px h-12px" src="~@/assets/icon-close-white.svg" alt="">
          </button>
        </div>
        <button @click="$emit('close')">{{$t('common.cancel')}}</button>
      </div>
    </div>
    <div v-if="!searched" class="flex-1 overflow-auto p-15px"></div>
    <div v-else class="flex-1 overflow-auto p-15px">
      <div v-if="searchList.length === 0"
           class="text-center py-2rem text-color8B light:text-color7D">
        {{ $t('noRelatedUser') }}
      </div>
      <template v-else>
        <div class="c-text-black text-left text-color8B light:text-color7D my-10px text-16px">{{ $t('user') }}</div>
        <div v-for="(item,index) of searchList.slice(0, showSearchUserNum)" :key="item.twitterId"
             @click="gotoUser(item)"
             class="border-b-1 border-color8B/30 light:border-colorF4
                                    flex items-center py-6px cursor-pointer">
          <img class="w-40px h-40px rounded-full mr-10px"
               :src="item.profileImg" alt=""
               @error="replaceEmptyImg">
          <div class="text-left">
            <div class="mb-5px font-bold">{{item.twitterName}} @{{item.twitterUsername}}</div>
            <div class="text-12px text-color8B light:text-color7D">Twitter Reputation:{{item.reputation}}</div>
          </div>
        </div>
        <div class="text-center my-8px">
          <button v-if="!userListIsFinished" class="text-color62"
                  @click="viewMoreUser">{{$t('common.viewMore')}}</button>
        </div>
      </template>
      <!--   community   -->
      <div class="c-text-black text-left text-color8B light:text-color7D mt-20px mb-10px text-16px">
        {{ $t('community.community') }}
      </div>
      <template v-if="searchCommunityList.length>0">
        <div v-for="(item,index) of searchCommunityList.slice(0, showSearchCommunityNum)" :key="item.communityId"
             @click="gotoCommunity(item)"
             class="border-b-1 border-color8B/30 light:border-colorF4
                                    flex items-center py-6px cursor-pointer">
          <img class="w-40px h-40px rounded-full mr-10px"
               :src="item.icon" alt=""
               @error="replaceEmptyImg">
          <div class="text-left">
            <div class="mb-5px font-bold">{{item.communityName}}</div>
          </div>
        </div>
        <div class="text-center my-8px">
          <button v-if="!communityListIsFinished" class="text-color62"
                  @click="viewMoreCommunity">{{$t('common.viewMore')}}</button>
        </div>
      </template>
      <div v-else
           class="text-center py-1rem text-color8B light:text-color7D">
        {{ $t('noRelatedCommunities') }}
      </div>
      <!--                      tag-->
      <template v-if="seachTagList.length>0">
        <div class="c-text-black text-left text-color8B light:text-color7D mt-15px mb-10px text-16px">{{ $t('topicsView.topics') }}</div>
        <div class="flex flex-wrap items-center gap-5px">
          <div class="border-1 border-color62 light:border-transparent w-max flex
                      py-3px px-6px rounded-6px mt-10px whitespace-nowrap cursor-pointer"
               :class="selectedTag === tag?'bg-color62 light:bg-color62 text-white':'bg-transparent light:bg-colorF7'"
               v-for="tag of seachTagList.slice(0, showSearchTagNum)" :key="tag"
               @click.stop="setSelectTag(tag)">
            #{{ tag.replace('#', '') }}
          </div>
        </div>
        <div class="text-center my-8px">
          <button v-if="!tagListIsFinished" class="text-color62"
                  @click="viewMoreTag">{{$t('common.viewMore')}}</button>
        </div>
      </template>
      <div v-else
           class="text-center py-2rem text-color8B light:text-color7D">
        {{ $t('noRelatedTags') }}
      </div>
    </div>
  </div>
</template>

<script>
import {searchTags, searchUsers, searchCommunityByName} from "@/api/api";
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import {mapState} from "vuex";

export default {
  name: "SearchView",
  computed: {
    ...mapState('postsModule', ['selectedTag']),
  },
  data() {
    return {
      searchText: '',
      searchList: [],
      seachTagList: [],
      searchCommunityList: [],
      searched: false,
      userListIsFinished: false,
      showSearchUserNum: 5,
      communityListIsFinished: false,
      showSearchCommunityNum: 5,
      tagListIsFinished: false,
      showSearchTagNum: 15
    }
  },
  mounted() {
    setTimeout(() => {
      this.$refs.searchInputRef.focus()
    }, 500)
  },
  methods: {
    replaceEmptyImg(e) {
      e.target.src = emptyAvatar;
    },
    async onSearch(e) {
      if(this.searchText.trim().length > 0 && e.keyCode === 13) {
        const [users, communities, tags] = await Promise.all([searchUsers(this.searchText), searchCommunityByName(this.searchText), searchTags(this.searchText)])

        this.searchList = []
        this.seachTagList = []
        this.searchCommunityList = []
        this.searched = true
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
      this.searched = false
      this.searchText = ''
      this.searchList = []
      this.seachTagList = []
      this.searchCommunityList = []
    },
    setSelectTag(tag) {
      this.$router.push('/')
      this.$store.commit('postsModule/saveSelectedTag', tag)
      this.$emit('close')
    },
    gotoUser(user) {
      this.$router.push('/search-user/@' + user.twitterUsername)
    },
    gotoCommunity(community) {
      this.$router.push('/community-detail/' + community.communityId)
    },
    viewMoreUser() {
      if(this.userListIsFinished) return
      this.showSearchUserNum += 5
      this.userListIsFinished = (this.showSearchUserNum>this.searchList.length)
    },
    viewMoreCommunity() {
      if(this.communityListIsFinished) return
      this.showSearchCommunityNum += 5
      this.communityListIsFinished = (this.showSearchCommunityNum>this.searchCommunityList.length)
    },
    viewMoreTag() {
      if(this.tagListIsFinished) return
      this.showSearchTagNum += 15
      this.tagListIsFinished = (this.showSearchTagNum>this.seachTagList.length)
    }
  }
}
</script>

<style scoped>

</style>
