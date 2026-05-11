<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import DataTable from "@/shared/components/DataTable.vue";
import type { Portugal2030Notice } from "../noticesPt2030.types";
import { formatCurrency, formatDate, getNoticeStatus } from "../services/noticesPt2030.services";
import { useFavouritesStore } from "@/stores/favouritesStore";

defineProps<{
  notices: Portugal2030Notice[];
}>();

const emit = defineEmits<{
  (e: "select", notice: Portugal2030Notice): void;
}>();

const favouritesStore = useFavouritesStore();

const statusConfig = {
  open:     { label: "Aberto",  classes: "bg-green-500/10 text-green-500" },
  closed:   { label: "Fechado", classes: "bg-red-500/10 text-red-500" },
  upcoming: { label: "A abrir", classes: "bg-yellow-500/10 text-yellow-500" },
} as const;

const columns: ColumnDef<Portugal2030Notice, any>[] = [
  {
    id: "favourite",
    header: "",
    enableSorting: false,
    cell: ({ row }) => {
      const code = row.original.code;
      const isFav = favouritesStore.isFavourite(code);
      return h(
        "button",
        {
          class: `p-1.5 rounded-lg transition-colors ${isFav ? "text-yellow-400 hover:text-yellow-500" : "text-theme-muted hover:text-yellow-400 hover:bg-yellow-400/10"}`,
          onClick: (e: MouseEvent) => {
            e.stopPropagation();
            favouritesStore.toggle(code);
          },
        },
        h(resolveComponent("AppIcon"), { name: "Star", size: 16, fill: isFav ? "currentColor" : "none" }),
      );
    },
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    cell: ({ row }) =>
      h(
        "button",
        {
          class: "p-1.5 rounded-lg text-theme-muted hover:text-primary hover:bg-primary/10 transition-colors",
          onClick: (e: MouseEvent) => {
            e.stopPropagation();
            emit("select", row.original);
          },
        },
        h(resolveComponent("AppIcon"), { name: "Eye", size: 16 }),
      ),
  },
  {
    accessorKey: "code",
    header: "Código",
    cell: ({ getValue }) =>
      h("span", { class: "font-mono text-sm font-semibold" }, getValue()),
  },
  {
    accessorKey: "domination",
    header: "Denominação",
    cell: ({ getValue }) =>
      h("span", { class: "block truncate max-w-xs text-sm", title: getValue() }, getValue()),
  },
  {
    accessorKey: "fund",
    header: "Fundo",
    cell: ({ getValue }) =>
      h("span", { class: "text-sm text-theme-muted" }, getValue()),
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ getValue }) =>
      h("span", { class: "text-sm text-theme-muted" }, getValue()),
  },
  {
    accessorKey: "total_allocation",
    header: "Dotação Total",
    cell: ({ getValue }) =>
      h("span", { class: "text-sm font-semibold" }, formatCurrency(getValue())),
  },
  {
    accessorKey: "notice_end_date",
    header: "Prazo",
    cell: ({ getValue }) =>
      h("span", { class: "text-sm text-theme-muted" }, formatDate(getValue())),
  },
  {
    id: "status",
    header: "Estado",
    accessorFn: (row) => getNoticeStatus(row),
    cell: ({ getValue }) => {
      const s = getValue() as keyof typeof statusConfig;
      return h(
        "span",
        { class: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusConfig[s].classes}` },
        statusConfig[s].label,
      );
    },
  },
];
</script>

<template>
  <DataTable
    :data="notices"
    :columns="columns"
    @rowClick="emit('select', $event)"
  />
</template>
