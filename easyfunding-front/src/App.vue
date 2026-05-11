<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { appConfig } from '@/config/appConfig'
import ConfirmDialog from 'primevue/confirmdialog'
import { useNotificationsRealTime } from './stores/notificationsRealTimeStore'
import { startNotificationsSSE, stopNotificationsSSE } from "@/modules/notifications/services/notifications.sse"
import { useAuthStore } from "@/stores/authStore"
import { toast } from 'vue3-toastify'

const auth = useAuthStore();
const router = useRouter();
const rt = useNotificationsRealTime();

watch(
    () => auth.token,
    (token) => {
        if (!token) {
            stopNotificationsSSE()
            return
        }

        startNotificationsSSE({
            onMessage: async (payload) => {
                rt.push(payload);

                
                if (router.currentRoute.value.path !== "/notifications") {
                    const n = payload?.notification
                    toast(n?.body || n?.title || "Nova notificação", {
                        autoClose: 4000,
                    })
                }
            },
        })
    },
    { immediate: true }
)

const applyTheme = () => {
    const root = document.documentElement

    // Core Colors
    root.style.setProperty('--color-primary', appConfig.theme.primary)
    root.style.setProperty('--color-secondary', appConfig.theme.secondary)

    // Dark Theme configuration
    if (appConfig.theme.dark) {
        root.style.setProperty('--theme-dark-background', appConfig.theme.dark.background)
        root.style.setProperty('--theme-dark-text', appConfig.theme.dark.text)
        root.style.setProperty('--theme-dark-icon', appConfig.theme.dark.icon)
    }

    // Light Theme configuration
    if (appConfig.theme.light) {
        root.style.setProperty('--theme-light-background', appConfig.theme.light.background)
        root.style.setProperty('--theme-light-text', appConfig.theme.light.text)
        root.style.setProperty('--theme-light-icon', appConfig.theme.light.icon)
    }
}

watch(() => appConfig.theme, applyTheme, { deep: true })
</script>

<template>
    <RouterView />
    <ConfirmDialog appendTo="body" :pt="{
        mask: 'bg-black/40 backdrop-blur-sm flex items-center justify-center',

        root:
            'w-full max-w-md rounded-3xl ' +
            'bg-[var(--surface-theme)] text-theme-text ' +
            'shadow-[0_20px_60px_-20px_rgba(0,0,0,0.4)] ' +
            'border border-theme-border/30',

        header:
            'flex items-center justify-between px-6 pt-6',

        headerTitle:
            'text-base font-black',

        headerIcons:
            'flex items-center gap-2',

        closeButton:
            'w-9 h-9 rounded-xl grid place-items-center ' +
            'text-theme-muted hover:bg-black/5 dark:hover:bg-white/5 transition',

        content:
            'px-6 py-5',

        footer:
            'px-6 pb-6 pt-2 flex justify-end gap-3',

        rejectButton:
            'h-10 px-4 rounded-xl font-black text-[11px] uppercase tracking-widest ' +
            'bg-black/5 dark:bg-white/10 text-theme-text ' +
            'hover:bg-black/10 dark:hover:bg-white/15 ' +
            'active:scale-[0.98] transition ' +
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 dark:focus-visible:ring-white/25',

        acceptButton:
            'h-10 px-4 rounded-xl font-black text-[11px] uppercase tracking-widest ' +
            'bg-red-600 text-white hover:bg-red-700 ' +
            'active:scale-[0.98] transition ' +
            'shadow-sm shadow-red-600/30 ' +
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40',

    }">

        <template #message="slotProps">
            <div class="flex gap-3 items-start">
                <div class="mt-0.5 text-red-500">
                    <AppIcon name="AlertTriangle" :size="18" className="text-red-500" />
                </div>
                <div>
                    <p class="font-bold text-theme-text leading-snug">
                        {{ slotProps.message?.message }}
                    </p>
                </div>
            </div>
        </template>
    </ConfirmDialog>
</template>
