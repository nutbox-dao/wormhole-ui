<template>
  <div class="text-left border-1 border-listBgBorder bg-white/10 rounded-12px overflow-hidden max-w-25rem">
    <img class="" :src="linkPreviewInfo.image" alt="">
    <div class="px-1rem py-0.5rem">
      <div class="">{{getUrlHost(linkPreviewInfo.url)}}</div>
      <div class="c-text-bold text-1rem my-0.4rem overflow-hidden overflow-ellipsis whitespace-nowrap">{{linkPreviewInfo.title}}</div>
      <div class="overflow-hidden overflow-ellipsis whitespace-nowrap">{{linkPreviewInfo.desc}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LinkPreview",
  data() {
    return {
      linkPreviewInfo: {
        url: 'https://twitter.com/terry3t1/status/1542338002818666496',
        image: 'https://pbs.twimg.com/media/FWd8DdiX0AAwfEN.jpg:large',
        title: 'terry3t.eth on Twitter',
        desc: '“Siguniang mountain, here we are。 （!post by https://t.co/ybMGq2pJM9） #wormhole3”'
      }
    }
  },
  methods: {
    getUrlHost(link) {
      const url = new URL(link)
      return url.host.toLowerCase() || ''
    }
  }
}
</script>

<style scoped>

</style>
