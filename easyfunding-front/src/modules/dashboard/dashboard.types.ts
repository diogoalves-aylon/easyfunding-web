export interface DashboardKpis {
  revenue: number;
  sessions: number;
  conversion: number;
  errors: number;
  latency: number;
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
