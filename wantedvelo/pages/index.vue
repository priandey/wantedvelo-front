<template app>
    <v-main>
        <v-container>
            <v-row>
                <v-col
                v-for="bike in this.bikes"
                :key="bike.pk"
                lg="2"
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
                  >
                  </v-img>
                  <v-card-title>
                    {{ bike.reference }}
                    <v-card-actions>
                    <v-btn
                      color="primary"
                      dark
                      small
                      absolute
                      center
                      right
                    >
                      <v-icon>mdi-eye-plus-outline</v-icon>
                    </v-btn>
                  </v-card-actions></v-card-title>
                  <v-card-subtitle>{{ bike.robbery_date}}</v-card-subtitle>
                </v-card>
                    </template>
                    <bike-alert
                      :bike-id="bike.pk"
                      in-modal="true"></bike-alert>
                  </v-dialog>

            </v-col>
        </v-row>
          <v-row>
            <v-col><v-progress-linear indeterminate v-intersect="infiniteScroll"></v-progress-linear></v-col>
          </v-row>
    </v-container>
      <v-btn
        color="primary"
        large
        fixed
        bottom
        :style="{left: '50%', transform:'translateX(-50%)'}"
        fab
        @click="addBike"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <new-bike @creationEnded="refresh"></new-bike>
</v-main>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        endpoints : {
          bikes: "/bikes/"
        },
        bikes: [],
        bikeCount: 18,
        bikeOffset: 0,
        showModal: false,
      }
    },
    methods : {
      refresh() {
        this.bikes = [];
        this.bikeOffset = 0;
        this.get_bikes(this.bikeCount, this.bikeOffset);
        this.bikeOffset += 18;
      },
      get_bikes (itemcount, itemOffset) {
        this.$axios.get('', {
          params: {
            'limit': itemcount,
            'offset': itemOffset,
          }
        })
          .then(response => {
            response.data.results.forEach(bike => {
              this.bikes.push({
                picture: bike.picture,
                pk: bike.pk,
                reference: bike.reference,
                robbery_date: bike.date_of_robbery
              })
            })
          })
      },
      infiniteScroll (entries, observer, isIntersecting) {
        if (isIntersecting) {
            this.get_bikes(this.bikeCount, this.bikeOffset);
            this.bikeOffset += 18;
        }
      },
      addBike(){
        if (this.$store.state.auth.isAuthenticated === false) {
          this.$store.commit('openAuthPannel')
        }
        this.$store.commit('openBikePannel');
      },
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
    },

  }
</script>
<style>
</style>
