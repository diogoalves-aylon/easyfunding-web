<script setup lang="ts">
import { computed } from "vue";
import { formatCurrency, formatDate, getNoticeStatus, parseDocuments, getDownloadUrl } from "../services/noticesPt2030.services";
import type { Portugal2030Notice } from "../noticesPt2030.types";
import { useFavouritesStore } from "@/stores/favouritesStore";

const props = defineProps<{
  notice: Portugal2030Notice;
}>();

const favouritesStore = useFavouritesStore();
const isFav = computed(() => favouritesStore.isFavourite(props.notice.code));

const statusConfig = {
  open:     { label: "Aberto",  classes: "bg-green-500/10 text-green-500" },
  closed:   { label: "Fechado", classes: "bg-red-500/10 text-red-500" },
  upcoming: { label: "A abrir", classes: "bg-yellow-500/10 text-yellow-500" },
} as const;

const status = computed(() => getNoticeStatus(props.notice));
const documents = computed(() => parseDocuments(props.notice.documents));

const daysBadge = computed(() => {
  const now = Date.now();
  const start = new Date(props.notice.notice_start_date).getTime();
  const end = new Date(props.notice.notice_end_date).getTime();

  if (status.value === "open") {
    const d = Math.ceil((end - now) / 86400000);
    if (d <= 0) return { label: "A fechar hoje", urgent: true };
    if (d <= 7) return { label: `Fecha em ${d}d`, urgent: true };
    return { label: `Fecha em ${d}d`, urgent: false };
  }
  if (status.value === "upcoming") {
    const d = Math.ceil((start - now) / 86400000);
    return { label: `Abre em ${d}d`, urgent: false };
  }
  const d = Math.ceil((now - end) / 86400000);
  return { label: `Fechou há ${d}d`, urgent: false };
});

// Progress between notice_start_date and notice_end_date (0-100)
const openProgress = computed(() => {
  const start = new Date(props.notice.notice_start_date).getTime();
  const end = new Date(props.notice.notice_end_date).getTime();
  const now = Date.now();
  if (status.value === "upcoming") return 0;
  if (status.value === "closed") return 100;
  return Math.max(0, Math.min(100, ((now - start) / (end - start)) * 100));
});

const pubPassed = computed(() => Date.now() >= new Date(props.notice.notice_publication_date).getTime());
const startPassed = computed(() => status.value !== "upcoming");
</script>

<template>
  <div class="space-y-6">

    <!-- Título e badges -->
    <div>
      <div class="flex items-start justify-between gap-2 mb-2">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="font-mono text-xs font-bold text-theme-muted">{{ notice.code }}</span>
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
            :class="statusConfig[status].classes"
          >
            {{ statusConfig[status].label }}
          </span>
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
            :class="daysBadge.urgent
              ? 'bg-orange-500/10 text-orange-500'
              : 'bg-black/5 dark:bg-white/10 text-theme-muted'"
          >
            {{ daysBadge.label }}
          </span>
        </div>
        <button
          type="button"
          class="shrink-0 p-2 rounded-lg transition-colors"
          :class="isFav ? 'text-yellow-400 hover:text-yellow-500' : 'text-theme-muted hover:text-yellow-400 hover:bg-yellow-400/10'"
          @click="favouritesStore.toggle(notice.code)"
        >
          <AppIcon name="Star" :size="20" :fill="isFav ? 'currentColor' : 'none'" />
        </button>
      </div>
      <h1 class="text-xl font-extrabold text-theme-text leading-snug">{{ notice.domination }}</h1>
      <p class="mt-1 text-sm text-theme-muted">{{ notice.classification }}</p>
    </div>

    <!-- Linha de tempo -->
    <div class="bg-theme-bg rounded-xl p-4 ui-border">
      <p class="text-[10px] font-extrabold uppercase tracking-widest text-theme-muted mb-5">
        Linha de tempo
      </p>

      <div class="flex items-start">
        <!-- Milestone: Publicação -->
        <div class="flex flex-col items-center shrink-0">
          <div
            class="w-3 h-3 rounded-full border-2 transition-colors"
            :class="pubPassed
              ? 'border-primary bg-primary'
              : 'border-theme-border bg-theme-surface'"
          />
          <p class="text-[10px] font-bold text-theme-muted mt-2 text-center leading-tight">Publicação</p>
          <p class="text-[11px] font-semibold text-theme-text text-center">
            {{ formatDate(notice.notice_publication_date) }}
          </p>
        </div>

        <!-- Linha pub → abertura -->
        <div
          class="flex-1 h-0.5 mt-1.5 rounded-full mx-1"
          :class="startPassed ? 'bg-primary/40' : 'bg-theme-border/30'"
        />

        <!-- Milestone: Abertura -->
        <div class="flex flex-col items-center shrink-0">
          <div
            class="w-3 h-3 rounded-full border-2 transition-colors"
            :class="startPassed
              ? 'border-primary bg-primary'
              : 'border-theme-border bg-theme-surface'"
          />
          <p class="text-[10px] font-bold text-theme-muted mt-2 text-center leading-tight">Abertura</p>
          <p class="text-[11px] font-semibold text-theme-text text-center">
            {{ formatDate(notice.notice_start_date) }}
          </p>
        </div>

        <!-- Barra de progresso abertura → fecho -->
        <div class="flex-[2] mt-1 mx-1">
          <div class="h-1.5 rounded-full overflow-hidden bg-theme-border/20 relative">
            <div
              class="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
              :class="status === 'closed' ? 'bg-red-400/70' : 'bg-green-500/70'"
              :style="{ width: openProgress + '%' }"
            />
          </div>
          <!-- indicador "hoje" -->
          <div
            v-if="status === 'open'"
            class="flex justify-end pr-[calc(100%-v-bind(openProgress+'%'))] mt-0.5"
          >
          </div>
        </div>

        <!-- Milestone: Fecho -->
        <div class="flex flex-col items-center shrink-0">
          <div
            class="w-3 h-3 rounded-full border-2 transition-colors"
            :class="status === 'closed'
              ? 'border-red-400 bg-red-400'
              : 'border-theme-border bg-theme-surface'"
          />
          <p class="text-[10px] font-bold text-theme-muted mt-2 text-center leading-tight">Fecho</p>
          <p class="text-[11px] font-semibold text-theme-text text-center">
            {{ formatDate(notice.notice_end_date) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Alocações -->
    <div>
      <p class="text-[10px] font-extrabold uppercase tracking-widest text-theme-muted mb-3">Dotações</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <!-- Total — destaque maior -->
        <div class="md:col-span-3 bg-theme-bg rounded-xl p-4 ui-border shadow flex items-center justify-between gap-4">
          <div>
            <p class="text-[10px] font-extrabold uppercase tracking-widest text-theme-muted mb-1">Dotação Total</p>
            <p class="text-2xl font-extrabold text-theme-text">{{ formatCurrency(notice.total_allocation) }}</p>
          </div>
          <div class="p-3 rounded-xl bg-primary/5">
            <AppIcon name="Banknote" :size="24" className="text-primary" />
          </div>
        </div>

        <div class="bg-theme-bg rounded-xl p-4 ui-border shadow">
          <p class="text-[10px] font-extrabold uppercase tracking-widest text-theme-muted mb-1">Global</p>
          <p class="text-lg font-bold text-theme-text">{{ formatCurrency(notice.global_allocation) }}</p>
        </div>

        <div class="bg-theme-bg rounded-xl p-4 ui-border shadow">
          <p class="text-[10px] font-extrabold uppercase tracking-widest text-theme-muted mb-1">Nacional</p>
          <p class="text-lg font-bold text-theme-text">{{ formatCurrency(notice.national_allocation) }}</p>
        </div>

        <div class="bg-theme-bg rounded-xl p-4 ui-border shadow">
          <p class="text-[10px] font-extrabold uppercase tracking-widest text-theme-muted mb-1">Atualizado em</p>
          <p class="text-sm font-semibold text-theme-text">{{ formatDate(notice.notice_updated_at) }}</p>
        </div>
      </div>
    </div>

    <!-- Metadados -->
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-theme-bg rounded-xl p-4 ui-border shadow">
        <p class="text-[10px] font-extrabold uppercase tracking-widest text-theme-muted mb-1">Fundo</p>
        <p class="text-sm font-semibold text-theme-text">{{ notice.fund }}</p>
      </div>
      <div class="bg-theme-bg rounded-xl p-4 ui-border shadow">
        <p class="text-[10px] font-extrabold uppercase tracking-widest text-theme-muted mb-1">Tipo</p>
        <p class="text-sm font-semibold text-theme-text">{{ notice.type }}</p>
      </div>
    </div>

    <!-- Documentos -->
    <div v-if="documents.length">
      <p class="text-[10px] font-extrabold uppercase tracking-widest text-theme-muted mb-3">Documentos</p>
      <div class="flex flex-wrap gap-2">
        <a
          v-for="(doc, i) in documents"
          :key="i"
          :href="getDownloadUrl(doc.path, doc.filename)"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ui-border bg-theme-bg text-theme-text hover:brightness-110 transition shadow"
        >
          <AppIcon name="FileText" :size="16" className="text-theme-muted" />
          {{ doc.filename }}
        </a>
      </div>
    </div>

  </div>
</template>
