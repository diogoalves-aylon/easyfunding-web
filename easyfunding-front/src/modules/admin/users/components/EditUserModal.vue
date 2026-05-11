<script setup lang="ts">
import { X } from "lucide-vue-next";
import type { AdminUser } from "../adminUsers.types";

/**
 * Payload de edição:
 * - password opcional (se vazio -> não manda / não atualiza)
 * - role e is_admin ficam editáveis, se você quiser
 */
export type UpdateUserPayload = {
  id: number;
  username: string;
  email: string;
  password?: string;
  is_admin: boolean;
  role?: string; // opcional, se seu backend suportar
};

const props = defineProps<{
  open: boolean;
  modelValue: UpdateUserPayload;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "submit"): void;
  (e: "update:modelValue", v: UpdateUserPayload): void;
}>();

function update<K extends keyof UpdateUserPayload>(key: K, val: UpdateUserPayload[K]) {
  emit("update:modelValue", { ...props.modelValue, [key]: val });
}

/**
 * Ajuda: se quiser garantir que password vazio vire undefined
 * antes de enviar, faça isso no submit do parent (recomendado).
 */
</script>

<template>
  <transition name="modal">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <div class="rounded-2xl shadow-xl max-w-md w-full p-6 relative ui-border bg-theme-bg">
        <button @click="emit('close')" class="absolute top-4 right-4 text-theme-muted">
          <X class="w-5 h-5" />
        </button>

        <h3 class="text-xl font-extrabold text-theme-text mb-6">Editar Utilizador</h3>

        <form @submit.prevent="emit('submit')" class="space-y-4">
          <div>
            <label class="block text-sm font-bold mb-1 text-theme-muted">Username</label>
            <input
              :value="modelValue.username"
              @input="e => update('username', (e.target as HTMLInputElement).value)"
              type="text"
              required
              class="w-full px-4 py-2 rounded-lg outline-none text-sm ui-border shadow bg-theme-surface text-theme-text"
              placeholder="johndoe"
            />
          </div>

          <div>
            <label class="block text-sm font-bold mb-1 text-theme-muted">Email</label>
            <input
              :value="modelValue.email"
              @input="e => update('email', (e.target as HTMLInputElement).value)"
              type="email"
              required
              class="w-full px-4 py-2 rounded-lg outline-none text-sm ui-border shadow bg-theme-surface text-theme-text"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label class="block text-sm font-bold mb-1 text-theme-muted">Password</label>
              <span class="text-[11px] text-theme-muted">
                (opcional — deixe em branco para não alterar)
              </span>
            </div>

            <input
              :value="modelValue.password ?? ''"
              @input="e => update('password', (e.target as HTMLInputElement).value)"
              type="password"
              class="w-full px-4 py-2 rounded-lg outline-none text-sm ui-border shadow bg-theme-surface text-theme-text"
              placeholder="••••••••"
            />
          </div>

          <div class="flex items-center gap-2 pt-2">
            <input
              :checked="modelValue.is_admin"
              @change="e => update('is_admin', (e.target as HTMLInputElement).checked)"
              type="checkbox"
              id="is_admin_edit"
              class="w-4 h-4 rounded"
            />
            <label for="is_admin_edit" class="text-sm font-bold text-theme-text">
              Administrador
            </label>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="emit('close')"
              class="flex-1 px-4 py-2 rounded-lg font-bold transition cursor-pointer hover:brightness-110 ui-border bg-theme-surface text-theme-text"
            >
              Cancelar
            </button>

            <button
              type="submit"
              :disabled="loading"
              class="flex-1 px-4 py-2 rounded-lg font-bold cursor-pointer transition bg-theme-button text-theme-textSecondary hover:brightness-110 disabled:opacity-60"
            >
              {{ loading ? "Salvando..." : "Salvar" }}
            </button>
          </div>
        </form>

        <!-- mini info -->
        <div class="mt-4 text-xs text-theme-muted">
          ID: <span class="font-mono text-theme-text">{{ modelValue.id }}</span>
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
