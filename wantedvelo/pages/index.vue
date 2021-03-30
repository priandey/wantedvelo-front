<template>
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
                <v-card
                height="250"
                hover
                >
                  <v-img
                  v-bind:src="bike.picture"
                  gradient="rgba(0,0,0,.5), rgba(0,0,0,.23)"
                  max-height="160"
                  >
                  </v-img>
                  <v-card-title>{{ bike.reference }}
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
            </v-col>
        </v-row>
          <v-card id="infiniteLoading"
               v-intersect="{
              handler: infiniteScroll,
              options: {
                 threshold:1.0
                }
              }"
          height="100"></v-card> <!-- TODO : Load twice -->
    </v-container>
      <v-btn
        color="primary"
        large
        fixed
        bottom
        :style="{left: '50%', transform:'translateX(-50%)'}"
        fab
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
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
        bikeCount: 12,
        bikeOffset: 0,
      }
    },
    methods : {
      get_bikes (itemcount, itemOffset) {
        this.$axios.get('', {
          params: {
            'limit': itemcount,
            'offset': itemOffset,
          }
        })
          .then(response => {
            console.log(response.data);
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
      infiniteScroll () {
        this.get_bikes(this.bikeCount, this.bikeOffset);
        this.bikeOffset += 12;
      },
    },

  }
</script>
<style>
</style>
