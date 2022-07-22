import * as Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'windi.css'
import Spinner from "@/components/Spinner";
import { List, PullRefresh, ImagePreview } from 'vant'
import 'vant/es/image-preview/style';

window.$vueApp = Vue.createApp(App)
window.$vueApp.component('c-spinner', Spinner)
window.$vueApp.use(store).use(router)
  .use(List).use(PullRefresh).use(ImagePreview)
window.$vueApp.mount('#app')
window.$vueApp.config.globalProperties.routerAppend = (path, pathToAppend) => {
  return path + (path.endsWith('/') ? '' : '/') + pathToAppend
}
