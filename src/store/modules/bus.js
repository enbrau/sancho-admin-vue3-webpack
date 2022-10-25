const SET_READY_STATE = 'SET_READY_STATE'

const state = {
  readyState: 3
}

const mutations = {
  [SET_READY_STATE]: (state, newState) => {
    state.readyState = newState
  },
}

const actions = {
  setReadyState({ commit }, newState) {
    commit(SET_READY_STATE, newState)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
