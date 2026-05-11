<script setup lang="ts">
import type { UserProfile } from '../profile.types'

const props = defineProps<{
  user: UserProfile | null
}>()

</script>

<template>
  <div
    v-if="user"
    class="rounded-3xl p-6 shadow-sm flex items-center gap-5 ui-border"
  >
    <div
      class="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center font-extrabold text-lg"
      style="border-color: var(--border-theme); background: rgba(37,99,235,0.10);"
    >
      <img
        :src="'/assets/avatar-default.svg'"
        alt="Avatar"
        class="w-full h-full object-cover"
      />
    </div>

    <div class="min-w-0">
      <div class="flex items-center gap-3 flex-wrap">
        <h3 class="text-lg font-extrabold text-theme-text truncate">
          {{ user.name }}
        </h3>
        <span
          class="text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-full bg-theme-button text-theme-textSecondary"
        >
          {{ user.role }}
        </span>
      </div>

      <p class="text-sm mt-1 truncate" style="color: var(--muted-theme);">
        {{ user.email }}
      </p>

      <p
        v-if="user.phone"
        class="text-sm truncate"
        style="color: var(--muted-theme);"
      >
        {{ user.phone }}
      </p>
    </div>
  </div>
</template>
