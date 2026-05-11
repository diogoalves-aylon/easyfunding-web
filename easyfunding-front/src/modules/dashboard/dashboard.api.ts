import type { DashboardPayload } from "./dashboard.types";

const rnd = (min: number, max: number) => Math.random() * (max - min) + min;

export async function fetchDashboard(): Promise<DashboardPayload> {
  await new Promise((r) => setTimeout(r, 200));

  const healthScore = rnd(92, 99.9);
  const incidents = Math.round(rnd(0, 6));
  const errors = Math.round(rnd(12, 120));
  const latency = rnd(80, 260);

  const history = Array.from({ length: 24 }, (_, i) => ({
    label: `${String(i).padStart(2, "0")}:00`,
    a: rnd(30, 95) + Math.sin(i / 3) * 10,
    b: rnd(20, 80) + Math.cos(i / 4) * 10,
  }));

  return {
    kpis: {
      revenue: rnd(1200, 4800),
      sessions: Math.round(rnd(8000, 18000)),
      conversion: rnd(1.4, 5.2),
      errors,
      latency,
    },
    status: {
      uptime: `${healthScore.toFixed(2)}%`,
      incidents: `${incidents}`,
      healthScore,
    },
    history,
  };
}
