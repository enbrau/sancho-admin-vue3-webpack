const modules = {}
const moduleFiles = require.context('./modules/', false, /\.js$/) 
moduleFiles.keys().forEach((key) => {
  const moduleName = key.replace(/(\.\/|\.js)/g, '')
  modules[moduleName] = moduleFiles(key)
  console.log(`[Sancho] API loaded: ${moduleName}`)
})

export default modules
