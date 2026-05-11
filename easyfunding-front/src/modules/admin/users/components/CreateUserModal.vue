<script setup lang="ts">
import { X } from 'lucide-vue-next'
import type { CreateUserPayload } from '../adminUsers.types'

const props = defineProps<{
    open: boolean
    modelValue: CreateUserPayload
    loading: boolean
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'submit'): void
    (e: 'update:modelValue', v: CreateUserPayload): void
}>()

function update<K extends keyof CreateUserPayload>(key: K, val: CreateUserPayload[K]) {
    emit('update:modelValue', { ...props.modelValue, [key]: val })
}
</script>

<template>
    <transition name="modal">
        <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div class="rounded-2xl shadow-xl max-w-md w-full p-6 relative ui-border bg-theme-bg">
                <button @click="emit('close')" class="absolute top-4 right-4" style="color: var(--muted-theme);">
                    <X class="w-5 h-5" />
                </button>

                <h3 class="text-xl font-extrabold text-theme-text mb-6">Novo Utilizador</h3>

                <form @submit.prevent="emit('submit')" class="space-y-4">
                    <div>
                        <label class="block text-sm font-bold mb-1 text-theme-muted">Username</label>
                        <input :value="modelValue.username"
                            @input="e => update('username', (e.target as HTMLInputElement).value)" type="text" required
                            class="w-full px-4 py-2 rounded-lg outline-none text-sm ui-border shadow bg-theme-surface"
                            placeholder="johndoe" />
                    </div>

                    <div>
                        <label class="block text-sm font-bold mb-1 text-theme-muted">Email</label>
                        <input :value="modelValue.email"
                            @input="e => update('email', (e.target as HTMLInputElement).value)" type="email" required
                            class="w-full px-4 py-2 rounded-lg ui-border outline-none text-sm shadow bg-theme-surface"
                            placeholder="john@example.com" />
                    </div>

                    <div>
                        <label class="block text-sm font-bold mb-1 text-theme-muted">Password</label>
                        <input :value="modelValue.password"
                            @input="e => update('password', (e.target as HTMLInputElement).value)" type="password"
                            required class="w-full px-4 py-2 rounded-lg ui-border outline-none text-sm shadow bg-theme-surface"
                            placeholder="••••••••" />
                    </div>

                    <div class="flex items-center gap-2 pt-2">
                        <input :checked="modelValue.is_admin"
                            @change="e => update('is_admin', (e.target as HTMLInputElement).checked)" type="checkbox"
                            id="is_admin" class="w-4 h-4 rounded" />
                        <label for="is_admin" class="text-sm font-bold" style="color: var(--text-theme);">
                            Administrador
                        </label>
                    </div>

                    <div class="flex gap-3 pt-4">
                        <button type="button" @click="emit('close')"
                            class="flex-1 px-4 py-2 rounded-lg font-bold transition cursor-pointer hover:brightness-150"
                            style="background: rgba(148,163,184,0.15); color: var(--text-theme);">
                            Cancelar
                        </button>

                        <button type="submit" :disabled="loading"
                            class="flex-1 px-4 py-2 rounded-lg font-bold cursor-pointer transition bg-theme-button text-theme-textSecondary hover:brightness-110 ">
                            {{ loading ? 'Criando...' : 'Cadastrar' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity .22s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
</style>
