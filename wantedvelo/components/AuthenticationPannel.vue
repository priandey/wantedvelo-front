<template>
    <div>
        <v-text-field
        label = 'Mail'
        v-model = "user.email"
        v-on:keyup.enter = "send_mail"
         />
         <v-text-field
         label = '6-Digit Token'
         v-model = 'credentials.loginToken'
         v-on:keyup.enter = "get_token"
          />
    </div>
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
              phone: '',
              username: '',
          },
          error: {
              errored: false,
              error_message:'',
          },
          isAuthenticated: false,
          mail_sent: false,
          open_edition: false,
          // API Endpoints below
          send_mail_ep: "pwl/auth/email/",
          send_token_ep: "pwl/auth/token/",
      }
  },
  mounted () {
        if (storageAvailable('sessionStorage')) {
            if (sessionStorage.getItem('authToken')) {
                this.isAuthenticated = true;
                this.credentials.authToken = sessionStorage.getItem('authToken');
                this.$axios.setToken(sessionStorage.getItem('authToken'), 'Token')
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
                        this.credentials.authToken = response.data.token;
                        this.$axios.setToken(response.data.token, 'Token')
                        this.error.errored = false;
                    }
                })
                .catch(error => {
                    this.error.errored = true;
                    this.error.error_message = Object.entries(error.response.data)[0][1][0]
                    this.credentials.loginToken = "";
                    this.isAuthenticated = false ;
                })
        },

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

<style></style>
