<script setup lang="ts">
import type { Role } from "../adminRoles.types";

const props = defineProps<{
  roles: Role[];
  selectedRole: Role | null;
  search: string;
}>();

const emit = defineEmits<{
  (e: "update:search", v: string): void;
  (e: "select", role: Role): void;
}>();
</script>

<template>
  <!-- Search card -->
  <div class="p-4 ui-border bg-theme-surface shadow">
    <div class="relative">
      <AppIcon
        name="Search"
        :size="16"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted"
      />

      <input
        :value="search"
        @input="e => emit('update:search', (e.target as HTMLInputElement).value)"
        type="text"
        placeholder="Search roles..."
        class="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none ui-border bg-theme-bg shadow text-theme-text placeholder:text-theme-muted/70"
      />
    </div>
  </div>

  <!-- List -->
  <div class="flex-1 overflow-y-auto shadow">
    <button
      v-for="role in roles"
      :key="role.id"
      @click="emit('select', role)"
      class="w-full text-left px-4 py-3 ui-border transition flex items-center justify-between group bg-theme-bg shadow"
      :class="selectedRole?.id === role.id
        ? 'bg-primary/5'
        : 'hover:brightness-[0.98] dark:hover:brightness-110'"
    >
      <div class="min-w-0 text-theme-text">
        <p class="font-semibold truncate">
          {{ role.name }}
        </p>

        <p class="text-xs truncate w-40 text-theme-muted">
          {{ role.description }}
        </p>
      </div>

      <AppIcon
        v-if="role.isSystem"
        name="Shield"
        :size="16"
        className="opacity-60 group-hover:opacity-100 text-theme-muted"
      />
    </button>
  </div>
</template>
