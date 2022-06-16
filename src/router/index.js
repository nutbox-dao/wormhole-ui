import * as Vue from 'vue'
import * as VueRouter from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import VerifyView from '@/views/Verify'
import LoginView from '@/views/Login'
import FAQView from '@/views/FAQ'
import Profile from '@/views/Profile'
import UserIndexView from '@/views/user/UserIndex'
import UserTokenView from '@/views/user/Token'
import UserNftView from '@/views/user/NFT'
import UserTransactionView from '@/views/user/Transaction'
import UserPostView from '@/views/user/Post'
import UserPostDetailView from '@/views/user/PostDetail'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/verify',
    name: 'verify',
    component: VerifyView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  // {
  //   path: '/profile/:id',
  //   name: 'profile',
  //   component: Profile
  // },
  {
    path: '/faq',
    name: 'faq',
    component: FAQView,
  },
  {
    path: '/profile/:user',
    name: 'user',
    component: UserIndexView,
    children: [
      {
        path: '/profile/:user',
        name: 'token',
        component: UserTokenView
      },
      {
        path: '/profile/:user/nft',
        name: 'nft',
        component: UserNftView
      },
      {
        path: '/profile/:user/transaction',
        name: 'transaction',
        component: UserTransactionView
      },
      {
        path: '/profile/:user/post',
        name: 'post',
        component: UserPostView
      },
      {
        path: '/profile/:user/post-detail',
        name: 'post-detail',
        component: UserPostDetailView
      }
    ]
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Vue.defineAsyncComponent(() => import('../views/AboutView.vue')),
  },
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes: routes,
})

export default router
