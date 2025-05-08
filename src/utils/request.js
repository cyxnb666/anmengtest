import axios from 'axios';
import router from '@/router';
import { Notification, MessageBox, Message } from 'element-ui';
import store from '../store';
import { getToken, removeToken } from '@/utils/auth';
import { timeout } from '@/settings';
import { useAgent, prevProxy } from '@/config';
import CommonLoading from './loading';
let isDev = process.env.NODE_ENV === 'development';
const loading = new CommonLoading();

export const createAxios = (baseURL, errorTip = false) => {
  const newInstance = axios.create({ baseURL, timeout: timeout });

  // request拦截器
  newInstance.interceptors.request.use(
    (config) => {
      if (config.needLoading) {
        loading.showFullScreenLoading();
      }
          // 添加白名单接口检查
    const noAuthApis = ['/ruleLog/getAgriRuleExecDateVO', '/ruleLog/queryExecLogPage'];
    const isNoAuthApi = noAuthApis.some(api => config.url.includes(api));
    
    // 非白名单接口才检查 token
    if (!isNoAuthApi && getToken()) {
      var userInfo = getToken();
      config.headers['token'] = userInfo.token;
      config.headers['userCode'] = userInfo.userCode;
      config.headers['userName'] = userInfo.userName;
    }
      if (getToken()) {
        var userInfo = getToken();
        config.headers['token'] = userInfo.token;
        config.headers['userCode'] = userInfo.userCode;
        config.headers['userName'] = userInfo.userName;
      }
      if (isDev && config.token && config.userCode) {
        config.headers['token'] = config.token;
        config.headers['userCode'] = config.userCode;
      }
      config.headers['Content-Type'] = 'application/json';
      return config;
    },
    (error) => {
      loading.tryHideFullScreenLoading();

      // Do something with request error
      console.log(error); // for debug
      Promise.reject(error);
    },
  );

  // response 拦截器
  newInstance.interceptors.response.use(
    (response) => {
      if (response.config.needLoading) loading.tryHideFullScreenLoading();

      const code = response.status;
      let resData = response.data || {};
      if (resData && resData.code == -3) {
        removeToken();
        Notification.error({
          title: resData.msg || '登录失效',
          duration: 2000,
          onClose() {
            location.reload();
          },
        });
        return Promise.reject(resData);
      }
      if (
        ((resData.code) ||
          errorTip ||
          resData.code == -5) &&
        resData.code !== 200
      ) {
        console.error(response);
        Message.error(resData.message || resData.msg || '请求错误');
        return Promise.reject(resData);
      } else if (code < 200 || code > 300) {
        Notification.error({
          title: response.message,
        });
        return Promise.reject(resData);
      } else {
        if (response.config.returnRes) {
          return response;
        }
        return response.data;
      }
    },
    (error, config) => {
      console.error(error);

      loading.tryHideFullScreenLoading();
      let code = 0;
      if (error?.config?.errorNoResTip) {
        return Promise.reject(error);
      }
      try {
        code = error.response.status;
      } catch (e) {
        if (error.toString().indexOf('Error: timeout') !== -1) {
          Notification.error({
            title: '网络请求超时',
            duration: 5000,
          });
          return Promise.reject(error);
        }
      }

      if (code) {
        if (code === 401) {
          MessageBox.confirm(
            '登录状态已过期，您可以继续留在该页面，或者重新登录',
            '系统提示',
            {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning',
            },
          ).then(() => {
            store.dispatch('user/logout').then(() => {
              location.reload(); // 为了重新实例化vue-router对象 避免bug
            });
          });
        } else if (code === 403) {
          router.push({ path: '/401' });
        } else {
          const errorMsg = error.response.data.message;
          Notification.error({
            title: errorMsg || '服务器开小差了',
            duration: 5000,
          });
        }
      } else {
        Notification.error({
          title: '接口请求失败',
          duration: 5000,
        });
      }
      return Promise.reject(error);
    },
  );

  return newInstance;
};
// 农险实例
let baseURL = useAgent ? prevProxy : process.env.VUE_APP_BASE_API;
const service = createAxios(baseURL);
export default service;
