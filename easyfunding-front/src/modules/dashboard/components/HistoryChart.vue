<script setup lang="ts">
import { computed } from "vue";
import type { DashboardPoint } from "../dashboard.types";

const props = defineProps<{ points: DashboardPoint[] }>();

const W = 900;
const H = 260;
const P = 14;

const a = computed(() => props.points.map((p) => p.a));
const b = computed(() => props.points.map((p) => p.b));

const minY = computed(() => Math.min(...a.value, ...b.value, 0));
const maxY = computed(() => Math.max(...a.value, ...b.value, 100));

const pathFor = (vals: number[]) => {
  if (!vals.length) return "";
  const step = (W - P * 2) / Math.max(1, vals.length - 1);
  const range = maxY.value - minY.value || 1;

  return vals.map((v, i) => {
    const x = P + i * step;
    const y = P + (H - P * 2) * (1 - (v - minY.value) / range);
    return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");
};
</script>

<template>
  <div class="w-full h-full">
    <div class="w-full h-full rounded-2xl bg-black/5 dark:bg-white/10 overflow-hidden">
      <svg class="w-full h-full" viewBox="0 0 900 260" preserveAspectRatio="none">
        <path :d="pathFor(a)" fill="none" stroke-width="3" class="stroke-blue-500" stroke-linecap="round" />
        <path :d="pathFor(b)" fill="none" stroke-width="3" class="stroke-orange-400" stroke-linecap="round" />
      </svg>
    </div>
  </div>
</template>
