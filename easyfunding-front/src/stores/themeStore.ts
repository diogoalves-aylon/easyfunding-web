import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
    const isDark = ref(localStorage.getItem('theme') === 'dark')

    const toggleTheme = () => {
        isDark.value = !isDark.value
        updateDocumentClass()
        localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    }

    const updateDocumentClass = () => {
        if (isDark.value) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

    // Init
    updateDocumentClass()

    return {
        isDark,
        toggleTheme
    }
})
