<template>
  <div :class="classes">
    <slot name="default" />
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {config} from '@fortawesome/fontawesome-svg-core'

const props = defineProps({
  fixedWidth: {
    type: Boolean,
    default: false,
  },
})

const {familyPrefix} = config
const classes = computed(() => {
  const tmp = [`${familyPrefix}-layers`]
  if (props.fixedWidth) {
    tmp.push(`${familyPrefix}-fw`)
  }
  return tmp
})
</script>
