<template>
  <div>
    <div class="c-text-black text-1.6rem">{{$t('curation.create')}}</div>
    <div class="text-15px leading-1.5rem text-left xl:text-0.75rem text-color8B light:text-color7D my-1.5rem">
      {{$t('curation.createTip', {rewards: tokenInfo})}}
    </div>
    <button v-if="!approvement" class="gradient-btn w-full h-55px 2xl:h-2.8rem max-w-300px rounded-full c-text-black text-18px 2xl:text-0.9rem flex items-center justify-center mx-auto"
            @click="approve"
          :disabled="approving">
      <c-spinner class="w-1.5rem h-1.5rem ml-0.5rem" v-show="approving"></c-spinner>
      <span>{{$t('common.approve')}}</span>
    </button>
    <button v-else class="gradient-btn w-full h-55px 2xl:h-2.8rem max-w-300px rounded-full c-text-black text-18px 2xl:text-0.9rem flex items-center justify-center mx-auto"
      :disabled="creating"
      @click="creating=true;$emit('createCuration')">
      <c-spinner class="w-1.5rem h-1.5rem ml-0.5rem" v-show="creating"></c-spinner>
      <span>{{$t('common.confirm')}}</span>
    </button>
    <button class="underline mt-1.5rem c-text-black text-15px 2xl:text-0.75rem"
        :disable="creating || approving"
         @click="creating=false;approving=fals;$emit('close')">{{$t('curation.backToEdit')}}</button>
  </div>
</template>

<script>
import  {getApprovement, approve} from '@/utils/asset'
import { CURATION_CONTRACT } from '@/config'
import { mapState } from 'vuex'
import { notify } from "@/utils/notify";

export default {
  name: "SendTokenTip",
  props: {
    token: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      tokenInfo: '',
      approvement: false,
      approving: false,
      creating: false
    }
  },
  computed: {
    ...mapState('web3', ['account']),
  },
  methods: {
    async approve() {
      try{
        this.approving = true
        await approve(this.token.address, this.account, CURATION_CONTRACT)
        this.approvement = true
      } catch (e) {
        notify({message: this.$t('curation.approveFail'), duration: 5000, type: 'error'})
      } finally {
        this.approving = false
      }
    }
  },
  mounted () {
    this.tokenInfo = this.token.amount + ' ' + this.token.symbol;
    getApprovement(this.token.address, this.account, CURATION_CONTRACT).then(res => {
      this.approvement = res
    })
  },

}
</script>

<style scoped>

</style>
