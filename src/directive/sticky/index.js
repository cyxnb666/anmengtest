import sticky from './sticky'

const install = function(Vue) {
  Vue.directive('sticky', sticky)
}

if (window.Vue) {
  window.waves = sticky
  Vue.use(install); // eslint-disable-line
}

sticky.install = install
export default sticky
