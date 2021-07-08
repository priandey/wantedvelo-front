export const state = () => ({
  firstVisit: false,
  auth: {
    isAuthenticated: false,
    authToken: '',
    showPannel: false,
    user: {
      is_institution: false,
      is_moderation: false,
      email:'',
      geographic_zone: '',
    }
  },
  addBikePannel: false,
  localisation: {
    point: {
      lat: 48.92313275913779,
      lon: 2.2521972656250004,
    },
  },
})

export const mutations = {
  authenticate(state, token) {
    state.auth.isAuthenticated = true;
    state.auth.authToken = token;
    state.auth.showPannel = false;
  },

  firstVisit(state) {
    state.firstVisit = true;
    localStorage.setItem('firstVisit', 'true')
  },

  notFirstVisit(state) {
    state.firstVisit = false;
    localStorage.setItem('firstVisit', 'false')
  },

  registerUser(state, user) {
    state.auth.user = user
  },

  resetAuth(state) {
    localStorage.removeItem('authToken');
    this.$axios.setToken(false);
    state.auth.isAuthenticated = false;
    state.auth.authToken = false;
  },

  setPoint(state, point) {
    /* Takes a {lat:x, lon:x} point object */
    state.localisation.point = point
  },

  openAuthPannel(state) {
    state.auth.showPannel = true;
  },

  closeAuthPannel(state) {
    state.auth.showPannel = false;
  },

  openBikePannel(state) {
    state.addBikePannel = true;
  },

  closeBikePannel(state) {
    state.addBikePannel = false;
  }
}
