<template>
    <v-combobox
      label="Ajoutez une caractéristique"
      placeholder="Une marque, une couleur, un type de vélo, etc."
      prepend-icon="mdi-bicycle"
      v-model="select"
      :items="items"
      dense
      hide-selected
      multiple
      hide-no-data
      menu-props="top"
      @change="updateTraits"
    ></v-combobox>
</template>

<script>
    export default {
        name: "SearchCreateTraits",
      data() {
          return {
            items:[],
            select: [],
          }
      },
      mounted () {
          this.$axios.get('/traits/')
            .then(response => {
              response.data.results.forEach(item => {
                this.items.push(item.name)
              })
            })
      },
      computed: {
        newItems () {
          return this.select.filter(x => !this.items.includes(x))
        },
      },
      methods: {
          updateTraits() {
            if (this.newItems.length > 0) {
              let newItem = this.newItems[0];
              this.$axios.post('/traits/', {name:newItem})
                .then(response => {this.items.push(newItem)})
            }
            this.$emit('updateTraitsList', this.select)
          },
      },
    }
</script>

<style scoped>
</style>
