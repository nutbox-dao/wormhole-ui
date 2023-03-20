<template>
  <div class="text-14px xl:text-0.8rem px-15px pt-2rem">
    <div class="container mx-auto max-w-600px xl:max-w-30rem">
      <div class="text-left text-12px leading-18px xl:text-14px xl:leading-1rem
                  text-colorF1 bg-tip-gradient light:text-color62 light:bg-colorF1
                  px-16px py-10px rounded-8px my-11px xl:my-0.8rem">
          {{$t('curationsView.curationTip')}} 
          <a href="https://docs.google.com/forms/d/1dvhDTHkY1liA-zMgVM4i3gAloC8tJ8U6y4G6AkpQPDM/edit"
           target="_blank" 
           class="cursor-pointer text-buleColor text-14px border-b-1 border-listBgBorder border-colorE3">
            {{ $t('curationsView.howToGetcurator') }}
          </a>
      </div>
    </div>
    <div v-loading="loading"
         class="container mx-auto max-w-600px xl:max-w-30rem bg-blockBg light:bg-white rounded-20px
                px-20px sm:px-4.5rem py-24px mb-2rem">
      <div  class="text-left text-14px 2xl:text-0.7rem">
        <!-- preview tweet -->
        <div class="mt-0.6rem">
          <div class="mb-6px font-bold">{{$t('curation.relatedTweet')}}</div>
          <div v-if="linkIsVerified" class="overflow-hidden relative rounded-12px"
                :class="expandPreview?'':'max-h-134px'">
            <Blog :post="form.postData"
                  class="bg-blockBg light:bg-white rounded-13px border-1 border-listBgBorder light:border-colorE3">
              <template #bottom-btn-bar><div></div></template>
            </Blog>
            <button v-if="!expandPreview" @click.stop="expandPreview=!expandPreview"
                    class="absolute bg-view-more light:bg-view-more-light text-white bottom-0 left-0 w-full h-40px
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
        <!-- related link -->
        <div class="mt-5px relative">
          <div class="bg-color62/20 light:bg-colorF1 border-1 border-color62 pl-15px
                      rounded-8px h-44px 2xl:h-2rem flex items-center relative"
               :class="checkingTweetLink?'hover:border-color8B/30':''">
            <div class="w-full text-12px xl:text-0.7rem">
              <input class="bg-transparent h-full w-full"
                     :class="linkIsError?'text-redColor':'text-color62'"
                     v-model="form.link"
                     :disabled="checkingTweetLink || !haveCuratorNFT"
                     @input="linkIsError=false"
                     :placeholder="$t('curation.pasteLink')">
            </div>
            <button class="bg-color62 text-white h-20px xl:h-1rem px-5px rounded-4px min-w-50px disabled:opacity-50
                           mx-15px whitespace-nowrap flex justify-center items-center text-12px xl:text-0.6rem"
                    :disabled="!haveCuratorNFT || checkingTweetLink"
                    @click="checkLink">
              <span v-if="!checkingTweetLink">{{$t('curation.verify')}}</span>
              <c-spinner v-else class="w-1.5rem h-1.5rem"></c-spinner>
            </button>
          </div>
        </div>
        <!-- description -->
        <div class="mt-1.8rem">
          <div class="flex justify-between items-center">
            <div class="mb-6px font-bold">{{$t('curation.desc')}}</div>
            <span class="text-color8B light:text-color7D/50">{{form.description.length}}/180</span>
          </div>
          <div class="mb-6px text-color62 italic">
            {{ $t('curation.descriptionDesc') }}
          </div>
          <div class="relative border-1 bg-black/40 border-1 border-color8B/30
                      light:bg-white light:border-colorE3 hover:border-primaryColor
                      rounded-8px min-h-44px 2xl:min-h-2rem flex items-center">
            <el-input v-model="form.description"
                      :rows="4" :maxlength="180"
                      class="border-0 c-textarea rounded-8px overflow-hidden"
                      type="textarea"
                      :placeholder="$t('curation.createDescTip')"/>
          </div>
        </div>
        <div class="text-right mt-2rem">
          <button class="h-40px 2xl:h-2rem rounded-full px-1.5rem w-full gradient-btn"
                  :disabled="!haveCuratorNFT || !linkIsVerified"
                  @click="create">{{ haveCuratorNFT ? $t('curationsView.createCuration') : $t('postView.notCurator')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTweetById } from '@/utils/twitter'
import { mapGetters } from 'vuex'
import Blog from "@/components/Blog";
import { parseTweet } from '@/utils/twitter-tool'
import { getCuratorNFT } from '@/utils/asset'
import { notify } from '@/utils/notify';

export default {
  name: "CreateCuration",
  components: { Blog },
  data() {
    return {
      position: document.body.clientWidth < 768?'bottom':'center',
      connectLoading: false,
      loading: false,
      showDes: false,
      form: {
        description: '',
        link: '',
        postData: {}
      },
      linkIsVerified: false,
      linkIsError: false,
      wrongLinkDes: 'Invalid link',
      checkingTweetLink: false,
      TweetLinRex: 'https://twitter.com/[a-zA-Z0-9\_]+/status/([0-9]+)',
      haveCuratorNFT: false
    }
  },
  computed: {
    ...mapGetters(['getAccountInfo'])
  },
  methods: {
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
      if (link.length === 0) {
        return;
      }
      const match = link.match(this.TweetLinRex);
      if (!match) {
        this.wrongLinkDes = this.$t('curation.invalidLink');
        this.linkIsError = true
        return;
      }
      try{
        this.checkingTweetLink = true;
        const tweet = await getTweetById(match[1]);
        if (tweet.data) {
          this.form.tweetId = tweet.data.id
          this.form.postData = await parseTweet(tweet, false)
            if (tweet.data.conversation_id !== tweet.data.id) {
              this.wrongLinkDes = this.$t('curation.replyCanntCurate');
              this.linkIsError = true
              this.form.tweetId = '';
              this.form.postData = {};
              return;
            }
            if (this.form.postData.retweetId) {
              this.wrongLinkDes = this.$t('curation.cantCurateQuoteTweet');
              this.linkIsError = true
              this.form.tweetId = '';
              this.form.postData = {};
              return;
            }
            this.linkIsVerified = true;
        }else {
          this.wrongLinkDes = this.$t('curation.tweetNotExist');
          this.linkIsError = true
          this.form.postData = {};
        }
      } catch (e) {
        console.log('Fetch data from twitter fail:', e);
        if (e === 'log out') {
          this.$router.replace('/square')
        }
      } finally {
        this.checkingTweetLink = false;
      }
    },
    keydown(e) {
      if(e.keyCode === 13) {
        e.preventDefault()
        return false
      }
    },
    create() {
      if (!this.linkIsVerified) return;
      if (!this.form.link || this.form.description.length < 1) {
        notify({message: this.$t('tips.missingInput'), type: 'info'})
        return;
      }
      const content = `${this.form.description}\n#iweb3 #curate\n${this.form.link}`;

      let url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(content)
      window.open(url, '__blank')
    },
  },
  async mounted () {
    const { author, tweetId } = history.state;
    if (author && tweetId) {
      this.form.link = `https://twitter.com/${author}/status/${tweetId}`
      this.checkLink();
    }
    if (!this.getAccountInfo?.ethAddress) {
      this.$router.push('/')
    }

    const balance = await getCuratorNFT(this.getAccountInfo.ethAddress)
    if (balance >= 1) {
      this.haveCuratorNFT = true
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
