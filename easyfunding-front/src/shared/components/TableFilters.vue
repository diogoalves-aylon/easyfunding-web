<script setup lang="ts">
import { computed } from 'vue'
import AppDatePicker from './AppDatePicker.vue'

export type FilterConfig =
  | { type: 'search'; key: string; placeholder?: string }
  | { type: 'select'; key: string; label: string; options: string[] }
  | { type: 'date-range'; keyFrom: string; keyTo: string; label: string }

const props = defineProps<{
  filters: FilterConfig[]
  modelValue: Record<string, string>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, string>): void
}>()

function update(key: string, value: string) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

function clearAll() {
  const cleared = Object.fromEntries(Object.keys(props.modelValue).map(k => [k, '']))
  emit('update:modelValue', cleared)
}

const hasActiveFilters = computed(() =>
  Object.values(props.modelValue).some(v => v !== '')
)

const nonSearchFilters = computed(() => props.filters.filter(f => f.type !== 'search'))
const searchFilter = computed(() => props.filters.find(f => f.type === 'search') as Extract<FilterConfig, { type: 'search' }> | undefined)
</script>

<template>
  <div class="rounded-xl ui-border bg-theme-surface shadow-sm px-4 py-3">
  <div class="flex items-center gap-2 flex-wrap">

    <!-- Label "Filtros" -->
    <div class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium ui-border bg-theme-surface text-theme-muted shrink-0 select-none">
      <AppIcon name="SlidersHorizontal" :size="14" />
      Filtros
    </div>

    <!-- Select filters -->
    <template v-for="filter in nonSearchFilters" :key="filter.type === 'date-range' ? filter.keyFrom : filter.key">

      <div v-if="filter.type === 'select'" class="relative shrink-0">
        <select
          :value="modelValue[filter.key] ?? ''"
          @change="e => update(filter.key, (e.target as HTMLSelectElement).value)"
          class="appearance-none pl-3 pr-8 py-2 rounded-lg text-sm ui-border bg-theme-surface text-theme-text outline-none cursor-pointer"
        >
          <option value="">{{ filter.label }}</option>
          <option v-for="opt in filter.options" :key="opt" :value="opt">{{ opt }}</option>
        </select>
        <AppIcon
          name="ChevronDown"
          :size="13"
          className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-theme-muted"
        />
      </div>

      <div
        v-else-if="filter.type === 'date-range'"
        class="flex items-center gap-2 px-3 py-2 rounded-lg ui-border bg-theme-surface shrink-0"
      >
        <AppIcon name="CalendarDays" :size="14" className="text-theme-muted shrink-0" />
        <span class="text-sm text-theme-muted whitespace-nowrap">{{ filter.label }}</span>
        <AppDatePicker
          :modelValue="modelValue[filter.keyFrom] ?? ''"
          placeholder="De"
          @update:modelValue="update(filter.keyFrom, $event)"
        />
        <span class="text-xs text-theme-muted">—</span>
        <AppDatePicker
          :modelValue="modelValue[filter.keyTo] ?? ''"
          placeholder="Até"
          @update:modelValue="update(filter.keyTo, $event)"
        />
      </div>

    </template>

    <!-- Slot (e.g. favourites toggle) -->
    <slot />

    <!-- Clear -->
    <button
      v-if="hasActiveFilters"
      @click="clearAll"
      type="button"
      class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-red-500 hover:bg-red-500/10 shrink-0"
    >
      <AppIcon name="X" :size="14" />
      Limpar
    </button>

    <!-- Search — right, stretches -->
    <div v-if="searchFilter" class="relative flex-1 min-w-48">
      <AppIcon
        name="Search"
        :size="15"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted pointer-events-none"
      />
      <input
        :value="modelValue[searchFilter.key] ?? ''"
        @input="e => update(searchFilter.key, (e.target as HTMLInputElement).value)"
        type="text"
        :placeholder="searchFilter.placeholder ?? 'Pesquisar...'"
        class="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none ui-border bg-theme-surface text-theme-text placeholder:text-theme-muted/70"
      />
    </div>

  </div>
  </div>
</template>
