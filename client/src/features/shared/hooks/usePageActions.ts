import { useCallback } from "react";
import type { DashboardSection, Page } from "@/app-types";

type Args = {
  isAuthenticated: boolean;
  canCreateEvent: boolean;
  setPage: (page: Page) => void;
  setDashboardSection: (section: DashboardSection) => void;
  setGlobalInboxOpen: (open: boolean) => void;
  setCalendarSelectedEvent: (event: null) => void;
};

export function usePageActions({
  isAuthenticated,
  canCreateEvent,
  setPage,
  setDashboardSection,
  setGlobalInboxOpen,
  setCalendarSelectedEvent
}: Args) {
  const goExplore = useCallback(() => {
    setPage("home");
    requestAnimationFrame(() => document.getElementById("featured-events")?.scrollIntoView({ behavior: "smooth" }));
  }, [setPage]);

  const goCreateEvent = useCallback(() => {
    if (isAuthenticated && canCreateEvent) {
      setPage("dashboard");
      setDashboardSection("overview");
      requestAnimationFrame(() => document.getElementById("create-event-form")?.scrollIntoView({ behavior: "smooth" }));
      return;
    }
    setPage("signup");
  }, [isAuthenticated, canCreateEvent, setPage, setDashboardSection]);

  const activateNotification = useCallback(
    (item: { relatedEventId?: string }, markRead: (id: string) => void, id: string) => {
      void Promise.resolve(markRead(id));
      if (item.relatedEventId) {
        setPage("home");
        setGlobalInboxOpen(false);
        setCalendarSelectedEvent(null);
      }
    },
    [setPage, setGlobalInboxOpen, setCalendarSelectedEvent]
  );

  return { goExplore, goCreateEvent, activateNotification };
}

