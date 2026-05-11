<script setup lang="ts">
import { computed } from 'vue'
import type { ProfileForm } from '../profile.types'
import { Mail, Phone, User } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: ProfileForm
  loading?: boolean
  error?: string
  success?: string

  /** Controla o que pode editar */
  lockNameEmail?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: ProfileForm): void
  (e: 'save'): void
}>()

const safeModel = computed<ProfileForm>(() => ({
  name: props.modelValue?.name ?? '',
  email: props.modelValue?.email ?? '',
  phone: props.modelValue?.phone ?? ''
}))

const lockNameEmail = computed(() => props.lockNameEmail !== false)

function update<K extends keyof ProfileForm>(key: K, val: ProfileForm[K]) {
  emit('update:modelValue', { ...safeModel.value, [key]: val })
}

function onSave() {
  if (props.loading) return
  emit('save')
}

</script>

<template>
  <div
    class="rounded-3xl p-6 shadow-sm ui-border"
  >
    <h3 class="font-extrabold text-theme-text mb-5">Informações pessoais</h3>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <!-- Nome (travado) -->
      <div>
        <label
          for="profile-name"
          class="block text-[10px] font-extrabold uppercase tracking-widest mb-1.5 ml-1"
          style="color: var(--muted-theme);"
        >
          Nome
        </label>

        <div
          class="flex items-center gap-2 px-4 py-3 rounded-2xl border transition"
          style="background: var(--bg-theme); border-color: var(--border-theme);"
          :class="[
            loading ? 'opacity-70' : 'focus-within:ring-2 focus-within:ring-primary/40',
            lockNameEmail ? 'opacity-90' : ''
          ]"
        >
          <User class="w-4 h-4" style="color: var(--muted-theme);" />
          <input
            id="profile-name"
            class="w-full bg-transparent outline-none text-sm cursor-not-allowed"
            style="color: var(--text-theme);"
            :value="safeModel.name"
            :disabled="lockNameEmail"
            readonly
            autocomplete="name"
            autocapitalize="words"
            placeholder="Seu nome"
          />
        </div>
      </div>

      <!-- Email (travado) -->
      <div>
        <label
          for="profile-email"
          class="block text-[10px] font-extrabold uppercase tracking-widest mb-1.5 ml-1"
          style="color: var(--muted-theme);"
        >
          Email
        </label>

        <div
          class="flex items-center gap-2 px-4 py-3 rounded-2xl border transition"
          style="background: var(--bg-theme); border-color: var(--border-theme);"
          :class="[
            loading ? 'opacity-70' : 'focus-within:ring-2 focus-within:ring-primary/40',
            lockNameEmail ? 'opacity-90' : ''
          ]"
        >
          <Mail class="w-4 h-4" style="color: var(--muted-theme);" />
          <input
            id="profile-email"
            type="email"
            class="w-full bg-transparent outline-none text-sm cursor-not-allowed"
            style="color: var(--text-theme);"
            :value="safeModel.email"
            :disabled="lockNameEmail"
            readonly
            autocomplete="email"
            inputmode="email"
            placeholder="email@dominio.com"
          />
        </div>
      </div>

      <!-- Telefone (editável) -->
      <div>
        <label
          for="profile-phone"
          class="block text-[10px] font-extrabold uppercase tracking-widest mb-1.5 ml-1"
          style="color: var(--muted-theme);"
        >
          Telefone
        </label>

        <div
          class="flex items-center gap-2 px-4 py-3 rounded-2xl border transition"
          style="background: var(--bg-theme); border-color: var(--border-theme);"
          :class="loading ? 'opacity-70' : 'focus-within:ring-2 focus-within:ring-primary/40'"
        >
          <Phone class="w-4 h-4" style="color: var(--muted-theme);" />
          <input
            id="profile-phone"
            v-maska="'+351 9## ### ###'"
            type="tel"
            class="w-full bg-transparent outline-none text-sm"
            style="color: var(--text-theme);"
            :value="safeModel.phone"
            :disabled="loading"
            autocomplete="tel"
            inputmode="tel"
            @input="update('phone', ($event.target as HTMLInputElement).value)"
            placeholder="+351 ..."
          />
        </div>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="error"
        class="mt-4 text-sm rounded-2xl p-3 border"
        style="background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.25); color: rgb(239,68,68);"
        role="alert"
      >
        {{ error }}
      </div>
    </transition>

    <transition name="fade">
      <div
        v-if="success"
        class="mt-4 text-sm rounded-2xl p-3 border"
        style="background: rgba(16,185,129,0.10); border-color: rgba(16,185,129,0.22); color: rgb(16,185,129);"
        role="status"
      >
        {{ success }}
      </div>
    </transition>

    <div class="mt-5 flex justify-end">
      <button
        type="button"
        class="px-5 py-3 rounded-2xl font-extrabold text-xs tracking-widest 
          uppercase transition active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02]
          bg-theme-button text-theme-textSecondary shadow-lg"
        :disabled="loading"
        @click="onSave"
      >
        {{ loading ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES' }}
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
