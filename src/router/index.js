import * as Vue from 'vue'
import * as VueRouter from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import VerifyView from '@/views/CreateAccount'
import LoginView from '@/views/Login'
import LoginCodeView from '@/views/LoginCode'
import FAQView from '@/views/FAQ'
import UserIndexView from '@/views/user/UserIndex'
import UserTokenView from '@/views/user/Token'
import UserNftView from '@/views/user/NFT'
import UserTransactionView from '@/views/user/Transaction'
import UserPostView from '@/views/user/Post'
import UserPostDetailView from '@/views/post/PostDetail'
// other user's profile view
import AccountInfoView from '@/views/user/tempUser/AccountInfo'
// import AccountPostView from '@/views/user/tempUser/Post'
// import AccountTokenView from '@/views/user/tempUser/Token'
// import AccountNFTView from '@/views/user/tempUser/NFT'
// import AccountWalletView from '@/views/user/tempUser/WalletView'
import SearchView from '@/views/user/SearchView'

import WalletView from "@/views/user/WalletView";
import AboutUsView from "@/views/AboutView";
import PostsIndex from "@/views/post/PostsIndex";
import CreateCuration from "@/views/curations/CreateRecommend";
import CurationDetail from "@/views/curations/CurationDetail";
import CurationsView from "@/views/user/Curations";
import FaucetView from "@/views/Faucet"
import RewardView from "@/views/user/RewardView";
import UserGuide from '@/views/UserGuide';
import CreateView from "@/views/CreateView";
import WalletIndex from "@/views/user/WalletIndex";
import WordCloud from '@/views/word-cloud/Index'

const routes = [
  {
    path: '/',
    redirect: '/square',
  },
  {
    path: '/square/:referee?',
    name: 'square',
    component: PostsIndex,
    meta: {keepAlive: true}
  },
  {
    path: '/create-curation',
    name: 'create-curation',
    component: CreateView
  },
  {
    path: '/curation-detail/:id',
    name: 'curation-detail',
    component: CurationDetail
  },
  {
    path: '/logincode/:code?',
    name: 'login-code',
    component: LoginCodeView
  },
  {
    path: '/account-info/:user',
    name: 'account-info',
    component: AccountInfoView
  },
  {
    path: '/search-user/:user',
    name: 'search-user',
    component: SearchView
  },
  {
    path: '/word-cloud',
    name: 'word-cloud',
    component: WordCloud
  },
  {
    path: '/faq',
    name: 'faq',
    component: FAQView,
  },
  {
    path: '/userguide',
    name: 'user-guide',
    component: UserGuide
  },
  {
    path: '/about',
    name: 'about',
    component: AboutUsView,
  },
  {
    path: '/faucet',
    name: 'faucet',
    component: FaucetView,
  },
  {
    path: '/wallet/:user',
    name: 'wallet',
    component: WalletIndex,
    meta: {gotoHome: true},
    children: [
      {
        path: '/wallet/:user/wallet',
        name: 'wallet',
        component: WalletView,
        meta: {gotoHome: true},
        children: [
          {
            path: '',
            name: 'nft',
            component: UserNftView
          },
          {
            path: 'token',
            name: 'token',
            component: UserTokenView
          },
        ]
      },
      {
        path: '/wallet/:user/reward',
        name: 'reward',
        component: RewardView,
        meta: {gotoHome: true}
      },
      {
        path: '/wallet/:user/transaction',
        name: 'transaction',
        component: UserTransactionView,
        meta: {gotoHome: true},
      },
    ]
  },
  {
    path: '/profile/:user',
    name: 'user',
    component: UserIndexView,
    meta: {gotoHome: true},
    children: [
      {
        path: '/profile/:user/post',
        name: 'post',
        component: UserPostView,
        meta: {keepAlive: true, gotoHome: true}
      },
      {
        path: '/profile/:user/curations',
        name: 'profile-curations',
        component: CurationsView,
        meta: {keepAlive: true, gotoHome: true}
      }
    ]
  },
  {
    path: '/post-detail/:postId',
    name: 'post-detail',
    component: UserPostDetailView,
  },
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes: routes,
})

router.beforeResolve((to, from, next) => {
  if (to.name === 'word-cloud') {
    window.document.title = 'test'
  }
  console.log(33, to);
  console.log(55, window);
  next();
})

export default router
