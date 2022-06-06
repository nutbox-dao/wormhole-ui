<template>
    <div>
test texxt
    </div>
</template>

<script>
import { getSteemBalance } from '@/utils/steem'
import { mapState } from 'vuex'
import { getTwitterAccount, getUserBindInfo, getRegisterOp } from '@/api/api'
import { notify } from "@/utils/notify";

export default {
    name: 'Profile',
    data() {
        return {
            steemBalance: 0
        }
    },
    computed: {
        ...mapState(['accountInfo']),
    },
    methods: {
        showNotify(message, duration, type) {
            notify({message, duration, type})
        },
    },
    async mounted () {
        const twitterUsername = this.$route.params.id.startsWith('@') ? this.$route.params.id.substring(1) : this.$route.params.id
        
        if (this.accountInfo && twitterUsername == this.accountInfo.twitterUsername) {
        }else {
            // check twitter account
            try{
                const account = await getTwitterAccount(twitterUsername)
                if (account.errors && account.errors.length > 0) {
                    console.log('Not exsit');
                    this.showNotify('This twitter account is invalid.', 5000, 'error')
                    this.$router.push('/')
                    return;
                }else {
                    // get bind account
                    const bindInfo = await getUserBindInfo(account.data.id)
                    // store bind account
                    this.$store.commit('saveAccountInfo', bindInfo)
                }
            }catch(e) {
                this.showNotify(e, 5000, 'error')
                this.$router.push('/')
                return;
            }
        }
        // get and show account balance
        const { steemId, ethAddress } = this.accountInfo
        if (steemId) {
            // get steem balance
            getSteemBalance(steemId).then(balance => this.steemBalance = balance)
                .catch(err => console.log('get steem balance fail:', err))
        }
        if (ethAddress) {
            //get eth balances
        }
    },
}
</script>

<style lang="scss" scoped>

</style>