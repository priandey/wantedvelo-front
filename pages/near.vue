<template app>
    <v-main>
      <v-card>
        <SearchLocationBar></SearchLocationBar>
        <LocateUser
        autoLocate
        hide></LocateUser>
      </v-card>
      <v-img> <!-- Map is warped in an image to prevent clashes between vuetify z-index (0-10) and leaflet z-index (100-1100) -->
      <div id="map-wrap" style="height: 75vh">
          <l-map :zoom=9 :center="centerPoint" @update:center="updateCenter($event)"> <!-- TODO: Feature idea => Component should react to zoom change by expanding its near circle accordingly -->
            <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
                <l-marker
                  v-for="bike in bikes"
                  v-bind:key="bike.pk"
                  :lat-lng="[bike.robbed_location.latitude, bike.robbed_location.longitude]"
                  @click="openDialog($event,bike.pk)"
                >
                  <l-tooltip><v-img :src="bike.picture" max-width="250"></v-img></l-tooltip>
                </l-marker>
          </l-map>
      </div>
      </v-img>
      <v-dialog
      v-model="dialog">
        <bike-alert
          v-if="dialog"
          :bike-id="selected"
          in-modal="true"></bike-alert>
      </v-dialog>
    </v-main>
</template>

<script>
  export default {
        name: "near",
        data() {
          return {
            bikes: [],
            selected: null,
            dialog:false,
            boundary: 50,
          }
        },
        methods: {
          openDialog(event,bikePk) {
            this.selected = bikePk;
            this.dialog = true;
            return false // Dirty way to stop event propagation manually
          },
          updateCenter(e) {
            this.$store.commit('setPoint', {lat:e.lat, lon:e.lng});
          },

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
            this.$fetch()
          },
        },
    async fetch() {
          this.bikes = await this.$axios.get("/", {
            params: {
              search_type: 'near',
              lon: this.centerPoint[1],
              lat: this.centerPoint[0],
              limit: 80
            }
          })
            .then(response => response.data.results)
    }

    }
</script>

<style scoped>
</style>
