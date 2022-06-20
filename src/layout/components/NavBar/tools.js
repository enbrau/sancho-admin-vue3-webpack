import { markRaw } from "vue"

const toolFiles = require.context('./tools/', false, /\.vue$/)
const tools = {}
toolFiles.keys().forEach((key) => {
  const moduleName = key.replace(/(\.\/|\.vue)/g, '')
  tools[moduleName] = markRaw(toolFiles(key).default)
})

export default tools