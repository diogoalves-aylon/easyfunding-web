<script setup lang="ts">
import AppIcon from "@/shared/components/AppIcon.vue";
import type { AdminUser, Role } from "../adminUsers.types";

defineProps<{
  users: AdminUser[];
  roles: Role[];
  extraRoles: Role[];
}>();

const emit = defineEmits<{
  (e: "changeRole", payload: { user: AdminUser; role: string }): void;
  (e: "delete", user: AdminUser): void;
  (e: "edit", user: AdminUser): void;
}>();
</script>

<template>
  <div class="overflow-x-auto bg-theme-surface shadow rounded-lg">
    <table class="w-full text-left border-collapse">
      <thead class="bg-black/5 dark:bg-white/10">
        <tr>
          <th class="px-6 py-4 text-xs font-extrabold uppercase tracking-widest text-theme-muted">
            Utilizador
          </th>
          <th class="px-6 py-4 text-xs font-extrabold uppercase tracking-widest text-theme-muted">
            Função / Cargo
          </th>
          <th class="px-6 py-4 text-xs font-extrabold uppercase tracking-widest text-right text-theme-muted">
            Ações
          </th>
        </tr>
      </thead>

      <tbody class="divide-y divide-theme-border/40">
        <tr
          v-for="user in users"
          :key="user.id"
          class="transition bg-theme-bg hover:brightness-[0.98] dark:hover:brightness-110"
        >
          <td class="px-6 py-4">
            <div class="flex items-center gap-3">
              <img
                :src="user.avatar"
                class="w-9 h-9 rounded-full bg-black/10 dark:bg-white/10"
                alt=""
              />
              <div>
                <div class="font-semibold text-theme-text">{{ user.name }}</div>
                <div class="text-xs text-theme-muted">{{ user.email }}</div>
              </div>
            </div>
          </td>

          <td class="px-6 py-4">
            <select
              :value="user.role"
              @change="e => emit('changeRole', { user, role: (e.target as HTMLSelectElement).value })"
              class="w-40 p-1.5 rounded-lg text-sm outline-none ui-border bg-theme-bg text-theme-text shadow"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
              <option v-for="role in extraRoles" :key="role.id" :value="role.name">
                {{ role.name }}
              </option>
            </select>
          </td>

          <td class="px-6 py-4 text-right">
            <button
              type="button"
              @click="emit('edit', user)"
              class="text-theme-muted hover:text-theme-text transition"
              title="Editar"
            >
              <AppIcon name="Pencil" className="inline w-4 h-4" />
            </button>

            <button
              type="button"
              @click="emit('delete', user)"
              class="text-red-500 hover:brightness-110 transition"
              title="Remover"
            >
              <AppIcon name="Trash" className="inline w-4 h-4 ml-2" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
