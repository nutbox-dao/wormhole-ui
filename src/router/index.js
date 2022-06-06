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
  {
    path: '/faq',
    name: 'faq',
    component: FAQView,
  },
  {
    path: '/:user',
    name: 'user',
    component: UserIndexView,
    children: [
      {
        path: '/:user',
        name: 'token',
        component: UserTokenView
      },
      {
        path: '/:user/nft',
        name: 'nft',
        component: UserNftView
      },
      {
        path: '/:user/transaction',
        name: 'transaction',
        component: UserTransactionView
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
