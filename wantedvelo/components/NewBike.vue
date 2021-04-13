<template>
    <v-bottom-sheet
    v-model="openPannel"
    inset
    transition="slide-x-transition"
    overlay-opacity="0.9">
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
              traits: {},
              robbed:true,
            },
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
              this.$axios.post('/', this.bike)
            }
          },
      }
    }
</script>

<style scoped>

</style>
