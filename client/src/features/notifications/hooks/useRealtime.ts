import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { API_BASE } from "@/lib/apiClient";
import type { NotificationDto } from "@/features/notifications/hooks/useNotifications";

type UseRealtimeArgs = {
  token: string;
  enabled: boolean;
  organizerId: string | null;
  onOrganizerAffected?: () => void;
  onNotificationCreated?: (n: NotificationDto) => void;
};

export function useRealtime({ token, enabled, organizerId, onOrganizerAffected, onNotificationCreated }: UseRealtimeArgs) {
  const [realtimeFeed, setRealtimeFeed] = useState<string[]>([]);
  useEffect(() => {
    if (!enabled || !token) return;
    const connection = new signalR.HubConnectionBuilder().withUrl(`${API_BASE}/hubs/events`, { accessTokenFactory: () => token }).withAutomaticReconnect().build();
    const syncOrganizerIfAffected = (p: { organizerId?: string }) => {
      if (!organizerId || !p.organizerId) return;
      if (String(p.organizerId) !== organizerId) return;
      onOrganizerAffected?.();
    };
    connection.on("EventApproved", (p: { title: string; organizerId?: string }) => {
      setRealtimeFeed((prev) => [`Event approved: ${p.title}`, ...prev].slice(0, 8));
      syncOrganizerIfAffected(p);
    });
    connection.on("EventRejected", (p: { title: string; organizerId?: string; reason?: string }) => {
      setRealtimeFeed((prev) => [`Event rejected: ${p.title}${p.reason ? ` - ${p.reason}` : ""}`, ...prev].slice(0, 8));
      syncOrganizerIfAffected(p);
    });
    connection.on("EventMarkedPending", (p: { title: string; organizerId?: string }) => {
      setRealtimeFeed((prev) => [`Event back to pending: ${p.title}`, ...prev].slice(0, 8));
      syncOrganizerIfAffected(p);
    });
    connection.on("NotificationCreated", (n: NotificationDto) => {
      onNotificationCreated?.(n);
    });
    connection.on("EventCapacityUpdated", (p: { eventId: string; registered: number; capacity: number; remaining: number }) => {
      setRealtimeFeed((prev) => [`Capacity update (${p.eventId.slice(0, 8)}): ${p.registered}/${p.capacity}, remaining ${p.remaining}`, ...prev].slice(0, 8));
    });
    connection.start().catch(() => undefined);
    return () => {
      void connection.stop();
    };
  }, [enabled, token, organizerId, onOrganizerAffected, onNotificationCreated]);
  const clearRealtimeFeed = () => setRealtimeFeed([]);
  return { realtimeFeed, setRealtimeFeed, clearRealtimeFeed };
}

