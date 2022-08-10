import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
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
      const { name, avatar } = result.data;
      commit('SET_NAME', name);
      commit('SET_AVATAR', avatar)
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

