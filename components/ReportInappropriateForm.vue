<template>
    <v-card>
      <template v-if="reportSent === false && error === false">
        <v-card-title>
          Ce contenu n'est pas approprié ?
        </v-card-title>
        <v-card-text>
          <v-select
          :items="items"
          v-model="selected"
          label="Sélectionnez la raison de votre signalement"
          ></v-select>
          <v-textarea
          label="Apporter des précisions si besoin"
          v-model="precision"
          rows="3"></v-textarea>
        </v-card-text>
        <v-btn
          color="primary"
          :disabled="!reasonSelected"
          :loading="loading"
          @click="sendReport"
        >Envoyer le rapport</v-btn>
        <v-btn
        color="grey"
        @click="closeDialog">Annuler</v-btn>
      </template>
      <template v-else-if="error === true">
        <v-card-title>Une erreur est survenue</v-card-title>
        <v-card-text>Description :  {{ errorMessage }} </v-card-text>
        <v-card-actions>
          <v-btn
          color="primary"
          @click="reinitialize">Ré-essayer</v-btn>
          <v-btn
          plain
          href="wantedbugs.priandey.eu"
          target="_blank">Signaler l'erreur</v-btn>
        </v-card-actions>
      </template>
      <template v-else-if="reportSent === true">
        <v-card-title>Merci de votre signalement !</v-card-title>
        <v-card-text>Nos équipes de modérations vont examiner ce contenu. Vous pouvez quitter cette fenêtre en cliquant en dehors</v-card-text>
      </template>
    </v-card>
</template>

<script>
    export default {
      name: "ReportInappropriateForm",
      props:{
          bikeId : {
            type: Number
          }
      },
      data() {
          return {
            items: [
              "Ce contenu est suspect et/ou publie du spam",
              "Les propos/images sont inappropriés ou dangereux",
              "Je suis le propriétaire de ce vélo (joindre une méthode de contact)",
              "Ce contenu exprime des idées suicidaires ou auto-destructrices",
              "Autre raison",
            ],
            selected: null,
            reasonSelected: false,
            precision: '',
            loading: false,
            reportSent: false,
            error: false,
            errorMessage: null,
          }
      },
      watch: {
          selected(val) {
            if (val != null) {
              this.reasonSelected = true
            } else {
              this.reasonSelected = false
            }
          },
      },
      methods: {
        async sendReport(){
          let form_data = new FormData();
          form_data.append("reason", this.selected);
          form_data.append("message", this.precision);
          form_data.append("bike", this.bikeId);
          try {
            this.loading = true;
            const token = await this.$recaptcha.execute('login');
            const isAuthorized = await fetch('/api/check-token', {
              method: 'POST',
              body: JSON.stringify({
                token,
              })
            })
              .then(res => res.json())
              .then(res => res.success);
            if (isAuthorized) {
              this.$axios.post('/ask_moderation/', form_data)
                .then(response => {
                  this.loading = false;
                  this.reportSent = true;
                })
                .catch(e => {
                  this.loading = false;
                  this.error = true;
                  this.errorMessage = e;
                  console.log("Error:",e)
                })
            }

          } catch (error) {
            this.loading = false;
            this.error = true;
            this.errorMessage = error;
            console.log('Error:', error)
          }
        },
        reinitialize() {
          this.selected = null;
          this.loading = false;
          this.reportSent = false;
          this.error = false;
          this.precision = '';
        },
        closeDialog() {
          this.$emit("closeDialog")
        }
      },
    }
</script>

<style scoped>

</style>
