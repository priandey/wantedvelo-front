<template>
    <v-bottom-sheet
    v-model="openPannel"
    fullscreen
    transition="slide-x-transition"
    persistent
    scrollable>
      <v-card>
        <v-card-text height="100vh">
      <v-progress-linear
      v-if="isLoading"
      indeterminate></v-progress-linear>
      <v-container v-if="!isLoading && !isSent">

      <v-form v-model="isValid">
        <v-text-field
          v-model="bike.name"
          :rules="textRules"
          maxlength="100"
          counter
          required
          label="Nom du vélo"
          hint="Ex: Vélo de Sarah"
          prepend-icon="mdi-pencil"
        ></v-text-field>
        <v-text-field
          v-model="bike.reference"
          :rules="textRules"
          maxlength="255"
          required
          label="Référence du vélo"
          hint="Bicycode, numéro de série du cadre, etc."
          prepend-icon="mdi-barcode"
        ></v-text-field>
          <image-compressor @compressed="setFile($event)"></image-compressor>
      </v-form>

      <search-create-traits
      @updateTraitsList="updateTraits"></search-create-traits>
        <v-card-subtitle>Où votre vélo a-t-il disparu : </v-card-subtitle>
          <locate-user
            auto-locate
            hide
            v-if="location.autoLocate"
            @userLocated="setPoint([$store.state.localisation.point.lat, $store.state.localisation.point.lon])"></locate-user>
          <v-btn text outlined rounded @click="location.autoLocate = true">Localiser ici</v-btn>/
          <v-dialog
          v-model="location.dialog">
            <template v-slot:activator="{ on, attrs }">
              <v-btn text outlined rounded v-on="on">Localiser ailleurs</v-btn>
            </template>
            <SelectLocation @confirm="setPoint([$event.lat, $event.lng])"></SelectLocation>
          </v-dialog>
        <v-card-subtitle v-if="location.isLocated">Une localisation a été enregistrée (vous pouvez en changer)</v-card-subtitle>

      <v-card-actions>
      <v-btn
      @click="submit"
      :disabled="!readyToSubmit">Enregistrer mon vélo</v-btn>
      </v-card-actions>
      </v-container>
      <v-container v-if="!isLoading && isSent">
        <v-card-title><v-icon color="primary">mdi-check</v-icon>Votre vélo a bien été enregistré comme volé</v-card-title>
      </v-container>
        <v-card-actions><v-btn @click="endCreation">Fermer</v-btn></v-card-actions>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
</template>

<script>
    export default {
        name: "NewBike",
        computed: {
          openPannel: {
            get () {
              return this.$store.state.addBikePannel && this.$store.state.auth.isAuthenticated
            },
            set () {
              this.$store.commit('closeBikePannel')
            }
          },
          readyToSubmit() {
            return this.isValid && this.location.isLocated
          },
        },
        data () {
          return {
            isValid:false,
            isLoading:false,
            isSent:false,
            location: {
              autoLocate: false,
              dialog:false,
              isLocated: false,
              lat:null,
              lon:null,
            },
            bike: {
              name: null,
              reference: null,
              file: null,
              robbed:true,
            },
            traits: [],
            textRules: [
              v => !!v || 'Ce champ doit être rempli',
              v => (v && v.length > 0) || 'Ce champ doit être rempli',
            ],
          }
        },

      methods: {
          setPoint(coords) {
            if (coords != null) {
              this.location.lat = coords[0];
              this.location.lon = coords[1];
              this.location.isLocated = true;
            }
            this.location.dialog = false;
            this.location.autoLocate = false
          },
          setFile(e) {
            this.bike.file = e;
          },
          submit() {
            if (this.isValid) {
              var form_data = new FormData();
              form_data.append('robbed_location', JSON.stringify({
                latitude: this.location.lat,
                longitude: this.location.lon
              }));
              form_data.append('name', this.bike.name);
              form_data.append('robbed', this.bike.robbed);
              form_data.append('reference', this.bike.reference);
              form_data.append('picture', this.bike.file, this.bike.file.name);
              this.isLoading = true;

              this.$axios.post('/', form_data, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              })
                .then(bike => {
                  this.bike = bike.data;
                  this.$axios.patch('/bike/'+this.bike.pk+"/", {traits:this.traits})
                    .then(response => {
                      this.isLoading = false;
                      this.isSent = true;
                    })
                })
            }
          },
          updateTraits(traitsList) {
            this.traits = traitsList
          },
          endCreation() {
            this.$emit("creationEnded");
            this.isSent = false;
            this.$store.commit('closeBikePannel');
          }
      }
    }
</script>

<style scoped>

</style>
