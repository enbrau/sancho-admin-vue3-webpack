const SET_INITIALIZED        = 'SET_INITIALIZED'
const SET_AVAILABLE_WIDGETS  = 'SET_AVAILABLE_WIDGETS'
const SET_PREFERANCE_WIDGETS = 'SET_PREFERANCE_WIDGETS'
const SET_PREFERANCE_OBJECT  = 'SET_PREFERANCE_OBJECT'

const state = {
  initialized: false,
  availableWidgets: [],
  preferanceWidgets: [],
  preferanceObject: null
}

const mutations = {
  [SET_INITIALIZED]: (state, initialized) => {
    state.initialized = initialized
  },
  [SET_AVAILABLE_WIDGETS]: (state, widgets) => {
    state.availableWidgets = widgets
  },
  [SET_PREFERANCE_WIDGETS]: (state, widgets) => {
    state.preferanceWidgets = widgets
  },
  [SET_PREFERANCE_OBJECT]: (state, object) => {
    state.preferanceObject = object
  }
}

const actions = {
  setInitialized({ commit }, initialized) {
    commit(SET_INITIALIZED, initialized)
  },
  setAvailableWidgets({ commit }, widgets) {
    commit(SET_AVAILABLE_WIDGETS, widgets)
  },
  setPreferanceWidgets({ commit }, widgets) {
    commit(SET_PREFERANCE_WIDGETS, widgets)
  },
  setPreferanceObject({ commit }, object) {
    commit(SET_PREFERANCE_OBJECT, object)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
