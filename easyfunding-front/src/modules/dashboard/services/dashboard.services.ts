import { fetchDashboard } from "../dashboard.api";
import type { DashboardPayload } from "../dashboard.types";


export const DashboardService = {
  /**
   * Retorna os dados do dashboard
   */
  async getDashboard(): Promise<DashboardPayload> {
    try {
      return await fetchDashboard();
    } catch (error) {
      console.error("[DashboardService] Failed to load dashboard", error);
      throw error;
    }
  },
};
