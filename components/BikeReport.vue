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
          <v-dialog>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-on="on">Localiser ailleurs</v-btn>
            </template>
            <SelectLocation @confirm="setCoords($event)"></SelectLocation>
          </v-dialog>
        </v-card-text>
        <v-card-text v-else>
          <strong>Vous avec été localisé avec succès</strong>
        </v-card-text>

        <locate-user
        v-if="askedLocation"
        autoLocate
        hide
        @userLocated="toggleAutoLocated"></locate-user>

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
            coords: {
              lat:'',
              lon:'',
            },
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
        toggleAutoLocated() {
          this.coords.lat = this.$store.state.localisation.point.lat;
          this.coords.lon = this.$store.state.localisation.point.lon;
          this.located = true
        },
        setCoords(e) {
          this.coords.lat = e.lat;
          this.coords.lon = e.lng;
          this.located = true
        },
        sendReport(){
          let report = {
            message: this.message,
            coords: this.coords
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
