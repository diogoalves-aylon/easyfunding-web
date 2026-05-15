<script setup lang="ts">
import type { User } from "../adminRoles.types";

defineProps<{
  open: boolean;
  roleName: string;
  users: User[];
  search: string;
  selectedUserId: number | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "confirm"): void;
  (e: "update:search", v: string): void;
  (e: "update:selectedUserId", v: number | null): void;
}>();
</script>

<template>
  <transition name="modal">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4 "
    >
      <div class="w-full max-w-md rounded-lg shadow-xl flex flex-col max-h-[80vh] ui-border bg-theme-surface ">
        <!-- header -->
        <div class="p-4 flex items-center justify-between ui-border bg-theme-bg rounded-lg">
          <h3 class="font-extrabold text-theme-text">
            Atribuir utilizador a {{ roleName }}
          </h3>

          <button
            type="button"
            @click="emit('close')"
            class="p-1 rounded transition hover:brightness-110 text-theme-muted"
          >
            <AppIcon name="X" :size="20" className="text-theme-muted" />
          </button>
        </div>

        <!-- body -->
        <div class="p-4">
          <input
            :value="search"
            @input="e => emit('update:search', (e.target as HTMLInputElement).value)"
            type="text"
            placeholder="Pesquisar utilizadores..."
            class="w-full px-4 py-2 rounded-lg text-sm mb-4 outline-none ui-border bg-theme-bg shadow text-theme-text placeholder:text-theme-muted/70"
          />

          <div class="space-y-1 max-h-60 overflow-y-auto">
            <div
              v-for="u in users"
              :key="u.id"
              @click="emit('update:selectedUserId', u.id)"
              class="flex items-center p-2 rounded-lg cursor-pointer ui-border transition bg-theme-bg shadow"
              :class="selectedUserId === u.id
                ? 'bg-primary/5'
                : 'hover:brightness-[0.98] dark:hover:brightness-110'"
            >
              <img
                :src="u.avatar || 'https://i.pravatar.cc/150'"
                class="w-8 h-8 rounded-full mr-3"
                alt=""
              />

              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold truncate text-theme-text">
                  {{ u.name }}
                </p>
                <p class="text-xs truncate text-theme-muted">
                  {{ u.email }}
                </p>
              </div>

              <AppIcon
                v-if="selectedUserId === u.id"
                name="Check"
                :size="16"
                className="text-primary"
              />
            </div>
          </div>
        </div>

        <!-- footer -->
        <div class="p-4 ui-border flex justify-end gap-2 bg-theme-bg rounded-lg">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 rounded-lg text-sm font-bold text-theme-text bg-theme-bg transition hover:brightness-150 cursor-pointer"
            style="background: rgba(148,163,184,0.15); color: var(--text-theme);"
          >
            Cancelar
          </button>

          <button
            type="button"
            @click="emit('confirm')"
            :disabled="!selectedUserId"
            class="px-4 py-2 rounded-lg text-sm font-bold bg-theme-button text-theme-textSecondary hover:brightness-110 transition cursor-pointer"
          >
            Confirmar Atribuição
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.22s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
