<script setup lang="ts">
import * as icons from 'lucide-vue-next'
import { computed } from 'vue'
import type { Component } from 'vue'

type IconName = keyof typeof icons

const props = withDefaults(
  defineProps<{
    name: IconName
    size?: number
    className?: string
    strokeWidth?: number
    fill?: string
  }>(),
  {
    size: 24,
    strokeWidth: 2,
    fill: 'none',
  }
)

const Cmp = computed<Component>(() => icons[props.name] as unknown as Component)
</script>

<template>
  <component
    :is="Cmp"
    :size="props.size"
    :stroke-width="props.strokeWidth"
    :class="props.className"
    :fill="props.fill"
  />
</template>
