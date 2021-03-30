export const state = () => ({
  auth: {
    isAuthenticated: false,
    authToken: '',
  },
  localisation: {
    point: {
      lat:43,
      lon: 54,
    },
  },
})

export const mutations = {
  authenticate(state) {
    state.auth.isAuthenticated = true;
  },

  reset(state) {
    state.isAuthenticated = false;
  },

  setPoint(state, point) {
    /* Takes a {lat:x, lon:x} point object */
    state.localisation.point = point
  }
}
