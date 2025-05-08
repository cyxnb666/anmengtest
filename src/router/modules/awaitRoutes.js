// 同步路由
import Layout from '@/layout';

// 常规路由-所有角色及权限均可访问
export const constantRoutes = [
  // 重定向页面，刷新需要用到
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/layouts/redirect.vue')
      }
    ]
  },
  { // 登录页
    path: '/login',
    name: 'Login',
    meta: { title: '登录' },
    hidden: true,
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/',
    component: Layout,
    hidden: true,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      hidden: true,
      component: () => import('@/views/dashboard/index')
    }]
  },

  { // 404页
    path: '/404',
    name: '404',
    meta: { title: '404' },
    hidden: true,
    component: () => import('@/views/layouts/404.vue')
  },
  { // 
    path: '/ruleLogManagement/logDetails',
    hidden: true,
    component: () => import('@/views//ruleLogManagement/logDetails/index.vue')
  },

];
