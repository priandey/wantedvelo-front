<template>
  <v-container>
    <template v-if="isAuthenticated">
      <v-expansion-panels
      inset>
        <v-expansion-panel
        v-for="bike in bikes"
        :key="bike.pk">
          <v-expansion-panel-header>
            {{ bike.name }}
          </v-expansion-panel-header> <!-- TODO : Add report and add Markers accordingly -->
          <v-expansion-panel-content>
              <v-card elevation="0">
                <v-card-title>Référence : {{ bike.reference }}</v-card-title>
                <v-card-subtitle><v-chip v-for="trait in bike.traits" :key="trait">{{ trait }}</v-chip></v-card-subtitle>
                <v-img :src="bike.picture" max-width="450"></v-img>
                <template v-if="bike.alerts.length > 0">
                  <v-card-title>Votre vélo a été vu !</v-card-title>
                  <v-card-text>
                    <v-expansion-panels>
                      <v-expansion-panel v-for="alert in bike.alerts" :key="alert.date" @click="debugLeaflet">
                        <v-expansion-panel-header>Vu le {{ alert.date }}</v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <strong>Message de l'utilisateur :</strong> {{ alert.message }}
                          <v-img> <!-- TODO: Leaflet loading only one tile on mount -->
                            <div id="map-wrap" style="height: 40vh">
                              <l-map :zoom=15 :center="[alert.coords.lat, alert.coords.lon]">
                                <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
                                <l-marker :lat-lng="[alert.coords.lat, alert.coords.lon]">
                                  <l-tooltip>Votre vélo a été vu ici !</l-tooltip>
                                </l-marker>
                              </l-map>
                            </div>
                          </v-img>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-card-text>
                </template>
                <template v-else>
                  <v-card-title>Votre vélo n'a été repéré par personne...pour le moment !</v-card-title>
                </template>
              </v-card>

          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <template v-if="noBike">
        <v-card>
          <v-card-title>Vous n'avez pas déclaré de vol de vélo !</v-card-title>
          <v-card-subtitle>Quelle chance !</v-card-subtitle>
          <v-card-actions>
            <v-btn
            color="primary"
            @click="$store.commit('openBikePannel')">
              Malheureusement, j'aimerais déclarer un vol...
            </v-btn>
          </v-card-actions>
          <new-bike @creationEnded="$fetch"></new-bike>
        </v-card>
      </template>
    </template>
    <template v-else>
      <h1>Vous devez vous identifier pour accèder à vos vélos !</h1>
      <v-btn @click="openAuthPannel">S'identifier</v-btn>
    </template>
  </v-container>
</template>

<script>
    export default {
        name: "owned",
      data () {
          return {
            bikes:null,
          }
      },

      computed: {
        isAuthenticated() {
          return this.$store.state.auth.isAuthenticated
        },
        noBike() {
          return this.bikes === null || this.bikes.length < 1
        }
      },

      watch: {
        isAuthenticated() {
          if(this.isAuthenticated) {
            this.$fetch()
          } else {
            this.bikes = null
          }
        }
      },
      methods: {
        openAuthPannel() {
          this.$store.commit('openAuthPannel');
        },

        debugLeaflet() {
          // Resolving Leaflet map not working well with webpack
          setTimeout(function() { window.dispatchEvent(new Event('resize')) }, 250);
        }
      },
      async fetch() {
          if (this.isAuthenticated) {
          this.bikes = await this.$axios.get('/', {
            params: {
              search_type: 'owned',
              limit: 200,
            }
          })
            .then(response => response.data.results)
          }
    }
    }
</script>

<style scoped>

</style>
