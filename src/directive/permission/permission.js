import store from '@/store'
import {checkPermission} from '@/utils/permission'

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
