<template>
  <v-file-input
    v-model="file"
    accept="image/png, image/jpeg, image/bmp"
    placeholder="Choisissez une image de votre vélo"
    prepend-icon="mdi-camera"
    label="Image"
    @change="compressImg"
    show-size
  ></v-file-input>
</template>

<script>
  import Compressor from 'compressorjs'

    export default {
      name: "ImageCompressor",
      data () {
        return {
          file: null,
        }
      },
      methods: {
        async compressImg(e) {
          if (!e.isCompressed) {
            await new Promise((resolve, reject) => {
              new Compressor(e, {
                quality: 0.9,
                convertSize: 2000000,
                maxWidth: 1000,
                success: resolve,
                error: reject,
              });
            }).then(result => {
              result.isCompressed = true;
              this.file = result;
              this.$emit("compressed", this.file)
            })
          }
        }
      }
    }
</script>

<style scoped>

</style>
