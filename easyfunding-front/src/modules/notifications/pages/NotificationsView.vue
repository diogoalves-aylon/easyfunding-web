<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import NotificationsHeader from "../components/NotificationsHeader.vue";
import NotificationCard from "../components/NotificationCard.vue";
import EmptyState from "../components/EmptyState.vue";
import { useNotifications } from "../useNotifications";
import { notificationsService } from "../services/notifications.services";
import { useNotificationsRealTime } from "@/stores/notificationsRealTimeStore";

const router = useRouter();

const { notifications, acknowledge, ignore, clearVisualList, canClear, fetchNotifications } = useNotifications();

const notificationsList = computed(() => notifications.value);
const rt = useNotificationsRealTime();

const sortedNotifications = computed(() => {
  return [...notificationsList.value].sort((a, b) => {
    // não vistas primeiro
    if (a.viewed !== b.viewed) return a.viewed ? 1 : -1;
    // mais recentes primeiro
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
});

onMounted(async () => {
  await fetchNotifications().catch(() => { });

  await notificationsService.init({
    onRoute: (route: string) => router.push(route),
    onReceived: () => fetchNotifications(),
  })
});

watch(
  () => rt.tick,
  async (t) => {
    if (!t) return
    await fetchNotifications().catch(() => { })
  }
);
</script>

<template>
  <div class="space-y-6">
    <NotificationsHeader :clearDisabled="!canClear" @clear="clearVisualList" />

    <EmptyState v-if="sortedNotifications.length === 0" />

    <div v-else class="space-y-4">
      <NotificationCard v-for="n in sortedNotifications" :key="n.id" :item="n" @ack="acknowledge" @ignore="ignore" />
    </div>
  </div>
</template>
