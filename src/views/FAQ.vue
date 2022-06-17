<template>
  <div class="faq-view overflow-auto">
    <div class="container px-15px mx-auto mt-6rem text-left max-w-43rem fade-in c-text-medium">
      <div>
        <div class="text-1.6rem leading-2rem">
          How to generate a new address, do you keep the private key on platform?
        </div>
        <div class="text-1rem text-text8F leading-1.8rem mt-1.4rem ">
          We generate a random key pair, send it to you in an encrypted way. And we never keep your any keys.
        </div>
        <div class="w-full h-1px bg-text8F my-2.25rem"></div>
      </div>
      <div>
        <div class="text-1.6rem leading-2rem">
          Need I restore my private key after I binded my account? Can I find it back if I lost it?
        </div>
        <div class="text-1rem text-text8F leading-1.8rem mt-1.4rem">
          Please keep your key in a very security place, we dont keep them, so nobody can find them back if you lose them.
        </div>
         <div class="w-full h-1px bg-text8F my-2.25rem"></div>
      </div>
      <div>
        <div class="text-1.6rem leading-2rem">
          Can I send crypto asset through twitter? How?
        </div>
        <div class="text-1rem text-text8F leading-1.8rem mt-1.4rem">
          Yes, you can send STEEM token at this phase, but can't send eth assets because of we don't keep your key.<br>
          You can send STEEM to another one by send twitter: #wormhole3 !send 1 STEEM to @another twitter account.
        </div>
         <div class="w-full h-1px bg-text8F my-2.25rem"></div>
      </div>
      <div>
        <div class="text-1.6rem leading-2rem">
          Can I sync my tweets to web3?
        </div>
        <div class="text-1rem text-text8F leading-1.8rem mt-1.4rem">
          Sure, your tweet will be stored in web3 for ever, it always belong to you.<br>
          You can send twitter to sync them like this:#wormhole3 !post content. 
        </div>
         <div class="w-full h-1px bg-text8F my-2.25rem"></div>
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
