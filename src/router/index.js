import * as Vue from 'vue'
import * as VueRouter from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import VerifyView from '@/views/Verify'
import LoginView from '@/views/Login'
import FAQView from '@/views/FAQ'
import UserIndexView from '@/views/user/UserIndex'
import UserTokenView from '@/views/user/Token'
import UserNftView from '@/views/user/NFT'
import UserTransactionView from '@/views/user/Transaction'
import UserPostView from '@/views/user/Post'
import UserPostDetailView from '@/views/post/PostDetail'
import AccountInfoView from '@/views/AccountInfo'
import SquareIndex from "@/views/square/SquareIndex";
import TagView from "@/views/square/TagView";
import WalletView from "@/views/user/WalletView";
import TopicsView from "@/views/square/TopicsView";
import AboutUsView from "@/views/AboutView";

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
    path: '/verify',
    name: 'verify',
    component: VerifyView,
  },
  {
    path: '/signup',
    name: 'signup',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
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
    component: UserPostDetailView
  }
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes: routes,
})

export default router
