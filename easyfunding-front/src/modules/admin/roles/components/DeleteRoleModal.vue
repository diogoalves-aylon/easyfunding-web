<script setup lang="ts">
import { AlertTriangle, X } from 'lucide-vue-next'
import type { Role } from '../adminRoles.types'

defineProps<{ open: boolean; role: Role | null }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'confirm'): void }>()
</script>

<template>
  <transition name="modal">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div class="rounded-2xl shadow-xl max-w-md w-full p-6 relative ui-border bg-theme-surface">
        <button @click="emit('close')" class="absolute top-4 right-4" style="color: var(--muted-theme);">
          <X class="w-5 h-5" />
        </button>

        <div class="flex flex-col items-center text-center">
          <div class="w-12 h-12 rounded-full flex items-center justify-center mb-4"
               style="background: rgba(239,68,68,0.12); color: rgb(239,68,68);">
            <AlertTriangle class="w-6 h-6" />
          </div>

          <h3 class="text-lg font-extrabold text-theme-text mb-2">Remover Role</h3>
          <p class="mb-6 text-theme-muted">
            Tem certeza que deseja remover a role
            <span class="font-bold text-theme-text">{{ role?.name }}</span>?
          </p>

          <div class="flex gap-3 w-full">
            <button @click="emit('close')"
                    class="flex-1 px-4 py-2 rounded-lg font-bold transition hover:brightness-105 cursor-pointer"
                    style="background: rgba(148,163,184,0.15); color: var(--text-theme);">
              Cancelar
            </button>
            <button @click="emit('confirm')"
                    class="flex-1 px-4 py-2 rounded-lg font-bold transition hover:brightness-110 cursor-pointer"
                    style="background: rgb(239,68,68); color: white;">
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity .22s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
