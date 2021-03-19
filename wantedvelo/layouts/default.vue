<template>
    <v-app>
        <v-card>
    <v-toolbar
      color="primary"
      flat
    >
      <v-toolbar-title>WantedVelo</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <template v-slot:extension v-tabs>
        <v-tabs
          centered
          right
          grow
          active-class="active-tab"
        >
          <v-tabs-slider color="yellow"></v-tabs-slider>

          <v-tab>
            Derniers vols
          </v-tab>
          <v-tab>
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
    </v-app>
</template>

<script>
</script>

<style lang="scss" scoped>
.active-tab {
    color: rgba(255, 145, 0, 0.9); // orange accent 3
}

</style>
