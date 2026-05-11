import api from "@/core/api";

export type BackendNotification = {
  id: number;
  title: string;
  body: string;
  data: Record<string, any> | null;
  status: "pending" | "sent" | "failed";
  error_message: string | null;
  created_at: string;
  sent_at: string | null;
  read_at: string | null;
};

export const notificationsApi = {
  async listMine() {
    const res = await api.get<{ results: BackendNotification[] }>("/api/notifications/");
    return res.data.results;
  },

  async markRead(id: number, read = true) {
    const res = await api.post(`/api/notifications/${id}/read/`, { read });
    return res.data;
  },

  async deleteOne(id: number) {
    await api.delete(`/api/notifications/${id}/`);
  },

  async clearAll() {
    await api.delete("/api/notifications/clear/");
  },

  async registerDevice(token: string, platform: "android" | "ios") {
    const res = await api.post("/api/notifications/devices/register/", { token, platform });
    return res.data;
  },

  async sendPushUp(payload: { user_id: number; title: string; body: string; data?: Record<string, any> }) {
    const res = await api.post("/api/notifications/send/", payload);
    return res.data;
  },
};
