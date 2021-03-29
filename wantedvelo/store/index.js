export const state = () => ({
  auth: {
    isAuthenticated: false,
    authToken: '',
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
  }
}
