import store from '@/store'
import { deepClone, uuid } from '@/utils'
import { saveObject, fetchObjects } from '@/api/modules/utility.js'
import { createRoutes } from '@/router/routes.mjs'

export async function loadAvailableWidgets() {
  const routes = createRoutes(null)
  const filterWidgets = async function(routes, widgets) {
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i]
      if (route?.meta.widget) {
        const routeCom = await route.component()
        widgets.push({
          id: route.path,
          title: route.meta.fallbackTitle,
          remark: route.meta.remark,
          icon: route.meta.icon,
          width: route.meta.widget.width || '1/2',
          height: route.meta.widget.height || '',
          component: routeCom.default
        })
      }
      if (route.children) {
        await filterWidgets(route.children, widgets)
      }
    }
  }
  const widgets = []
  await filterWidgets(routes, widgets)
  await store.dispatch('dashboard/setAvailableWidgets', widgets)
  return widgets
}

export async function loadDefaultWidgets() {
  const availableWidgets = deepClone(store.state.dashboard.availableWidgets)
  const widgets = []
  for (let i = 0; i < availableWidgets.length; i++) {
    const widget = availableWidgets[i]
    if (!widget.hidden) {
      delete widget.component
      widgets.push(widget)
    }
  }
  return widgets
}

export async function loadPreferanceWidgets() {
  const searchParam = {
    type: 'DashboardWidgetsConfig',
    isPublic: 'N',
    owner: store.state.subscriber.sid,
    fetchContent: true
  }
  const { data } = await fetchObjects(searchParam)
  const obj = data.datalist && data.datalist.length > 0 ? data.datalist[0] : {
    id: uuid(),
    name: store.state.subscriber.profile.nickname + '的仪表盘配置',
    wid: null,
    type: 'DashboardWidgetsConfig',
    isPublic: 'N',
    owner: store.state.subscriber.sid,
    content: '[]'
  }
  const widgets = JSON.parse(obj.content)
  await store.dispatch('dashboard/setPreferanceObject', obj)
  await store.dispatch('dashboard/setPreferanceWidgets', widgets)
  return widgets
}

export async function savePreferanceWidgets(widgets) {
  if (store.state.dashboard.preferanceObject) {
    const obj = deepClone(store.state.dashboard.preferanceObject)
    obj.content = JSON.stringify(widgets)
    await saveObject(obj)
    await store.dispatch('dashboard/setPreferanceObject', obj)
  }
}

export async function initDashboard(force) {
  if (force || !store.state.dashboard.initialized) {
    await loadAvailableWidgets()
    await loadPreferanceWidgets()
    await store.dispatch('dashboard/setInitialized', true)
  }
}

export async function loadRealTimeWidgets(force) {
  await initDashboard(force)
  const aMap = {}
  for (let i = 0; i < store.state.dashboard.availableWidgets.length; i++) {
    const widget = store.state.dashboard.availableWidgets[i];
    aMap[widget.id] = widget
  }
  if (store.state.dashboard.preferanceWidgets.length > 0) {
    const widgets = []
    for (let i = 0; i < store.state.dashboard.preferanceWidgets.length; i++) {
      const widget = store.state.dashboard.preferanceWidgets[i]
      if (aMap[widget.id]) {
        widgets.push(deepClone(widget))
      }
    }
    return widgets
  }
  return await loadDefaultWidgets()
}
