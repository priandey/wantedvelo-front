<template>
    <v-combobox
      label="Entrez une caractéristique"
      placeholder="Une marque, une couleur, un type de vélo, etc."
      prepend-icon="mdi-bicycle"
      v-model="select"
      :items="items"
      :loading="isLoading"
      :search-input.sync="search"
      dense
      :chips="chips"
      hide-selected
      multiple
      hide-no-data
      :menu-props="{top:true, maxHeight:'150px'}"
      @change="updateTraits($event)"
    ></v-combobox>
</template>

<script>
    export default {
        name: "SearchCreateTraits",
      props: {
          createIfNone: {
            default: true,
            type: Boolean,
          },
        chips: {
          default:false,
          type: Boolean,
        }
      },
      data() {
          return {
            items:[],
            select: [],
            isLoading:false,
            search:null,
          }
      },

      watch: {
        search (val) {
          // Items have already been requested
          if (this.isLoading) return;

          this.isLoading = true;
          this.items = [];

          this.$axios.get("/traits/", {
            params: {
              qs:val,
            },
          })
            .then(response => response.data.results)
            .then(response => {
              console.log(response);
              response.forEach(item => {
                this.items.push(item.name)
              })
            })
            .finally(() => (this.isLoading = false))
        },
      },
      computed: {
        newItems () {
          return this.select.filter(x => !this.items.includes(x))
        },
      },
      methods: {
          updateTraits(traits) {
            if (this.createIfNone) {
              if (traits.length > 0) {
                let newItem = traits[traits.length-1];
                this.$axios.get('/traits/', {
                  params: {
                    qs:newItem
                  }
                })
                  .then(response => response.data.results)
                  .then(response => {
                    if (response.length === 0) {
                      this.$axios.post('/traits/', {name:newItem})
                    }
                  })
              }
              this.$emit('updateTraitsList', this.select)
            }
          },
      },
    }
</script>

<style scoped>
</style>
