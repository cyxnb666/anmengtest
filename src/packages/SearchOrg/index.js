// 导入组件，组件必须声明 name
import Cmp from './src'

// 为组件提供 install 安装方法，供按需引入
Cmp.install = function(Vue) {
  Vue.component(Cmp.name, Cmp)
}

// 默认导出组件
export default Cmp
