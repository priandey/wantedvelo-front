<template>
  <!-- TODO : Redo all this crap it's ugly -->
  <v-bottom-sheet
    v-model="sheet"
    inset
  >

      <v-stepper v-model="stepper.step">
        <v-stepper-header>
          <v-divider></v-divider>
          <v-stepper-step
            :complete="stepper.step > 1"
            step="1"
          >
            Entrez votre email
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step
            :complete="stepper.step > 2"
            step="2"
          >
            Copiez le code reçu par mail
          </v-stepper-step>
          <v-divider></v-divider>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">

            <v-text-field
            label="Connexion ou création de compte"
            placeholder="Email"
            hint="Si vous n'avez pas de compte, il sera créé automatiquement"
            v-model="user.email"
            :error="error.errored"
            :error-messages="error.error_message"
            @keyup.enter="send_mail"></v-text-field>

            <v-btn
              color="primary"
              :loading="stepper.loading"
              :disabled="!mailFilled"
              @click="send_mail"
            >
              Continuer
            </v-btn>

            <v-btn
              text
              @click="$store.commit('closeAuthPannel')">
              Annuler
            </v-btn>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-text-field
              label="Entrez le code reçu par mail"
              placeholder="Code à 6 chiffres"
              hint="N'oubliez pas de regarder dans le dossier 'Indésirable'"
              :error="error.errored"
              :error-messages="error.error_message"
              v-model="credentials.loginToken"
              @keyup.enter="get_token"></v-text-field>

            <v-btn
              color="primary"
              :loading="stepper.loading"
              :disabled="!tokenFilled"
              @click="get_token"
            >
              Valider
            </v-btn>

            <v-btn
              text
              @click="stepper.step = 1">
              Revenir à l'étape précédente
            </v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
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
        stepper: {
          step: 1,
          loading:false
        },
        activate:false,
        // API Endpoints below
        send_mail_ep: "pwl/auth/email/",
        send_token_ep: "pwl/auth/token/",
        verify_auth_token_ep: "pwl/verify/",
      }
    },
    computed : {
      sheet : {
        get () {
          return this.$store.state.auth.showPannel
        },
        set() {
          this.$store.commit('closeAuthPannel')
        }
      },
      mailFilled() {
        return this.user.email.length > 0
      },
      tokenFilled() {
        return this.credentials.loginToken.length === 6
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
        this.stepper.loading = true;
        this.$axios.post(this.send_mail_ep, {'email': this.user.email})
          .then(response => {
            // Gerer la réponse
            if (response.status === 200) {
              this.error.errored = false;
              this.stepper.loading = false;
              this.stepper.step = 2
            }
          })
          .catch(error => {
            this.stepper.loading = false;
            this.error.errored = true;
            this.error.error_message = Object.entries(error.response.data)[0][1][0];
          })
      },
      get_token () {
        this.stepper.loading = true;
        this.$axios.post(this.send_token_ep, {
          'email': this.user.email,
          'token': this.credentials.loginToken
        })
          .then(response => {
            if (response.status === 200) {
              this.stepper.loading = false;
              sessionStorage.setItem('authToken', response.data.token);
              this.credentials.loginToken = '';
              this.$store.commit('authenticate');
              this.$axios.setToken(response.data.token, 'Token');
              this.error.errored = false;
            }
          })
          .catch(error => {
            this.stepper.loading = false;
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
              this.$store.commit('authenticate', token);
              this.$axios.setToken(token, 'Token');
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
