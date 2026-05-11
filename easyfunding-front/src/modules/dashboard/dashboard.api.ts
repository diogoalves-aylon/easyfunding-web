import api from "@/core/api";
import type { DashboardPayload } from "./dashboard.types";

export async function fetchDashboard(): Promise<DashboardPayload> {
  const { data } = await api.get<DashboardPayload>("api/notices-pt2030/dashboard/");
  return data;
}
