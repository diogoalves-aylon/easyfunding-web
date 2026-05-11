<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useNoticesPt2030Detail } from "../useNoticesPt2030Detail";
import NoticeDetailHeader from "../components/NoticeDetailHeader.vue";
import NoticeHistoryTimeline from "../components/NoticeHistoryTimeline.vue";
import NoticeChatbotPanel from "../components/NoticeChatbotPanel.vue";
import { useFavouritesStore } from "@/stores/favouritesStore";

const router = useRouter();

const { latest, history, loading, error } = useNoticesPt2030Detail();

const favouritesStore = useFavouritesStore();
onMounted(() => favouritesStore.load());

const isChatbotOpen = ref(false);
</script>

<template>
  <div class="space-y-6">
    <!-- Header Controls -->
    <div class="flex items-center justify-between">
      <button
        type="button"
        @click="router.back()"
        class="flex items-center gap-2 text-sm font-semibold text-theme-muted hover:text-theme-text transition"
      >
        <AppIcon name="ArrowLeft" :size="16" />
        Voltar
      </button>

      <button 
        v-if="latest"
        @click="isChatbotOpen = true" 
        class="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
      >
        <AppIcon name="Bot" :size="18" />
        Falar com Assistente
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-8 h-8 border-4 border-theme-border border-t-black dark:border-t-white rounded-full animate-spin" />
    </div>

    <!-- Erro -->
    <div v-else-if="error" class="text-center py-20 text-sm text-red-500">
      {{ error }}
    </div>

    <template v-else-if="latest">
      <!-- Header do aviso -->
      <div class="rounded-xl ui-border bg-theme-surface shadow p-6">
        <NoticeDetailHeader :notice="latest" />
      </div>

      <!-- Histórico -->
      <div v-if="history.length > 1" class="rounded-xl ui-border bg-theme-surface shadow p-6">
        <NoticeHistoryTimeline :history="history" />
      </div>
    </template>

    <!-- Not found -->
    <div v-else class="text-center py-20 text-sm text-theme-muted">
      Aviso não encontrado.
    </div>

    <!-- Chatbot Panel -->
    <NoticeChatbotPanel 
      v-if="latest" 
      v-model="isChatbotOpen" 
      :concursoId="latest.code" 
    />
  </div>
</template>
