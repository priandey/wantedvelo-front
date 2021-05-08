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
          async updateTraits(traits) {
            if (traits.length > 0) {
              let newItem = traits[traits.length-1];
              let exist = await this.traitExist(newItem);
              if (!exist) {
                if (this.createIfNone) {
                  this.$axios.post('/traits/', {name:newItem})
                } else {
                  traits.splice(traits.length-1, 1)
                }
              }
              this.$emit('updateTraitsList', this.select)
            }
          },
         async traitExist(trait) {
            return new Promise((resolve, reject) => {
              this.$axios.get('/traits/', {
                params: {
                  qs: trait
                }
              })
                .then(response => response.data.results)
                .then(response => {
                  if (response.length > 0) {
                    resolve(true)
                  } else {
                    resolve(false)
                  }
                })
            })
        }
      },
    }
</script>

<style scoped>
</style>
