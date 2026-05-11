import { defineStore } from "pinia";

type SseNotificationPayload = {
  event?: string;
  notification?: {
    id: number;
    title?: string;
    body?: string;
    created_at?: string;
    data?: any;
    status?: string;
    read_at?: string | null;
  };
};

export const useNotificationsRealTime = defineStore("notificationsRealTime", {
  state: () => ({
    tick: 0,
    lastPayload: null as SseNotificationPayload | null,
  }),
  actions: {
    psuh(payload: SseNotificationPayload) {
      this.lastPayload = payload;
      this.tick += 1;
    },
    reset() {
      this.tick = 0;
      this.lastPayload = null;
    },
  },
});
