import { computed, ref, watch } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { Capacitor } from "@capacitor/core";

import { notificationsApi } from "./notifications.api";
import type { AppNotification, NotificationType } from "./notifications.types";
import { initPushNotifications } from "./services/notifications.services";

function isNative() {
  return Capacitor.isNativePlatform();
}

function mapType(n: any): NotificationType {
  const t = String(n?.data?.type ?? "INFO").toUpperCase();
  if (t === "SUSPICIOUS_MOTION" || t === "AUDIO_ALERT" || t === "SYSTEM" || t === "INFO" || t === "WARNING" || t === "ALERT") {
    return t as any;
  }
  return "INFO";
}

function mapSource(n: any): string {
  return String(n?.data?.source ?? n?.data?.app ?? "");
}

export function useNotifications() {
  const auth = useAuthStore();
  const list = ref<AppNotification[]>([]);
  const initialized = ref(false);

  const notifications = computed(() => list.value);
  const canClear = computed(() => list.value.length > 0);

  async function fetchNotifications() {
    const backend = await notificationsApi.listMine();

    list.value = backend.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.body,
      created_at: n.created_at,
      status: n.status,
      data: n.data,
      type: mapType(n),
      source: mapSource(n),
      viewed: !!n.read_at,
    }));
  }

  async function acknowledge(id: number) {
    await notificationsApi.markRead(id, true);
    const idx = list.value.findIndex((x) => x.id === id);
    if (idx >= 0) list.value[idx] = { ...list.value[idx]!, viewed: true };
  }

  async function ignore(id: number) {
    await notificationsApi.deleteOne(id);
    list.value = list.value.filter((n) => n.id !== id);
  }

  async function clearVisualList() {
    await notificationsApi.clearAll();
    list.value = [];
  }

  watch(
    () => auth.isAuthenticated,
    async (loggedIn) => {
      initialized.value = false;

      if (!loggedIn) {
        list.value = [];
        return;
      }

      await fetchNotifications();

      if (!initialized.value) {
        initialized.value = true;
        await initPushNotifications();
      }
    },
    { immediate: true }
  );

  return {
    notifications,
    acknowledge,
    ignore,
    clearVisualList,
    canClear,
    fetchNotifications,
  };
}
