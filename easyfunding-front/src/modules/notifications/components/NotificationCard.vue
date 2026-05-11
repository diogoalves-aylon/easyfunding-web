<script setup lang="ts">
import { computed } from 'vue'
import type { AppNotification } from '../notifications.types'
import { formatRelativeTime, getIconTone } from '../services/notifications.services'

const props = defineProps<{ item: AppNotification }>()

const emit = defineEmits<{
  (e: 'ack', id: number): void
  (e: 'ignore', id: number): void
}>()

const isNew = computed(() => !props.item.viewed)
const isResolved = computed(() => props.item.viewed)

const tone = computed(() => getIconTone(props.item.type))

const iconName = computed(() => {
  switch (props.item.type) {
    default: return 'Bell'
  }
})

const timeLabel = computed(() => formatRelativeTime(props.item.created_at))

const statusPill = computed(() => {
  if (props.item.status === 'failed')
    return { text: 'FALHOU', fg: 'rgb(239,68,68)', bg: 'rgba(239,68,68,0.10)', icon: 'XCircle' }

  if (props.item.status === 'pending')
    return { text: 'PENDENTE', fg: 'rgb(245,158,11)', bg: 'rgba(245,158,11,0.14)', icon: 'Clock' }

  // sent
  if (isResolved.value)
    return { text: 'LIDA', fg: 'rgb(16,185,129)', bg: 'rgba(16,185,129,0.12)', icon: 'CheckCircle2' }

  return { text: 'ENVIADA', fg: 'rgb(59,130,246)', bg: 'rgba(59,130,246,0.12)', icon: 'Bell' }
})
</script>

<template>
  <div class="notif-card rounded-[28px] border p-6 md:p-7"
    :class="{ 'notif-card--new': isNew, 'notif-card--resolved': isResolved }" :style="{
      background: 'var(--surface-theme)',
      borderColor: isResolved ? 'rgba(0,0,0,0)' : (isNew ? 'rgba(16,185,129,0.6)' : 'var(--border-theme)')
    }">
    <div class="flex gap-5 items-start">
      <!-- Icon -->
      <div class="w-14 h-14 rounded-2xl flex items-center justify-center border"
        :style="{ background: tone.bg, color: tone.fg, borderColor: 'rgba(0,0,0,0.02)' }">
        <AppIcon :name="iconName" :size="24" className="text-theme-muted" />
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span class="text-[10px] font-extrabold tracking-widest uppercase" style="color: var(--muted-theme);">
            {{ timeLabel }}
          </span>

          <span v-if="isNew" class="text-[10px] font-extrabold tracking-widest uppercase px-2 py-1 rounded-full"
            style="background: rgba(16,185,129,0.14); color: rgb(16,185,129);">
            NOVO
          </span>

          <span v-else class="text-[10px] font-extrabold tracking-widest uppercase px-2 py-1 rounded-full"
            :style="{ background: statusPill.bg, color: statusPill.fg }">
            {{ statusPill.text }}
          </span>
        </div>

        <h3 class="mt-1 font-extrabold text-theme-text text-base md:text-lg truncate">
          {{ item.title }}
        </h3>

        <p class="text-[11px] font-bold uppercase tracking-widest mt-1" style="color: var(--color-primary);">
          {{ item.source }}
        </p>

        <p class="mt-2 text-sm leading-relaxed" style="color: var(--muted-theme);">
          {{ item.message }}
        </p>
      </div>

      <!-- Actions / Status -->
      <div class="hidden sm:flex flex-col gap-3 items-stretch min-w-35 pl-4 border-l"
        style="border-color: var(--border-theme);">
        <template v-if="isNew">
          <button
            class="notif-btn notif-btn--primary px-4 py-3 rounded-2xl font-extrabold text-xs tracking-widest uppercase"
            style="background: var(--color-primary); color: white;" @click="$emit('ack', item.id)">
            CIENTE
          </button>
          <button class="notif-btn px-4 py-3 rounded-2xl font-extrabold text-xs tracking-widest uppercase"
            style="background: rgba(148,163,184,0.12); color: var(--text-theme);" @click="$emit('ignore', item.id)">
            IGNORAR
          </button>
        </template>

        <template v-else>
          <div
            class="px-4 py-2 rounded-2xl font-extrabold text-xs tracking-widest uppercase flex items-center justify-center gap-2"
            :style="{ background: statusPill.bg, color: statusPill.fg }">
            <AppIcon :name="statusPill.icon" :size="16" className="text-theme-muted" />
            <span>{{ statusPill.text }}</span>
          </div>
        </template>
      </div>
    </div>

    <!-- Mobile actions -->
    <div v-if="isNew" class="sm:hidden mt-5 grid grid-cols-2 gap-3">
      <button
        class="notif-btn notif-btn--primary px-4 py-3 rounded-2xl font-extrabold text-xs tracking-widest uppercase"
        style="background: var(--color-primary); color: white;" @click="$emit('ack', item.id)">
        CIENTE
      </button>
      <button class="notif-btn px-4 py-3 rounded-2xl font-extrabold text-xs tracking-widest uppercase"
        style="background: rgba(148,163,184,0.12); color: var(--text-theme);" @click="$emit('ignore', item.id)">
        IGNORAR
      </button>
    </div>
  </div>
</template>

<style scoped>
/* (mantém exatamente o CSS do zip — não mexi nele) */
.notif-card {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  transition:
    box-shadow 260ms ease,
    border-color 260ms ease,
    transform 260ms ease,
    filter 260ms ease,
    opacity 260ms ease;
  will-change: box-shadow, transform, border-color, opacity;
}
.notif-card:hover { transform: translateY(-1px); box-shadow: 0 14px 38px rgba(0, 0, 0, 0.08); }
.notif-card--new { box-shadow: 0 16px 50px rgba(16, 185, 129, 0.14), 0 12px 32px rgba(0, 0, 0, 0.06); }
.notif-card--resolved { box-shadow: none; border-color: transparent !important; transform: none; filter: saturate(0.98); }
.notif-btn { transition: transform 120ms ease, filter 200ms ease, box-shadow 200ms ease, opacity 200ms ease; }
.notif-btn:focus-visible { outline: none; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.20); }
.notif-btn:hover { filter: brightness(1.02); }
.notif-btn:active { transform: scale(0.98); }
.notif-btn--primary:hover { box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12); }
@media (prefers-reduced-motion: reduce) {
  .notif-card, .notif-btn { transition: none !important; }
  .notif-card:hover { transform: none; }
}
</style>
