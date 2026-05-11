<script setup lang="ts">
import { formatCurrency, formatDate } from "../services/noticesPt2030.services";
import type { Portugal2030Notice } from "../noticesPt2030.types";

const props = defineProps<{
  history: Portugal2030Notice[];
}>();

type DiffField = {
  label: string
  old: string
  new: string
}

function getDiff(current: Portugal2030Notice, previous: Portugal2030Notice): DiffField[] {
  const diffs: DiffField[] = []

  const checks: Array<{ label: string; key: keyof Portugal2030Notice; format: (v: string) => string }> = [
    { label: "Dotação Total",      key: "total_allocation",        format: formatCurrency },
    { label: "Dotação Global",     key: "global_allocation",       format: formatCurrency },
    { label: "Dotação Nacional",   key: "national_allocation",     format: formatCurrency },
    { label: "Data de Abertura",   key: "notice_start_date",       format: formatDate },
    { label: "Data de Fecho",      key: "notice_end_date",         format: formatDate },
    { label: "Data de Publicação", key: "notice_publication_date", format: formatDate },
  ]

  for (const { label, key, format } of checks) {
    const a = String(current[key] ?? "")
    const b = String(previous[key] ?? "")
    if (a !== b) diffs.push({ label, old: format(b), new: format(a) })
  }

  return diffs
}
</script>

<template>
  <div>
    <h2 class="text-[10px] font-extrabold uppercase tracking-widest text-theme-muted mb-6">
      Histórico de versões ({{ history.length }})
    </h2>

    <div class="relative">
      <!-- Linha vertical com gradiente -->
      <div
        class="absolute left-4 top-4 bottom-4 w-px"
        style="background: linear-gradient(to bottom, var(--color-primary, #000) 0%, rgba(148,163,184,0.25) 100%)"
      />

      <div class="space-y-5">
        <div
          v-for="(version, i) in history"
          :key="version.id"
          class="relative flex gap-5 items-start"
        >
          <!-- Marker -->
          <div class="relative z-10 shrink-0">
            <!-- Versão atual -->
            <div
              v-if="i === 0"
              class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md ring-4 ring-primary/10"
            >
              <AppIcon name="CheckCircle" :size="15" className="text-white" />
            </div>

            <!-- Versão inicial -->
            <div
              v-else-if="i === history.length - 1"
              class="w-8 h-8 rounded-full ui-border bg-theme-surface flex items-center justify-center shadow-sm"
            >
              <AppIcon name="History" :size="14" className="text-theme-muted" />
            </div>

            <!-- Versões intermédias -->
            <div
              v-else
              class="w-8 h-8 rounded-full ui-border bg-theme-surface flex items-center justify-center shadow-sm"
            >
              <span class="text-[11px] font-extrabold text-theme-muted">
                {{ history.length - i }}
              </span>
            </div>
          </div>

          <!-- Card -->
          <div
            class="flex-1 mb-1 rounded-xl ui-border bg-theme-surface shadow-sm overflow-hidden"
            :class="i === 0 ? 'ring-1 ring-primary/10' : ''"
          >
            <!-- Header do card -->
            <div
              class="flex items-center justify-between gap-2 flex-wrap px-4 py-3 border-b border-theme-border/30"
              :class="i === 0 ? 'bg-primary/5' : 'bg-theme-bg/50'"
            >
              <span class="text-xs font-extrabold text-theme-text uppercase tracking-wide">
                {{ i === 0 ? 'Versão atual' : i === history.length - 1 ? 'Versão inicial' : `Versão ${history.length - i}` }}
              </span>
              <span class="text-xs text-theme-muted flex items-center gap-1">
                <AppIcon name="Clock" :size="11" className="text-theme-muted" />
                {{ formatDate(version.notice_updated_at) }}
              </span>
            </div>

            <!-- Corpo do card -->
            <div class="px-4 py-3">

              <!-- Versão inicial: resumo completo -->
              <template v-if="i === history.length - 1">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-widest text-theme-muted mb-0.5">Abertura</p>
                    <p class="font-semibold text-theme-text">{{ formatDate(version.notice_start_date) }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-widest text-theme-muted mb-0.5">Fecho</p>
                    <p class="font-semibold text-theme-text">{{ formatDate(version.notice_end_date) }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-widest text-theme-muted mb-0.5">Dotação Total</p>
                    <p class="font-semibold text-theme-text">{{ formatCurrency(version.total_allocation) }}</p>
                  </div>
                </div>
              </template>

              <!-- Outras versões: diff -->
              <template v-else>
                <template v-if="getDiff(version, history[i + 1]).length">
                  <div class="space-y-2">
                    <div
                      v-for="diff in getDiff(version, history[i + 1])"
                      :key="diff.label"
                      class="flex items-center gap-2 flex-wrap"
                    >
                      <span class="text-[10px] font-extrabold uppercase tracking-wider text-theme-muted w-28 shrink-0">
                        {{ diff.label }}
                      </span>
                      <span class="text-xs line-through text-theme-muted/50">{{ diff.old }}</span>
                      <AppIcon name="ArrowRight" :size="11" className="text-theme-muted shrink-0" />
                      <span class="text-sm font-semibold text-theme-text">{{ diff.new }}</span>
                    </div>
                  </div>
                </template>
                <p v-else class="text-xs text-theme-muted italic">
                  Sem alterações relevantes registadas.
                </p>
              </template>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
