<template>
    <v-text-field
    label="Rechercher par référence"
    hint="Bicycode, numéro de cadre, etc."
    v-model="querystring"
    :loading="isLoading"></v-text-field>
</template>

<script>
    export default {
      name: "SearchByReference",
      data(){
          return {
            querystring: '',
            isLoading: false,
          }
      },

      watch: {
        querystring(val) {
          if (val.length > 0) {
            this.isLoading = true;
            this.$axios.get("/", {
              params: {
                search_type: "by_ref",
                qs: val
              }
            })
              .then(response => response.data.results)
              .then(response => {
                this.isLoading = false;
                this.$emit("searchResult", response)
              })
          } else {
            this.$emit("emptySearch")
          }
        }
      }
    }
</script>

<style scoped>

</style>
