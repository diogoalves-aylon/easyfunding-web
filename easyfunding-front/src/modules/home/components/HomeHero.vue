<script setup lang="ts">
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
</script>

<template>
  <section class="relative ui-border bg-theme-surface shadow-ui-sm rounded-ui-lg p-6 md:p-10 overflow-hidden">
    <!-- glows decorativos -->
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary opacity-[0.10] blur-3xl"></div>
      <div class="absolute -bottom-28 -left-28 w-72 h-72 rounded-full bg-secondary opacity-[0.08] blur-3xl"></div>
      <div class="absolute inset-x-0 top-0 h-1 bg-primary opacity-60"></div>
    </div>

    <div class="relative z-10 flex flex-col md:flex-row items-start justify-between gap-8">
      <!-- texto principal -->
      <div class="min-w-0 flex-1">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10">
          <span class="w-2 h-2 rounded-full bg-secondary"></span>
          <span class="text-xs font-extrabold uppercase tracking-widest text-theme-muted">
            Portugal 2030 · Fundos Públicos
          </span>
        </div>

        <h1 class="mt-4 text-3xl md:text-4xl font-extrabold text-theme-text tracking-tight leading-tight">
          Encontra o fundo certo<br />
          <span class="text-primary">para o teu projeto.</span>
        </h1>

        <p class="mt-3 text-theme-muted leading-relaxed max-w-xl">
          O EasyFunding agrega e organiza os fundos públicos portugueses em tempo real.
          Pesquisa por tipologia, dotação ou área de intervenção — e em breve, pergunta em linguagem natural com IA.
        </p>

        <div class="mt-6 flex flex-wrap items-center gap-3">
          <router-link
            to="/notices-pt2030"
            class="px-5 py-2.5 rounded-full font-bold bg-primary text-white hover:brightness-110 transition"
          >
            Explorar Fundos
          </router-link>

          <router-link
            v-if="!authStore.isAuthenticated"
            to="/auth/login"
            class="px-5 py-2.5 rounded-full font-bold ui-border bg-theme-surface text-theme-text hover:bg-theme-bg transition"
          >
            Entrar
          </router-link>
        </div>
      </div>

      <!-- bloco lateral -->
      <div class="hidden md:block shrink-0 w-[280px]">
        <div class="ui-border bg-theme-bg rounded-ui p-4 shadow-ui-sm space-y-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl ui-border bg-theme-surface flex items-center justify-center">
              <AppIcon name="Landmark" className="text-primary" :size="20" />
            </div>
            <div>
              <p class="text-sm font-bold text-theme-text">Fundos disponíveis</p>
              <p class="text-xs text-theme-muted">Portugal 2030 e outros</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div class="rounded-xl ui-border bg-theme-surface p-3">
              <p class="text-[10px] font-extrabold uppercase tracking-widest text-theme-muted">Tipologias</p>
              <p class="text-sm font-bold text-theme-text">Múltiplas</p>
            </div>
            <div class="rounded-xl ui-border bg-theme-surface p-3">
              <p class="text-[10px] font-extrabold uppercase tracking-widest text-theme-muted">Pesquisa IA</p>
              <p class="text-sm font-bold text-secondary">Em breve</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
