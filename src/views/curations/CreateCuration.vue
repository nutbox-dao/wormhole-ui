<template>
  <div class="container mx-auto max-w-600px xl:max-w-30rem bg-blockBg light:bg-white rounded-20px
              px-20px sm:px-4.5rem py-24px mb-2rem text-left mt-2rem">
    <div class="text-15px leading-24px 2xl:text-0.9rem 2xl:leading-1.2rem c-text-black mt-1rem light:text-color46">
      1. {{$t('createCuration.option1')}}
    </div>
    <div class="w-full h-1px bg-color8B/30 light:bg-colorF4 mt-1rem"></div>
    <div class="text-15px leading-24px 2xl:text-0.9rem 2xl:leading-1.2rem c-text-black mt-1rem light:text-color46">
      <div> 2. {{$t('createCuration.option2')}}</div>
      <ul class="list-upper-alpha ml-34px leading-34px">
        <li>{{$t('createCuration.option2A')}}</li>
        <li>{{$t('createCuration.option2B')}}</li>
        <li>{{$t('createCuration.option2C')}}</li>
        <li>{{$t('createCuration.option2D')}}</li>
        <li>{{$t('createCuration.option2E')}}</li>
      </ul>
    </div>

  </div>
</template>

<script>
export default {
  name: "CreateCuration"
}
</script>

<style scoped>

</style>
