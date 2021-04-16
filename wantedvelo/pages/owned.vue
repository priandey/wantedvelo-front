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
          </v-expansion-panel-header>
          <v-expansion-panel-content>
              <v-container>
                <v-row>
                  <v-col cols="6"><h2>Reference : {{bike.reference}}</h2></v-col>
                  <v-col cols="6"><v-combobox disabled label="Caractéristiques" chips v-model="bike.traits" item-text="item.name"><v-chip>test</v-chip></v-combobox></v-col>
                </v-row>
                <v-row justify="center">
                  <v-col cols="6"><v-img :src="bike.picture"></v-img></v-col>
                </v-row>
              </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
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
