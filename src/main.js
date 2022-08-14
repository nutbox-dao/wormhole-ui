import * as Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './lang/index'
import 'windi.css'
import Spinner from "@/components/Spinner";
import { List, PullRefresh, ImagePreview, Popup } from 'vant'
import 'vant/es/image-preview/style';
import 'element-plus/dist/index.css'

window.$vueApp = Vue.createApp(App)
window.$vueApp.component('c-spinner', Spinner)
window.$vueApp.use(store).use(router).use(i18n)
  .use(List).use(PullRefresh).use(ImagePreview).use(Popup)
window.$vueApp.mount('#app')
window.$vueApp.config.globalProperties.routerAppend = (path, pathToAppend) => {
  return path + (path.endsWith('/') ? '' : '/') + pathToAppend
}
