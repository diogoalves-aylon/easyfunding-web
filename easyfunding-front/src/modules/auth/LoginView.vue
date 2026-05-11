<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { appConfig } from '@/config/appConfig'
import { useThemeStore } from '@/stores/themeStore'

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const authStore = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    await authStore.login(username.value, password.value)
    router.push(authStore.user?.role === 'ADMIN' ? '/dashboard' : '/notices-pt2030')
  } catch (e) {
    error.value = 'Falha ao realizar login. Verifique suas credenciais.'
  } finally {
    loading.value = false
  }
}

const theme = useThemeStore()

const logoUrl = computed(() =>
  theme.isDark ? appConfig.logo.dark : appConfig.logo.light
)
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
      <div class="p-8">
          <div class="flex justify-center mb-6">
              <!-- Logo placeholder -->
              <div class="w-12 h-12 bg-theme-textSecondary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  <img :src="logoUrl" alt="Logo" class="h-8 w-auto" />
              </div>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2 text-center">Bem Vindo(a)</h2>
          <p class="text-center text-gray-500 mb-8">Insira seus dados para acessar sua conta</p>

          <form @submit.prevent="handleLogin" class="space-y-5">
              <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                  <input 
                    v-model="username" 
                    type="text" 
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all" 
                    placeholder="name@company.com"
                    required 
                  />
              </div>
              <div>
                  <div class="flex justify-between items-center mb-1">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Palavra-passe</label>
                  </div>
                  <input 
                    v-model="password" 
                    type="password" 
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all" 
                    placeholder="••••••••"
                    required 
                  />
              </div>
              
              <div v-if="error" class="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-200">
                  {{ error }}
              </div>

              <div class="pt-2">
                 <button 
                   type="submit" 
                   class="w-full py-3 px-4 bg-primary hover:brightness-110 text-white font-semibold rounded-lg shadow-lg shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 transition-all transform active:scale-[0.98]"
                   :disabled="loading"
                 >
                     <span v-if="loading" class="flex items-center justify-center gap-2 text-secondary">
                         <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                             <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                             <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                         </svg>
                         Entrando...
                     </span>
                     <span class="text-secondary" v-else>Entrar</span>
                 </button>
              </div>
          </form>
      </div>
  </div>
</template>
