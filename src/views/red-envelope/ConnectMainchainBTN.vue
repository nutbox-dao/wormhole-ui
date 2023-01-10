<template>
  <button class="bg-tag-gradient gradient-btn-disabled-grey
                 flex items-center justify-center min-w-10rem px-20px
                 rounded-12px h-44px 2xl:h-2.2rem text-white font-bold" @click="connect">
    {{ $t('common.connectMetamask') }}
    <c-spinner v-show="connecting" class="w-16px h-16px 2xl:w-1rem 2xl:h-1rem ml-0.5rem"></c-spinner>
  </button>
</template>

<script>
import { setupNetwork } from '@/utils/web3/web3';
import {accountChanged, getAccounts} from "@/utils/web3/account";
import { CHAIN_NAME } from '@/ny-config';

export default {
    name: 'ConnectMainchainBTN',
    data() {
        return {
            connecting: false
        }
    },
    methods: {
        async connect() {
            try{
                this.connecting = true
                await setupNetwork(CHAIN_NAME)
                getAccounts()
            } catch(e) {

            } finally {
                this.connecting = false
            }

        }
    },
}
</script>

<style scoped>

</style>
