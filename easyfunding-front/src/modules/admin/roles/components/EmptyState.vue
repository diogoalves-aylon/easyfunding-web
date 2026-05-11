<script setup lang="ts">
import { Shield } from 'lucide-vue-next'
</script>

<template>
  <div class="flex items-center justify-center p-12 rounded-xl border border-dashed"
       style="background: var(--surface-theme); border-color: var(--border-theme); color: var(--muted-theme);">
    <div class="text-center">
      <Shield class="w-16 h-16 mx-auto mb-4 opacity-50"/>
      <p class="text-lg font-extrabold" style="color: var(--text-theme);">Selecione uma role</p>
      <p class="text-sm">ou crie uma nova para começar</p>
    </div>
  </div>
</template>
