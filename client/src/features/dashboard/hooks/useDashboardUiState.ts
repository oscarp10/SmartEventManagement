import { useState } from "react";
import type { DashboardSection } from "@/app-types";
import type { AdminEvent } from "@/features/dashboard/roles/admin/components/AdminEventCard";
import type { EventItem } from "@/features/events/types";

export function useDashboardUiState() {
  const [dashboardSection, setDashboardSection] = useState<DashboardSection>("overview");
  const [dashboardSearch, setDashboardSearch] = useState("");
  const [adminReviewEvent, setAdminReviewEvent] = useState<AdminEvent | null>(null);
  const [adminApproveEvent, setAdminApproveEvent] = useState<AdminEvent | null>(null);
  const [adminRejectEvent, setAdminRejectEvent] = useState<AdminEvent | null>(null);
  const [adminPendingEvent, setAdminPendingEvent] = useState<AdminEvent | null>(null);
  const [adminReviewTab, setAdminReviewTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [globalInboxOpen, setGlobalInboxOpen] = useState(false);
  const [calendarSelectedEvent, setCalendarSelectedEvent] = useState<EventItem | null>(null);
  const [attendeeEventDetails, setAttendeeEventDetails] = useState<EventItem | null>(null);
  return { dashboardSection, setDashboardSection, dashboardSearch, setDashboardSearch, adminReviewEvent, setAdminReviewEvent, adminApproveEvent, setAdminApproveEvent, adminRejectEvent, setAdminRejectEvent, adminPendingEvent, setAdminPendingEvent, adminReviewTab, setAdminReviewTab, globalInboxOpen, setGlobalInboxOpen, calendarSelectedEvent, setCalendarSelectedEvent, attendeeEventDetails, setAttendeeEventDetails };
}

