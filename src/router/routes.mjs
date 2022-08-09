const debug = false

export const createRoutes = (Layout) => {
  return [
    // Add routes you want to visit from Main App here: 
    {
      path: '/system',
      component: Layout,
      redirect: 'noRedirect',
      meta: { title: 'system.menus.system', fallbackTitle: '系统管理', icon: 'cogs', noCache: true, isAnon: debug },
      children: [
        {
          path: 'core/subscriber',
          component: () => import('@/views/system/Subscriber.vue'),
          isMenu: true,
          meta: { title: 'system.menus.subscriber', fallbackTitle: '用户管理', remark: '新增、修改、删除用户', icon: 'user-fill', isShortCut: true, isConfigShortCut: true, noCache: true, isAnon: debug },
        },
        {
          path: 'core/role',
          component: () => import('@/views/system/Role.vue'),
          isMenu: true,
          meta: { title: 'system.menus.role', fallbackTitle: '角色管理', remark: '新增、修改、删除用户角色', icon: 'role', isShortCut: true, isConfigShortCut: true, noCache: true, isAnon: debug }
        },
        {
          path: 'core/organization',
          component: () => import('@/views/system/Organization.vue'),
          isMenu: true,
          meta: { title: 'system.menus.org', fallbackTitle: '机构管理', remark: '新增、修改、删除用户机构', icon: 'org', isShortCut: true, isConfigShortCut: true, noCache: true, isAnon: debug }
        },
        {
          path: 'core/parameters',
          component: () => import('@/views/system/Parameters.vue'),
          isMenu: true,
          meta: { title: 'system.menus.parameters', fallbackTitle: '参数管理', remark: '修改系统参数', icon: 'settings', isShortCut: true, isConfigShortCut: true, noCache: true, isAnon: debug },
        },
        {
          path: 'core/schedule',
          component: () => import('@/views/system/Schedule.vue'),
          isMenu: true,
          meta: { title: 'system.menus.schedule', fallbackTitle: '计划任务管理', remark: '修改系统计划任务', icon: 'schedule', isShortCut: true, isConfigShortCut: true, noCache: true, isAnon: debug }
        },
        {
          path: 'core/data-dictionary',
          component: () => import('@/views/system/DataDictionary.vue'),
          isMenu: true,
          meta: { title: 'system.menus.data-dictionary', fallbackTitle: '字典管理', remark: '新增、修改、删除系统数据字典', isShortCut: true, isConfigShortCut: true, icon: 'dictionary', noCache: true, isAnon: debug }
        },
        {
          path: 'core/cache',
          component: () => import('@/views/system/Cache.vue'),
          isMenu: true,
          meta: { title: 'system.menus.cache', fallbackTitle: '缓存管理', remark: '查看或刷新系统缓存', icon: 'cache', isShortCut: true, isConfigShortCut: true, noCache: true, isAnon: debug }
        },
        {
          path: 'core/audit',
          component: () => import('@/views/system/AuditLog.vue'),
          isMenu: true,
          meta: { title: 'system.menus.audit', fallbackTitle: '审计日志', remark: '查看用户系统使用日志', icon: 'audit', isShortCut: true, isConfigShortCut: true, noCache: true, isAnon: debug }
        }
      ]
    }
  ]
}
