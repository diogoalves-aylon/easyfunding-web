<script setup lang="ts" generic="TData, TValue">
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  type ColumnDef,
  type SortingState,
  type ExpandedState,
} from '@tanstack/vue-table'
import { ref, computed, watch } from 'vue'
import { ArrowUpDown } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  globalFilter?: string
  pageSize?: number
  totalItems?: number
  manualPagination?: boolean
  manualSorting?: boolean
  getRowCanExpand?: (row: TData) => boolean
}>(), {
  pageSize: 10,
  manualPagination: false,
  manualSorting: false,
  getRowCanExpand: () => false
})

const emit = defineEmits<{
  (e: 'rowClick', row: TData): void
  (e: 'paginationChange', pageIndex: number, pageSize: number): void
  (e: 'sortingChange', sorting: SortingState): void
}>()

const sorting = ref<SortingState>([])
const expanded = ref<ExpandedState>({})
const paginationState = ref({
  pageIndex: 0,
  pageSize: props.pageSize,
})

const table = useVueTable({
  get data() {
    return props.data
  },
  columns: props.columns,
  state: {
    get sorting() {
      return sorting.value
    },
    get globalFilter() {
      return props.globalFilter
    },
    get pagination() {
      return paginationState.value
    },
    get expanded() {
      return expanded.value
    }
  },
  onSortingChange: updaterOrValue => {
    sorting.value = typeof updaterOrValue === 'function' ? updaterOrValue(sorting.value) : updaterOrValue
    emit('sortingChange', sorting.value)
  },
  onExpandedChange: updaterOrValue => {
    expanded.value = typeof updaterOrValue === 'function' ? updaterOrValue(expanded.value) : updaterOrValue
  },
  onPaginationChange: updaterOrValue => {
    paginationState.value = typeof updaterOrValue === 'function' ? updaterOrValue(paginationState.value) : updaterOrValue
    emit('paginationChange', paginationState.value.pageIndex, paginationState.value.pageSize)
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  getRowCanExpand: (row) => props.getRowCanExpand(row.original),
  manualSorting: props.manualSorting,
  manualPagination: props.manualPagination,
  get pageCount() {
    return props.manualPagination && props.totalItems
      ? Math.ceil(props.totalItems / paginationState.value.pageSize)
      : undefined
  },
  initialState: {
    pagination: {
      pageSize: props.pageSize,
      pageIndex: 0
    }
  }
})

watch(() => props.pageSize, (newPageSize) => {
  table.setPageSize(newPageSize)
}, { immediate: true })

const setPageSize = (size: number) => {
  table.setPageSize(size)
}

defineExpose({
  setPageSize,
  table
})

const pageNumbers = computed(() => {
  const totalPages = table.getPageCount()
  const current = table.getState().pagination.pageIndex + 1
  const delta = 2
  const range = []

  for (let i = Math.max(2, current - delta); i <= Math.min(totalPages - 1, current + delta); i++) {
    range.push(i)
  }

  if (current - delta > 2) {
    range.unshift('...')
  }
  if (current + delta < totalPages - 1) {
    range.push('...')
  }

  range.unshift(1)
  if (totalPages > 1) {
    range.push(totalPages)
  }

  return range
})
</script>

<template>
  <div class="w-full bg-theme-surface rounded-lg shadow-sm border border-theme-border overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left">
        <thead class="text-xs uppercase bg-theme-surface text-theme-text border-b border-gray-100 dark:border-gray-700">
          <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <th v-for="header in headerGroup.headers" :key="header.id"
              class="px-3 py-3 text-xs sm:text-sm sm:px-6 sm:py-4 font-semibold tracking-wider cursor-pointer select-none group whitespace-nowrap first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6"
              @click="header.column.getToggleSortingHandler()?.($event)">
              <div class="flex items-center gap-1">
                <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                  :props="header.getContext()" />
                <ArrowUpDown v-if="header.column.getCanSort()"
                  class="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  :class="{ 'opacity-100 text-primary': header.column.getIsSorted() }" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
          <template v-for="row in table.getRowModel().rows" :key="row.id">
            <tr
              class="group bg-theme-surface hover:bg-primary/5 dark:hover:bg-primary/30 transition-colors cursor-pointer"
              @click="emit('rowClick', row.original)">
              <td v-for="cell in row.getVisibleCells()" :key="cell.id"
                class="px-3 py-3 text-xs sm:text-sm align-top text-theme-text first:pl-4 sm:first:pl-6 last:pr-4 sm:last:pr-6">
                <slot :name="'cell-' + cell.column.id" :row="row.original" :cell="cell" :value="cell.getValue()">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </slot>
              </td>
            </tr>
            <tr v-if="row.getIsExpanded()">
              <td :colspan="row.getVisibleCells().length" class="p-0 bg-gray-50 dark:bg-gray-800/50">
                <slot name="expanded-row" :row="row.original"></slot>
              </td>
            </tr>
          </template>
          <tr v-if="table.getRowModel().rows.length === 0">
            <td :colspan="columns.length" class="px-3 sm:px-6 py-8 sm:py-12 text-center text-theme-text">
              <div class="flex flex-col items-center justify-center gap-2">
                <p class="text-base font-medium">Nenhum registro encontrado</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Footer -->
    <div
      class="flex flex-col sm:flex-row items-center justify-between p-4 bg-theme-surface border-t border-gray-100 dark:border-gray-700">
      <span class="text-sm text-gray-500 dark:text-gray-400">
        A mostrar de <span class="font-medium">
          {{ props.manualPagination && props.totalItems === 0 ? 0 : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1 }}
        </span>
        até <span class="font-medium">
          {{ props.manualPagination
              ? Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, props.totalItems || 0)
              : Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)
          }}
        </span>
        de <span class="font-medium">{{ props.manualPagination ? props.totalItems : table.getFilteredRowModel().rows.length }}</span> registos
      </span>

      <div class="flex items-center gap-2 mt-4 sm:mt-0">
        <button
          class="px-3 py-1 rounded text-sm font-medium text-theme-text hover:bg-primary/5 dark:hover:bg-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          @click="table.previousPage()" :disabled="!table.getCanPreviousPage()">
          Anterior
        </button>

        <template v-for="(page, index) in pageNumbers" :key="index">
          <span v-if="page === '...'" class="px-2 text-theme-text">...</span>
          <button v-else class="w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors"
            :class="page === (table.getState().pagination.pageIndex + 1)
              ? 'bg-green-600 text-white shadow-sm'
              : 'text-theme-text hover:bg-primary/5 dark:hover:bg-primary/30'"
            @click="table.setPageIndex(Number(page) - 1)">
            {{ page }}
          </button>
        </template>

        <button
          class="px-3 py-1 rounded text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-primary/5 dark:hover:bg-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          @click="table.nextPage()" :disabled="!table.getCanNextPage()">
          Próximo
        </button>
      </div>
    </div>
  </div>
</template>
