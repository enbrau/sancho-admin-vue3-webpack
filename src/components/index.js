import SvgIcon from '@/components/SvgIcon/index.vue'

const moduleFiles = require.context('@/icons', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(moduleFiles)
const iconNames = []
moduleFiles.keys().forEach((key) => {
  const iconName = key.replace(/^\.\/(.*)\.\w+$/, '$1').replace('../icons/', '').replace('.svg', '')
  iconNames.push(iconName)
  console.log(`[Sancho] Icon loaded: ${iconName}`)
})
export const icons = iconNames

export default {
  install: (app) => {
    app.component('SvgIcon', SvgIcon)
  }
}
