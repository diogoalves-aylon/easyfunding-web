import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { notificationsApi } from "../notifications.api";
import type { NotificationType } from "../notifications.types";
import { LocalNotifications } from "@capacitor/local-notifications";

function parseIsoSafe(ts?: string | null): Date | null {
  if (!ts) return null;
  const fixed = ts.replace(/\.(\d{3})\d+(?=Z$|[+-]\d{2}:\d{2}$)/, ".$1");
  const d = new Date(fixed);
  return Number.isFinite(d.getTime()) ? d : null;
}

export function formatRelativeTime(ts?: string | null) {
  const d = parseIsoSafe(ts);
  if (!d) return "";

  const diffMs = Date.now() - d.getTime();
  const s = Math.max(0, Math.floor(diffMs / 1000));

  if (s < 60) return `há ${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `há ${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `há ${h}h`;
  const days = Math.floor(h / 24);
  return `há ${days}d`;
}

export function getIconTone(type: NotificationType) {
  // mantém a estética do zip
  switch (type) {
    case "WARNING":
    case "ALERT":
      return { bg: "rgba(239,68,68,0.10)", fg: "rgb(239,68,68)" };
    default:
      return { bg: "rgba(148,163,184,0.12)", fg: "rgb(100,116,139)" };
  }
}

let initialized = false;

function getNativePlatform(): "android" | "ios" | null {
  const p = Capacitor.getPlatform();
  if (p === "android" || p === "ios") return p;
  return null;
}

export async function initPushNotifications(options?: {
  onRoute?: (route: string) => void;
  onReceived?: () => void;
}) {
  if (initialized) return;
  initialized = true;
  console.log(
    "[push] isNative:",
    Capacitor.isNativePlatform(),
    "platform:",
    Capacitor.getPlatform(),
  );

  if (!Capacitor.isNativePlatform()) return;
  const plat = getNativePlatform();
  if (!plat) return;

  const perm0 = await PushNotifications.checkPermissions();
  console.log("[push] perm check:", perm0);

  let perm = await PushNotifications.checkPermissions();
  if (perm.receive !== "granted")
    perm = await PushNotifications.requestPermissions();
  console.log("[push] perm after request:", perm);

  if (perm.receive !== "granted") return;

  await PushNotifications.register();
  console.log("[push] register() called");

  PushNotifications.addListener("registration", async (token) => {
    try {
      await notificationsApi.registerDevice(token.value, plat);
      console.log("[push] FCM token:", token.value);
    } catch (e) {
      console.error("notifications: registerDevice failed", e);
    }
  });

  PushNotifications.addListener("registrationError", (err) => {
    console.error("notifications: registrationError", err);
  });

  async function ensureLocalChannel() {
    const perm = await LocalNotifications.checkPermissions();
    if (perm.display !== "granted") {
      const req = await LocalNotifications.requestPermissions();
      if (req.display !== "granted") return false;
    }

    if (Capacitor.getPlatform() === "android") {
      await LocalNotifications.createChannel({
        id: "alerts",
        name: "Alertas",
        description: "Alertas do app",
        importance: 5, 
        visibility: 1, 
        sound: "default",
        vibration: true,
        lights: true,
      });
    }

    return true;
  }

  PushNotifications.addListener(
    "pushNotificationReceived",
    async (notification) => {
      console.log("[push] foreground received:", notification);

      await ensureLocalChannel();

      await LocalNotifications.schedule({
        notifications: [
          {
            id: Math.floor(Math.random() * 2_000_000_000),
            title: notification.title ?? "Notificação",
            body: notification.body ?? "",
            extra: notification.data ?? {},
            channelId: "alerts",
            schedule: { at: new Date(Date.now() + 50) },
          },
        ],
      });

      options?.onReceived?.();
    },
  );

  PushNotifications.addListener(
    "pushNotificationActionPerformed",
    async (action) => {
      console.log("[push] actionPerformed:", action);
      const data = action.notification?.data ?? {};
      const notifId = Number(data.notification_id);

      if (Number.isFinite(notifId) && notifId > 0) {
        try {
          await notificationsApi.markRead(notifId, true);
        } catch {}
      }

      const route = data.route ? String(data.route) : null;
      if (route && options?.onRoute) options.onRoute(route);
    },
  );
}

export const notificationsService = {
  init: initPushNotifications,
  sendPushUp: notificationsApi.sendPushUp,
};
