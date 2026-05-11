<script setup lang="ts">
</script>

<template>
  <div class="py-20 text-center rounded-3xl border-2 border-dashed"
       style="background: rgba(148,163,184,0.08); border-color: var(--border-theme);">
    <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm"
         style="background: var(--surface-theme); color: var(--muted-theme);">
      <AppIcon name="BellOff" :size="40" className="text-theme-muted" />
    </div>
    <p class="font-bold uppercase text-xs tracking-widest" style="color: var(--muted-theme);">
      Nenhuma notificação
    </p>
  </div>
</template>
