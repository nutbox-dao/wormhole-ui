export default {
  signIn: 'Sign In',
  signUp: 'Sign Up',
  square: 'Square',
  curations: 'Curations',
  faq: 'FAQs',
  aboutUs: 'About Us',
  discord: 'Discord',
  twitter: 'Twitter',
  logout: 'Log out',
  signUpView: {
    t1: 'Activate web3 wallet',
    t2: 'and Sign up',
    btn1: 'Activate Your Wallet',
    p1: 'Already verified yourself ?',
    p2: 'Log in here'
  },
  verifyView: {
    p1: 'Below is the password to your new wallet:',
    p2: 'Please save this private key in a very secure location. We will never keep this key, so if you dont save it, nobody can find back this account.',
    btn1: 'Ok, I saved it.',
    p3: 'Great,',
    p4: 'now let\'s verify your Twitter handle',
    btn2: 'Go to bind',
    p5: 'After you\'ve tweeted the bind message',
    p6: 'Log in here',
    p7: 'Are you sure saved the important key?',
    p8: 'I know that if I do not save the private key, no one can retrieve my account',
    btn3: 'yes，I\'m sure'
  },
  signInView: {
    p1: 'Please enter your twitter username.',
    p2: 'Haven\'t signed up yet ?',
    p3: 'Create an account',
    p4: 'Your account is in the process of registration',
    p5: 'Please wait for a moment',
    p6: 'You havn\'t send twitter yet',
  },
  squareView: {
    p1: 'Post twitter content on chain and earn rewards',
    p2: 'There\'s no related posts about this topic. Please check other topic for try.'
  },
  tagView: {
    p1: 'Utopianism, some argue, is essential for the improvement of the human condition.'
  },
  topicsView: {
    title: 'More topics',
    post: 'Posts'
  },
  postView: {
    tweetPost: 'Tweet a post',
    socialToken: 'Social token',
    resourceCredits: 'Resource Credits',
    p1: 'Every your post upload to the blockchain will cost you resource credits(RC), so your post can\'t be synced to blockchain if the RC is too lower. The RC will recover 20% every day.',
    goTweet: 'Go tweet',
    tips: 'Tips',
    p2: 'Replace {\'{***}\'} to real content.',
    p3: 'You can replace {\'{@twitter_username}\'} with a twitter username.',
    tweetTip: 'Tweet action tips',
    tip1: '1. Transfer STEEM/SBD to a twitter account',
    tip2: '2. Add a post to web3',
    p4: 'Your account is in the process of registration',
    p5: 'Please wait for a moment',
    p6: 'You havn\'t send twitter yet',
    p7: 'You havn\'t post any content to wormhole3, Please try to start from Twitter by wormhole3.',
    p8: 'This service is still in Beta. Please be careful and do not deposit anything more than you can lose.\n' +
      '              By depositing into this account, you are agreeing to our terms of service.'
  },
  profileView: {
    socialAsset: 'Social assets',
    web3Wallet: 'Web3 wallet',
    ethWallet: 'ETH wallet',
    getNftP1: 'A NFT that shows your social influence on Twitter',
    people: 'People',
    curations: 'Curations'
  },
  token: {
    noNft: "You havn't got any NFTs.",
  },
  transactionView: {
    recentTransaction: 'Recent transactions',
    viewBlockchain: 'View on blockchain',
    fail: 'Fail',
    waiting: 'Waiting...',
    receiveFrom: 'Receive from',
    sendTo: 'Send to'
  },
  aboutView: {
    q1: '1. How to generate a new address, do you keep the private key on platform?',
    a1: 'To be updated... By using graphene technology, Wormhole3 can generate a Web3 id for each user, and derive its low-privilege Web3_social id. The private key of the Web3 id is uniquely held by the user, and the Web3_social id is delegated to the user\'s Web2 account (such as Twitter) in a decentralized manner. This has brought about a huge change. On the Web2 platform, users can control the Web3_social id, such as tweeting on the Twitter page to upload posts on the chain and tweeting to transfer cryptocurrencies. There is no need to install any Web3 plug-in wallet in the whole process, and there is no need to consider issues such as handling fees.😎'
  },
  faqView: {
    q1: 'How to generate a new address, do you keep the private key on platform?',
    a1: 'We generate a random new address in your own front page, and the key never be sent to our platform, so we never touch and keep it.',
    q2: 'Need I restore my private key after I binded my account? Can I find it back if I lost it?',
    a2: 'Please keep your key in a very security place, we dont keep them, so nobody can find them back if you lose them.',
    q3: 'Can I send crypto asset through twitter? How?',
    a3p1: 'Yes, you can send STEEM token at this phase, but can\'t send eth assets because of we don\'t keep your key.',
    a3p2: `You can send STEEM to another one by send twitter: {'@'}wormhole_3 !send 1 STEEM to {'@'}another twitter account.`,
    q4: 'Can I sync my tweets to web3?',
    a4p1: 'Sure, your tweet will be stored in web3 for ever, it always belong to you.',
    a4p2: `You can send twitter to sync them like this: {'{content}'} #iweb3.`,
  },
  curationsView: {
    p1: 'Attend curation win FTs, NFTs or other prizes.',
    createBtn: 'Create a curation',
    createCuration: 'Create Curation'
  },
  tips: {
    missingInput: "Please complete all infos.",
    textLengthOut: "Input text exceed max length.",
  },
  curation: {
    title: 'Title',
    inputTitle: 'Enter a curation title',
    schedule: 'Schedule',
    startTimeTip: 'The default start time is the creation time.',
    description: 'Description',
    inputDes: "Enter the detail of your curation",
    connectWallet: "Connect Wallet",
    maxCount: 'Max reward users',
    maxCountTip: 'The top count of curators can earn reward',
    inputMaxCount: 'Enter max reward users',
    noLimited: 'No limited',
    rewardsMethod: 'Reward Method',
    posw: "Proof Of Subjective Work(PoSW)",
    poswDes: 'If it is a PoSW curation, the reward will be issued to the participants according to the review. \nIf it is other quest, the rewards will be automatically.',
    rewardsAmount: 'Rewards Amount',
    inputRewardsAmount: 'Enter amount of rewards',
    inputErc20: 'Enter ERC20 address or select one',
    totalAmount: "Total amount",
    insuffientBalance: 'Insuffient Balance',
    approveFail: 'Approve Fail',
    create:"Create",
    createTip: "Since the reward of this curation includes tokens, it is necessary to enter the tokens ( {rewards} ) into the bonus vault in advance. After the curation ends, eligible curator will be able to receive the rewards.",
    backToEdit: 'Back to edit',
    crateFail: "Crate curation fail",
    createdOk: 'Create Curation Success!',
    startCuration: 'Tweet and start curation',
    moreDetail: 'more details'
  },
  common: {
    none: 'None',
    noMore: 'No more',
    post: 'Post',
    token: 'Token',
    nft: 'NFTs',
    next: 'Next',
    preview: 'Preview',
    submit: 'Submit',
    confirm: 'Confirm',
    send: 'Send',
    approve: 'Approve',
    connectMetamask: 'Connect Metamask',
    pullRefresh: 'Pull to refresh data',
    loosingRefresh: 'Release to refresh',
    loading: 'Loading...',
    serverError: 'Server Error',
    get: 'GET'
  }
}
