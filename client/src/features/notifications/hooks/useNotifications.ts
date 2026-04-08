import { useCallback, useEffect, useMemo, useState } from "react";
import { inferLiveNotificationTone } from "@/lib/events";
import { notificationsApi } from "@/features/notifications/services/notificationsApi";
import type { DashboardNotificationItem } from "@/features/dashboard/components/NotificationsPanel";

export type NotificationDto = { id: string; userId: string; message: string; isRead: boolean; createdAt: string };

export function useNotifications(token: string, enabled: boolean) {
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const reload = useCallback(async () => {
    if (!enabled || !token) {
      setNotifications([]);
      return;
    }
    setError("");
    setLoading(true);
    try {
      setNotifications(await notificationsApi.listMine(token));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, [enabled, token]);
  useEffect(() => {
    void reload();
  }, [reload]);
  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);
  const items: DashboardNotificationItem[] = useMemo(
    () =>
      notifications
        .slice()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map((n) => ({ id: n.id, body: n.message, read: n.isRead, createdAt: n.createdAt, tone: inferLiveNotificationTone(n.message) })),
    [notifications]
  );
  const markRead = useCallback(
    async (id: string) => {
      if (!token) return;
      try {
        await notificationsApi.markRead(token, id);
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      } catch {
        // ignore transient failures
      }
    },
    [token]
  );
  const prependFromRealtime = useCallback((n: NotificationDto) => {
    setNotifications((prev) => [n, ...prev].slice(0, 50));
  }, []);
  return { notifications, setNotifications, notificationsLoading: loading, notificationsError: error, unreadNotificationsCount: unreadCount, dashboardNotificationItems: items, markNotificationRead: markRead, prependNotificationFromRealtime: prependFromRealtime, reloadNotifications: reload };
}

