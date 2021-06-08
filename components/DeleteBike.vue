<template>
    <v-card>
      <v-card-title>Supprimer ce vélo de manière définitive</v-card-title>
      <v-card-actions>
        <v-btn
        color="red"
        @click="confirmDeletion">
          Supprimer ce vélo
        </v-btn>
        <v-btn
        color="grey"
        @click="closeDialog">
          Annuler
        </v-btn>
      </v-card-actions>
    </v-card>
</template>

<script>
    export default {
        name: "DeleteBike",
      props: {
          bikeId: {
            type: Number
          }
      },
      methods: {
          confirmDeletion() {
            this.$axios.delete(/bike/ + this.bikeId + '/')
              .then(response => {
                this.$router.go()
              })
              .catch(e => {
                console.log(e)
              })
          },

          closeDialog() {
            this.$emit('closeDialog')
          }
      }
    }
</script>

<style scoped>

</style>
