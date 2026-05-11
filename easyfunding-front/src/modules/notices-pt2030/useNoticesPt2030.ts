import { computed, onMounted, reactive, ref } from "vue";
import type { Portugal2030Notice, NoticesFilters } from "./noticesPt2030.types";
import { noticesPt2030Service, getNoticeStatus } from "./services/noticesPt2030.services";

export function useNoticesPt2030() {
  const notices = ref<Portugal2030Notice[]>([]);
  const loading = ref(false);
  const error = ref("");

  const filters = reactive<NoticesFilters>({
    search: "",
    type: "",
    fund: "",
    publication_from: "",
    publication_to: "",
  });

  const availableTypes = computed(() =>
    [...new Set(notices.value.map((n) => n.type))].filter(Boolean).sort()
  );

  const availableFunds = computed(() =>
    [...new Set(notices.value.map((n) => n.fund))].filter(Boolean).sort()
  );

  const statusPriority: Record<string, number> = { open: 0, upcoming: 1, closed: 2 };

  const filteredNotices = computed(() => {
    return notices.value
      .filter((n) => {
        const search = filters.search.toLowerCase();
        const matchSearch =
          !search ||
          n.domination.toLowerCase().includes(search) ||
          n.code.toLowerCase().includes(search);
        const matchType = !filters.type || n.type === filters.type;
        const matchFund = !filters.fund || n.fund === filters.fund;
        const pubDate = new Date(n.notice_publication_date).getTime();
        const matchDateFrom = !filters.publication_from || pubDate >= new Date(filters.publication_from).getTime();
        const matchDateTo = !filters.publication_to || pubDate <= new Date(filters.publication_to).getTime();
        return matchSearch && matchType && matchFund && matchDateFrom && matchDateTo;
      })
      .sort((a, b) => statusPriority[getNoticeStatus(a)] - statusPriority[getNoticeStatus(b)]);
  });

  async function fetchNotices() {
    loading.value = true;
    error.value = "";
    try {
      notices.value = await noticesPt2030Service.fetchAll();
    } catch {
      error.value = "Erro ao carregar os avisos. Tente novamente.";
    } finally {
      loading.value = false;
    }
  }

  onMounted(fetchNotices);

  return {
    notices,
    loading,
    error,
    filters,
    availableTypes,
    availableFunds,
    filteredNotices,
    fetchNotices,
  };
}
