import { createRouter, createWebHashHistory } from 'vue-router'
import { beforeRouteHook, afterRouteHook, errorHook } from '@/hooks'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
import { PERM_KEYS } from '@/consts'
import Layout from '@/layout'
import lodash from 'lodash'

let scannedRoutes = []
const moduleFiles = require.context('./modules/', false, /\.js$/)
moduleFiles.keys().forEach((key) => {
  const module = moduleFiles(key)
  const moduleName = key.replace(/^\.\/(.*)\.\w+$/, '$1').replace('modules/', '')
  const target = module.default
  if (Array.isArray(target)) {
    for (const route of target) {
      scannedRoutes.push(route)
    }
  } else {
    scannedRoutes.push(target)
  }
  console.log(`[Sancho] Route loaded: ${moduleName}`)
})

export const routes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect.vue'),
        hidden: true
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard'),
        meta: { title: 'common.menus.Dashboard', icon: 'home-fill', affix: true, noCache: true, isAnon: true }
      },
      {
        path: '403',
        component: () => import('@/views/error/403.vue'),
        hidden: true,
        meta: { title: 'common.menus.Error403', icon: 'error-fill', affix: false, noCache: true, isAnon: true }
      },
      {
        path: '404',
        component: () => import('@/views/error/404.vue'),
        hidden: true,
        meta: { title: 'common.menus.Error404', icon: 'error-fill', affix: false, noCache: true, isAnon: true }
      },
    ]
  },
  ...scannedRoutes,
  { path: '/:pathMatch(.*)*', redirect: '/404', hidden: true }
]

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ left: 0 }),
  routes
})

const whiteList = ['/login']
router.beforeEach(async (to, from, next) => {
  NProgress.start()

  const token = await store.dispatch('subscriber/getToken')

  if (!token) {
    if (whiteList.indexOf(to.path) >= 0) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
    return
  }

  let profile = store.state.subscriber.profile
  if (!profile) {
    try {
      await store.dispatch('subscriber/updateProfile')
      profile = store.state.subscriber.profile
    } catch(error) {
      await store.dispatch('subscriber/logout')
      next('login')
      return
    }
  }

  // Update Routes
  await store.dispatch('layout/updateMenus', { routes, perms: store.state.subscriber.perms })

  // for (const route of accessibleRoutes) {
  //   router.addRoute(route)
  // }
  // router.addRoute({ path: '/:pathMatch(.*)*', redirect: '/404', hidden: true })

  return beforeRouteHook.promise(to, from, next)
    .then(() => {
      next()
    })
    .catch((error) => {
      errorHook.call(error)
    })
})

router.afterEach(async (route) => {
  NProgress.done()
  return afterRouteHook.promise(route)
    .catch((error) => {
      errorHook.call(error)
    })
})

export default router

export function hasPermission(route) {
  const isAnon = route.meta ? route.meta.isAnon : false
  const actionKey = route.name || route.meta?.title || '_'
  const perms = store.state.subscriber.perms

  if (isAnon || !actionKey || perms.includes(PERM_KEYS.SUPER_ADMIN)) {
    return true
  }

  return perms.includes(actionKey)
}

export function isPermitted(actionKey) {
  const perms = store.state.subscriber.perms

  if (!actionKey || perms.includes(PERM_KEYS.SUPER_ADMIN)) {
    return true
  }

  return perms.includes(actionKey)
}

export function filterRoutes(routes, { perms }) {
  // no logic here
  return routes
}

export function filterMenus(routes, ignorePermission, blacklist) {
  const isMenu = function(route) {
    if (!route.hidden) {
      if (blacklist && lodash.indexOf(blacklist, route.path) >= 0) {
        return false
      }
      return true
    }
    return false
  }
  const filterMenu = function(route) {
    const tmp = { ...route }
    tmp.id    = tmp.name || tmp.id || tmp.meta?.title || tmp.path || lodash.uniqueId()
    tmp.name  = tmp.name || tmp.meta?.title || tmp.path || lodash.uniqueId()
    if (isMenu(tmp) && (ignorePermission || tmp.meta?.isAnon || hasPermission(tmp))) {
      if (route.children) {
        tmp.children = []
        for (let i = 0; i < route.children.length; i++) {
          const child = filterMenu(route.children[i])
          if (child) {
            tmp.children = tmp.children.concat(child)
          }
        }
      }
      return [ tmp ]
    } else if (tmp.children) {
      let res = []
      for (let i = 0; i < tmp.children.length; i++) {
        const child = filterMenu(tmp.children[i])
        if (child) {
          res = res.concat(child)
        }
      }
      return res
    }
    return []
  }

  let res = []
  routes.forEach(route => {
    const tmp = filterMenu(route)
    if (tmp) {
      res = res.concat(tmp)
    }
  })

  return res
}
