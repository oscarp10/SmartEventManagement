import { useDashboardDerived } from "@/features/dashboard/hooks/useDashboardDerived";
import { useDashboardUiState } from "@/features/dashboard/hooks/useDashboardUiState";
import type { EventItem, RegistrationDto } from "@/features/events/types";
import type { OrganizerAnalyticsResponse } from "@/features/dashboard/types";

type Args = {
  profileRole?: "Admin" | "Organizer" | "Attendee";
  realtimeFeedLength: number;
  recommendations: EventItem[];
  featuredEvents: EventItem[];
  approvedCatalogEvents: EventItem[];
  adminCatalogEvents: EventItem[];
  myEvents: EventItem[];
  registrations: RegistrationDto[];
  organizerAnalytics: OrganizerAnalyticsResponse | null;
};

export function useDashboardController({
  profileRole,
  realtimeFeedLength,
  recommendations,
  featuredEvents,
  approvedCatalogEvents,
  adminCatalogEvents,
  myEvents,
  registrations,
  organizerAnalytics
}: Args) {
  const ui = useDashboardUiState();

  const derived = useDashboardDerived({
    profileRole,
    dashboardSection: ui.dashboardSection,
    dashboardSearch: ui.dashboardSearch,
    realtimeFeedLength,
    recommendations,
    featuredEvents,
    approvedCatalogEvents,
    adminCatalogEvents,
    myEvents,
    registrations,
    organizerAnalytics
  });

  return { ...ui, ...derived };
}

