<template>
  <!-- TODO : 2-time information. First with info and picture, second with traits -->
    <v-bottom-sheet
    v-model="openPannel"
    inset
    transition="slide-x-transition"
    overlay-opacity="0.9">
      <locate-user
        auto-locate
        hide></locate-user>
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
          <v-file-input
            v-model="bike.file"
            :rules="imageRules"
            accept="image/png, image/jpeg, image/bmp"
            placeholder="Choisissez une image de votre vélo"
            prepend-icon="mdi-camera"
            label="Image"
            show-size
          ></v-file-input>
      </v-form>
      <search-create-traits
      @updateTraitsList="updateTraits"></search-create-traits>
      <v-btn
      @click="submit"
      :disabled="!isValid">Enregistrer mon vélo</v-btn>
    </v-bottom-sheet>
</template>
<!-- fields : 'name', 'picture', 'reference', -->
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
          }
        },
        data () {
          return {
            isValid:false,
            bike: {
              name: null,
              reference: null,
              file: null,
              robbed:true,
            },
            traits: [],
            imageRules: [
              v => !!v || 'Une image est requise',
              v => (v && v.size < 2000000) || 'Votre image est trop lourde (2MB max)',
            ],
            textRules: [
              v => !!v || 'Ce champ doit être rempli',
              v => (v && v.length > 0) || 'Ce champ doit être rempli',
            ],
          }
        },

      methods: {
          submit() {
            if (this.isValid) {
              var form_data = new FormData();
              form_data.append('robbed_location', JSON.stringify({
                latitude: this.$store.state.localisation.point.lat,
                longitude: this.$store.state.localisation.point.lon
              }));
              form_data.append('name', this.bike.name);
              form_data.append('robbed', this.bike.robbed);
              form_data.append('reference', this.bike.reference);
              form_data.append('picture', this.bike.file);

              this.$axios.post('/', form_data, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              })
                .then(bike => {
                  this.bike = bike.data;
                  this.$axios.patch('/bike/'+this.bike.pk+"/", {traits:this.traits})
                })
            }
          },
          updateTraits(traitsList) {
            this.traits = traitsList
          }
      }
    }
</script>

<style scoped>

</style>
