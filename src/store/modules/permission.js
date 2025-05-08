import { asyncMockRoutes,asyncMockFuctionIdList } from '@/router/modules/asyncRoutes';
import { constantRoutes } from '@/router/modules/awaitRoutes';
import { deepClone } from '@/utils';
import { flatTree } from '@/utils/tree';
import { getMenus } from '@/api/modules/common';
import Layout from '@/layout';
import { getBool } from '@/utils/tools';
import { getToken } from '@/utils/auth';
import {isDev} from '@/settings'

export const filterAsyncRouter = (routers) => { // 遍历后台传来的路由字符串，转换为组件对象
  return routers.filter(router => {
    if (router.component) {
      if (router.component === 'Layout') { // Layout组件特殊处理
        router.component = Layout;
      } else {
        const component = router.component;
        router.component = loadView(component);
      }
    }
    let { hidden, cache, title, icon } = router;
    router.hidden = getBool(hidden);
    router.cache = getBool(cache);
    if (!router.meta) {
      router.meta = {
        title,
        icon
      };
    }

    if (router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children);
    }
    return true;
  });
};

export const loadView = (view) => {
  return (resolve) => require([`@/views/${view}`], resolve);
};
function getIndexPath(arr, result = []) {
  if (arr && arr.length > 0) {
    result.push(arr[0].path);
    if (arr[0].children && arr[0].children.length > 0) {
      return getIndexPath(arr[0].children, result);
    }
  }
}
export default {
  namespaced: true,
  state: {
    routes: [],
    addRoutes: [],
    firstPath: '',
    flatRouters: [],//扁平的路由
    funtionIdList:[],//按钮权限
  },
  mutations: {
    SET_ROUTES: (state, {routes,funtionIdList}) => {
      state.addRoutes = routes;
      state.routes = constantRoutes.concat(routes);
      state.flatRouters = flatTree(state.routes);
      state.funtionIdList=funtionIdList
    },
    SET_FIRST_PATH: (state, firstPath) => {
      state.firstPath = firstPath;
    },
    RESET_ROUTES: (state) => {
      state.routes = [];
    }
  },
  actions: {
    //判断是否有路由
    HandlerHasRoute({ state }, path) {
      let hasItem = state.flatRouters.find(v => v.path === path);
      return Promise.resolve(hasItem ? true : false);
    },
    resetRoutes({ commit }) {
      commit('RESET_ROUTES');
    },
    initRoutes({ commit }) {
      return new Promise(resolve => {
        let { role = [] } = getToken();
        getMenus({ roleIdList: role.map(it => it.id) }).then(res => {
          if (res.code === 200) {
            let { sysMenuVoList = [], funtionIdList = [] } = res.data;
            let list = isDev?sysMenuVoList.concat(asyncMockRoutes):sysMenuVoList;
            funtionIdList=isDev?funtionIdList.concat(asyncMockFuctionIdList):funtionIdList
            let result = [];
            getIndexPath(list, result);
            let str = result.join('/');
            let arr = str.split('//');
            let firstPath = arr[arr.length - 1];
            if (!firstPath.startsWith('/')) {
              firstPath = '/' + firstPath;
            }
            console.log(firstPath, 'firstPath');
            let asyncRoutes = filterAsyncRouter(list);
            console.log(asyncRoutes, 'asyncRoutes');

            asyncRoutes.push({ path: '*', redirect: '/404', hidden: true });
            commit('SET_FIRST_PATH', firstPath);
            commit('SET_ROUTES', {routes:asyncRoutes,funtionIdList});
            resolve(asyncRoutes);
          }
        });
      });
    }
  }
};
