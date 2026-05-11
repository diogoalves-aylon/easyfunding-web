<script setup lang="ts">
import { Plus } from 'lucide-vue-next'

defineProps<{
  total: number
}>()

const emit = defineEmits<{
  (e: 'create'): void
}>()
</script>

<template>
  <div class="p-6 flex justify-between items-center">
    <div class="flex items-center gap-4">
      <div>
        <h3 class="text-lg font-extrabold text-theme-text">Gerir Utilizadores</h3>
        <p class="text-sm text-theme-muted">Gerencie acesso e permissões</p>
      </div>

      <span class="text-xs font-bold px-2.5 py-0.5 rounded text-theme-textSecondary bg-theme-button">
        {{ total }} Total
      </span>
    </div>

    <button
      @click="emit('create')"
      class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition bg-theme-button text-theme-textSecondary hover:brightness-110"
      >
      <AppIcon name="Plus" :size="18"/>Adicionar Utilizador
    </button>
  </div>
</template>
