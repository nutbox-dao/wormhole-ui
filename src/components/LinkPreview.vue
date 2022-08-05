<template>
  <div class="text-left border-1 border-listBgBorder bg-white/10 rounded-12px overflow-hidden md:max-w-35rem">
    <img class="" :src="linkPreviewInfo.images && linkPreviewInfo.images[0]" alt="">
    <div class="px-1rem py-0.5rem">
      <div class="">{{getUrlHost(linkPreviewInfo.url)}}</div>
      <div class="c-text-bold text-1rem my-0.4rem overflow-hidden overflow-ellipsis whitespace-nowrap">{{linkPreviewInfo.title}}</div>
      <div class="text-line-3">{{linkPreviewInfo.description}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LinkPreview",
  props: {
    pageInfo: {
      type: String,
      default: "{}"
    }
  },
  data() {
    return {
      linkPreviewInfo: {
        url: 'https://twitter.com/terry3t1/status/1542338002818666496',
        image: 'https://pbs.twimg.com/media/FWd8DdiX0AAwfEN.jpg:large',
        title: 'terry3t.eth on Twitter',
        desc: '“Siguniang mountain, here we are。 （!post by https://t.co/ybMGq2pJM9） #iweb3'
      }
    }
  },
  methods: {
    getUrlHost(link) {
      const url = new URL(link)
      return url.host.toLowerCase() || ''
    }
  },
  mounted () {
    this.linkPreviewInfo = JSON.parse(this.pageInfo);
  },
}
</script>

<style scoped>
.text-line-3 {
  word-break: break-word;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
</style>
