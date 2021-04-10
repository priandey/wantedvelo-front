<template app>
    <v-main>
      <v-card>
        <SearchLocationBar></SearchLocationBar>
        <LocateUser></LocateUser>
        <v-btn @click="centerElsewhere"></v-btn>
      </v-card>
      <v-img> <!-- Map is warped in an image to prevent clashes between vuetify z-index (0-10) and leaflet z-index (100-1100) -->
      <div id="map-wrap" style="height: 100vh">
          <l-map :zoom=9 :center="centerPoint">
            <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
            <l-marker
              v-for="bike in bikes"
              v-bind:key="bike.pk"
              :lat-lng="[bike.robbed_location.latitude, bike.robbed_location.longitude]">
              <l-tooltip><v-card width="150"><v-card-title>{{ bike.reference}}</v-card-title></v-card></l-tooltip>
            </l-marker>
          </l-map>
      </div>
      </v-img>
    </v-main>
</template>

<script>
  export default {
        name: "near",
        data() {
          return {
            bikes: []
          }
        },
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
            console.log("changed");
            this.$fetch()
          },
        },
    async fetch() {
          this.bikes = await this.$axios.get("/", {
            params: {
              search_type: 'near',
              lon: this.centerPoint[1],
              lat: this.centerPoint[0],
              limit: 40
            }
          })
            .then(response => response.data.results)
    }

    }
</script>

<style scoped>
</style>
