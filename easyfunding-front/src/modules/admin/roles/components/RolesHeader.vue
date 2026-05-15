<script setup lang="ts">
import { Plus, Shield } from 'lucide-vue-next'
const emit = defineEmits<{ (e: 'create'): void }>()
</script>

<template>
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-extrabold text-theme-text flex items-center gap-2">
        <Shield class="w-6 h-6" />
        Gestão de Perfis
      </h1>
      <p class="text-sm text-theme-muted">Gere os perfis de acesso e permissões dos utilizadores</p>
    </div>

    <button
      @click="emit('create')"
      class="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition bg-theme-button text-theme-textSecondary hover:brightness-110"
    >
      <Plus class="w-4 h-4"/>
      Criar Perfil
    </button>
  </div>
</template>
