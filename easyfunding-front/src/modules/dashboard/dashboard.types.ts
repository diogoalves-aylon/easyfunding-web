export interface DashboardKpis {
  avisosAbertos: number;
  utilizadoresAtivos: number;
  fundosDisponiveis: number;
  prazoMedio: number;
  totalFavoritos: number;
}

export interface DashboardStatus {
  uptime: string;
  incidents: string;
  healthScore: number;
}

export interface DashboardPoint {
  label: string;
  a: number;
  b: number;
}

export interface DashboardPayload {
  kpis: DashboardKpis;
  status: DashboardStatus;
  history: DashboardPoint[];
}
