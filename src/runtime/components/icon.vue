<template>
  <svg v-if="parsedIcon && symbol" style="display: none">
    <symbol v-bind="properties" v-html="htmlTag" />
  </svg>
  <svg v-else-if="parsedIcon" v-bind="properties" v-html="htmlTag" />
</template>

<script setup lang="ts">
import {
  icon as faIcon,
  parse as faParse,
  config as faConfig,
  type IconDefinition,
  type IconLookup,
  type Transform,
} from '@fortawesome/fontawesome-svg-core'
import {computed} from 'vue'
import type {IconName} from '@fortawesome/fontawesome-common-types'
import {transformIsMeaningful} from '../utils'

const props = defineProps({
  border: {
    type: Boolean,
    default: false,
  },
  fixedWidth: {
    type: Boolean,
    default: false,
  },
  flip: {
    type: [Boolean, String],
    default: false,
    validator: (value: any) => [true, false, 'horizontal', 'vertical', 'both'].includes(value),
  },
  icon: {
    type: [Object, Array, String],
    required: true,
  },
  mask: {
    type: [Object, Array, String],
    default: null,
  },
  maskId: {
    type: String,
    default: undefined,
  },
  listItem: {
    type: Boolean,
    default: false,
  },
  pull: {
    type: String,
    default: undefined,
    validator: (value: any) => ['right', 'left'].includes(value),
  },
  pulse: {
    type: Boolean,
    default: false,
  },
  rotation: {
    type: [String, Number],
    default: undefined,
    validator: (value: any) => [90, 180, 270].includes(Number.parseInt(value, 10)),
  },
  swapOpacity: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: undefined,
    validator: (value: any) =>
      ['2xs', 'xs', 'sm', 'lg', 'xl', '2xl', '1x', '2x', '3x', '4x', '5x', '6x', '7x', '8x', '9x', '10x'].includes(
        value,
      ),
  },
  spin: {
    type: Boolean,
    default: false,
  },
  transform: {
    type: [String, Object],
    default: undefined,
  },
  symbol: {
    type: [Boolean, String],
    default: false,
  },
  title: {
    type: String,
    default: undefined,
  },
  titleId: {
    type: String,
    default: undefined,
  },
  inverse: {
    type: Boolean,
    default: false,
  },
  bounce: {
    type: Boolean,
    default: false,
  },
  shake: {
    type: Boolean,
    default: false,
  },
  beat: {
    type: Boolean,
    default: false,
  },
  fade: {
    type: Boolean,
    default: false,
  },
  beatFade: {
    type: Boolean,
    default: false,
  },
  spinPulse: {
    type: Boolean,
    default: false,
  },
  spinReverse: {
    type: Boolean,
    default: false,
  },
})

const icon = computed(() => normalizeIconArgs(props.icon))
const mask = computed(() => normalizeIconArgs(props.mask))
const transform = computed(() => {
  if (props.transform) {
    const transform = typeof props.transform !== 'object' ? faParse.transform(props.transform) : props.transform
    if (transform && transformIsMeaningful(transform)) {
      return transformForSvg(transform)
    }
  }
  return undefined
})
const parsedIcon = computed(() => {
  return faIcon(icon.value as IconLookup, {
    classes: classes.value,
    title: props.title,
    titleId: props.titleId,
  })
})
const parsedMask = computed(() => faIcon(mask.value as IconLookup))
const properties = computed(() => {
  const properties: Record<string, any> = {
    'aria-hidden': true,
    'data-prefix': parsedIcon.value?.prefix,
    'data-icon': parsedIcon.value?.iconName,
    class: classes.value,
    focusable: false,
    role: 'img',
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: `0 0 ${parsedIcon.value?.icon[0]} ${parsedIcon.value?.icon[1]}`,
  }
  if (props.symbol) {
    properties.id = [parsedIcon.value?.prefix, 'fa', parsedIcon.value?.iconName].join('-')
  }
  if (props.title) {
    properties['aria-labelledby'] = uniqueId.value
  }

  return properties
})
const htmlTag = computed(() => {
  const svg = getSVG()
  if (parsedMask.value) {
    const id = props.maskId || parsedMask.value.iconName
    return `<defs>
      <clipPath id="clip-${id}">
        <path fill="currentColor" d="${parsedMask.value.icon[4]}"></path>
      </clipPath>
      <mask id="mask-${id}" x="0" y="0" width="100%" height="100%" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
        <rect x="0" y="0" width="100%" height="100%" fill="white"></rect>
        ${svg}
      </mask>
    </defs>
    <rect fill="currentColor" clip-path="url(#clip-${id})" mask="url(#mask-${id})" x="0" y="0" width="100%" height="100%"></rect>`
  }
  return svg
})
const classes = computed(() => {
  const classes = {
    'fa-spin': props.spin,
    'fa-pulse': props.pulse,
    'fa-fw': props.fixedWidth,
    'fa-border': props.border,
    'fa-li': props.listItem,
    'fa-inverse': props.inverse,
    'fa-flip': props.flip === true,
    'fa-flip-horizontal': props.flip === 'horizontal' || props.flip === 'both',
    'fa-flip-vertical': props.flip === 'vertical' || props.flip === 'both',
    [`fa-${props.size}`]: props.size !== undefined,
    [`fa-rotate-${props.rotation}`]: props.rotation !== undefined,
    [`fa-pull-${props.pull}`]: props.pull !== undefined,
    'fa-swap-opacity': props.swapOpacity,
    'fa-bounce': props.bounce,
    'fa-shake': props.shake,
    'fa-beat': props.beat,
    'fa-fade': props.fade,
    'fa-beat-fade': props.beatFade,
    'fa-spin-pulse': props.spinPulse,
    'fa-spin-reverse': props.spinReverse,
  }

  const active = Object.keys(classes)
    .map((key) => (classes[key] ? key : null))
    .filter((key) => key)

  return [faConfig.replacementClass, ...active] as string[]
})

const uniqueId = computed(() => {
  return faConfig.replacementClass + '-title-' + (props.titleId || nextUniqueId())
})

function normalizeIconArgs(icon: Record<string, any> | string | string[] | null) {
  if (icon) {
    if (typeof icon === 'string') {
      const styles: Record<string, string> = {
        solid: 'fas',
        regular: 'far',
        light: 'fal',
        thin: 'fat',
        duotone: 'fad',
        brands: 'fab',
      }
      let prefix = styles[faConfig.styleDefault] || 'fas'
      let iconName = icon.replace(/\bfa-/g, '')
      if (iconName.includes(' ')) {
        const tmp: string[] = iconName.split(/\s+/)
        if (tmp[0] in styles) {
          prefix = styles[tmp[0]]
        }
        iconName = tmp[1]
      }

      return {prefix, iconName}
    }

    if (Array.isArray(icon) && icon.length === 2) {
      return {prefix: icon[0], iconName: icon[1]}
    }

    if (typeof icon === 'object' && 'prefix' in icon && 'iconName' in icon) {
      return icon as IconDefinition
    }
  }

  return undefined
}

function transformForSvg(transform: Transform) {
  const containerWidth = 512
  const iconWidth = parsedIcon.value?.icon[0] || 512
  const x = transform.x || 0
  const y = transform.y || 0
  const size = transform.size || 0
  const rotate = transform.rotate || 0
  const flipX = transform.flipX || 0
  const flipY = transform.flipY || 0

  const outer = 'translate('.concat(String(containerWidth / 2), ' 256)')
  const innerTranslate = 'translate('.concat(String(x * 32), ', ').concat(String(y * 32), ') ')
  const innerScale = 'scale('
    .concat(String((size / 16) * (flipX ? -1 : 1)), ', ')
    .concat(String((size / 16) * (flipY ? -1 : 1)), ') ')
  const innerRotate = 'rotate('.concat(String(rotate), ' 0 0)')
  const inner = ''.concat(innerTranslate, ' ').concat(innerScale, ' ').concat(innerRotate)
  const path = 'translate('.concat(String((iconWidth / 2) * -1), ' -256)')

  return {outer, inner, path}
}

function nextUniqueId() {
  const idPool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

  let size = 12
  let id = ''
  while (size-- > 0) {
    id += idPool[(Math.random() * 62) | 0]
  }

  return id
}

function getSVG() {
  const fill = parsedMask.value ? 'black' : 'currentColor'
  const svg = []

  let path = parsedIcon.value.icon[4]
  if (!Array.isArray(path)) {
    path = [path]
  }
  path.forEach((i: string) => {
    svg.push(
      `<path fill="${fill}"${transform.value ? ' transform="' + transform.value.path + '"' : ''} d="${i}"></path>`,
    )
  })

  if (transform.value) {
    svg.unshift(`<g transform="${transform.value.outer}">`, `<g transform="${transform.value.inner}">`)
    svg.push('</g>', '</g>')
  }
  if (props.title) {
    svg.unshift(`<title id="${uniqueId.value}">${props.title}</title>`)
  }

  return svg.join('')
}

if (props.icon && !parsedIcon.value) {
  console.info('Could not find main icon', icon.value)
}
if (props.mask && !parsedMask.value) {
  console.info('Could not find mask icon', mask.value)
}
</script>
