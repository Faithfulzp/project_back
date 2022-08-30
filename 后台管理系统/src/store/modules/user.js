import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter, constantRoutes, asyncRoutes, anyRoutes } from '@/router'
import router from '@/router';

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '', //用户名
    avatar: '', //用户头像
    routes: [], //返回的标记，不同用户应该展示哪些菜单的标记
    roles: [], //用户角色信息
    buttons: [], // 按钮的信息：按钮权限用的标记 
    resultAsyncRoutes: [], //过滤出来需要权限才能访问的路由
    resultAllRoutes: [], // 一个用户所能访问的所有路由的集合
  }
}

const state = getDefaultState()

const mutations = {
  // 重置state
  RESET_STATE: (state) => {
    // 清除数据 
    Object.assign(state, getDefaultState())
  },
  // 存储token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 获取用户信息
  SET_USERINFO(state, userInfo) {
    state.name = userInfo.name;
    state.avatar = userInfo.avatar;
    state.routes = userInfo.routes;
    state.roles = userInfo.roles;
    state.buttons = userInfo.buttons;
  },
  // 存储一个用户需要展示的所有路由
  SET_RESULTASYNCROUTES(state, asyncRoutes) {
    // 用户的异步路由
    state.resultAsyncRoutes = asyncRoutes;
    // 需要将一个用户所能展示的路由全部进行合并：常量、异步、任意
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes);
    // 给router添加一个新的路由，addRoutes是封装的一个路由方法
    router.addRoutes(state.resultAllRoutes);
  }
}
// 计算出，服务器返回的routes中，有哪些异步路由asyncRoutes需要展示
const computeAsyncRoutes = (asyncRoutes, routes) => {
  // 过滤出【超级管理员和普通员工】所需要展示的路由
  return asyncRoutes.filter((item) => {
    // 判断name是否存在，存在则可以查看该路由
    if (routes.indexOf(item.name) != -1) {
      // 递归：判断是否还有子路由，如果有则需要重新调用本函数
      if (item.children && item.children.length) {
        computeAsyncRoutes(item.children, routes);
      }
      return true;
    }
  })
}
const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password })
    // 请求返回的code成功可能是20000也可能是200
    if (result.code == 20000 || result.code == 200) {
      commit('SET_TOKEN', result.data.token);
      setToken(result.data.token);
      return 'ok';
    } else {
      return Promise(new Error('登录数据请求失败'));
    }
  },

  // get user info
  async getInfo({ commit, state }) {
    let result = await getInfo(state.token);
    // 请求返回的code成功可能是20000也可能是200
    if (result.code == 20000 || result.code == 200) {
      // 如果没有数据
      if (!result.data) {
        return Promise(new Error('用户数据请求失败，请重新登录'));
      }
      // 存储用户数据
      /* 
      需要获取的数据有：
      name：用户名
      avatar：用户头像
      routes：返回的标记，不同用户应该展示哪些菜单的标记
      roles：用户角色信息
      buttons：按钮的信息：按钮权限用的标记 
      */
      commit('SET_USERINFO', result.data);
      commit('SET_RESULTASYNCROUTES', computeAsyncRoutes(asyncRoutes, result.data.routes));
      return result.data;
    } else {
      return Promise(new Error('数据请求失败'));
    }
  },

  // user logout
  async logout({ commit, state }) {
    let result = await logout(state.token);
    // 请求返回的code成功可能是20000也可能是200
    if (result.code == 20000 || result.code == 200) {
      removeToken(); // 必须先清除token
      resetRouter(); // 重置路由
      commit('RESET_STATE');
      return 'ok';
    } else {
      return Promise(new Error('退出登录请求失败'));
    }
  },

  // remove token
  async resetToken({ commit }) {
    let result = await logout(state.token);
    // 请求返回的code成功可能是20000也可能是200
    if (result.code == 20000 || result.code == 200) {
      removeToken(); // 清除token
      commit('RESET_STATE');
      return 'ok';
    } else {
      return Promise(new Error('清除token请求失败'));
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

