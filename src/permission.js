import store from '@/store';
import { getDocumentTitle } from '@/utils';
import { whiteList } from '@/settings';
import { Message } from 'element-ui';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
NProgress.configure({ showSpinner: false });

export default function (router) {
  router.beforeEach(async (to, from, next) => {
    console.log('Route path:', to.path);
    console.log('Full route:', to);
    console.log('Is in whitelist:', whiteList.some(path => to.path.startsWith(path)));
    NProgress.start(); // 打开页面加载进度条

    document.title = getDocumentTitle(to.meta.title); // 设置页面标题
    // 白名单直接放行,不初始化路由
  if (whiteList.indexOf(to.path) !== -1) {
    return next();

  }
    if (store.getters.token) { // 用户已登录 ⬇
      // 拒绝其访问登录页，强制跳转回首页
      if (whiteList.indexOf(to.path) !== -1) {
        return next();
      }

      // 检查用户信息存在否，存在放行 ⬇
      const hasRoutes = (store.getters.permission_routes || []).length > 0;
      if (hasRoutes) {
        return next();
      }
      // 不存在获取 ⬇
      try {
        const accessRoutes = await store.dispatch('permission/initRoutes');
        router.addRoutes(accessRoutes);
        if ((to.path === '/' || to.path === '/dashboard') && store.getters.firstPath) {
          return next({ ...to, path: store.getters.firstPath, replace: true });
        }
        return next({ ...to, replace: true });
      } catch (error) {
        // 获取错误，注销登录并提示错误
        await store.dispatch('user/resetToken');
        Message.error(error || 'Has Error');
        next(`/login`);
      }
    } else { // 用户未登录 ⬇
      if (whiteList.indexOf(to.path) !== -1) {
        next();
      } else {
        // 如不在白名单内，则跳转登录页面
        next(`/login`);
      }
    }
  });

  router.afterEach(() => {
    NProgress.done(); // 关闭页面加载进度条
  });
}