<template>
    <v-main>
      <template
        v-if="is_institution">
        <v-card>
          <v-card-title>Vélos volés et retrouvés à : {{ geo_zones }}</v-card-title>
          <v-card-actions>
            <v-btn
              color="primary"
            @click="downloadXLSXFile">
              Télécharger les données (.xlsx)
            </v-btn>
          </v-card-actions>
          <v-card-subtitle>Taille de l'échantillon : {{bikes.length}} vélos</v-card-subtitle>
          <v-container>
            <v-row
            align="stretch">
              <v-col
                cols="12"
                md="6">
                <ChartBikeTheftByHours
                  :bikes="bikes"></ChartBikeTheftByHours>
              </v-col>
              <v-col
                cols="12"
                md="6">
                <ChartBikeFound
                  :bikes="bikes"></ChartBikeFound>
              </v-col>
              <v-col
                cols="12"
                md="6">
                <ChartBikeTheftByMonthYear
                  :bikes="bikes"></ChartBikeTheftByMonthYear>
              </v-col>
            </v-row>
          </v-container>
        </v-card>

      </template>

      <template
        v-else>
      <v-card>
        <v-card-title>Votre compte n'est pas accrédité pour accéder à ce service</v-card-title>
        <v-card-actions>
          <v-btn
            color="primary"
            @click="$router.go(-1)"
            >Revenir à la page précédente</v-btn>
        </v-card-actions>
      </v-card>
      </template>
    </v-main>
</template>

<script>
    export default {
      name: "stats",
      data() {
        return {
          bikes:[],
        }
      },
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
        async get_bikes() {
          await this.$axios.get('stats/')
            .then(response => response.data)
            .then(response => {
              this.bikes = response;
            })
        },
      },
      mounted() {
        if (this.is_institution) {
          this.get_bikes()
        }
      },
      watch: {
        is_institution(val) {
          if (val) {
            this.get_bikes()
          }
        }
      },
    }
</script>

<style scoped>

</style>
