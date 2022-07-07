const SET_APPS = 'SET_APPS'
const SET_STATE   = 'SET_STATE'

const state = {
  apps: []
}

const mutations = {
  [SET_APPS]: (state, apps) => {
    state.apps = apps
  },
  [SET_STATE]: (state, newState) => {
    Object.assign(state, newState)
  }
}

const actions = {
  setApps({ commit }, apps) {
    commit(SET_APPS, apps)
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
