<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const open = ref(false)
const wrapperRef = ref<HTMLElement | null>(null)

const today = new Date()

const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth())

const MONTHS = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
]
const DAY_HEADERS = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom']

const displayValue = computed(() => {
  if (!props.modelValue) return ''
  const [y, m, d] = props.modelValue.split('-')
  return `${d}/${m}/${y}`
})

const daysGrid = computed(() => {
  const firstDay = new Date(viewYear.value, viewMonth.value, 1)
  const totalDays = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
  const startOffset = (firstDay.getDay() + 6) % 7 // Monday-first

  const cells: Array<{ day: number | null; date: string }> = []

  for (let i = 0; i < startOffset; i++) {
    cells.push({ day: null, date: '' })
  }
  for (let d = 1; d <= totalDays; d++) {
    const m = String(viewMonth.value + 1).padStart(2, '0')
    const day = String(d).padStart(2, '0')
    cells.push({ day: d, date: `${viewYear.value}-${m}-${day}` })
  }

  return cells
})

function prevMonth() {
  if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- }
  else viewMonth.value--
}

function nextMonth() {
  if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ }
  else viewMonth.value++
}

function selectDay(date: string) {
  emit('update:modelValue', date)
  open.value = false
}

function clearValue(e: MouseEvent) {
  e.stopPropagation()
  emit('update:modelValue', '')
}

function isSelected(date: string) {
  return props.modelValue === date
}

function isToday(date: string) {
  const m = String(today.getMonth() + 1).padStart(2, '0')
  const d = String(today.getDate()).padStart(2, '0')
  return date === `${today.getFullYear()}-${m}-${d}`
}

function toggleOpen() {
  if (!open.value) {
    const source = props.modelValue ? new Date(props.modelValue + 'T00:00:00') : today
    viewYear.value = source.getFullYear()
    viewMonth.value = source.getMonth()
  }
  open.value = !open.value
}

function onDocumentClick(e: MouseEvent) {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target as Node)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick))
</script>

<template>
  <div ref="wrapperRef" class="relative">
    <!-- Input -->
    <button
      type="button"
      @click.stop="toggleOpen"
      class="flex items-center gap-2 py-2 px-3 rounded-lg text-sm outline-none ui-border bg-theme-bg shadow min-w-[148px] transition hover:brightness-[0.98] dark:hover:brightness-110"
    >
      <AppIcon name="Calendar" :size="14" className="text-theme-muted shrink-0" />
      <span class="flex-1 text-left" :class="displayValue ? 'text-theme-text' : 'text-theme-muted/60'">
        {{ displayValue || placeholder || 'dd/mm/aaaa' }}
      </span>
      <AppIcon
        v-if="modelValue"
        name="X"
        :size="12"
        className="text-theme-muted hover:text-theme-text shrink-0"
        @click="clearValue"
      />
    </button>

    <!-- Popover -->
    <Transition name="dp">
      <div
        v-if="open"
        class="absolute top-full mt-2 left-0 z-50 w-72 rounded-xl ui-border bg-theme-surface shadow-lg p-3"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-3">
          <button
            type="button"
            @click="prevMonth"
            class="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            <AppIcon name="ChevronLeft" :size="16" className="text-theme-muted" />
          </button>

          <span class="text-sm font-bold text-theme-text select-none">
            {{ MONTHS[viewMonth] }} {{ viewYear }}
          </span>

          <button
            type="button"
            @click="nextMonth"
            class="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            <AppIcon name="ChevronRight" :size="16" className="text-theme-muted" />
          </button>
        </div>

        <!-- Day headers -->
        <div class="grid grid-cols-7 mb-1">
          <span
            v-for="h in DAY_HEADERS"
            :key="h"
            class="text-center text-[10px] font-extrabold uppercase tracking-wider text-theme-muted py-1"
          >
            {{ h }}
          </span>
        </div>

        <!-- Days -->
        <div class="grid grid-cols-7 gap-y-0.5">
          <template v-for="(cell, i) in daysGrid" :key="i">
            <div v-if="!cell.day" />
            <button
              v-else
              type="button"
              @click="selectDay(cell.date)"
              class="aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition select-none"
              :class="[
                isSelected(cell.date)
                  ? 'bg-primary text-white font-bold'
                  : isToday(cell.date)
                  ? 'ring-1 ring-inset ring-primary/40 text-theme-text hover:bg-black/5 dark:hover:bg-white/10'
                  : 'text-theme-text hover:bg-black/5 dark:hover:bg-white/10'
              ]"
            >
              {{ cell.day }}
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dp-enter-active,
.dp-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dp-enter-from,
.dp-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
