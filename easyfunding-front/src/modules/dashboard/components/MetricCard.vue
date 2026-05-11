<template>
  <div
    class="p-3 rounded-2xl shadow-sm transition-all duration-300 border"
    :class="highlight
      ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500/10 dark:bg-blue-500/10 dark:border-blue-400/20 dark:ring-blue-400/20'
      : 'bg-theme-surface border-theme-border/30'"
  >
    <div class="flex items-center justify-between mb-0">
      <div class="p-1.5 rounded-lg" :class="highlight ? 'bg-white/70 dark:bg-white/10' : 'bg-black/5 dark:bg-white/10'">
        <slot name="icon" />
      </div>

      <span
        class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
        :class="highlight
          ? 'bg-blue-600 text-white dark:bg-blue-400/20 dark:text-blue-200'
          : 'bg-black/5 dark:bg-white/10 text-theme-muted'"
      >
        {{ trend }}
      </span>
    </div>

    <p class="text-theme-muted text-xs font-medium mb-1">{{ label }}</p>

    <h4 class="text-lg font-bold" :class="highlight ? 'text-blue-700 dark:text-blue-200' : 'text-theme-text'">
      {{ value }}
    </h4>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string;
  trend: string;
  highlight?: boolean;
}>();
</script>
