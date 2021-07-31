<template>
    <v-app>
        <v-card>
    <v-toolbar
      color="primary"
    >

      <v-img
        class="pa-0 mx-1 mt-4"
        src="/logo.png"
        max-height="14vh"
        max-width="13vh"
        min-height="60px"
        min-width="60px"
        contain
      ></v-img>

      <v-spacer></v-spacer>
      <v-menu
        bottom
        left
        offset-x
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            dark
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>

        <v-list
        >
          <v-list-item
          link
          @click="newBikeAlert">
            <v-list-item-title>Déclarer un vol</v-list-item-title>
          </v-list-item>
          <v-list-item
          to="/">
            <v-list-item-title>Rechercher un vélo</v-list-item-title>
          </v-list-item>
          <v-list-item
          to="near">
            <v-list-item-title>Les vols autour de moi</v-list-item-title>
          </v-list-item>
          <v-list-item
          to="owned"
          v-if="$store.state.auth.isAuthenticated">
            <v-list-item-title>Voir mes déclarations</v-list-item-title>
          </v-list-item>
          <v-list-item
          to="stats"
          v-if="$store.state.auth.user.is_institution">
            <v-list-item-title>Statistiques</v-list-item-title>
          </v-list-item>
          <v-list-item
          v-if="$store.state.auth.isAuthenticated"
          @click="logout">
            <v-list-item-title>Déconnexion</v-list-item-title>
          </v-list-item>
          <v-list-item
          v-else
          @click="verifyAuth">
            <v-list-item-title>Connexion</v-list-item-title>
          </v-list-item>
          <v-list-item
            @click="$store.commit('firstVisit')">
            <v-list-item-title>A propos</v-list-item-title>
          </v-list-item>
          <v-list-item
            href="http://wantedbugs.priandey.eu/"
            target="_blank">
            <v-list-item-title>Bug / Suggestion</v-list-item-title>
            <v-list-item-icon><v-icon>mdi-arrow-top-right</v-icon></v-list-item-icon>
          </v-list-item>
        </v-list>
      </v-menu>
      <template v-slot:extension v-tabs>
        <v-tabs
          grow
          centered
          right
          active-class="active-tab"
        >
          <v-tabs-slider color="yellow"></v-tabs-slider>

          <v-tab
          to="/"
          @change="updateActiveTab(1)">
            <v-icon>mdi-timeline-clock-outline</v-icon>
            <span v-if="activeTab === 1" class="ml-2">Derniers vols</span>
          </v-tab>

          <v-tab
          to="/near"
          @change="updateActiveTab(2)">
             <v-icon>mdi-crosshairs-gps</v-icon>
            <span v-if="activeTab === 2" class="ml-2">A proximité</span>
          </v-tab>

          <v-tab
          to="/owned"
          @change="updateActiveTab(3)"
          @click="verifyAuth">
            <v-icon>mdi-bicycle</v-icon>
            <span v-if="activeTab === 3" class="ml-2">Mes vélos</span>
          </v-tab>

        </v-tabs>
      </template>
    </v-toolbar>

  </v-card>
      <AuthenticationPannel />
      <FirstVisitDisclaimer></FirstVisitDisclaimer>
      <Nuxt />
    </v-app>
</template>

<script>
  export default {
    data() {
      return {
        activeTab:null
      }
    },
    methods: {
      logout () {
        this.$store.commit("resetAuth");
      },
      verifyAuth() {
        if (!this.$store.state.auth.isAuthenticated) {
          this.$store.commit('openAuthPannel')
        }
      },
      updateActiveTab(tabNumber) {
        this.activeTab = tabNumber
      },
      newBikeAlert() {
        this.$router.push({ name: 'index', query: { action: 'addBike' } });
      },
    },
  }
</script>

<style lang="scss" scoped>
.active-tab {
    color: rgba(255, 145, 0, 0.9); // orange accent 3
}
  .superscript {
    vertical-align: super;
    font-size: 60%
  }

  .subheading {
    font-size: medium;
  }

</style>
