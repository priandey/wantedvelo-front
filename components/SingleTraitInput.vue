<template>
    <v-combobox
      placeholder="Marque, modèle, couleur, etc."
      outlined
      solo
      dense
      clearable
      hide-no-data
      v-model="select"
      append-icon=""
      :items="items"
      :search-input.sync="search"
      :chips="true"
      :menu-props="{top:true, maxHeight:'150px'}"
      @change="pushTrait($event)">
    </v-combobox>
</template>

<script>
    export default {
      name: "SingleTraitInput",
      props: {
        createIfNone: {
          default: true,
          type: Boolean
        }
      },
      data() {
          return {
            items:[],
            select: null,
            isLoading: false,
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
        select (val) {
          if (val === null) {
            this.$emit('selectionEmpty')
          }
        },
      },

      methods: {
          async pushTrait(trait) {
            if (trait != null) {
              let exist = await this.traitExist(trait);
              if (exist === false) {
                if (this.createIfNone) {
                  this.$axios.post('/traits/', {name:trait})
                    .then(response => response.data.name)
                    .then(response => {
                      trait = response
                    })
                } else {
                  this.select = null;
                }
              }
              this.$emit('pushTrait', this.select)
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
      }
    }
</script>

<style scoped>

</style>
