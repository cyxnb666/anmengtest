import axios from 'axios'
const modulesFiles = require.context('./modules', true, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value
  return modules
}, {})

export const $api = async (path, ...arg) => {
  if (modules) {
    try {
      return path.split('/').reduce((obj, key) => obj[key], modules)(...arg)
    } catch {
      throw new Error(`请查看${path}模块下是否存在调用方法，并保证它的正确性`)
    }
  }
}

export const $all = async (...arg) => {
  return axios.all(arg)
}

export default {
  install (Vue) {
    Vue.prototype.$api = $api
    Vue.prototype.$all = $all
  }
}
