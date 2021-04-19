<template>
    <!-- Todo: selected should unselect when erasing content-->
      <v-autocomplete
        v-model="model"
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        color="primary"
        hide-no-data
        hide-selected
        :filter="customFilter"
        item-text="cityname"
        item-value="cityname"
        label="Chercher une commune"
        placeholder="Essayez un nom de commune, ou un code postal"
        prepend-icon="mdi-magnify"
        return-object
      ></v-autocomplete>

</template>

<script>
    export default {
        name: "SearchLocationBar",
      data: () => ({
        entries: [],
        isLoading: false,
        model: null,
        search: null,

      }),
      computed: {
          items() {
            return this.entries
          }
      },
      watch: {
        search (val) {
          // Items have already been requested
          if (this.isLoading) return;
          // Using another axios instance to communicate with api-adresse.data.gouv.fr to protect authorization token
          let axiosInstance = this.$axios.create();
          delete axiosInstance.defaults.headers.common;

          this.isLoading = true;
          this.entries = [];

          axiosInstance.get("https://api-adresse.data.gouv.fr/search/", {
            params: {
              q:val,
              type: "municipality",
              autocomplete:"1",
              limit:"5"
            },
          })
            .then(response => response.data.features)
            .then(response => {
              response.forEach(item => {
                this.entries.push({
                  cityname: item.properties.city + ', ' + item.properties.postcode,
                  coordinates: item.geometry.coordinates
                })
              })
            })
            .catch(err => {
              console.log(err)
            })
            .finally(() => (this.isLoading = false))
        },
        model: function(self) {
            this.$store.commit('setPoint', {
              lat: self.coordinates[1],
              lon: self.coordinates[0],
            });
        }
      },
      methods: {
          customFilter(item, queryText, itemText) {
            const cityname = item.cityname.toLowerCase();
            const searchText = queryText.toLowerCase();

            return cityname.search(searchText) > -1
          }
      }
    }
</script>

<style scoped>
</style>
