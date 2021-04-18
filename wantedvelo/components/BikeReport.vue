<template>
    <v-card>
      <template v-if="!reportSent && !reportErrored">
        <v-card-title>Vous avez vu ce vélo ?</v-card-title>
        <v-card-subtitle>Dites le à son propriétaire*</v-card-subtitle>

        <v-card-text>
        <v-textarea
        label="Circonstances du repérage"
        placeholder="Ex: Je l'ai vu attaché à un poteau près du 16 rue Barbotte"
        v-model="message"
        dense
        ></v-textarea>
        </v-card-text>
        <v-card-subtitle>Joignez-y une localisation* </v-card-subtitle>

        <v-card-text v-if="located === false">
          <v-btn @click="askLocation">Localiser ici</v-btn>
          ou
          <v-btn disabled>Localiser ailleurs (WIP)</v-btn>
        </v-card-text>
        <v-card-text v-else>
          <strong>Vous avec été localisé avec succès</strong>
        </v-card-text>

        <locate-user
        v-if="askedLocation"
        autoLocate
        hide
        @userLocated="toggleLocated"></locate-user>

        <v-card-actions>
          <v-btn color="primary" :disabled="!isReady" @click="sendReport">Envoyer le rapport<v-icon right>mdi-send</v-icon></v-btn>
        </v-card-actions>
      </template>
      <template v-else-if="reportSent && !reportErrored">
        <v-card-title>Merci de votre aide !</v-card-title>
        <v-card-subtitle> Vous pouvez quitter ce popup </v-card-subtitle>
      </template>
      <template v-else-if="reportErrored">
        <v-card-title>Une erreur s'est produite.</v-card-title>
        <v-card-subtitle>{{ errorMessage }}</v-card-subtitle>
      </template>
    </v-card>
</template>

<script>
    export default {
      name: "BikeReport",
      props: {
        bikeId: {
          type: Number
        }
      },
      data() {
          return{
            message:'',
            located: false,
            askedLocation: false,
            reportSent: false,
            reportErrored: false,
            errorMessage: ''
          }
      },
      computed: {
        isReady() {
          return this.located && this.message.length > 0;
        },
      },
      methods: {
        askLocation() {
          this.askedLocation = true
        },
        toggleLocated() {
          this.located = true
        },
        sendReport(){
          let report = {
            message: this.message,
            coords: {
              lon: this.$store.state.localisation.point.lon,
              lat: this.$store.state.localisation.point.lat,
            }
          };
          this.$axios.post('/bike/' + this.bikeId + '/found/', report)
            .then(response => {
              this.reportSent = true
            })
            .catch(e => {
              this.reportErrored = true;
              this.errorMessage = e
            })

          // TODO : Actually send the report
        }
      }
    }
</script>

<style scoped>

</style>
