<template>
    <v-main>
        <AuthenticationPannel />
        <v-container>
            <v-row>
                <v-col
                v-for="n in 24"
                :key="n"
                lg="2"
                md="4"
                sm="6"
                cols="12"
                >
                <v-card
                height="250"
                hover></v-card>
            </v-col>
        </v-row>
    </v-container>
      <v-btn
        color="primary"
        large
        fixed
        bottom
        :style="{left: '50%', transform:'translateX(-50%)'}"
        fab
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
</v-main>
</template>

<script>
export default {

}
</script>
