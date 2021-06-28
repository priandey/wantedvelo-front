<template>
    <v-container>
      <v-row>
        <v-col
          cols="12"
          v-if="createIfNone"
        >Entrez des caractéristiques pour votre vélo (Une par case)
        </v-col>
        <v-col
          cols="12"
          v-else>Rechercher par caractéristiques
          <v-btn
            icon
            @click="visible = !visible"
          >
            <v-icon v-if="!visible">mdi-menu-down</v-icon>
            <v-icon v-else>mdi-menu-up</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-if="visible | createIfNone">
        <v-col
        v-for="n in traitsNumber" :key="n"
        cols="11"
        sm="3"
        md="2"
        lg="2">
          <SingleTraitInput
          :create-if-none="createIfNone"
          @pushTrait="updateTraitsList($event)"></SingleTraitInput>
        </v-col>
        <v-col
        cols="1">
          <v-btn
            icon
            @click="traitsNumber += 1">
            <v-icon>mdi-plus-circle-outline</v-icon>
          </v-btn>
          <v-btn
            icon
            @click="traitsNumber -= 1">
            <v-icon>mdi-minus-circle-outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
</template>

<script>
    export default {
      name: "SearchCreateTraits",

      props: {
          createIfNone: {
            default: true,
            type: Boolean,
          },
        icon: {
          default:'mdi-bicycle',
          type: String
        }
      },

      data() {
          return {
            traitsList: [],
            traitsNumber: 3,
            visible: false,
          }
      },

      methods: {
        updateTraitsList(trait) {
          if (trait != null) {
            this.traitsList.push(trait);
            this.$emit("updateTraitsList", this.traitsList)
          }
        },
      }
    }
</script>

<style scoped>
</style>
