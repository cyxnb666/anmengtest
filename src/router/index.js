import Vue from 'vue'
import Router from 'vue-router'
import guard from '@/permission'
import { constantRoutes } from './modules/awaitRoutes'

Vue.use(Router)



const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()
guard(router)

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
