import Vue from 'vue'
import { hasPerm } from '@/utils/permission'
import { $log } from '@/utils/tools'
import {$imgUrl} from '@/config'
import $api from '@/api'
import {ENV} from '@/settings'
import calc from '@/utils/calc'
import * as echarts from 'echarts'
import 'echarts/map/js/china.js'
import vueSeamlessScroll from 'vue-seamless-scroll' 
Vue.use(vueSeamlessScroll)

// 全局样式
import 'normalize.css'
import '@/styles/index.scss'
import "@/styles/text/text.css"
// 全局图标
import '@/icons'

// element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI, {
  size: 'small' // set element-ui default size
})

// 自定义指令
import Directives from '@/directive'
Vue.use(Directives)

// 全局组件
import TechUiTb from '@/packages'
Vue.use(TechUiTb)

Vue.use($api)
Vue.prototype.hasPerm = hasPerm
Vue.prototype.fileviewUrl = $imgUrl
Vue.prototype.$bus = new Vue() //事件总线
Vue.prototype.isDev=ENV==='development'
Vue.prototype.ENV=ENV
Vue.prototype.$calc = calc
Vue.prototype.$echarts = echarts
Vue.prototype.$log = $log





