import * as Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

window.$vueApp = Vue.createApp(App)
window.$vueApp.use(store)
window.$vueApp.use(router)
window.$vueApp.mount('#app')
window.$vueApp.config.globalProperties.routerAppend = (path, pathToAppend) => {
  return path + (path.endsWith('/') ? '' : '/') + pathToAppend
}
