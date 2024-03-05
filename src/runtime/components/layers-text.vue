<template>
  <span :class="classes" :style="style">{{ value }}</span>
</template>

<script setup lang="ts">
import {config, parse, type Transform} from '@fortawesome/fontawesome-svg-core'
import {computed, type StyleValue} from 'vue'
import {transformIsMeaningful} from '../utils'

const props = defineProps({
  value: {
    type: [String, Number],
    default: '',
  },
  transform: {
    type: [String, Object],
    default: null,
  },
  counter: {
    type: Boolean,
    default: false,
  },
  position: {
    type: String,
    default: null,
    validator: (value) => ['bottom-left', 'bottom-right', 'top-left', 'top-right'].includes(value as string),
  },
})

const {familyPrefix} = config
const classes = computed(() => {
  const tmp = []
  if (props.counter) {
    tmp.push(`${familyPrefix}-layers-counter`)
  } else {
    tmp.push(`${familyPrefix}-layers-text`)
  }
  if (props.position) {
    tmp.push(`${familyPrefix}-layers-${props.position}`)
  }
  return tmp
})

const style = computed(() => {
  const transform =
    props.transform && typeof props.transform !== 'object'
      ? transformForCss(parse.transform(props.transform))
      : props.transform
  return {transform} as StyleValue
})

function transformForCss(transform: Transform) {
  const d = 16
  const x = transform.x || 0
  const y = transform.y || 0
  const size = transform.size || 0
  const rotate = transform.rotate || 0

  let val = ''
  if (transformIsMeaningful(transform)) {
    val += 'translate(calc(-50% + '.concat(String(x / d), 'em), calc(-50% + ').concat(String(y / d), 'em)) ')
  } else {
    val += 'translate('.concat(String(x / d), 'em, ').concat(String(y / d), 'em) ')
  }

  val += 'scale('
    .concat(String((size / d) * (transform.flipX ? -1 : 1)), ', ')
    .concat(String((size / d) * (transform.flipY ? -1 : 1)), ') ')
  val += 'rotate('.concat(String(rotate), 'deg) ')

  return val
}
</script>
