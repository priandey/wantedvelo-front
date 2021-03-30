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
  authenticate(state, authToken) {
    state.auth.isAuthenticated = true;
    state.auth.authToken = authToken;
  },

  reset(state) {
    state.isAuthenticated = false;
    state.authToken = '';
  },

  setPoint(state, point) {
    /* Takes a {lat:x, lon:x} point object */
    state.localisation.point = point
  }
}
