import drag from './el-drag-dialog/drag'
import adaptive from './el-table/adaptive'
import permission from './permission/permission'
import sticky from './sticky/sticky'
import waves from './waves/waves'

const directives = {
  drag,
  adaptive,
  has:permission,
  sticky,
  waves
}
export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key])
    })
  }
}
