<template>
  <v-bottom-sheet
    v-model="sheet"
    inset
  >
    <div
      class="bottomSheet text-center"
    >
      <h2>Connexion</h2>
      <div class="loginForm">
        <v-text-field
          label = 'Mail'
          v-model = "user.email"
          v-on:keyup.enter = "send_mail"></v-text-field>
        <v-text-field
          label = '6-Digit Token'
          v-model = 'credentials.loginToken'
          v-on:keyup.enter = "get_token"></v-text-field>
      </div>
    </div>
  </v-bottom-sheet>
</template>

<script>
  export default {
    data() {
      return {
        credentials: {
          loginToken: '',
          authToken: '',
        },
        user: {
          email: '',
      },
        error: {
          errored: false,
          error_message:'',
        },
        sheet:false,
        mail_sent: false,
        open_edition: false,
        // API Endpoints below
        send_mail_ep: "pwl/auth/email/",
        send_token_ep: "pwl/auth/token/",
        verify_auth_token_ep: "pwl/verify/",
      }
    },
    mounted () {
      if (storageAvailable('sessionStorage')) {
        if (sessionStorage.getItem('authToken')) {
          let authToken = sessionStorage.getItem('authToken');
          this.verify_auth_token(authToken);
        }
      } else {
        console.log('Navigateur incompatible');
      }
    },
    methods: {
      send_mail() {
        this.$axios.post(this.send_mail_ep, {'email': this.user.email})
          .then(response => {
            // Gerer la réponse
            if (response.status === 200) {
              this.mail_sent = true;
              this.error.errored = true;
              this.error.error_message = "Veuillez consulter le mail renseigné et recopier le token"
            }
          })
          .catch(error => {
            this.error.errored = true;
            this.error.error_message = Object.entries(error.response.data)[0][1][0];
          })
      },
      get_token () {
        this.$axios.post(this.send_token_ep, {
          'email': this.user.email,
          'token': this.credentials.loginToken
        })
          .then(response => {
            // Gerer la réponse
            if (response.status === 200) {
              sessionStorage.setItem('authToken', response.data.token);
              this.mail_sent = false;
              this.credentials.loginToken = '';
              this.$store.commit('authenticate');
              this.$axios.setToken(response.data.token, 'Token');
              this.error.errored = false;
              this.sheet = false;
            }
          })
          .catch(error => {
            this.error.errored = true;
            this.error.error_message = Object.entries(error.response.data)[0][1][0];
            this.credentials.loginToken = "";
          })
      },
      verify_auth_token (token) {
        this.$axios.get(this.verify_auth_token_ep, {
          headers: {
            Authorization: 'Token ' + token //the token is a variable which holds the token
          }
        })
          .then(response => {
            if (response.status === 200) {
              this.$store.commit('authenticate');
              this.$axios.setToken(token, 'Token');
              this.sheet = false;
              return true
            } else {
              return false
            }
          })
      }

    },
  }

  function storageAvailable(type) {
    try {
      var storage = window[type],
        x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    }
    catch(e) {
      return e instanceof DOMException && (
          // everything except Firefox
        e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage.length !== 0;
    }
  };
</script>
<style scoped>
  .bottomSheet {
    background-color : var(--v-primary-base);
  }

  .loginForm {
    margin-right: 10%;
    margin-left: 10%;
  }
</style>
