<script setup lang="ts">
import type { User } from "../adminRoles.types";

defineProps<{ users: User[] }>();
const emit = defineEmits<{ (e: "remove", userId: number): void }>();
</script>

<template>
  <div class="rounded-lg ui-border bg-theme-bg overflow-hidden shadow">
    <table class="w-full text-sm text-left">
      <thead class="bg-black/5 dark:bg-white/10">
        <tr>
          <th class="px-4 py-3 text-xs font-extrabold uppercase tracking-widest text-theme-muted">
            User
          </th>
          <th class="px-4 py-3 text-xs font-extrabold uppercase tracking-widest text-right text-theme-muted">
            Action
          </th>
        </tr>
      </thead>

      <tbody class="divide-y divide-theme-border/40">
        <tr
          v-for="u in users"
          :key="u.id"
          class="transition hover:brightness-[0.98] dark:hover:brightness-110"
        >
          <td class="px-4 py-3 font-medium text-theme-text">
            <div class="flex items-center gap-3">
              <img
                :src="u.avatar || 'https://i.pravatar.cc/150'"
                class="w-6 h-6 rounded-full"
                alt=""
              />
              <span class="truncate">{{ u.name }} ({{ u.email }})</span>
            </div>
          </td>

          <td class="px-4 py-3 text-right">
            <button
              type="button"
              @click="emit('remove', u.id)"
              class="inline-flex items-center gap-1 text-sm font-bold transition hover:brightness-110 text-red-500"
            >
              <AppIcon name="Trash2" :size="16" className="text-red-500" />
              Remove
            </button>
          </td>
        </tr>

        <tr v-if="users.length === 0">
          <td colspan="2" class="px-4 py-6 text-center text-theme-muted">
            No users assigned to this role
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
