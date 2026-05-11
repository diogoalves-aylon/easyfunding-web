<script setup lang="ts">
import { computed } from 'vue'
import type { PasswordForm } from '../profile.types'
import { Lock } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: PasswordForm
  loading?: boolean
  error?: string
  success?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: PasswordForm): void
  (e: 'save'): void
}>()

/**
 * Proteção para evitar crash caso o form ainda não esteja populado
 * (muito comum quando dados vêm async).
 */
const safeModel = computed<PasswordForm>(() => ({
  currentPassword: props.modelValue?.currentPassword ?? '',
  newPassword: props.modelValue?.newPassword ?? '',
  confirmPassword: props.modelValue?.confirmPassword ?? ''
}))

function update<K extends keyof PasswordForm>(key: K, val: PasswordForm[K]) {
  emit('update:modelValue', { ...safeModel.value, [key]: val })
}

const invalidCurrent = computed(() => (props.error || '').toLowerCase().includes('senha atual'))
const invalidNew = computed(() => (props.error || '').toLowerCase().includes('nova senha') || (props.error || '').toLowerCase().includes('diferente'))
const invalidConfirm = computed(() => (props.error || '').toLowerCase().includes('confirma'))

function onSave() {
  if (props.loading) return
  emit('save')
}
</script>

<template>
  <div
    class="rounded-3xl p-6 shadow-sm ui-border"
  >
    <div class="flex items-center gap-2 mb-5">
      <Lock class="w-5 h-5" style="color: var(--muted-theme);" />
      <h3 class="font-extrabold text-theme-text">Segurança</h3>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <!-- Senha atual -->
      <div>
        <label
          for="pwd-current"
          class="block text-[10px] font-extrabold uppercase tracking-widest mb-1.5 ml-1"
          style="color: var(--muted-theme);"
        >
          Senha atual
        </label>

        <input
          id="pwd-current"
          type="password"
          class="w-full px-4 py-3 rounded-2xl outline-none text-sm border transition"
          style="background: var(--bg-theme); color: var(--text-theme); border-color: var(--border-theme);"
          :class="invalidCurrent
            ? 'border-red-500 focus:ring-2 focus:ring-red-400'
            : 'focus:ring-2 focus:ring-primary/40'"
          :disabled="loading"
          autocomplete="current-password"
          :value="safeModel.currentPassword"
          @input="update('currentPassword', ($event.target as HTMLInputElement).value)"
          placeholder="••••••••"
        />
      </div>

      <!-- Nova senha -->
      <div>
        <label
          for="pwd-new"
          class="block text-[10px] font-extrabold uppercase tracking-widest mb-1.5 ml-1"
          style="color: var(--muted-theme);"
        >
          Nova senha
        </label>

        <input
          id="pwd-new"
          type="password"
          class="w-full px-4 py-3 rounded-2xl border outline-none text-sm transition"
          style="background: var(--bg-theme); color: var(--text-theme); border-color: var(--border-theme);"
          :class="invalidNew 
            ? 'border-red-500 focus:ring-2 focus:ring-red-400'
            : 'focus:ring-2 focus:ring-primary/40'"
          :disabled="loading"
          autocomplete="new-password"
          :value="safeModel.newPassword"
          @input="update('newPassword', ($event.target as HTMLInputElement).value)"
          placeholder="••••••••"
        />
      </div>

      <!-- Confirmar -->
      <div>
        <label
          for="pwd-confirm"
          class="block text-[10px] font-extrabold uppercase tracking-widest mb-1.5 ml-1"
          style="color: var(--muted-theme);"
        >
          Confirmar
        </label>

        <input
          id="pwd-confirm"
          type="password"
          class="w-full px-4 py-3 rounded-2xl border outline-none text-sm transition"
          style="background: var(--bg-theme); color: var(--text-theme); border-color: var(--border-theme);"
          :class="invalidConfirm 
            ? 'border-red-500 focus:ring-2 focus:ring-red-400'
            : 'focus:ring-2 focus:ring-primary/40'"
          :disabled="loading"
          autocomplete="new-password"
          :value="safeModel.confirmPassword"
          @input="update('confirmPassword', ($event.target as HTMLInputElement).value)"
          placeholder="••••••••"
        />
      </div>
    </div>

    <div class="mt-5 flex justify-end">
      <button
        type="button"
        class="px-5 py-3 rounded-2xl font-extrabold text-xs tracking-widest 
          uppercase transition active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02]
          bg-theme-button text-theme-textSecondary shadow-lg"
        :disabled="loading"
        @click="onSave"
      >
        {{ loading ? 'SALVANDO...' : 'ALTERAR SENHA' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 220ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
