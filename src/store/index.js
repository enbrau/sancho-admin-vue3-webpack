import { createStore } from 'vuex'

const modules = {}
const moduleFiles = require.context('./modules/', false, /\.js$/) 
moduleFiles.keys().forEach((key) => {
  const moduleName = key.replace(/(\.\/|\.js)/g, '')
  modules[moduleName] = moduleFiles(key).default
  console.log(`[Sancho] Storage unit loaded: ${moduleName}`)
})

export const getters = {
  perms: state => state.subscriber.perms,
  roles: state => state.subscriber.roles,
  menus: state => state.subscriber.menus,
  token: state => state.subscriber.token,
  sid:   state => state.subscriber.sid
}


const store = createStore({
   modules,
   getters
})

export default store
