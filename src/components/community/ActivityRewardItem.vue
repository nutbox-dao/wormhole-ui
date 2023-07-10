<template>
    <div class="flex justify-between items-center py-10px gap-15px cursor-pointer text-14px">
        <div class="flex-1 flex items-center truncate">
            <Avatar :profile-img="reward.profileImg"
                    :name="reward.name"
                    :username="reward.username"
                    :steem-id="reward.steemId"
                    :eth-address="reward.ethAddress"
                    :reputation="reward.reputation"
                    @gotoUserPage="$router.push({path : '/account-info/@' + reward.username})">
            <template #avatar-img>
                <img v-if="reward.profileImg" class="w-28px min-w-28px h-28px xl:w-1.2rem xl:min-w-1.2rem xl:h-1.2rem rounded-full
                            border-1 border-color62 light:border-white bg-color8B/10"
                    @error="replaceEmptyImg"
                    @click.stop="$router.push({path : '/account-info/@' + reward.username})"
                    :src="reward.profileImg" alt="">
                <img class="mr-10px rounded-full max-w-56px max-h-56px bg-color62/10 border-1"
                :class="avatarClass"
                @click.stop="$router.push({path : '/account-info/@' + reward.username})"
                src="@/assets/icon-default-avatar.svg" v-else alt="">
            </template>
            </Avatar>
            <span class="ml-6px truncate">{{reward.username}}</span>
        </div>
        <span>{{ showingReward(reward) }}</span>
    </div>
</template>

<script>
import {useWindowSize} from "@vant/use";
import { mapState, mapGetters } from 'vuex'
import { formatAmount, formatPrice } from '@/utils/helper'
import emptyAvatar from "@/assets/icon-default-avatar.svg";
import Avatar from "@/components/Avatar.vue";


export default {
    setup () {
        const { width } = useWindowSize();
        return {
        width
        }
    },
    props: {
        reward: {
            type: Object,
            default: {}
        },
    },
    components: {
        Avatar,
    },
    computed: {
        ...mapState('community', ['showingCommunity']),
    },
    methods: {
        formatAmount,
        formatPrice,
        replaceEmptyImg(e) {
            e.target.src = emptyAvatar;
        },
        showingReward(reward) {
            let amount = 0;
            let p = 0;
            if (reward.reward > 0) {
                amount = reward.reward / (10 ** reward.decimals)
            }else if (reward.estimateReward > 0) {
                amount = reward.estimateReward / (10 ** reward.decimals)
            }
            return `${formatAmount(amount)}(${formatPrice(amount * this.showingCommunity.rewardPrice)})`
        },
    },
}
</script>

<style lang="scss" scoped>

</style>
