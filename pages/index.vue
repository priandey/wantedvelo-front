<template app>
    <v-main>
        <v-container>
          <v-row class="mt-1">
              <SearchCreateTraits
              :menuprops="{maxHeight:'150px'}"
              :create-if-none="false"
              :chips="true"
              @updateTraitsList="updateFiltering($event)"
              @selectionEmpty="refresh"
              icon="mdi-magnify"
              label="Cherchez un vélo"
              placeholder="Entrez une référence ou une caractéristique (marque, couleur, type de cadre, etc.)"></SearchCreateTraits>
          </v-row>
            <v-row>
                <v-col
                v-for="bike in this.bikes"
                :key="bike.pk"
                xl="2"
                lg="3"
                md="4"
                sm="6"
                cols="12"
                >
                  <v-dialog
                  :width="dialogWidth">
                    <template v-slot:activator="{ on, attrs }">
                      <v-card
                      height="250"
                      hover
                      v-on="on"
                      >
                        <v-img
                        v-bind:src="bike.picture"
                        gradient="rgba(0,0,0,.5), rgba(0,0,0,.23)"
                        max-height="160"
                        min-height="66%"
                        >
                        </v-img>
                        <v-card-title>
                          <div class="truncated"> {{ bike.reference }} </div>
                          <v-card-actions>
                            <v-dialog
                            :width="dialogWidth">
                              <template v-slot:activator="{ on:dialog, attrs}">
                                <v-tooltip top>
                                  <template v-slot:activator="{on:tooltip, attrs}">
                                <v-btn
                                color="primary"
                                dark
                                medium
                                absolute
                                center
                                right
                                v-on="{...tooltip, ...dialog}"
                                >
                                    <v-icon large>mdi-eye-plus-outline</v-icon>
                                 </v-btn>
                                  </template>
                                  <span>J'ai vu ce vélo !</span>
                                </v-tooltip>
                              </template>
                              <bike-report :bikeId="bike.pk"></bike-report>
                            </v-dialog>
                        </v-card-actions></v-card-title>
                        <v-card-subtitle><span v-if="bike.robbery_city">À {{ bike.robbery_city }}, </span>le {{ bike.date_of_robbery}}</v-card-subtitle>
                      </v-card>
                    </template>
                    <bike-alert
                      in-modal="true"
                      :provided-bike="bike"></bike-alert>
                  </v-dialog>

            </v-col>
        </v-row>
          <v-row v-if="bikes.length >= 24">
            <v-col cols="12"><v-btn @click="$fetch">Load More</v-btn></v-col>
            <v-col cols="12"><v-progress-linear indeterminate v-intersect="infiniteScroll"></v-progress-linear></v-col>
          </v-row>
    </v-container>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            large
            fixed
            bottom
            :style="{left: '50%', transform:'translateX(-50%)'}"
            fab
            @click="addBike"
            v-on="on"
          >
            <v-icon>mdi-alert-plus</v-icon>
          </v-btn>
        </template>
        <span>Mon vélo a disparu !</span>
      </v-tooltip>
      <new-bike @creationEnded="refresh"></new-bike>
</v-main>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        endpoints : {
          bikes: "/bikes/",
          search_type:'all',
          traits: null,
        },
        bikes: [],
        bikeCount: 24,
        bikeOffset: 0,
        showModal: false,
      }
    },
    methods : {
      refresh() {
        this.bikes = [];
        this.bikeOffset = 0;
        this.endpoints.search_type = 'all';
        this.endpoints.traits = null;
        this.$fetch();
      },
      updateFiltering(traits) {
        if(traits.length > 0) {
          this.bikes = [];
          this.bikeOffset = 0;
          this.endpoints.search_type = 'filtered';
          this.endpoints.traits = traits.join();
          this.$fetch();
          console.log(event)
        }
      },
      infiniteScroll (entries, observer, isIntersecting) {
        if (isIntersecting) {
            this.$fetch();
        }
      },
      addBike(){
        if (this.$store.state.auth.isAuthenticated === false) {
          this.$store.commit('openAuthPannel')
        }
        this.$store.commit('openBikePannel');
        this.$router.replace({'query':null})
      },
    },
    async fetch() {
      await this.$axios.get('', {
        params: {
          'limit': this.bikeCount,
          'offset': this.bikeOffset,
          'search_type': this.endpoints.search_type,
          'traits': this.endpoints.traits
        }
      })
        .then(response => {
          response.data.results.forEach(bike => {
            this.bikes.push(bike)
          });
          this.bikeOffset += this.bikeCount
        })
    },
    mounted() {
      if (this.queryActions === "addBike") {
        this.addBike()
      }
      this.$fetch();
    },
    computed: {
      dialogWidth() {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs':
            return "80vw";
          case 'sm':
            return "80vw";
          case 'md':
            return "50vw";
          case 'lg':
            return "50vw";
          case 'xl':
            return "50vw"
        }
      },
      queryActions() {
        return this.$route.query.action
      }
    },
    watch: {
      queryActions(val) {
        if (val==="addBike") {
          this.addBike()
        }
      }
    },

  }
</script>
<style>
  .truncated {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 16ch;
  }
</style>
