const { uniqueId } = require('lodash')
const packageInfo = require('./package.json')
const settings = require('./settings')
const lodash = require('lodash')

const fs = require('fs')
const { zip, COMPRESSION_LEVEL } = require('zip-a-folder')

import('./src/router/routes.mjs')
  .then(({ createRoutes }) => {
    const routes = createRoutes('Layout')

    const pack = {
      name: settings.title,
      key: packageInfo.name,
      activeRule: '/#/' + settings.publicPath.replace('/', ''),
      container: '#sancho-subapp-container',
      remark: packageInfo.description,
      version: packageInfo.version,
      entry: settings.publicPath,
      isPublic: 'N',
      entries: [],
    }

    const convertRouteToEntry = function(route) {
      const entry = {
        id: uniqueId(),
        title: lodash.get(route, 'meta.fallbackTitle', '') || lodash.get(route, 'meta.title', ''),
        remark: lodash.get(route, 'meta.fallbackRemark', '') || lodash.get(route, 'meta.remark', ''),
        key: route.name || lodash.get(route, 'meta.key', '') || lodash.get(route, 'meta.title', ''),
        routePath: route.path,
        icon: lodash.get(route, 'meta.icon', 'micro-app'),
        isMenu: !route.hidden,
        isShortCut: !!lodash.get(route, 'meta.isShortCut', false),
        isNavBarShortCut: !!lodash.get(route, 'meta.isNavBarShortCut', false),
        isConfigShortCut: !!lodash.get(route, 'meta.isConfigShortCut', false),
        needPermission: !lodash.get(route, 'meta.isAnon', false),
        children: []
      }
      if (route.children && route.children.length > 0) {
        for (let i = 0; i < route.children.length; i++) {
          const childRoute = route.children[i]
          const childEntry = convertRouteToEntry(childRoute)
          entry.children.push(childEntry)
        }
      }
      return entry
    }

    for (let i = 0; i < routes.length; i++) {
      const route = routes[i]
      const entry = convertRouteToEntry(route)
      pack.entries.push(entry)
    }

    const packInfo = JSON.stringify(pack, null, '  ')

    fs.writeFileSync(__dirname + '/dist/.sancho-package', packInfo)

    zip(__dirname + '/dist', __dirname + `/micro-app-${pack.key}-${pack.version}.zip`, { compression: COMPRESSION_LEVEL.high })
  })
  .catch(err => {
    console.error(err)
  })
