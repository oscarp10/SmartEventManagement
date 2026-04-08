import { useCallback } from "react";
import { eventsApi } from "@/features/events/services/eventsApi";
import type { AuthProfile } from "@/features/auth/types";

type RefreshFn = () => Promise<void>;

export function useAdminEventActions(token: string, profile: AuthProfile | null, loadFeaturedEvents: RefreshFn, refreshAdminEvents: RefreshFn) {
  const approveEvent = useCallback(
    async (eventId: string) => {
      if (!token || !profile || profile.role !== "Admin") return;
      try {
        await eventsApi.approve(token, eventId);
        await loadFeaturedEvents();
        await refreshAdminEvents();
      } catch {
        // non-blocking
      }
    },
    [token, profile, loadFeaturedEvents, refreshAdminEvents]
  );

  const rejectEvent = useCallback(
    async (eventId: string, reason: string) => {
      if (!token || !profile || profile.role !== "Admin") return;
      try {
        await eventsApi.reject(token, eventId, reason);
        await loadFeaturedEvents();
        await refreshAdminEvents();
      } catch {
        // non-blocking
      }
    },
    [token, profile, loadFeaturedEvents, refreshAdminEvents]
  );

  const markEventPending = useCallback(
    async (eventId: string) => {
      if (!token || !profile || profile.role !== "Admin") return;
      try {
        await eventsApi.markPending(token, eventId);
        await loadFeaturedEvents();
        await refreshAdminEvents();
      } catch {
        // non-blocking
      }
    },
    [token, profile, loadFeaturedEvents, refreshAdminEvents]
  );

  return { approveEvent, rejectEvent, markEventPending };
}

