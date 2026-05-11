<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
}>()
</script>

<template>
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div>
      <h2 class="text-2xl font-bold text-theme-text">{{ title ?? 'Perfil' }}</h2>
      <p class="text-sm font-medium" style="color: var(--muted-theme);">
        {{ subtitle ?? 'Gerencie suas informações e preferências de conta' }}
      </p>
    </div>
  </div>
</template>
