import * as Vue from 'vue'
import * as VueRouter from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import VerifyView from '@/views/Verify'
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

import SquareIndex from "@/views/square/SquareIndex";
import TagView from "@/views/square/TagView";
import WalletView from "@/views/user/WalletView";
import TopicsView from "@/views/square/TopicsView";
import AboutUsView from "@/views/AboutView";
import CurationsIndex from "@/views/curations/CurationsIndex";
import CreateCuration from "@/views/curations/CreateCuration";
import CurationDetail from "@/views/curations/CurationDetail";
import CurationsView from "@/views/user/Curations";
import FaucetView from "@/views/Faucet"

const routes = [
  {
    path: '/',
    redirect: '/square',
  },
  {
    path: '/square',
    name: 'square',
    component: SquareIndex,
    meta: {keepAlive: true}
  },
  {
    path: '/square/tag/:tag',
    name: 'tag',
    component: TagView,
  },
  {
    path: '/square/topics',
    name: 'topics',
    component: TopicsView,
  },
  {
    path: '/curations',
    name: 'curations',
    component: CurationsIndex,
    meta: {keepAlive: true}
  },
  {
    path: '/create-curation',
    name: 'create-curation',
    component: CreateCuration
  },
  {
    path: '/curation-detail/:id',
    name: 'curation-detail',
    component: CurationDetail
  },
  {
    path: '/verify',
    name: 'verify',
    component: VerifyView,
  },
  {
    path: '/signup/:referee?',
    name: 'signup',
    component: HomeView
  },
  {
    path: '/logincode/:code',
    name: 'login-code',
    component: LoginCodeView
  },
  {
    path: '/account-info/:user',
    name: 'account-info',
    component: AccountInfoView
  },
  {
    path: '/faq',
    name: 'faq',
    component: FAQView,
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
    path: '/profile/:user',
    name: 'user',
    component: UserIndexView,
    children: [
      {
        path: '/profile/:user/wallet',
        name: 'wallet',
        component: WalletView,
        children: [
          {
            path: '',
            name: 'token',
            component: UserTokenView
          },
          {
            path: 'nft',
            name: 'nft',
            component: UserNftView
          },
        ]
      },
      {
        path: '/profile/:user/post',
        name: 'post',
        component: UserPostView,
        meta: {keepAlive: true}
      },
      {
        path: '/profile/:user/curations',
        name: 'profile-curations',
        component: CurationsView,
        meta: {keepAlive: true}
      }
    ]
  },
  {
    path: '/transaction/:user',
    name: 'transaction',
    component: UserTransactionView
  },
  {
    path: '/post-detail/:postId',
    name: 'post-detail',
    component: UserPostDetailView,
  },
  {
    path: '/confirm-reward',
    name: 'confirm-reward',
    component: () => import('@/views/curations/ConfirmReward'),
  },
  {
    path: '/submissions/:state',
    name: 'submissions',
    component: () => import('@/views/curations/Submissions'),
  }
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes: routes,
})

export default router
