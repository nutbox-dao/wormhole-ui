<template>
  <div class="faq-view overflow-auto">
    <div class="c-text-black text-center py-1rem text-1.5rem md:text-1.2rem">{{$t('faq')}}</div>
    <div class="container mx-auto text-left max-w-43rem fade-in c-text-medium">
      <div class="flex-1 flex flex-wrap gap-x-1.5rem gap-y-0.8rem mb-1rem">
        <button class="leading-30px whitespace-nowrap px-1rem rounded-full border-1 h-30px cursor-pointer"
                :class="tabIndex===0?'bg-color62/20 light:bg-colorF1 text-color62 border-color62 font-bold':
              'border-color8B/30 light:border-colorE3 light:border-colorE3 text-color84 light:text-color7D light:bg-colorF2'"
                @click="tabIndex=0">{{$t('faqView.operationAndTech')}}</button>
        <button class="leading-30px whitespace-nowrap px-1rem rounded-full border-1 h-30px cursor-pointer"
                :class="tabIndex===1?'bg-color62/20 light:bg-colorF1 text-color62 border-color62 font-bold':
              'border-color8B/30 light:border-colorE3 light:border-colorE3 text-color84 light:text-color7D light:bg-colorF2'"
                @click="tabIndex=1">{{$t('faqView.curationRelated')}}</button>
      </div>
      <div v-show="tabIndex===0">
        <div class="bg-blockBg light:bg-white light:shadow-popper-tip rounded-12px py-1rem px-1.5rem mb-1rem">
          <div class="c-text-black text-1.15rem leading-2rem md:text-1rem md:leading-1.5rem">
            {{$t('faqView.tab1.q1')}}
          </div>
          <div class="text-1rem leading-2rem md:text-0.8rem md:leading-1.2rem mt-1rem text-color8B">
            {{$t('faqView.tab1.a1')}}
          </div>
        </div>
        <div class="bg-blockBg light:bg-white light:shadow-popper-tip rounded-12px py-1rem px-1.5rem mb-1rem">
          <div class="c-text-black text-1.15rem leading-2rem md:text-1rem md:leading-1.5rem">
            {{$t('faqView.tab1.q2')}}
          </div>
          <div class="text-1rem leading-2rem md:text-0.8rem md:leading-1.2rem mt-1rem text-color8B">
            {{$t('faqView.tab1.a2')}}
          </div>
        </div>
        <div class="bg-blockBg light:bg-white light:shadow-popper-tip rounded-12px py-1rem px-1.5rem mb-1rem">
          <div class="c-text-black text-1.15rem leading-2rem md:text-1rem md:leading-1.5rem">
            {{$t('faqView.tab1.q3')}}
          </div>
          <div class="text-1rem leading-2rem md:text-0.8rem md:leading-1.2rem mt-1rem text-color8B">
            {{$t('faqView.tab1.a3')}}
          </div>
        </div>
        <div class="bg-blockBg light:bg-white light:shadow-popper-tip rounded-12px py-1rem px-1.5rem mb-1rem">
          <div class="c-text-black text-1.15rem leading-2rem md:text-1rem md:leading-1.5rem">
            {{$t('faqView.tab1.q4')}}
          </div>
          <div class="text-1rem leading-2rem md:text-0.8rem md:leading-1.2rem mt-1rem text-color8B">
            {{$t('faqView.tab1.a4')}}
          </div>
        </div>
        <div class="bg-blockBg light:bg-white light:shadow-popper-tip rounded-12px py-1rem px-1.5rem mb-1rem">
          <div class="c-text-black text-1.15rem leading-2rem md:text-1rem md:leading-1.5rem">
            {{$t('faqView.tab1.q5')}}
          </div>
          <div class="text-1rem leading-2rem md:text-0.8rem md:leading-1.2rem mt-1rem text-color8B">
            {{$t('faqView.tab1.a5')}}
          </div>
        </div>
      </div>
      <div v-show="tabIndex===1">
        <div class="bg-blockBg light:bg-white light:shadow-popper-tip rounded-12px py-1rem px-1.5rem mb-1rem">
          <div class="c-text-black text-1.15rem leading-2rem md:text-1rem md:leading-1.5rem">
            {{$t('faqView.tab2.q1')}}
          </div>
          <div class="text-1rem leading-2rem md:text-0.8rem md:leading-1.2rem mt-1rem text-color8B">
            {{$t('faqView.tab2.a1')}}
          </div>
        </div>
        <div class="bg-blockBg light:bg-white light:shadow-popper-tip rounded-12px py-1rem px-1.5rem mb-1rem">
          <div class="c-text-black text-1.15rem leading-2rem md:text-1rem md:leading-1.5rem">
            {{$t('faqView.tab2.q2')}}
          </div>
          <div class="text-1rem leading-2rem md:text-0.8rem md:leading-1.2rem mt-1rem text-color8B">
            <div class="mb-8px">{{$t('faqView.tab2.a2')}}</div>
            <ul class="list-decimal ml-14px">
              <li>{{$t('faqView.tab2.a2p1')}}</li>
              <li>{{$t('faqView.tab2.a2p2')}}</li>
              <li>{{$t('faqView.tab2.a2p3')}}</li>
            </ul>
          </div>
        </div>
        <div class="bg-blockBg light:bg-white light:shadow-popper-tip rounded-12px py-1rem px-1.5rem mb-1rem">
          <div class="c-text-black text-1.15rem leading-2rem md:text-1rem md:leading-1.5rem">
            {{$t('faqView.tab2.q3')}}
          </div>
          <div class="text-1rem leading-2rem md:text-0.8rem md:leading-1.2rem mt-1rem text-color8B">
            {{$t('faqView.tab2.a3')}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FAQ",
  data() {
    return {
      tabIndex: 0
    }
  }
}
</script>

<style scoped>

</style>
