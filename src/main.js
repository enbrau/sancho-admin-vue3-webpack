import { createApp } from 'vue'
import $router from '@/router'
import store from '@/store'
import i18n from '@/i18n'
import components from '@/components'

import App from './App.vue'
import { preloadHook } from './hooks'

// UI Library: ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import en from 'element-plus/lib/locale/lang/en'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import * as ElIconModules from '@element-plus/icons'

import '@/utils/handle-window-resize.js'
import '@/style/index.scss'

let instance = null
let router = $router

function render(props = {}) {
  const { container } = props

  instance = createApp(App)
    .use(router)
    .use(store)
    .use(i18n)
    .use(components)

  for(let iconName in ElIconModules){
    instance.component(iconName, ElIconModules[iconName])
  }
  instance.use(ElementPlus, {
    size: store.state.app.size,
    locale: (function(locale){
      switch(locale) {
        case 'zh-cn':
          return zhCn
        default:
          return en
      }
    }(store.state.app.locale))
  })

  preloadHook.promise(instance).then(() => {
    instance.mount(container ? container.querySelector('#app') : '#app')
    document.getElementsByClassName('loading-container')[0].style.display = 'none'
  })
}

// run as main application
import { registerMicroApps, start } from 'qiankun'
const apps = require('../sub-apps.js')
if (apps.length > 0) {
  registerMicroApps(apps)
  start()
}

// run as independent application
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

// run as micro application
export async function bootstrap() {
  console.log('[vue] vue app bootstraped');
}
export async function mount(props) {
  console.log('[vue] props from main framework', props);
  render(props);
}
export async function unmount() {
  instance.unmount()
  instance = null
  router = null
  console.log('[vue] vue app unmounted')
}
