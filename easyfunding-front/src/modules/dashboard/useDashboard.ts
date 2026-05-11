import { onMounted, onUnmounted, ref, computed } from "vue";
import { fetchDashboard } from "../dashboard/dashboard.api";
import type { DashboardPayload } from "../dashboard/dashboard.types";

export function useDashboard() {
  const data = ref<DashboardPayload | null>(null);
  const history = computed(() => data.value?.history ?? []);
  const lastUpdate = ref(new Date());
  const healthScore = computed(() => data.value?.status.healthScore ?? 0);

  let timer: number | undefined;

  const load = async () => {
    data.value = await fetchDashboard();
    lastUpdate.value = new Date();
  };

  onMounted(async () => {
    await load();
    timer = window.setInterval(load, 5000);
  });

  onUnmounted(() => {
    if (timer) window.clearInterval(timer);
  });

  return { data, history, lastUpdate, healthScore, reload: load };
}
