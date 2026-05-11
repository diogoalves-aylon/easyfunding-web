<script setup lang="ts">
const props = defineProps<{
  clearDisabled?: boolean
  subtitle?: string
}>()

const emit = defineEmits<{
  (e: 'clear'): void
}>()
</script>

<template>
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div>
      <h2 class="text-2xl font-bold text-theme-text">Notificações</h2>
      <p class="text-sm font-medium" style="color: var(--muted-theme);">
        {{ subtitle || 'Notificações e Eventos' }}
      </p>
    </div>

    <button
      type="button"
      class="h-11 px-4 rounded-2xl font-extrabold text-xs tracking-widest uppercase inline-flex items-center gap-2 transition-all select-none cursor-pointer"
      :class="[
        props.clearDisabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:-translate-y-px active:translate-y-0 active:scale-[0.99]'
      ]"
      style="background: rgba(239,68,68,0.12); color: rgb(239,68,68);"
      :disabled="props.clearDisabled"
      title="Remove as notificações da tela (apaga no backend)."
      @click="$emit('clear')"
    >
      <AppIcon name="Trash2" :size="18" className="text-theme-muted" />
      Limpar
    </button>
  </div>
</template>
