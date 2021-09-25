<template>
    <v-dialog
    v-model="dialog"
    :width="dialogWidth"
    @click:outside="setRead">
      <v-card>
        <v-card-title>Bienvenue sur l'alpha de WantedVelo</v-card-title>
        <v-card-text>
          Ce service vous permet de déclarer le vol de votre vélo afin d'en garder la trace, de permettre aux autres cyclistes
          de vous contacter s'ils le repèrent, et de produire des données pertinentes pour organiser la lutte contre les vols de
          vélos à l'échelle locale et nationale.
        </v-card-text>
        <v-card-text>
          Pour le moment, le service est en alpha, ce qui signifie que toutes les fonctionnalités finales n'ont pas été implémentées, et que
          des bugs peuvent survenir. Si vous en rencontrez un, ou si vous pensez à une fonctionnalité pertinente, merci de nous le faire
          savoir à l'adresse suivante <a href="http://wantedbugs.priandey.eu">WantedBugs</a> (vous pouvez la retrouver dans le menu latéral).
        </v-card-text>
        <v-card-text>
          Si vous êtes un usager insitutionnel (Association impliqué dans les mobilités douces, collectivité territoriale, etc) et que
          vous souhaiteriez avoir un accès aux données concernant votre territoire d'intervention, <a href="mailto:contact@wantedvelo.eu">merci de prendre contact par mail.</a>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="setRead">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: "FirstVisitDisclaimer",
        methods: {
          setRead() {
            this.$store.commit('notFirstVisit')
          }
        },
        computed: {
          dialog() {
            return this.$store.state.firstVisit
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

    }
</script>

<style scoped>
</style>
