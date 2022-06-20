import { markRaw } from "vue"

const actionFiles = require.context('./actions/', false, /\.vue$/)
const actions = {}
actionFiles.keys().forEach((key) => {
  const moduleName = key.replace(/(\.\/|\.vue)/g, '')
  actions[moduleName] = markRaw(actionFiles(key).default)
})

export default actions