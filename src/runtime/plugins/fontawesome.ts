import {defineNuxtPlugin} from '#app'
import {library, config} from '@fortawesome/fontawesome-svg-core'
// @ts-ignore
import icons from '#build/fontawesome.mjs'

config.autoAddCss = false

export default defineNuxtPlugin(() => {
  // @ts-ignore
  library.add(icons)
})
