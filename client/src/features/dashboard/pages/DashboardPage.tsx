import { useDashboardController, useDashboardPageProps } from "@/features/dashboard";
import type { DashboardNotificationItem } from "@/features/dashboard";
import { DashboardView } from "@/features/dashboard/pages/DashboardView";
import { useAuthContext } from "@/features/auth";
import { useEventActionHandlers, useEventContext, useOrganizerAnalytics } from "@/features/events";
import { useFeedback, useSuggestionForm, useSuggestionSubmission } from "@/features/feedback";
import { API_BASE } from "@/lib/apiClient";

type DashboardPageProps = {
  realtimeFeed: string[];
  notificationsLoading: boolean;
  notificationsError: string;
  unreadNotificationsCount: number;
  dashboardNotificationItems: DashboardNotificationItem[];
  onOpenInbox: () => void;
  onLogout: () => void;
  onExplore: () => void;
  onMarkNotificationRead: (id: string) => void;
  onNotificationItemClick: (item: DashboardNotificationItem) => void;
};

export function DashboardPage({
  realtimeFeed,
  notificationsLoading,
  notificationsError,
  unreadNotificationsCount,
  dashboardNotificationItems,
  onOpenInbox,
  onLogout,
  onExplore,
  onMarkNotificationRead,
  onNotificationItemClick
}: DashboardPageProps) {
  const auth = useAuthContext();
  const events = useEventContext();
  const { profile, token } = auth;

  const {
    feedbackMine,
    feedbackLoading,
    feedbackError,
    feedbackModal,
    setFeedbackModal,
    feedbackSubmitLoading,
    feedbackSubmitError,
    submitFeedback,
    deleteFeedback,
    attendeeEventsWithoutFeedback
  } = useFeedback(token, profile?.role === "Attendee" ? profile.id : null, events.registrations);

  const { organizerAnalytics, organizerAnalyticsLoading, organizerAnalyticsError } = useOrganizerAnalytics(
    token,
    profile?.role === "Organizer" ? profile.id : null
  );

  const dashboard = useDashboardController({
    profileRole: profile?.role,
    realtimeFeedLength: realtimeFeed.length,
    recommendations: events.recommendations,
    featuredEvents: events.featuredEvents,
    approvedCatalogEvents: events.approvedCatalogEvents,
    adminCatalogEvents: events.adminCatalogEvents,
    myEvents: events.myEvents,
    registrations: events.registrations,
    organizerAnalytics
  });

  const {
    suggestTitle,
    setSuggestTitle,
    suggestDescription,
    setSuggestDescription,
    suggestRationale,
    setSuggestRationale,
    suggestStatus,
    setSuggestStatus,
    suggestLoading,
    setSuggestLoading
  } = useSuggestionForm();

  const { handleSubmitEventSuggestion } = useSuggestionSubmission({
    profile,
    suggestTitle,
    suggestDescription,
    suggestRationale,
    setSuggestTitle,
    setSuggestDescription,
    setSuggestRationale,
    setSuggestStatus,
    setSuggestLoading,
    submitSuggestion: events.submitSuggestion
  });

  const { handleSaveInterests, handleCreateEvent, handleSaveAdminComment } = useEventActionHandlers({
    onAdminCommentSaved: (eventId, comment) => {
      dashboard.setAdminReviewEvent((prev) => (prev && prev.id === eventId ? { ...prev, adminComment: comment || undefined } : prev));
    }
  });

  const dashboardViewModel = useDashboardPageProps({
    profile,
    section: dashboard.dashboardSection,
    setSection: dashboard.setDashboardSection,
    dashboardSearch: dashboard.dashboardSearch,
    setDashboardSearch: dashboard.setDashboardSearch,
    dashboardSearchPlaceholder: dashboard.dashboardSearchPlaceholder,
    dashboardTitle: dashboard.dashboardTitle,
    unreadNotificationsCount,
    token,
    apiBase: API_BASE,
    realtimeFeed,
    dashboardNotificationItems,
    notificationsLoading,
    notificationsError,
    recommendations: events.recommendations,
    attendeeBrowseFiltered: dashboard.attendeeBrowseFiltered,
    attendeeBrowsePool: dashboard.attendeeBrowsePool,
    attendeeEventDetails: dashboard.attendeeEventDetails,
    setAttendeeEventDetails: dashboard.setAttendeeEventDetails,
    myEvents: events.myEvents,
    adminCatalogEvents: events.adminCatalogEvents,
    approvedCatalogEvents: events.approvedCatalogEvents,
    registrations: events.registrations,
    calendarSelectedEvent: dashboard.calendarSelectedEvent,
    setCalendarSelectedEvent: dashboard.setCalendarSelectedEvent,
    registrationLoading: events.registrationLoading,
    registrationError: events.registrationError,
    isRegisteredForEvent: events.isRegisteredForEvent,
    metricTiles: dashboard.metricTiles,
    organizerAnalytics,
    organizerAnalyticsLoading,
    organizerAnalyticsError,
    adminSummary: dashboard.adminSummary,
    feedbackModal,
    setFeedbackModal,
    feedbackSubmitError,
    feedbackSubmitLoading,
    toAttendeeDetailFromRegistration: dashboard.toAttendeeDetailFromRegistration,
    selectedInterestTags: events.selectedInterestTags,
    setSelectedInterestTags: events.setSelectedInterestTags,
    interestOtherInput: events.interestOtherInput,
    setInterestOtherInput: events.setInterestOtherInput,
    interestSaveFeedback: events.interestSaveFeedback,
    interestSaveLoading: events.interestSaveLoading,
    suggestTitle,
    setSuggestTitle,
    suggestDescription,
    setSuggestDescription,
    suggestRationale,
    setSuggestRationale,
    suggestStatus,
    suggestLoading,
    attendeeEventsWithoutFeedback,
    feedbackLoading,
    feedbackError,
    feedbackMine,
    resolveEventTitle: dashboard.resolveEventTitle,
    newEvent: events.newEvent,
    setNewEvent: events.setNewEvent,
    createStatus: events.createStatus,
    organizerSuggestionsLoading: events.organizerSuggestionsLoading,
    organizerSuggestions: events.organizerSuggestions,
    adminReviewTab: dashboard.adminReviewTab,
    setAdminReviewTab: dashboard.setAdminReviewTab,
    adminReviewEvent: dashboard.adminReviewEvent,
    setAdminReviewEvent: dashboard.setAdminReviewEvent,
    adminApproveEvent: dashboard.adminApproveEvent,
    setAdminApproveEvent: dashboard.setAdminApproveEvent,
    adminRejectEvent: dashboard.adminRejectEvent,
    setAdminRejectEvent: dashboard.setAdminRejectEvent,
    adminPendingEvent: dashboard.adminPendingEvent,
    setAdminPendingEvent: dashboard.setAdminPendingEvent,
    onOpenInbox,
    onLogout,
    onExplore,
    onMarkNotificationRead,
    onNotificationItemClick,
    onRegisterForEvent: events.registerForEvent,
    onCancelRegistration: events.cancelRegistration,
    onSubmitFeedback: submitFeedback,
    onSaveInterests: handleSaveInterests,
    onSubmitSuggestion: handleSubmitEventSuggestion,
    onDeleteFeedback: deleteFeedback,
    onRefreshMyEvents: events.refreshMyEvents,
    onCreateEventSubmit: handleCreateEvent,
    onSaveAdminComment: handleSaveAdminComment,
    onApproveEvent: events.approveEvent,
    onRejectEvent: events.rejectEvent,
    onMarkEventPending: events.markEventPending
  });

  return dashboardViewModel ? <DashboardView {...dashboardViewModel} /> : null;
}

