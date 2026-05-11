<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useNoticesPt2030 } from "../useNoticesPt2030";
import TableFilters from "@/shared/components/TableFilters.vue";
import type { FilterConfig } from "@/shared/components/TableFilters.vue";
import NoticesTable from "../components/NoticesTable.vue";
import EmptyState from "../components/EmptyState.vue";
import { getNoticeStatus } from "../services/noticesPt2030.services";
import type { Portugal2030Notice } from "../noticesPt2030.types";
import { useFavouritesStore } from "@/stores/favouritesStore";

const router = useRouter();

const {
  notices,
  loading,
  filters,
  filteredNotices,
  availableTypes,
  availableFunds,
} = useNoticesPt2030();

const favouritesStore = useFavouritesStore();
const onlyFavourites = ref(false);

onMounted(() => favouritesStore.load());

const displayedNotices = computed(() =>
  onlyFavourites.value
    ? filteredNotices.value.filter((n) => favouritesStore.isFavourite(n.code))
    : filteredNotices.value
);

const openCount = computed(() =>
  notices.value.filter((n) => getNoticeStatus(n) === "open").length
);

const upcomingCount = computed(() =>
  notices.value.filter((n) => getNoticeStatus(n) === "upcoming").length
);

const fundsCount = computed(
  () => new Set(notices.value.map((n) => n.fund).filter(Boolean)).size
);

function onSelect(notice: Portugal2030Notice) {
  router.push({ name: "notices-pt2030-detail", params: { code: notice.code } });
}

const filterConfig = computed<FilterConfig[]>(() => [
  { type: 'search', key: 'search', placeholder: 'Pesquisar por código ou denominação...' },
  { type: 'select', key: 'type', label: 'Tipo', options: availableTypes.value },
  { type: 'select', key: 'fund', label: 'Fundo', options: availableFunds.value },
  { type: 'date-range', keyFrom: 'publication_from', keyTo: 'publication_to', label: 'Publicação' },
])

const filtersRecord = computed({
  get: () => ({
    search: filters.search,
    type: filters.type,
    fund: filters.fund,
    publication_from: filters.publication_from,
    publication_to: filters.publication_to,
  }),
  set: (val) => {
    filters.search = val.search ?? ''
    filters.type = val.type ?? ''
    filters.fund = val.fund ?? ''
    filters.publication_from = val.publication_from ?? ''
    filters.publication_to = val.publication_to ?? ''
  },
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-extrabold text-theme-text">Avisos Portugal 2030</h1>
      <p class="text-sm text-theme-muted mt-1">
        Consulte os avisos de abertura de candidaturas do Portugal 2030
      </p>
    </div>

    <!-- KPIs -->
    <div v-if="!loading" class="grid grid-cols-2 md:grid-cols-3 gap-3">
      <div class="p-4 rounded-2xl border bg-theme-surface border-theme-border/30 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <div class="p-1.5 rounded-lg bg-green-500/10">
            <AppIcon name="CheckCircle" :size="18" className="text-green-500" />
          </div>
          <span class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
            Abertos
          </span>
        </div>
        <p class="text-theme-muted text-xs font-medium mb-1">Avisos Abertos</p>
        <h4 class="text-xl font-bold text-theme-text">{{ openCount }}</h4>
      </div>

      <div class="p-4 rounded-2xl border bg-theme-surface border-theme-border/30 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <div class="p-1.5 rounded-lg bg-yellow-500/10">
            <AppIcon name="Clock" :size="18" className="text-yellow-500" />
          </div>
          <span class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
            Futuros
          </span>
        </div>
        <p class="text-theme-muted text-xs font-medium mb-1">A Abrir</p>
        <h4 class="text-xl font-bold text-theme-text">{{ upcomingCount }}</h4>
      </div>

      <div class="p-4 rounded-2xl border bg-theme-surface border-theme-border/30 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <div class="p-1.5 rounded-lg bg-purple-500/10">
            <AppIcon name="Layers" :size="18" className="text-purple-500" />
          </div>
          <span class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-theme-muted">
            Total
          </span>
        </div>
        <p class="text-theme-muted text-xs font-medium mb-1">Fundos</p>
        <h4 class="text-xl font-bold text-theme-text">{{ fundsCount }}</h4>
      </div>
    </div>

    <!-- Skeleton KPIs -->
    <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-3">
      <div
        v-for="i in 3"
        :key="i"
        class="p-4 rounded-2xl border bg-theme-surface border-theme-border/30 shadow-sm animate-pulse h-24"
      />
    </div>

    <!-- Filters -->
    <TableFilters :filters="filterConfig" v-model="filtersRecord">
      <button
        type="button"
        title="Mostrar só favoritos"
        class="flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors"
        :class="onlyFavourites ? 'text-yellow-400' : 'text-theme-muted hover:text-yellow-400'"
        @click="onlyFavourites = !onlyFavourites"
      >
        <AppIcon name="Star" :size="15" :fill="onlyFavourites ? 'currentColor' : 'none'" />
        <span v-if="favouritesStore.count > 0" class="text-xs font-semibold tabular-nums">
          {{ favouritesStore.count }}
        </span>
      </button>
    </TableFilters>

    <!-- Table -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-8 h-8 border-4 border-theme-border border-t-black dark:border-t-white rounded-full animate-spin" />
    </div>

    <template v-else>
      <div v-if="displayedNotices.length" class="rounded-xl ui-border bg-theme-surface shadow overflow-hidden">
        <NoticesTable :notices="displayedNotices" @select="onSelect" />
      </div>
      <EmptyState
        v-else
        :message="onlyFavourites ? 'Ainda não marcou nenhum aviso como favorito' : 'Nenhum aviso encontrado'"
        :icon="onlyFavourites ? 'Star' : 'FileSearch'"
      />
    </template>
  </div>
</template>
