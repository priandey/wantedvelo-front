<template>
  <v-card>
    <v-container>
  <v-img
    :src="bike.picture"
    max-height="50vh"
    contain></v-img>
    <v-card-title>Référence : {{bike.reference}}
      <v-card-actions>
        <v-dialog
          :width="dialogWidth">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              medium
              v-on="on"
            >
              <v-icon large>mdi-eye-plus-outline</v-icon>
            </v-btn>
          </template>
          <bike-report :bikeId="bike.pk"></bike-report>
        </v-dialog>
      </v-card-actions>
    </v-card-title>
    <v-card-subtitle>Disparu le : {{bike.date_of_robbery}} <nuxt-link :to="{name: 'alert-id', params:{id:bikeId}}">Lien direct</nuxt-link></v-card-subtitle>
      <template v-if="!inModal">
      <div id="map-wrap" style="height: 30vh">
        <l-map :zoom=10 :center="latLng">
          <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
          <l-marker
            :lat-lng="latLng">
          </l-marker>
        </l-map>
      </div>
      </template>
    </v-container>
  </v-card>
</template>

<script>
    export default {
      name: "BikeAlert",
      props: ['bikeId', 'inModal'],
      data() {
        return {
          bike: {
            robbed_location: {
              latitude:'43',
              longitude:'45',
            }
          },
        }
      },
      async fetch() {
        await this.$axios.get('/bike/'+this.bikeId)
          .then(response => {
            this.bike = response.data;
          })
      },

      computed:{
        latLng() {
          return [this.bike.robbed_location.latitude, this.bike.robbed_location.longitude]
        },
      }
    }
</script>

<style scoped>

</style>
