import type {IconStyle} from '@fortawesome/fontawesome-svg-core'
import {addPlugin, addTemplate, createResolver, defineNuxtModule, addComponent} from '@nuxt/kit'

const iconsToAdd: string[] = []

export interface ModuleOptions {
  component: string
  suffix?: boolean
  addCss?: boolean
  icons?: {[key in IconStyle]?: string[]}
  proIcons?: {[key in IconStyle]?: string[]}
  sharpIcons?: {[key in IconStyle]?: string[]}
  useLayers?: boolean
  useLayersText?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt3-fontawesome',
    configKey: 'fontawesome',
  },
  defaults: {
    component: 'font-awesome',
    suffix: false,
    addCss: true,
    useLayers: true,
    useLayersText: true,
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    addTemplate({filename: 'fontawesome.mjs', write: true, getContents: () => getContents(options)})
    addPlugin(resolver.resolve('./runtime/plugins/fontawesome'))

    const name = camelize(options.suffix ? options.component + '-icon' : options.component)
    await addComponent({name, filePath: resolver.resolve('./runtime/components/icon')})

    if (options.useLayers) {
      const name = camelize(options.component + '-layers')
      await addComponent({name, filePath: resolver.resolve('./runtime/components/layers')})
    }

    if (options.useLayersText) {
      const name = camelize(options.component + '-layers-text')
      await addComponent({name, filePath: resolver.resolve('./runtime/components/layers-text')})
    }

    if (options.addCss) {
      nuxt.options.css.unshift('@fortawesome/fontawesome-svg-core/styles.css')
    }

    nuxt.hook('modules:done', () => {
      console.info('Fontawesome module is ready')
    })
  },
})

function getContents(options: ModuleOptions) {
  const strings = []

  if (iconsToAdd.length) {
    iconsToAdd.splice(0, iconsToAdd.length)
  }

  if (options.icons) {
    strings.push(...addIcons(options.icons, 'free'))
  }
  if (options.proIcons) {
    strings.push(...addIcons(options.proIcons, 'pro'))
  }
  if (options.sharpIcons) {
    strings.push(...addIcons(options.sharpIcons, 'sharp'))
  }

  const icons = [...new Set(iconsToAdd)].map((key) => key)
  strings.push(`export default {${icons.join(', ')}}`)

  return strings.join('\n\n')
}

function addIcons(iconStyles: {[key in IconStyle]?: string[] | boolean}, type = 'free') {
  const imports = []

  for (const style in iconStyles) {
    const pkgName = `${type}-${style}-svg-icons`
    const icons = iconStyles[style as IconStyle]

    if (Array.isArray(icons) && icons.length) {
      const styleIcons = icons.map((icon: string) => {
        if (!icon.startsWith('fa')) {
          icon = 'fa-' + icon
        }
        icon = camelize(icon)

        const alias = `${type}Fa${style[0]}${icon[0].toUpperCase()}${icon.slice(1)}`
        iconsToAdd.push(alias)
        return `${icon} as ${alias}`
      })
      imports.push(`import {\n  ${[...new Set(styleIcons)].join(',\n  ')}\n} from '@fortawesome/${pkgName}'`)
    }
  }

  return imports
}

function camelize(name: string) {
  const tmp = name
    .split('-')
    .map((val) => val[0].toUpperCase() + val.slice(1))
    .join('')

  return tmp[0].toLowerCase() + tmp.slice(1)
}
