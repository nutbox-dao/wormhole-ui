<template>
    <div class="container">
        <vue-tree
        style="width: 800px;height:600px;border: 1px solid gray;"
        :dataset="treeData"
        :config="treeConfig">
            <template v-slot:node="{node, collapsed}">
                <img v-if="node.avatar"
                    class="mr-10px rounded-full cursor-pointer blog-avatar max-w-56px max-h-56px bg-color62/10 border-1 w-2.6rem h-2.6rem md:w-3.6rem md:h-3.6rem"
                    :style="{border: collapsed ? '1px solid grey' : ''}"
                    @click.stop="gotoTweet(node)"
                    @error="replaceEmptyImg"
                    :src="node.avatar" alt="">
                <img class="mr-10px rounded-full cursor-pointer blog-avatar max-w-56px max-h-56px bg-color62/10 border-1 w-2.6rem h-2.6rem md:w-3.6rem md:h-3.6rem"
                    @click.stop="gotoTweet(node)"
                    :style="{border: collapsed ? '1px solid grey' : ''}"
                    src="@/assets/icon-default-avatar.svg" v-else alt="">
            </template>
        </vue-tree>
    </div>
</template>

<script>

import VueTree from "@ssthouse/vue3-tree-chart";
import "@ssthouse/vue3-tree-chart/dist/vue3-tree-chart.css";
import Avatar from "@/components/Avatar";
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import { quoteTree } from '@/api/api'

export default {
    setup () {
        return {}
    },
    components: {
        VueTree,
        Avatar
    },
    data() {
        return {
            treeData: {
                name: 'James',
                value: 800,
                avatar:
                'https://gravatar.com/avatar/db51fdaf64d942180b5200ca37d155a4?s=400&d=robohash&r=x',
                children: [
                    {
                        name: 'James',
                        value: 800,
                        avatar:
                        'https://gravatar.com/avatar/db51fdaf64d942180b5200ca37d155a4?s=400&d=robohash&r=x',
                        children: [
                            
                        ]
                    }
                ]
            },
            treeConfig: {
                nodeWidth: 60, nodeHight: 60, levelHeigth: 200, direction: 'vertical', linkStyle: 'curve'
            }
        }
    },
    methods: {
        replaceEmptyImg(e) {
            e.target.src = emptyAvatar;
        },
        gotoTweet(node) {

        }
    },
    mounted () {
        // quoteTree('wormhole_3', '1660496651977621504', 'BitcoinPizzaDay', '	https://pbs.twimg.com/profile_images/1555384895089700864/Tbfw9i9D_200x200.jpg').then(res=>{
        //     this.data = res;
        // });
    },
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>