<template>
  <v-speed-dial
    v-model="dialShare"
    absolute
    right
    top
    direction="left"
    open-on-hover
  >
    <template v-slot:activator>
      <v-btn fab bottom small color="primary">
        <v-icon v-if="dialShare">mdi-close</v-icon>
        <v-icon v-else>mdi-share-variant</v-icon>
      </v-btn>
    </template>
    <v-btn
      dark
      fab
      bottom
      color="green"
      small
      :href="`https://wa.me/?text=` + encodedText + pageUrl"
      target="_blank"
    >
      <v-icon>mdi-whatsapp</v-icon>
    </v-btn>

    <v-btn
      dark
      fab
      bottom
      color="indigo"
      small
      :href="'http://www.facebook.com/sharer.php?u='+pageUrl+'&t='+encodedText"
      target="_blank"
    >
      <v-icon>mdi-facebook</v-icon>
    </v-btn>

    <v-btn
      dark
      fab
      bottom
      color="light-blue"
      small
      :href="'https://twitter.com/intent/tweet?text='+encodedText+'&url='+pageUrl"
      target="_blank"
    >
      <v-icon>mdi-twitter</v-icon>
    </v-btn>

    <v-btn
      dark
      fab
      bottom
      color="blue-grey"
      small
      @click="copyToClipboard"
    >
      <v-icon>mdi-content-copy</v-icon>
    </v-btn>
  </v-speed-dial>
    
</template>

<script>
    export default {
      name: "SocialShare",
      props: {
        pageUrl: {
          type: String
        },
        sharingText: {
          type: String,
          default: "Ce vélo a disparu, si vous le voyez signalez-le ! "
        }
      },
      data() {
        return {
          dialShare: false,
        }
      },

      computed: {
        encodedText() {
          return encodeURI(this.sharingText)
        },
      },

      methods: {
        copyToClipboard() {
          navigator.clipboard.writeText(this.pageUrl)
            .then(e => {
              this.$emit("copiedToClipboard")
            })
        }
      },
    }
</script>

<style scoped>

</style>
