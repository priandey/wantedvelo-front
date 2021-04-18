<template>
  <bike-alert
  :bike-id="id"></bike-alert>
</template>

<script>
    export default {
        name: "detail",

      data() {
          return {
            id : this.$route.params.id
          }
      },

    }
</script>

<style scoped>

</style>
