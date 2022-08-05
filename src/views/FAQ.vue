<template>
  <div class="faq-view overflow-auto">
    <div class="c-text-black text-center py-1rem text-1.5rem md:text-1.2rem">FAQs</div>
    <div class="container mx-auto text-left max-w-43rem fade-in c-text-medium">
      <div class="bg-blockBg rounded-12px py-1rem px-1.5rem mb-1rem">
        <div class="c-text-black text-1.15rem leading-2rem md:text-1rem md:leading-1.5rem">
          How to generate a new address, do you keep the private key on platform?
        </div>
        <div class="text-1rem leading-2rem md:text-0.8rem md:leading-1.2rem mt-1rem text-color8B">
          We generate a random new address in your own front page, and the key never be sent to our platform, so we never touch and keep it.
        </div>
      </div>
      <div class="bg-blockBg rounded-12px py-1rem px-1.5rem mb-1rem">
        <div class="c-text-black text-1.15rem leading-2rem md:text-1rem md:leading-1.5rem">
          Need I restore my private key after I binded my account? Can I find it back if I lost it?
        </div>
        <div class="text-1rem leading-2rem md:text-0.8rem md:leading-1.2rem mt-1rem text-color8B">
          Please keep your key in a very security place, we dont keep them, so nobody can find them back if you lose them.
        </div>
      </div>
      <div class="bg-blockBg rounded-12px py-1rem px-1.5rem mb-1rem">
        <div class="c-text-black text-1.15rem leading-2rem md:text-1rem md:leading-1.5rem">
          Can I send crypto asset through twitter? How?
        </div>
        <div class="text-1rem leading-2rem md:text-0.8rem md:leading-1.2rem mt-1rem text-color8B">
          Yes, you can send STEEM token at this phase, but can't send eth assets because of we don't keep your key.<br>
          You can send STEEM to another one by send twitter: #wormhole3 !send 1 STEEM to @another twitter account.
        </div>
      </div>
      <div class="bg-blockBg rounded-12px py-1rem px-1.5rem mb-1rem">
        <div class="c-text-black text-1.15rem leading-2rem md:text-1rem md:leading-1.5rem">
          Can I sync my tweets to web3?
        </div>
        <div class="text-1rem leading-2rem md:text-0.8rem md:leading-1.2rem mt-1rem text-color8B">
          Sure, your tweet will be stored in web3 for ever, it always belong to you.<br>
          You can send twitter to sync them like this: {content} #iweb3.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FAQ"
}
</script>

<style scoped>

</style>
