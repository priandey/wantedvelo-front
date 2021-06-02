<template>
  <v-card>
    <v-container>
  <v-img
    :src="bike.picture"
    max-height="50vh"
    contain></v-img>
      <v-chip class="mr-1 mt-3" v-for="trait in bike.traits" :key="trait">{{ trait }}</v-chip>
    <v-card-title>Référence : {{bike.reference}}
      <v-card-actions>
        <v-dialog
          :width="dialogWidth">
          <template v-slot:activator="{ on:dialog, attrs }">
            <v-tooltip top>
              <template v-slot:activator="{on:tooltip}">
                <v-btn
                  color="primary"
                  dark
                  medium
                  v-on="{...dialog, ...tooltip}"
                >
                  <v-icon large>mdi-eye-plus-outline</v-icon>
                </v-btn>
                  </template>
              <span>J'ai vu ce vélo !</span>
            </v-tooltip>
          </template>
          <bike-report :bikeId="bike.pk"></bike-report>
        </v-dialog>
      </v-card-actions>
    </v-card-title>
    <v-card-subtitle>Disparu le : {{bike.date_of_robbery}} <span v-if="bike.robbery_city">à {{bike.robbery_city}}</span>
      <social-share
      :page-url="constructedURL"
      @copiedToClipboard="openSnackBar"></social-share></v-card-subtitle>
      <template v-if="!inModal">
        <v-img>
      <div id="map-wrap" style="height: 30vh">
        <l-map :zoom=10 :center="latLng">
          <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
          <l-marker
            :lat-lng="latLng">
          </l-marker>
        </l-map>
      </div>
        </v-img>
      </template>
    </v-container>
    <v-snackbar
      v-model="snackbar"
      timeout="1300"
    >
      Lien copié dans le presse-papier

      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Fermer
        </v-btn>
      </template>
    </v-snackbar>
    <v-dialog
    :width="dialogWidth">
      <template v-slot:activator="{on:dialog, attrs}">
        <v-tooltip
          top
          >
          <template v-slot:activator="{on:tooltip, attrs}">
        <v-btn
          absolute
          bottom
          right
          text
          plain
          dense
          v-on="{...dialog, ...tooltip}"
          color="red"><v-icon>mdi-alert-octagon-outline</v-icon></v-btn>
          </template>
          <span>Signaler ce contenu</span>
        </v-tooltip>
        </template>
      <ReportInappropriateForm
      :bike-id="bike.pk"></ReportInappropriateForm>
    </v-dialog>
  </v-card>
</template>

<script>
    export default {
      name: "BikeAlert",
      props: ['bikeId', 'inModal', 'providedBike'],
      data() {
        return {
          bike: {
            robbed_location: {
              latitude:'48.85387273165656',
              longitude:'2.3497009277343754',
            }
          },
          snackbar: false,
        }
      },
      async fetch() {
        if (this.providedBike) {
          this.bike = this.providedBike
        } else {
          await this.$axios.get('/bike/' + this.bikeId + '/')
            .then(response => {
              this.bike = response.data;
            })
            .catch(e => console.log(e))
        }
      },
      mounted() {
          this.$fetch();
      },
      computed:{
        constructedURL() {
          if (typeof window !== 'undefined') {
            return "https://" + window.location.host + this.$router.resolve({
              name: "alert-id",
              params: {id: this.bike.pk}
            }).href
          }
        },

        latLng() {
          return [this.bike.robbed_location.latitude, this.bike.robbed_location.longitude]
        },

        dialogWidth() {
          switch (this.$vuetify.breakpoint.name) {
            case 'xs':
              return "80vw";
            case 'sm':
              return "80vw";
            case 'md':
              return "50vw";
            case 'lg':
              return "50vw";
            case 'xl':
              return "50vw"
          }
        },
      },
      methods: {
        openSnackBar() {
          this.snackbar = true;
        }
      },
    }
</script>

<style scoped>

</style>
