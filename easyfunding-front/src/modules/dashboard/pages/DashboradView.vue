<script setup lang="ts">
import { computed } from "vue";
import MetricCard from "../components/MetricCard.vue";
import HistoryChart from "../components/HistoryChart.vue";
import { useDashboard } from "../useDashboard";

const { data, history, lastUpdate, healthScore } = useDashboard();

const lastUpdateLabel = computed(() =>
  lastUpdate.value.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
);

const TIP = {
  card:
    "relative overflow-hidden rounded-3xl p-5 xl:p-6 border shadow-sm " +
    "bg-gradient-to-br from-blue-600 to-indigo-600 border-white/10 text-white " +
    "dark:from-blue-500/20 dark:to-indigo-500/10 dark:bg-gradient-to-br dark:border-white/10 dark:text-theme-text " +
    "shadow-lg ring-1 ring-white/10 dark:ring-white/10 dark:shadow-none",
  title: "font-bold text-base leading-tight text-white dark:text-theme-text",
  text: "mt-1 text-sm leading-relaxed text-blue-100 dark:text-theme-muted",
  iconWrap: "bg-white/15 dark:bg-white/10 border border-white/15 dark:border-white/10",
  icon: "text-white dark:text-blue-300",
  bgIcon:
    "pointer-events-none absolute -bottom-6 -right-6 opacity-15 text-white dark:text-blue-300/30",
} as const;
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-start justify-between gap-2">
      <div>
        <h2 class="text-2xl font-bold text-theme-text tracking-tight">
          Dashboard PT2030
        </h2>

        <div class="flex items-center gap-2 text-theme-muted text-sm">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Atualizado às {{ lastUpdateLabel }}
        </div>
      </div>

      <div class="px-3 py-2 rounded-xl shadow-sm bg-theme-surface border border-theme-border/40 flex items-center gap-2">
        <AppIcon name="Activity" :size="18" className="text-blue-500" />
        <span class="text-sm font-semibold text-theme-text">
          Monitorização em tempo real
        </span>
      </div>
    </div>

    <!-- KPIs -->
    <div v-if="data" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
      <MetricCard label="Avisos Abertos" :value="`${data.kpis.avisosAbertos}`" trend="ATIVO" highlight>
        <template #icon>
          <AppIcon name="FileText" className="text-green-500" />
        </template>
      </MetricCard>

      <MetricCard label="Utilizadores Ativos" :value="data.kpis.utilizadoresAtivos.toLocaleString('pt-PT')" trend="TOTAL">
        <template #icon>
          <AppIcon name="Users" className="text-blue-500" />
        </template>
      </MetricCard>

      <MetricCard label="Fundos Disponíveis" :value="`€ ${data.kpis.fundosDisponiveis}M`" trend="PT2030">
        <template #icon>
          <AppIcon name="Banknote" className="text-orange-500" />
        </template>
      </MetricCard>

      <MetricCard label="Prazo Médio" :value="`${data.kpis.prazoMedio} dias`" trend="MÉDIA">
        <template #icon>
          <AppIcon name="CalendarClock" className="text-purple-500" />
        </template>
      </MetricCard>

      <MetricCard label="Avisos Favoritos" :value="`${data.kpis.totalFavoritos}`" trend="TOTAL">
        <template #icon>
          <AppIcon name="Star" className="text-yellow-500" />
        </template>
      </MetricCard>
    </div>

    <!-- Layout principal -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-4 xl:gap-6 2xl:gap-7 items-stretch">
      <!-- Chart -->
      <div class="md:col-span-8 bg-theme-surface border border-theme-border/30 p-5 xl:p-7 2xl:p-8 rounded-3xl shadow-md h-full flex flex-col">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="font-bold text-theme-text">Atividade da Plataforma</h3>
            <p class="text-xs text-theme-muted">Ações de auditoria e notificações enviadas (últimas 24h)</p>
          </div>

          <div class="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-theme-muted">
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Auditoria
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-orange-400"></span> Notificações
            </div>
          </div>
        </div>

        <div class="flex-1 min-h-0">
          <HistoryChart :points="history" class="h-full" />
        </div>
      </div>

      <!-- Coluna direita -->
      <div class="md:col-span-4 flex flex-col gap-4 xl:gap-6 h-full">
        <!-- Status / Health -->
        <div class="bg-theme-surface border border-theme-border/30 p-6 xl:p-7 rounded-3xl shadow-md">
          <div class="flex flex-col items-center text-center">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-lg bg-green-500 text-white">
              <AppIcon name="ShieldCheck" :size="30" className="text-white" />
            </div>

            <h3 class="text-lg font-bold text-theme-text mb-1">Estado da Plataforma</h3>
            <p class="text-theme-muted text-sm mb-3">
              Score: <span class="font-bold text-theme-text">{{ healthScore.toFixed(0) }}%</span>
            </p>

            <div class="w-full bg-black/5 dark:bg-white/10 h-2.5 rounded-full overflow-hidden mb-4">
              <div class="h-full bg-green-500" :style="{ width: `${healthScore}%` }"></div>
            </div>

            <div class="grid grid-cols-2 gap-3 w-full">
              <div class="p-3 rounded-2xl text-center bg-black/5 dark:bg-white/10">
                <p class="text-theme-muted text-[10px] font-bold uppercase mb-1">UPTIME</p>
                <p class="font-bold text-theme-text">{{ data?.status.uptime ?? "--" }}</p>
              </div>

              <div class="p-3 rounded-2xl text-center bg-black/5 dark:bg-white/10">
                <p class="text-theme-muted text-[10px] font-bold uppercase mb-1">INCIDENTES</p>
                <p class="font-bold text-theme-text">{{ data?.status.incidents ?? "--" }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Dica PT2030 -->
        <div :class="TIP.card">
          <div class="relative z-10 flex items-start gap-3">
            <div class="shrink-0 mt-0.5">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center" :class="TIP.iconWrap">
                <AppIcon name="Bot" :size="18" :className="TIP.icon" />
              </div>
            </div>

            <div class="min-w-0">
              <h4 :class="TIP.title">Assistente IA</h4>
              <p :class="TIP.text">
                O assistente responde a questões sobre elegibilidade, critérios de seleção e documentação dos avisos PT2030.
              </p>
            </div>
          </div>

          <AppIcon name="Bot" :size="96" :className="TIP.bgIcon" />
        </div>
      </div>
    </div>
  </div>
</template>
