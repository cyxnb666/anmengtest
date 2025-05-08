import { login, logout } from '@/api/modules/common';
import { getToken, setToken, removeToken } from '@/utils/auth';
import { resetRouter } from '@/router';


const state ={
  token:getToken(),
  name: 'admin',
  avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
};

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state,{});
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
};

const actions = {
  // user login
  login({ commit }, data) {
    return new Promise((resolve, reject) => {
      let { username,
        password,
        rememberMe,
        code,
        uuid, } = data;
      const config = {
        password,
        picCode: code,
        uuid,
        userCode: username
      };
      login(config).then(response => {
        const { data } = response;
        const { token, role = [], userCode, userName } = data;
        const userInfo = {
          token,
          userCode,
          userName: encodeURIComponent(userName),
          role: role.map(v => {
            return { id: v.id };
          })
        };
        commit('SET_TOKEN', userInfo);
        setToken(userInfo, rememberMe);
        resolve(response);
      }).catch(error => {
        console.log(error, 'error');
        reject(error);
      });
    });
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('RESET_STATE');
        commit('SET_TOKEN', '');
        removeToken();
        resetRouter();
        dispatch('tagsView/delAllViews', null, { root: true });
        dispatch('permission/resetRoutes', null, { root: true });
        window.location.reload()
        resolve();
      });

    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken();
      commit('RESET_STATE');
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
