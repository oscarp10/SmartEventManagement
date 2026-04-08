import { useCallback } from "react";
import type { Page } from "@/app-types";
import { useAuthContext } from "@/features/auth/context/useAuthContext";
import { useEventContext } from "@/features/events/context/useEventContext";
import { useNotificationContext } from "@/features/notifications/context/useNotificationContext";

type UseLogoutControllerArgs = {
  setPage: (page: Page) => void;
  setGlobalInboxOpen: (open: boolean) => void;
};

export function useLogoutController({ setPage, setGlobalInboxOpen }: UseLogoutControllerArgs) {
  const auth = useAuthContext();
  const events = useEventContext();
  const { clearRealtimeFeed } = useNotificationContext();

  return useCallback(() => {
    setGlobalInboxOpen(false);
    events.setRecommendations([]);
    events.setMyEvents([]);
    events.setAdminCatalogEvents([]);
    clearRealtimeFeed();
    auth.logout();
    setPage("home");
  }, [auth, clearRealtimeFeed, events, setGlobalInboxOpen, setPage]);
}

