<template>
    <v-main>
      <v-card
      v-if="is_institution">
        <v-card-title>Vélos volés et retrouvés à : {{ geo_zones }}</v-card-title>
        <v-card-actions>
          <v-btn
            color="primary"
          @click="downloadXLSXFile">
            Télécharger le fichier excel
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card
      v-else>
        <v-card-title>Votre compte n'est pas accrédité pour accéder à ce service</v-card-title>
        <v-card-actions>
          <v-btn
            color="primary"
            @click="$router.go(-1)"
            >Revenir à la page précédente</v-btn>
        </v-card-actions>
      </v-card>
    </v-main>
</template>

<script>
    export default {
        name: "stats",
      computed: {
        is_institution() {
          if (this.$store.state.auth.isAuthenticated) {
            return this.$store.state.auth.user.is_institution
          } else {
            return false
          }
        },

        geo_zones() {
          if (this.is_institution) {
            return this.$store.state.auth.user.geographic_zone
          }
        },
      },

      methods: {
        downloadXLSXFile() {
          let config = {
            headers: {
              'Accept': '*/*',
            },
            responseType: 'blob'
          };
          this.$axios.get('stats/', config)
            .then(response => {
              let fileURL = window.URL.createObjectURL(new Blob([response.data]));
              let fileLink = document.createElement('a');
              fileLink.href = fileURL;
              fileLink.setAttribute('download', 'wantedVeloStats.xlsx');
              document.body.appendChild(fileLink);
              fileLink.click()
            })
        },
      }
    }
</script>

<style scoped>

</style>
