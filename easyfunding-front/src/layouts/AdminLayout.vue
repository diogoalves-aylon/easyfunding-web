<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { LogOut, Home, Menu, Moon, Sun, Shield, CircleUser, X, HelpCircle } from 'lucide-vue-next'
import { appConfig } from '@/config/appConfig'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'
import * as Icons from 'lucide-vue-next'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const route = useRoute()
const router = useRouter()

/* Responsividade (mesmo padrão do MainLayout)*/
const isMobile = ref(false)
let mql: MediaQueryList | null = null

const sidebarCollapsed = ref(false) // desktop mini
const drawerOpen = ref(false) // mobile drawer

function handleMediaChange() {
  isMobile.value = !!mql?.matches
  if (!isMobile.value) drawerOpen.value = false
}

onMounted(() => {
  mql = window.matchMedia('(max-width: 767px)')
  handleMediaChange()
  if (mql.addEventListener) mql.addEventListener('change', handleMediaChange)
  else mql.addListener(handleMediaChange)
})

onBeforeUnmount(() => {
  if (!mql) return
  if (mql.removeEventListener) mql.removeEventListener('change', handleMediaChange)
  else mql.removeListener(handleMediaChange)
})

function toggleMenu() {
  if (isMobile.value) drawerOpen.value = !drawerOpen.value
  else sidebarCollapsed.value = !sidebarCollapsed.value
}

function getIcon(name: string) {
  // @ts-ignore
  return Icons[name] || HelpCircle
}

function isActive(to: string) {
  return route.path === to || route.path.startsWith(to + '/')
}

/* User menu por clique (mobile-friendly)*/
const userMenuOpen = ref(false)
function toggleUserMenu() {
  userMenuOpen.value = !userMenuOpen.value
}
function closeUserMenu() {
  userMenuOpen.value = false
}

function onDocumentClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (target.closest('[data-user-menu]')) return
  closeUserMenu()
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick))

watch(
  () => route.fullPath,
  () => {
    closeUserMenu()
    drawerOpen.value = false
  }
)

/* Bottom nav layout + safe-area*/
const bottomNavHeightPx = 72
const mainPaddingBottomStyle = computed(() => {
  if (!isMobile.value) return {}
  return { paddingBottom: `calc(${bottomNavHeightPx}px + env(safe-area-inset-bottom))` }
})
const bottomNavStyle = computed(() => ({
  paddingBottom: 'env(safe-area-inset-bottom)',
  height: `calc(${bottomNavHeightPx}px + env(safe-area-inset-bottom))`
}))

function goBackToApp() {
  router.push('/') // ajuste se seu app home for outra rota
}

function logout() {
  authStore.logout()
}
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <!-- Backdrop do drawer (mobile) -->
    <div
      v-if="isMobile"
      class="fixed inset-0 z-40"
      :class="drawerOpen ? '' : 'pointer-events-none'"
    >
      <div
        class="absolute inset-0 bg-black/40 transition-opacity"
        :class="drawerOpen ? 'opacity-100' : 'opacity-0'"
        @click="drawerOpen = false"
      />
    </div>

    <!-- SIDEBAR / DRAWER (Admin) -->
    <aside
      class="z-50 flex flex-col transition-all duration-300 ease-in-out
             bg-slate-900 text-white border-r border-slate-800"
      :class="[
        // Desktop
        !isMobile ? (sidebarCollapsed ? 'w-20' : 'w-64') : '',
        // Mobile drawer
        isMobile
          ? `fixed top-0 left-0 h-full w-72 max-w-[85vw] transform ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`
          : 'relative'
      ]"
    >
      <!-- Header do sidebar -->
      <div class="h-16 px-4 border-b border-slate-800 flex items-center justify-between">
        <div class="flex items-center gap-3 overflow-hidden">
          <CircleUser class="w-10 h-10 text-gray-300" />
          <div v-if="!sidebarCollapsed || isMobile" class="overflow-hidden">
            <p class="text-sm font-medium truncate">{{ authStore.user?.name }}</p>
            <p class="text-xs text-gray-400">Admin</p>
          </div>
        </div>

        <!-- fechar drawer no mobile -->
        <button
          v-if="isMobile"
          class="p-2 rounded-md hover:bg-white/10"
          @click="drawerOpen = false"
          aria-label="Fechar menu"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Admin menu -->
      <nav class="flex-1 overflow-y-auto py-4">
        <ul class="space-y-1 px-2">
          <li v-for="item in appConfig.adminMenu" :key="item.to" class="relative">
            <router-link
              :to="item.to"
              class="flex items-center px-4 py-3 rounded-lg transition-colors group"
              :class="isActive(item.to)
                ? 'bg-primary text-white'
                : 'text-gray-300 hover:bg-slate-800 hover:text-white'"
              @click="isMobile ? (drawerOpen = false) : null"
            >
              <component :is="getIcon(item.icon)" class="w-5 h-5 shrink-0" />
              <span v-if="!sidebarCollapsed || isMobile" class="ml-3 font-medium truncate">
                {{ item.label }}
              </span>

              <!-- Tooltip (desktop colapsado) -->
              <div
                v-if="sidebarCollapsed && !isMobile"
                class="absolute left-16 top-1/2 -translate-y-1/2 z-50 invisible group-hover:visible
                       bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap"
              >
                {{ item.label }}
              </div>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Footer (Voltar + Sair) -->
      <div
        class="p-4 border-t border-slate-800 space-y-2"
        :style="isMobile ? { paddingBottom: 'calc(16px + env(safe-area-inset-bottom))' } : {}"
      >
        <button
          @click="goBackToApp"
          class="flex items-center w-full px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Home class="w-5 h-5 shrink-0"/>
          <span v-if="!sidebarCollapsed || isMobile" class="ml-3 font-medium">Voltar para APP</span>
        </button>

        <button
          @click="logout"
          class="flex items-center w-full px-4 py-2 text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut class="w-5 h-5 shrink-0"/>
          <span v-if="!sidebarCollapsed || isMobile" class="ml-3 font-medium">Sair</span>
        </button>
      </div>
    </aside>

    <!-- MAIN -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Topbar -->
      <header class="h-16 flex items-center justify-between px-4 md:px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <!-- menu button -->
        <button
          @click="toggleMenu"
          class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
          aria-label="Menu"
        >
          <Menu class="w-6 h-6" />
        </button>

        <div class="flex items-center gap-4">
          <!-- title -->
          <h2 class="hidden sm:block text-lg md:text-xl font-semibold text-gray-800 dark:text-white capitalize">
            {{ route.name?.toString() }}
          </h2>

          <!-- theme -->
          <button
            @click="themeStore.toggleTheme"
            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Alternar tema"
          >
            <Sun v-if="!themeStore.isDark" class="w-5 h-5 text-theme-text"/>
            <Moon v-else class="w-5 h-5 text-theme-text"/>
          </button>

          <!-- User menu (click) -->
          <div class="relative" data-user-menu>
            <button class="flex items-center focus:outline-none" @click.stop="toggleUserMenu" aria-label="Usuário">
              <CircleUser class="w-10 h-10 text-gray-400 dark:text-gray-500 hover:text-primary transition-colors" />
            </button>

            <transition name="fade">
              <div
                v-if="userMenuOpen"
                class="absolute right-0 mt-2 w-60 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 ring-1 ring-black/5 z-50"
              >
                <div class="px-4 py-2">
                  <div class="text-sm font-semibold text-gray-800 dark:text-white">{{ authStore.user?.name }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Admin
                  </div>
                </div>

                <div class="my-1 border-t border-gray-200 dark:border-gray-700"></div>

                <button
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  @click="goBackToApp"
                >
                  Voltar para APP
                </button>

                <button
                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-700"
                  @click="logout"
                >
                  Sair
                </button>
              </div>
            </transition>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-auto p-4 md:p-8" :style="mainPaddingBottomStyle">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- BOTTOM NAV (Admin no mobile) -->
    <nav
      v-if="isMobile"
      class="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 dark:border-gray-700
             bg-white/90 dark:bg-gray-900/80 backdrop-blur-md"
      :style="bottomNavStyle"
    >
      <ul class="h-18 flex items-stretch justify-around">
        <!-- 3 itens do admin + voltar app como 4º -->
        <li v-for="item in appConfig.adminMenu.slice(0, 3)" :key="item.to" class="flex-1">
          <router-link
            :to="item.to"
            class="h-full flex flex-col items-center justify-center gap-1 text-[11px] font-semibold select-none"
            :class="isActive(item.to) ? 'text-primary' : 'text-gray-500 dark:text-gray-400'"
          >
            <div class="px-3 py-1 rounded-full transition-colors" :class="isActive(item.to) ? 'bg-primary/10' : 'bg-transparent'">
              <component :is="getIcon(item.icon)" class="w-5 h-5" />
            </div>
            <span class="leading-none">{{ item.label }}</span>
          </router-link>
        </li>

        <li class="flex-1">
          <button
            class="h-full w-full flex flex-col items-center justify-center gap-1 text-[11px] font-semibold select-none
                   text-gray-500 dark:text-gray-400"
            @click="goBackToApp"
          >
            <div class="px-3 py-1 rounded-full">
              <Home class="w-5 h-5" />
            </div>
            <span class="leading-none">APP</span>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
