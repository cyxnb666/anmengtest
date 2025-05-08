import Cmp from './src'

Cmp.install = function(Vue) {
  Vue.component(Cmp.name, Cmp)
}

export default Cmp