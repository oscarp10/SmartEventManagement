import { useEffect, useRef } from "react";
import type { DashboardSection, Page } from "@/app-types";

type Args = {
  page: Page;
  profileName?: string;
  profileEmail?: string;
  globalInboxOpen: boolean;
  dashboardSection: DashboardSection;
  setGlobalInboxOpen: (open: boolean) => void;
  setDashboardSection: (section: DashboardSection) => void;
  setCalendarSelectedEvent: (event: null) => void;
  prefillContactFromProfile: (fullName?: string, email?: string) => void;
};

export function usePageLifecycle({
  page,
  profileName,
  profileEmail,
  globalInboxOpen,
  dashboardSection,
  setGlobalInboxOpen,
  setDashboardSection,
  setCalendarSelectedEvent,
  prefillContactFromProfile
}: Args) {
  useEffect(() => {
    if (page !== "contact") return;
    prefillContactFromProfile(profileName, profileEmail);
  }, [page, profileName, profileEmail, prefillContactFromProfile]);

  useEffect(() => {
    if (!globalInboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setGlobalInboxOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [globalInboxOpen, setGlobalInboxOpen]);

  useEffect(() => {
    if (page === "login" || page === "signup") setGlobalInboxOpen(false);
  }, [page, setGlobalInboxOpen]);

  useEffect(() => {
    if (dashboardSection !== "calendar") setCalendarSelectedEvent(null);
  }, [dashboardSection, setCalendarSelectedEvent]);

  const prevPageRef = useRef<Page>(page);
  useEffect(() => {
    if (page === "dashboard" && prevPageRef.current !== "dashboard") setDashboardSection("overview");
    prevPageRef.current = page;
  }, [page, setDashboardSection]);
}

