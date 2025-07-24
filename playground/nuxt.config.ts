import {defineNuxtConfig} from 'nuxt/config'

export default defineNuxtConfig({
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
      solid: ['face-smile', 'child', 'archive', 'envelope', 'pen-clip', 'circle', 'comment'],
      regular: ['comment', 'face-smile'],
      brands: ['twitter'],
    },
  },
  compatibilityDate: '2024-08-26',
})
