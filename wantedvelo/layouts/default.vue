<template>
    <v-app>
        <v-card>
    <v-toolbar
      color="primary"
      flat
    >
      <v-toolbar-title>WantedVelo</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn
        icon
        @click="logout">
        <v-icon>mdi-logout-variant</v-icon>
      </v-btn>

      <template v-slot:extension v-tabs>
        <v-tabs
          grow
          centered
          right
          active-class="active-tab"
        >
          <v-tabs-slider color="yellow"></v-tabs-slider>

          <v-tab
          to="/">
            Derniers avis de recherche
          </v-tab>
          <v-tab
          to="/near">
              <v-icon>mdi-crosshairs-gps</v-icon>
          </v-tab>
          <v-tab>
            Mes vélos
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
    methods: {
      logout () {
        this.$store.commit("resetAuth");
      },
    }
  }
</script>

<style lang="scss" scoped>
.active-tab {
    color: rgba(255, 145, 0, 0.9); // orange accent 3
}

</style>
