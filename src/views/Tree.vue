<template>
    <div class="container">
      <vue-tree
        style="width: 2000px; height: 1600px; border: 1px solid gray;"
        :dataset="richMediaData"
        :config="treeConfig"
      >
        <template v-slot:node="{ node, collapsed }">
            <img v-if="node.profileImg"
                 class="mr-10px rounded-full cursor-pointer blog-avatar max-w-56px max-h-56px bg-color62/10 border-1 w-2.6rem h-2.6rem md:w-3.6rem md:h-3.6rem"
                 @click.stop="gotoTweet(node)"
                 @error="replaceEmptyImg"
                 :src="node.profileImg" alt="">
            <img class="mr-10px rounded-full max-w-56px max-h-56px bg-color62/10 border-1 w-2.6rem h-2.6rem md:w-3.6rem md:h-3.6rem"
                 @click.stop="gotoTweet(node)"
                 src="@/assets/icon-default-avatar.svg" v-else alt="">
        </template>
      </vue-tree>
    </div>
  </template>
  
  <script>
import VueTree from "@ssthouse/vue3-tree-chart";
import "@ssthouse/vue3-tree-chart/dist/vue3-tree-chart.css";
import { quoteTree } from '@/api/api'
import emptyAvatar from "@/assets/icon-default-avatar.svg";

  export default {
    name: 'treemap',
    components: {
        VueTree,
    },
    data() {
      return {
        richMediaData: {},
        treeConfig: { nodeWidth: 80, nodeHeight: 80, levelHeight: 160, direction: 'horizontal' }
      }
    },
    methods: {
        replaceEmptyImg(e) {
            e.target.src = emptyAvatar;
        },
        gotoTweet(node) {
            window.open(`https://twitter.com/${node.name}/status/${node.tweetId}`, '__blank')
        }
    },
    mounted () {
        quoteTree('wormhole_3', '1660496651977621504', 'BitcoinPizzaDay', '	https://pbs.twimg.com/profile_images/1555384895089700864/Tbfw9i9D_200x200.jpg').then(res=>{
            this.richMediaData = res;
            res.children = res.children.filter(c => c.children && c.children.length > 0)
        });
    },
  }
  </script>
  
  <style scoped lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .rich-media-node {
    width: 80px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    color: white;
    background-color: #f7c616;
    border-radius: 4px;
  }
  </style>