<script setup lang="ts">
import { useThemeStore } from '@/stores/themeStore'
import { Sun, Moon } from 'lucide-vue-next'

const themeStore = useThemeStore()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-theme-bg transition-colors duration-300 relative">
    
    <!-- Theme Toggle -->
    <div class="absolute top-5 right-5">
        <button 
          @click="themeStore.toggleTheme" 
          class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          title="Alternar Tema"
        >
             <Sun v-if="!themeStore.isDark" class="w-6 h-6 text-gray-600"/>
             <Moon v-else class="w-6 h-6 text-primary"/>
        </button>
    </div>

    <div class="w-full max-w-md p-6 fade-in relative z-10">
       <router-view />
    </div>
  </div>
</template>

<style scoped>
.fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
