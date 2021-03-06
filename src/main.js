import { createApp } from 'vue'
import $router, { routes } from '@/router'
import { createRouter, createWebHashHistory } from 'vue-router'
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
let router = null
let history = null

function render(props = {}) {
  const { container } = props

  if (!window.__POWERED_BY_QIANKUN__) {
    router = $router
  } else {
    history = createWebHashHistory()
    router = createRouter({
      history,
      routes
    })
  }

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
    if (container) {
      container.getElementsByClassName('loading-container')[0].style.display = 'none'
    } else {
      document.getElementsByClassName('loading-container')[0].style.display = 'none'
    }
  })
}

// run as independent application
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

// run as micro application
import actions from '@/store/actions.js'

export async function bootstrap() {
  console.log('[vue] vue app bootstraped');
}
export async function mount(props) {
  console.log('[vue] props from main framework', props)
  actions.setActions(props)
  render(props);
}
export async function unmount() {
  instance.unmount()
  instance._container.innerHTML = ''
  instance = null
  router = null
  history.destroy()
  console.log('[vue] vue app unmounted')
}
