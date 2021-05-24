<template>
  <bike-alert
  :provided-bike="bike"></bike-alert>
</template>

<script>
    export default {
        name: "detail",

      data() {
          return {
            id : this.$route.params.id
          }
      },

      async asyncData(context) {
        let bike = await context.app.$axios.$get('/bike/'+context.params.id+'/');
        return { bike }
      },

      head() {
        return {
          meta: [
            {
              hid: 'description',
              name: 'description',
              content: 'Le vélo identifié ' + this.bike.reference + "a disparu, aidez son propriétaire a le retrouver"
            },
            {
              hid: 'twitter:title',
              name: 'twitter:title',
              content: this.bike.reference + ', ce vélo a disparu !'
            },
            {
              hid: 'twitter:description',
              name: 'twitter:description',
              content: 'Le vélo identifié ' + this.bike.reference + "a disparu, aidez son propriétaire a le retrouver"
            },
            {
              hid: 'twitter:image',
              name: 'twitter:image',
              content: this.bike.picture
            },
            {
              hid: 'twitter:image:alt',
              name: 'twitter:image:alt',
              content: "Image du vélo " + this.bike.reference
            },
            {
              hid: 'og:title',
              property: 'og:title',
              content: this.bike.reference + ', ce vélo a disparu !',
            },
            {
              hid: 'og:description',
              property: 'og:description',
              content: 'Le vélo identifié ' + this.bike.reference + "a disparu, aidez son propriétaire a le retrouver"
            },
            {
              hid: 'og:image',
              property: 'og:image',
              content: this.bike.picture
            },
            {
              hid: 'og:image:secure_url',
              property: 'og:image:secure_url',
              content: this.bike.picture
            },
            {
              hid: 'og:image:alt',
              property: 'og:image:alt',
              content: "Image du vélo " + this.bike.reference
            }
          ]
        }
      }

    }
</script>

<style scoped>

</style>
