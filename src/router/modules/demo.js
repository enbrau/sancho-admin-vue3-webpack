import Layout from '@/layout'
import MicroApp from '@/views/micro-app.vue'

export default [
  {
    path: '/demo',
    component: Layout,
    redirect: 'noRedirect',
    isMenu: true,
    meta: { title: 'demo.menus.Demo', icon: 'demo-fill', noCache: true },
    children: [
      {
        path: 'icon',
        component: () => import('@/views/demo/icons.vue'),
        isMenu: true,
        meta: { title: 'demo.menus.Icons', icon: 'icon-fill', noCache: true }
      },
      {
        path: 'subapp1',
        component: MicroApp,
        isMenu: true,
        meta: { title: 'demo.menus.MicroApp', icon: 'demo-fill', noCache: true },
      }
    ]
  }
]
