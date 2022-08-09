const SET_APPS   = 'SET_APPS'
const SET_STATE  = 'SET_STATE'
const SET_ROUTES = 'SET_ROUTES'

const state = {
  apps: [],
  routes: null
}

const mutations = {
  [SET_APPS]: (state, apps) => {
    state.apps = apps
  },
  [SET_ROUTES]: (state, routes) => {
    state.routes = routes
  },
  [SET_STATE]: (state, newState) => {
    Object.assign(state, newState)
  }
}

const actions = {
  setApps({ commit }, apps) {
    commit(SET_APPS, apps)
  },
  setRoutes({ commit }, routes) {
    commit(SET_ROUTES, routes)
  },
  setState({ commit }, newState) {
    commit(SET_STATE, newState)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
