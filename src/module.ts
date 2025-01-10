import type {IconStyle} from '@fortawesome/fontawesome-svg-core'
import {addPlugin, addTemplate, createResolver, defineNuxtModule, addComponent} from '@nuxt/kit'

const iconsToAdd: string[] = []

export type IconStyleWithKit = IconStyle & 'kit'

export interface ModuleOptions {
  component: string
  suffix?: boolean
  addCss?: boolean
  icons?: {[key in IconStyle]?: string[]}
  proIcons?: {[key in IconStyle]?: string[]}
  kitIdentifier?: string
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
    strings.push(...addIcons(options.proIcons, 'pro', options.kitIdentifier))
  }
  if (options.sharpIcons) {
    strings.push(...addIcons(options.sharpIcons, 'sharp'))
  }

  const icons = [...new Set(iconsToAdd)].map((key) => key)
  strings.push(`export default {${icons.join(', ')}}`)

  return strings.join('\n\n')
}

function addIcons(iconStyles: {[key in IconStyleWithKit]?: string[] | boolean}, type = 'free', kitIdentifier?: string) {
  const imports = []

  for (const style in iconStyles) {
    let pkgName = `@fortawesome/${type}-${style}-svg-icons`
    const icons: string[] = iconStyles[style as IconStyleWithKit]

    if (style == 'kit') {
      if (typeof(kitIdentifier) !== 'string' || !kitIdentifier.match(/^[a-z\d]{10}$/)) {
        throw new Error('Please check your FontAwesome kit ID')
      }
      pkgName = `@awesome.me/kit-${kitIdentifier}/icons/kit/custom`
    }

    if (Array.isArray(icons) && icons.length) {
      const styleIcons = icons.map((icon: string) => {
        if (!icon.startsWith('fa-') && !icon.match(/^fa[A-Z]/)) {
          icon = 'fa-' + icon
        }
        icon = camelize(icon)

        const alias_parts = [type, `Fa${style[0]}`, `${icon[0].toUpperCase()}${icon.slice(1)}`]
        if (style == 'kit') {
          alias_parts.splice(1, 0)
        }
        const alias = alias_parts.join('')
        iconsToAdd.push(alias)
        return `${icon} as ${alias}`
      })
      imports.push(`import {\n  ${[...new Set(styleIcons)].join(',\n  ')}\n} from '${pkgName}'`)
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
