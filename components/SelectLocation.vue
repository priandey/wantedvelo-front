<template>
  <v-card>
  <v-img> <!-- Map is warped in an image to prevent clashes between vuetify z-index (0-10) and leaflet z-index (100-1100) -->
    <div id="map-wrap" style="height: 50vh">
      <l-map :zoom=9 :center="centerPoint" @click="updateChoice">
        <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
        <l-marker
          v-if="choice"
          :lat-lng="[choice.lat, choice.lng]"
        >
        </l-marker>
      </l-map>
    </div>
  </v-img>
    <v-card-actions><v-btn @click="confirmChoice">Confirmer la localisation</v-btn></v-card-actions>
  </v-card>
</template>

<script>
    export default {
        name: "SelectLocation",
      data() {
          return {
            centerPoint: [this.$store.state.localisation.point.lat, this.$store.state.localisation.point.lon],
            choice: null,
          }
      },

      methods: {
          updateChoice(e) {
            this.choice = e.latlng
          },
        confirmChoice() {
            this.$emit('confirm', this.choice)
        }
      },

      mounted () {
        setTimeout(function() { window.dispatchEvent(new Event('resize')) }, 250);
      }
    }
</script>

<style scoped>

</style>
