export { useDashboardController } from "./hooks/useDashboardController";
export { useDashboardPageProps } from "./hooks/useDashboardPageProps";
export { useDashboardDerived } from "./hooks/useDashboardDerived";
export { useDashboardUiState } from "./hooks/useDashboardUiState";
export { useDashboardViewModel } from "./hooks/useDashboardViewModel";
export { dashboardApi } from "./services/dashboardApi";
export type { OrganizerAnalyticsResponse } from "./types";
export type { DashboardNotificationItem, NotificationTone } from "./components/NotificationsPanel";
export { DashboardView } from "./pages/DashboardView";
export { DashboardPageBody } from "./pages/DashboardPageBody";
export { DashboardNotificationsSection, DashboardProfileBasicSection, DashboardCalendarSection, DashboardOverviewSection } from "./pages/DashboardSharedSections";
export { AdminApprovalsSection } from "./roles/admin/AdminApprovalsSection";
export { OrganizerMyEventsSection } from "./roles/organizer/OrganizerDashboardSections";
export { OrganizerAdminSharedOverview } from "./roles/organizer/OrganizerAdminSharedOverview";
export { AttendeeEventDiscoverySection, AttendeeOverviewRegistrationsSection, AttendeeProfileExtensionSection, AttendeeEventDetailsModal } from "./roles/attendee/AttendeeDashboardSections";

