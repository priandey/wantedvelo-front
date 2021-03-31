<template>
    <v-main>
      <v-card>
        <SearchLocationBar></SearchLocationBar>
        <LocateUser></LocateUser>
        <v-btn @click="centerElsewhere"></v-btn>
      </v-card>
      <v-img> <!-- Map is warped in an image to prevent clashes between vuetify z-index (0-10) and leaflet z-index(100-1100 -->
      <div id="map-wrap" style="height: 100vh">
          <l-map :zoom=9 :center="centerPoint">
            <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
            <l-marker :lat-lng="centerPoint">
              <l-tooltip><v-card width="150"><v-card-title>COUCOU</v-card-title></v-card></l-tooltip>
            </l-marker>
          </l-map>
      </div>
      </v-img>
    </v-main>
</template>

<script>
  export default {
        name: "near",
        methods: {
          centerElsewhere() {
            this.$store.commit('setPoint', {
              lat:32,
              lon: 54,
            });
          }
        },
        computed: {
          centerPoint() {
            return [
              this.$store.state.localisation.point.lat,
              this.$store.state.localisation.point.lon,
            ]
          }
        },
        watch: {
          centerPoint () {
            console.log("changed")
          },
        }

    }
</script>

<style scoped>
</style>
