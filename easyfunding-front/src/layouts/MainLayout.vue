<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { LogOut, Menu, Moon, Sun, HelpCircle, CircleUser, X, ChevronDown } from 'lucide-vue-next'
import { appConfig } from '@/config/appConfig'
import type { CategoryMenuItem, MenuItem } from '@/config/appConfig'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'
import * as Icons from 'lucide-vue-next'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const router = useRouter()
const route = useRoute()

const isMobile = ref(false)
let mql: MediaQueryList | null = null

const sidebarCollapsed = ref(false)
const drawerOpen = ref(false)
const openCategories = ref<Set<string>>(new Set())

const navMode = computed(() => appConfig.layout.navMode)
const isSidebarMode = computed(() => navMode.value === "SIDEBAR")

function handleMediaChange() {
  isMobile.value = !!mql?.matches
  if (!isMobile.value) drawerOpen.value = false
}

onMounted(() => {
  mql = window.matchMedia('(max-width: 1024px)')
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

function canSeeMenuPath(path: string) {
  if (!authStore.isAuthenticated) return false

  const resolved = router.resolve(path)
  const routeName = resolved.name ? String(resolved.name) : null
  if (!routeName) return false

  if (resolved.meta?.skipPermissionCheck) return true

  return authStore.hasPermission(routeName)
}

function isItemVisible(item: CategoryMenuItem): boolean {
  if (item.itens) return item.itens.some(sub => canSeeMenuPath(sub.to))
  return !!item.to && canSeeMenuPath(item.to)
}

const mainNavItems = computed(() =>
  appConfig.mainMenu
    .filter(isItemVisible)
    .map(item =>
      item.itens
        ? { ...item, itens: item.itens.filter(sub => canSeeMenuPath(sub.to)) }
        : item
    )
)

const adminNavItems = computed(() =>
  appConfig.adminMenu.filter(item => canSeeMenuPath(item.to))
)

const sidebarItems = computed(() => {
  const flat: MenuItem[] = []
  for (const item of appConfig.mainMenu) {
    if (item.itens) {
      item.itens.filter(sub => canSeeMenuPath(sub.to)).forEach(sub => flat.push(sub))
    } else if (item.to && canSeeMenuPath(item.to)) {
      flat.push(item as MenuItem)
    }
  }
  return [...flat, ...adminNavItems.value]
})

function getIcon(name: string) {
  // @ts-ignore
  return Icons[name] || HelpCircle
}

function handleLogout() {
  authStore.logout()
}

function isActive(to: string) {
  return route.path === to || route.path.startsWith(to + '/')
}

function hasCategoryActiveChild(item: CategoryMenuItem): boolean {
  return !!item.itens?.some(sub => isActive(sub.to))
}

function toggleCategory(label: string) {
  if (openCategories.value.has(label)) {
    openCategories.value.delete(label)
  } else {
    openCategories.value.add(label)
  }
}

function isCategoryOpen(label: string) {
  return openCategories.value.has(label)
}

function handleCategoryClick(label: string) {
  if (sidebarCollapsed.value && !isMobile.value) {
    sidebarCollapsed.value = false
    openCategories.value.add(label)
  } else {
    toggleCategory(label)
  }
}

function syncOpenCategories() {
  for (const item of appConfig.mainMenu) {
    if (item.itens?.some(sub => isActive(sub.to))) {
      openCategories.value.add(item.label)
    }
  }
}

const userMenuOpen = ref(false)

function toggleUserMenu() {
  userMenuOpen.value = !userMenuOpen.value
}

function closeUserMenu() {
  userMenuOpen.value = false
}

watch(
  () => route.fullPath,
  () => {
    closeUserMenu()
    drawerOpen.value = false
    syncOpenCategories()
  }
)

function onDocumentClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (target.closest('[data-user-menu]')) return
  closeUserMenu()
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  syncOpenCategories()
})
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick))

const bottomNavHeightPx = 72

const mainPaddingBottomStyle = computed(() => {
  if (!isMobile.value) return {}
  return { paddingBottom: `calc(${bottomNavHeightPx}px + env(safe-area-inset-bottom))` }
})

const bottomNavStyle = computed(() => {
  if (!isMobile.value) return {}
  return {
    paddingBottom: 'var(--sab)',
    height: `calc(${bottomNavHeightPx}px + var(--sab))`
  }
})

const logoUrl = computed(() =>
  themeStore.isDark ? appConfig.logo.dark : appConfig.logo.light
)

const tip = ref<{ show: boolean; text: string; x: number; y: number }>({
  show: false,
  text: '',
  x: 0,
  y: 0,
})

function showTip(e: MouseEvent, text: string) {
  if (isMobile.value || !sidebarCollapsed.value) return

  const el = e.currentTarget as HTMLElement
  const r = el.getBoundingClientRect()

  tip.value = {
    show: true,
    text,
    x: r.right + 12,
    y: r.top + r.height / 2,
  }
}

function hideTip() {
  tip.value.show = false
}
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-theme-bg text-theme-text transition-colors duration-300">
    <!-- OVERLAY (Mobile) -->
    <div v-if="isMobile" class="fixed inset-0 z-40" :class="drawerOpen ? '' : 'pointer-events-none'">
      <div
        class="absolute inset-0 bg-black/40 transition-opacity"
        :class="drawerOpen ? 'opacity-100' : 'opacity-0'"
        @click="drawerOpen = false"
      />
    </div>

    <!-- SIDEBAR / DRAWER -->
    <aside
      v-if="isSidebarMode || isMobile"
      class="z-50 overflow-x-clip min-w-0 flex flex-col border-r transition-all duration-300 ease-in-out bg-theme-surface ui-border"
      :class="[
        !isMobile ? (sidebarCollapsed ? 'w-20' : 'w-64') : '',
        isMobile
          ? `fixed top-0 left-0 h-full w-72 max-w-[85vw] transform ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`
          : 'relative'
      ]"
    >
      <!-- Logo header -->
      <div class="h-16 flex items-center justify-between px-4 border-b ui-border bg-theme-bg">
        <div class="flex items-center gap-3 overflow-hidden">
          <img :src="logoUrl" alt="Logo" class="h-10 w-auto" />
          <span v-if="!sidebarCollapsed || isMobile" class="text-lg font-bold truncate">
            {{ appConfig.appName }}
          </span>
        </div>

        <button
          v-if="isMobile"
          class="p-2 rounded-md hover:bg-white/10 text-secondary"
          aria-label="Fechar menu"
          @click="drawerOpen = false"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Menu -->
      <nav class="flex-1 overflow-y-auto overflow-x-hidden py-4">
        <ul class="space-y-1 px-2 overflow-x-hidden">
          <li v-for="item in mainNavItems" :key="item.label" class="relative overflow-visible">

            <!-- Item direto -->
            <router-link
              v-if="!item.itens"
              :to="item.to!"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition group min-w-0"
              :class="[
                sidebarCollapsed && !isMobile ? 'justify-center' : '',
                isActive(item.to!)
                  ? 'bg-black/5 dark:bg-white/10 text-theme-text'
                  : 'text-theme-muted hover:text-theme-text hover:bg-black/5 dark:hover:bg-white/10'
              ]"
              @click="isMobile ? (drawerOpen = false) : undefined"
              @mouseenter="(e) => showTip(e, item.label)"
              @mouseleave="hideTip"
            >
              <component
                :is="getIcon(item.icon)"
                class="w-5 h-5 shrink-0 text-theme-icon"
                :class="sidebarCollapsed && !isMobile ? 'mx-auto' : ''"
              />
              <span v-if="!sidebarCollapsed || isMobile" class="font-semibold truncate">
                {{ item.label }}
              </span>
            </router-link>

            <!-- Categoria -->
            <template v-else>
              <button
                class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition hover:bg-black/5 dark:hover:bg-white/10"
                :class="[
                  sidebarCollapsed && !isMobile ? 'justify-center' : '',
                  hasCategoryActiveChild(item) ? 'text-theme-text' : 'text-theme-muted hover:text-theme-text',
                ]"
                @click="handleCategoryClick(item.label)"
                @mouseenter="(e) => showTip(e, item.label)"
                @mouseleave="hideTip"
              >
                <component
                  :is="getIcon(item.icon)"
                  class="w-5 h-5 shrink-0 text-theme-icon"
                  :class="sidebarCollapsed && !isMobile ? 'mx-auto' : ''"
                />
                <span v-if="!sidebarCollapsed || isMobile" class="font-semibold truncate flex-1 text-left">
                  {{ item.label }}
                </span>
                <ChevronDown
                  v-if="!sidebarCollapsed || isMobile"
                  class="w-4 h-4 shrink-0 transition-transform duration-200"
                  :class="isCategoryOpen(item.label) ? 'rotate-180' : ''"
                />
              </button>

              <!-- Sub-itens -->
              <ul
                v-if="isCategoryOpen(item.label) && (!sidebarCollapsed || isMobile)"
                class="mt-0.5 space-y-0.5 pl-3"
              >
                <li v-for="sub in item.itens" :key="sub.to">
                  <router-link
                    :to="sub.to"
                    class="flex items-center gap-3 px-3 py-2 rounded-xl transition"
                    :class="isActive(sub.to)
                      ? 'bg-black/5 dark:bg-white/10 text-theme-text'
                      : 'text-theme-muted hover:text-theme-text hover:bg-black/5 dark:hover:bg-white/10'"
                    @click="isMobile ? (drawerOpen = false) : undefined"
                  >
                    <component :is="getIcon(sub.icon)" class="w-4 h-4 shrink-0 text-theme-icon" />
                    <span class="text-sm font-semibold truncate">{{ sub.label }}</span>
                  </router-link>
                </li>
              </ul>
            </template>

          </li>
        </ul>
      </nav>

      <!-- Footer (Logout) -->
      <div class="p-4 border-t border-theme-border/40">
        <button
          class="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition text-theme-muted hover:text-red-500 hover:bg-black/5 dark:hover:bg-white/10"
          @click="handleLogout"
        >
          <LogOut class="w-5 h-5 shrink-0" />
          <span v-if="!sidebarCollapsed || isMobile" class="font-semibold">Sair</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Top Navbar -->
      <header
        class="pt-(--sat) h-[calc(4rem+var(--sat))] flex items-center justify-between px-4 md:px-6 bg-theme-surface ui-border"
      >
        <!-- ESQUERDA -->
        <div class="flex items-center gap-3 min-w-0">
          <button
            v-if="isSidebarMode"
            class="p-2 rounded-lg ui-border bg-theme-bg hover:brightness-[0.98] dark:hover:brightness-110 transition"
            aria-label="Menu"
            @click="toggleMenu"
          >
            <Menu class="w-6 h-6 text-theme-icon" />
          </button>

          <div v-else class="flex items-center gap-3 overflow-hidden">
            <img :src="logoUrl" alt="Logo" class="h-9 w-auto" />
            <span class="text-lg font-extrabold truncate text-theme-text">
              {{ appConfig.appName }}
            </span>
          </div>
        </div>

        <!-- CENTRO (navbar mode) -->
        <nav v-if="!isMobile && !isSidebarMode" class="flex items-center flex-1 justify-end mr-16">
          <div class="flex items-center gap-5">
            <router-link
              v-for="item in mainNavItems"
              :key="item.label"
              :to="item.to ?? ''"
              class="relative py-2 text-sm font-semibold transition"
              :class="item.to && isActive(item.to)
                ? 'text-theme-text'
                : 'text-theme-muted hover:text-theme-text'"
            >
              {{ item.label }}
              <span
                v-if="item.to && isActive(item.to)"
                class="absolute left-0 right-0 -bottom-1 h-0.5 rounded-full bg-theme-button"
              />
            </router-link>
          </div>
        </nav>

        <!-- DIREITA -->
        <div class="flex items-center gap-2 md:gap-3">
          <button
            class="p-2 rounded-full ui-border bg-theme-bg hover:brightness-[0.98] dark:hover:brightness-110 transition"
            aria-label="Alternar tema"
            @click="themeStore.toggleTheme"
          >
            <Sun v-if="!themeStore.isDark" class="w-5 h-5 text-theme-icon" />
            <Moon v-else class="w-5 h-5 text-theme-icon" />
          </button>

          <router-link
            v-if="!authStore.isAuthenticated"
            to="/auth/login"
            class="px-4 py-2 rounded-full text-sm font-bold bg-theme-button text-theme-textSecondary hover:brightness-110 transition"
          >
            Entrar
          </router-link>

          <template v-else>
            <div class="hidden md:block text-right leading-tight">
              <div class="text-sm font-semibold text-theme-text">{{ authStore.user?.name }}</div>
              <div class="text-xs text-theme-muted uppercase tracking-wider">{{ authStore.user?.role }}</div>
            </div>

            <div class="relative" data-user-menu>
              <button
                class="flex items-center focus:outline-none"
                aria-label="Menu do usuário"
                @click.stop="toggleUserMenu"
              >
                <CircleUser class="w-10 h-10 text-theme-icon" />
              </button>

              <transition name="fade">
                <div
                  v-if="userMenuOpen"
                  class="absolute right-0 mt-2 w-56 rounded-2xl ui-border bg-theme-surface shadow py-2 z-50"
                >
                  <div class="px-4 py-2 md:hidden">
                    <div class="text-sm font-semibold text-theme-text">{{ authStore.user?.name }}</div>
                    <div class="text-xs text-theme-muted uppercase tracking-wider">{{ authStore.user?.role }}</div>
                  </div>

                  <div class="my-1 border-t border-theme-border/40 md:hidden" />

                  <router-link
                    v-if="adminNavItems.length"
                    to="/admin/users"
                    class="block px-4 py-2 text-sm font-semibold text-theme-text hover:bg-black/5 dark:hover:bg-white/10"
                    @click="closeUserMenu"
                  >
                    Painel Administrador
                  </router-link>

                  <div v-if="adminNavItems.length" class="my-1 border-t border-theme-border/40" />

                  <button
                    class="w-full text-left px-4 py-2 text-sm font-semibold text-red-500 hover:bg-black/5 dark:hover:bg-white/10"
                    @click="handleLogout"
                  >
                    Sair
                  </button>
                </div>
              </transition>
            </div>
          </template>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-auto p-4 md:p-6 relative" :style="mainPaddingBottomStyle">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- BOTTOM NAV (Mobile) -->
    <nav
      v-if="isMobile"
      class="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/80 backdrop-blur-md"
      :style="bottomNavStyle"
    >
      <ul class="h-18 flex items-stretch justify-around">
        <li v-for="item in sidebarItems.slice(0, 4)" :key="item.to" class="flex-1">
          <router-link
            :to="item.to"
            class="h-full flex flex-col items-center justify-center gap-1 text-[11px] font-semibold select-none"
            :class="isActive(item.to) ? 'text-primary' : 'text-gray-500 dark:text-gray-400'"
          >
            <div
              class="px-3 py-1 rounded-full transition-colors"
              :class="isActive(item.to) ? 'bg-primary/10' : 'bg-transparent'"
            >
              <component :is="getIcon(item.icon)" class="w-5 h-5" />
            </div>
            <span class="leading-none">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <Teleport to="body">
      <div
        v-show="tip.show"
        class="fixed z-99999 -translate-y-1/2 ui-border bg-theme-surface text-theme-text text-xs font-semibold px-2 py-1 rounded-lg shadow whitespace-nowrap pointer-events-none"
        :style="{ left: tip.x + 'px', top: tip.y + 'px' }"
      >
        {{ tip.text }}
      </div>
    </Teleport>
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
