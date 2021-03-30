<template>
    <v-main>
      <LocateUser />
      <v-btn @click="centerElsewhere"></v-btn>
      <div id="map-wrap" style="height: 82vh">
        <client-only>
          <l-map :zoom=9 :center="centerPoint">
            <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
            <l-marker :lat-lng="centerPoint">
              <l-tooltip><v-card width="150"><v-card-title>COUCOU</v-card-title></v-card></l-tooltip>
            </l-marker>
          </l-map>
        </client-only>
      </div>
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
