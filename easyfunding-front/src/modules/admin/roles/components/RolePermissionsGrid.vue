<script setup lang="ts">
import type { AppRoutePermission } from "../adminRoles.types";

defineProps<{
  routes: AppRoutePermission[];
  selected: string[];
}>();

const emit = defineEmits<{ (e: "toggle", routeName: string): void }>();
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
    <div
      v-for="r in routes"
      :key="r.name"
      @click="emit('toggle', r.name)"
      class="p-3 rounded-lg ui-border bg-theme-surface cursor-pointer transition-all relative shadow-sm"
      :class="selected.includes(r.name)
        ? 'bg-primary/5'
        : 'hover:brightness-[0.98] dark:hover:brightness-110'"
    >
      <div class="flex items-center gap-3">
        <!-- checkbox visual -->
        <div
          class="w-5 h-5 rounded border flex items-center justify-center transition"
          :class="selected.includes(r.name)
            ? 'bg-primary border-primary text-white'
            : 'border-theme-border/60 text-transparent bg-theme-bg'"
        >
          <AppIcon v-if="selected.includes(r.name)" name="Check" :size="12" className="text-white" />
        </div>

        <span class="text-sm font-semibold text-theme-text">
          {{ r.name }}
        </span>
      </div>

      <div class="text-xs mt-1 ml-8 truncate text-theme-muted">
        {{ r.path }}
      </div>
    </div>
  </div>
</template>
