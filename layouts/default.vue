<template>
    <v-app>
        <v-card>
    <v-toolbar
      color="primary"
    >
      <v-toolbar-title><span class="heading">WantedVelo</span>
      <div class="subheading">Retrouvons les vélos volés</div></v-toolbar-title>

      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <div v-on="on">
            <v-btn
              icon
              @click="logout"
              v-if="$store.state.auth.isAuthenticated"
              title="Déconnexion">
              <v-icon>mdi-logout-variant</v-icon>
            </v-btn>
          </div>
        </template>
        <span>Déconnexion</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <div v-on="on">
            <v-btn
              icon
              title="Déclarer un bug"
              href="http://wantedbugs.priandey.eu"
              target="_blank">
              <v-icon>mdi-alert-circle</v-icon>
            </v-btn>
          </div>
        </template>
        <span>Déclarer un bug ou suggérer une amélioration</span>
      </v-tooltip>

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
      <Nuxt />
      <AuthenticationPannel />
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
      }
    }
  }
</script>

<style lang="scss" scoped>
.active-tab {
    color: rgba(255, 145, 0, 0.9); // orange accent 3
}

  .subheading {
    font-size: small;
  }

  .heading {
    font-weight: bold;
  }

</style>
