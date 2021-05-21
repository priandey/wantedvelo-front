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
      :page-url="constructedURL"></social-share></v-card-subtitle>
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
  </v-card>
</template>

<script>
    export default {
      name: "BikeAlert",
      props: ['bikeId', 'inModal'],
      data() {
        return {
          bike: {
            robbed_location: {
              latitude:'48.85387273165656',
              longitude:'2.3497009277343754',
            }
          },
        }
      },
      async fetch() {
        await this.$axios.get('/bike/'+this.bikeId+'/')
          .then(response => {
            this.bike = response.data;
          })
          .catch(e => console.log(e))
      },
      mounted() {
        this.$fetch();
      },
      computed:{
        constructedURL() {
          if (typeof window !== 'undefined') {
            return "https://" + window.location.host + this.$router.resolve({
              name: "alert-id",
              params: {id: this.bikeId}
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
