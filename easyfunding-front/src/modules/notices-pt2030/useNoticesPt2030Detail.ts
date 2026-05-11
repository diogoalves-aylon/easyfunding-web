import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import type { Portugal2030Notice } from "./noticesPt2030.types";
import { noticesPt2030Service } from "./services/noticesPt2030.services";

export function useNoticesPt2030Detail() {
  const route = useRoute();

  const latest = ref<Portugal2030Notice | null>(null);
  const history = ref<Portugal2030Notice[]>([]);
  const loading = ref(false);
  const error = ref("");

  async function fetchDetail(code: string) {
    loading.value = true;
    error.value = "";
    try {
      const res = await noticesPt2030Service.fetchDetail(code);
      latest.value = res.latest;
      history.value = res.history;
    } catch {
      error.value = "Erro ao carregar o aviso. Tente novamente.";
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    const code = String(route.params.code);
    fetchDetail(code);
  });

  return {
    latest,
    history,
    loading,
    error,
    fetchDetail,
  };
}
