<template>
  <v-tooltip right>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        dark
        v-bind="attrs"
        v-on="on"
        v-if="!hide"
        @click="updateCoords"
      >
        <v-icon>mdi-crosshairs-gps</v-icon>
      </v-btn>
    </template>
    <span>Autour de moi</span>
  </v-tooltip>
</template>

<script>
    export default {
        name: "LocateUser",
        props: {
          hide: {
            default: false,
            type: Boolean
          },
          autoLocate: {
            default: true,
            type: Boolean
          }
        },
        data() {
            return {
              point: this.$store.state.localisation.point,
            }
        },
      mounted() {
          if(this.autoLocate) {
            this.updateCoords()
          }
      },
      methods: {
          updateCoords() {
            getUserCoordinates()
            .then(coords => {
              this.$store.commit('setPoint', {
                lat: coords.lat,
                lon: coords.lon
              });
            })
          },
      },
    }
    function getUserCoordinates() {
      return new Promise((resolve, reject) => {
        let coords = {
          lat:'',
          lon:'',
        };
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (position) {
            coords.lat = position.coords.latitude;
            coords.lon = position.coords.longitude;
            resolve(coords);
          }, () => resolve({
            lat:48.852969,
            lon:2.349903,
          }))
        } else {
          reject(new Error("Failed to geolocate"));
        }
      });
    };
</script>

<style scoped>

</style>
