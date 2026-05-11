<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from 'vue';
import AppIcon from '@/shared/components/AppIcon.vue';

const props = defineProps<{
  modelValue: boolean;
  concursoId: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const messages = ref<{ role: 'user' | 'bot'; text: string; sources?: any[] }[]>([]);
const currentInput = ref('');
const isTyping = ref(false);
const chatContainer = ref<HTMLElement | null>(null);

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const closePanel = () => {
  emit('update:modelValue', false);
};

const panelWidth = ref(448); // 28rem default (max-w-md)
const MIN_WIDTH = 320;
const MAX_WIDTH = Math.min(window.innerWidth - 48, 1200);
const isResizing = ref(false);

function startResize(e: MouseEvent) {
  isResizing.value = true;
  const startX = e.clientX;
  const startWidth = panelWidth.value;

  const onMove = (ev: MouseEvent) => {
    const delta = startX - ev.clientX;
    panelWidth.value = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth + delta));
  };
  const onUp = () => {
    isResizing.value = false;
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onUp);
  };
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
}

onUnmounted(() => { isResizing.value = false; });

function renderMarkdown(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escaped
    .replace(/^#{4} (.+)$/gm, '<h4 class="text-sm font-semibold mt-2 mb-0.5">$1</h4>')
    .replace(/^#{3} (.+)$/gm, '<h3 class="text-sm font-bold mt-3 mb-1">$1</h3>')
    .replace(/^#{2} (.+)$/gm, '<h2 class="text-base font-bold mt-4 mb-1">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-lg font-bold mt-4 mb-2">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc list-inside">$1</li>')
    .replace(/(<li[^>]*>[\s\S]*?<\/li>\n?)+/g, m => `<ul class="my-1 space-y-0.5">${m}</ul>`)
    .replace(/\n\n/g, '</p><p class="mb-2 mt-1">')
    .replace(/\n/g, '<br>');
}

function topSources(sources: any[]): any[] {
  const best: Record<string, any> = {};
  for (const s of sources) {
    const fn = s.filename;
    if (!best[fn] || s.score > best[fn].score) best[fn] = s;
  }
  return Object.values(best)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

const sendMessage = async () => {
  const text = currentInput.value.trim();
  if (!text) return;

  messages.value.push({ role: 'user', text });
  currentInput.value = '';
  isTyping.value = true;
  await scrollToBottom();

  try {
    const chatApiUrl = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:8001';
    const res = await fetch(`${chatApiUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ concurso_id: props.concursoId, question: text }),
    });

    if (!res.ok) throw new Error(`Erro: ${res.status}`);

    // Add empty bot message and stream tokens into it
    messages.value.push({ role: 'bot', text: '' });
    const msgIndex = messages.value.length - 1;
    isTyping.value = false;

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const payload = line.slice(6).trim();
        if (payload === '[DONE]') break;
        try {
          const parsed = JSON.parse(payload);
          if (parsed.token) {
            messages.value[msgIndex].text += parsed.token;
            await scrollToBottom();
          }
          if (parsed.error) {
            messages.value[msgIndex].text = parsed.error;
          }
        } catch {}
      }
    }
  } catch (error) {
    messages.value.push({
      role: 'bot',
      text: 'Desculpa, ocorreu um erro ao comunicar com o assistente. Tenta novamente mais tarde.',
    });
  } finally {
    isTyping.value = false;
    await scrollToBottom();
  }
};

watch(() => props.modelValue, (isOpen) => {
  if (isOpen && messages.value.length === 0) {
    messages.value.push({
      role: 'bot',
      text: 'Olá! Sou o assistente virtual para este aviso. Como posso ajudar-te hoje?'
    });
  }
});
</script>

<template>
  <div>
    <!-- Overlay -->
    <transition
      enter-active-class="transition-opacity ease-linear duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity ease-linear duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        @click="closePanel"
        class="fixed inset-0 bg-black/40 z-[9998] backdrop-blur-sm"
      ></div>
    </transition>

    <!-- Side Panel -->
    <transition
      enter-active-class="transition ease-in-out duration-300 transform"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition ease-in-out duration-300 transform"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="modelValue"
        :style="{ width: panelWidth + 'px' }"
        class="fixed inset-y-0 right-0 z-[9999] bg-theme-surface shadow-2xl flex flex-col border-l border-theme-border"
        :class="{ 'select-none': isResizing }"
      >
        <!-- Resize handle -->
        <div
          @mousedown.prevent="startResize"
          class="absolute left-0 top-0 bottom-0 w-3 cursor-col-resize group z-10 flex items-center justify-center"
        >
          <div class="w-1 h-10 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-primary transition-colors flex flex-col items-center justify-center gap-1">
            <div class="w-0.5 h-0.5 rounded-full bg-white/60"></div>
            <div class="w-0.5 h-0.5 rounded-full bg-white/60"></div>
            <div class="w-0.5 h-0.5 rounded-full bg-white/60"></div>
          </div>
        </div>

        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-theme-border bg-theme-bg">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <AppIcon name="Bot" :size="20" />
            </div>
            <div>
              <h2 class="text-lg font-bold text-theme-text">Assistente IA</h2>
              <p class="text-xs text-theme-muted">Aviso PT2030</p>
            </div>
          </div>
          <button
            @click="closePanel"
            class="text-theme-muted hover:text-theme-text transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <AppIcon name="X" :size="20" />
          </button>
        </div>

        <!-- Chat Area -->
        <div
          ref="chatContainer"
          class="flex-1 overflow-y-auto p-6 space-y-6 bg-theme-surface"
        >
          <div
            v-for="(msg, idx) in messages"
            :key="idx"
            :class="['flex w-full', msg.role === 'user' ? 'justify-end' : 'justify-start']"
          >
            <div
              :class="[
                'max-w-[85%] rounded-2xl px-5 py-3 text-sm shadow-sm',
                msg.role === 'user'
                  ? 'bg-primary text-white rounded-br-none'
                  : 'bg-theme-bg text-theme-text border border-theme-border rounded-bl-none'
              ]"
            >
              <!-- User messages: plain text. Bot messages: rendered markdown -->
              <div
                v-if="msg.role === 'user'"
                class="whitespace-pre-wrap leading-relaxed"
              >{{ msg.text }}</div>
              <div
                v-else
                class="leading-relaxed prose-sm"
                v-html="renderMarkdown(msg.text)"
              ></div>

            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isTyping" class="flex justify-start">
            <div class="bg-theme-bg text-theme-text border border-theme-border rounded-2xl rounded-bl-none px-5 py-4 shadow-sm flex items-center gap-1.5">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.15s"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="p-4 border-t border-theme-border bg-theme-surface">
          <form
            @submit.prevent="sendMessage"
            class="relative flex items-center"
          >
            <input
              v-model="currentInput"
              type="text"
              placeholder="Pergunta sobre este aviso..."
              class="w-full bg-theme-bg border-transparent focus:border-primary focus:bg-theme-surface rounded-full py-3 pl-5 pr-12 text-sm transition-all outline-none border"
              :disabled="isTyping"
            />
            <button
              type="submit"
              :disabled="!currentInput.trim() || isTyping"
              class="absolute right-2 p-2 bg-primary text-white rounded-full hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <AppIcon name="Send" :size="16" />
            </button>
          </form>
          <div class="text-center mt-2">
            <p class="text-[10px] text-theme-muted">A IA pode cometer erros. Verifica a informação.</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
