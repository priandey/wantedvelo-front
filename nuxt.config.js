import colors from 'vuetify/es5/util/colors'
import redirectSSL from 'redirect-ssl'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - WantedVelo',
    title: 'WantedVelo',
    htmlAttrs: {
      lang: 'fr'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/CtkDateTimePicker', ssr: false },
    { src: '~/plugins/apexCharts', ssr: false },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
      '@nuxtjs/vuetify',
      '@nuxtjs/dotenv',
  ],

  serverMiddleware: [
    { path: '/api/check-token', handler: '~/api/recaptcha' },
    redirectSSL.create({
      enabled: process.env.NODE_ENV === 'production'
    }),

  ],


  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
      '@nuxtjs/axios',
      'nuxt-leaflet',
      '@nuxtjs/recaptcha',
  ],

  recaptcha: {
    hideBadge: false, // Hide badge element (v3 & v2 via size=invisible)
    siteKey: process.env.RECAPTCHA_SITE_KEY,    // Site key for requests
    version: 3,     // Version
  },

  axios: {
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:8000', // Used as fallback if no runtime config is provided
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      options: {
        customProperties: true
      },
      dark: true,
      themes: {
        dark: {
          primary: colors.green.darken2,
          accent: colors.grey.darken3,
          secondary: colors.orange.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.pink.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
