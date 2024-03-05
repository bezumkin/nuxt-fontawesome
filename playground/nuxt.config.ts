import {defineNuxtConfig} from 'nuxt/config'

export default defineNuxtConfig({
  telemetry: false,
  devtools: {enabled: false},
  ssr: true,
  app: {
    head: {
      link: [{rel: 'stylesheet', href: 'https://static.fontawesome.com/css/fontawesome-app.css'}],
    },
  },
  // @ts-ignore
  fontawesome: {
    icons: {
      solid: ['coffee', 'child', 'archive', 'envelope', 'pen-clip', 'circle', 'comment'],
      regular: ['comment'],
      brands: ['twitter'],
    },
  },
})
