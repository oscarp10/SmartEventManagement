import type { DashboardSection } from "@/app-types";
import type { DashboardViewProps } from "@/features/dashboard/pages/DashboardView";
import type { MetricTile } from "@/features/dashboard/pages/DashboardSharedSections";
import type { AuthProfile } from "@/features/auth/types";
import type { EventItem, RegistrationDto } from "@/features/events/types";
import type { FeedbackDto } from "@/features/feedback/types";
import type { OrganizerAnalyticsResponse } from "@/features/dashboard/types";
import type { DashboardNotificationItem } from "@/features/dashboard/components/NotificationsPanel";
import type { AdminEvent } from "@/features/dashboard/roles/admin/components/AdminEventCard";

type NewEventDraft = {
  title: string;
  description: string;
  dateTime: string;
  location: string;
  priceLabel: string;
  imageUrl: string;
  rating: string;
  reviewCount: string;
  attendeeCount: string;
  category: string;
  capacity: string;
  tags: string;
};

type SuggestionItem = {
  id: string;
  title: string;
  description: string;
  rationale?: string;
  createdAt: string;
  attendeeName: string;
  attendeeEmail: string;
};

type Args = {
  profile: AuthProfile | null;
  section: DashboardSection;
  setSection: (section: DashboardSection) => void;
  dashboardSearch: string;
  setDashboardSearch: (value: string) => void;
  dashboardSearchPlaceholder: string;
  dashboardTitle: string;
  unreadNotificationsCount: number;
  token: string;
  apiBase: string;
  realtimeFeed: string[];
  dashboardNotificationItems: DashboardNotificationItem[];
  notificationsLoading: boolean;
  notificationsError: string;
  recommendations: EventItem[];
  attendeeBrowseFiltered: EventItem[];
  attendeeBrowsePool: EventItem[];
  attendeeEventDetails: EventItem | null;
  setAttendeeEventDetails: (event: EventItem | null) => void;
  myEvents: EventItem[];
  adminCatalogEvents: EventItem[];
  approvedCatalogEvents: EventItem[];
  registrations: RegistrationDto[];
  calendarSelectedEvent: EventItem | null;
  setCalendarSelectedEvent: (event: EventItem | null) => void;
  registrationLoading: boolean;
  registrationError: string;
  isRegisteredForEvent: (eventId: string) => boolean;
  metricTiles: MetricTile[];
  organizerAnalytics: OrganizerAnalyticsResponse | null;
  organizerAnalyticsLoading: boolean;
  organizerAnalyticsError: string;
  adminSummary: { pending: number; approved: number; rejected: number; total: number };
  feedbackModal: { eventId: string; feedbackId?: string; rating: number; comment: string } | null;
  setFeedbackModal: (value: { eventId: string; feedbackId?: string; rating: number; comment: string } | null | ((prev: { eventId: string; feedbackId?: string; rating: number; comment: string } | null) => { eventId: string; feedbackId?: string; rating: number; comment: string } | null)) => void;
  feedbackSubmitError: string;
  feedbackSubmitLoading: boolean;
  toAttendeeDetailFromRegistration: (r: RegistrationDto) => EventItem;
  selectedInterestTags: string[];
  setSelectedInterestTags: (value: string[] | ((prev: string[]) => string[])) => void;
  interestOtherInput: string;
  setInterestOtherInput: (value: string) => void;
  interestSaveFeedback: { type: "ok" | "err"; text: string } | null;
  interestSaveLoading: boolean;
  suggestTitle: string;
  setSuggestTitle: (value: string) => void;
  suggestDescription: string;
  setSuggestDescription: (value: string) => void;
  suggestRationale: string;
  setSuggestRationale: (value: string) => void;
  suggestStatus: string;
  suggestLoading: boolean;
  attendeeEventsWithoutFeedback: { eventId: string; title: string }[];
  feedbackLoading: boolean;
  feedbackError: string;
  feedbackMine: FeedbackDto[];
  resolveEventTitle: (eventId: string) => string;
  newEvent: NewEventDraft;
  setNewEvent: (value: NewEventDraft | ((prev: NewEventDraft) => NewEventDraft)) => void;
  createStatus: string;
  organizerSuggestionsLoading: boolean;
  organizerSuggestions: SuggestionItem[];
  adminReviewTab: "pending" | "approved" | "rejected";
  setAdminReviewTab: (value: "pending" | "approved" | "rejected") => void;
  adminReviewEvent: AdminEvent | null;
  setAdminReviewEvent: (value: AdminEvent | null) => void;
  adminApproveEvent: AdminEvent | null;
  setAdminApproveEvent: (value: AdminEvent | null) => void;
  adminRejectEvent: AdminEvent | null;
  setAdminRejectEvent: (value: AdminEvent | null) => void;
  adminPendingEvent: AdminEvent | null;
  setAdminPendingEvent: (value: AdminEvent | null) => void;
  onOpenInbox: () => void;
  onLogout: () => void;
  onExplore: () => void;
  onMarkNotificationRead: (id: string) => void;
  onNotificationItemClick: (item: DashboardNotificationItem) => void;
  onRegisterForEvent: (eventId: string) => void | Promise<void>;
  onCancelRegistration: (eventId: string) => void | Promise<void>;
  onSubmitFeedback: () => void | Promise<void>;
  onSaveInterests: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  onSubmitSuggestion: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  onDeleteFeedback: (id: string) => void;
  onRefreshMyEvents: () => Promise<void>;
  onCreateEventSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  onSaveAdminComment: (eventId: string, comment: string) => void | Promise<void>;
  onApproveEvent: (eventId: string) => void | Promise<void>;
  onRejectEvent: (eventId: string, reason: string) => void | Promise<void>;
  onMarkEventPending: (eventId: string) => void | Promise<void>;
};

export function useDashboardPageProps(args: Args): DashboardViewProps | null {
  if (!args.profile) return null;
  return {
    profile: args.profile,
    section: args.section,
    onSection: args.setSection,
    searchQuery: args.dashboardSearch,
    onSearchQuery: args.setDashboardSearch,
    searchPlaceholder: args.dashboardSearchPlaceholder,
    unreadCount: args.unreadNotificationsCount,
    onOpenInbox: args.onOpenInbox,
    onLogout: args.onLogout,
    onExplore: args.onExplore,
    title: args.dashboardTitle,
    bodyProps: {
      role: args.profile.role,
      profile: args.profile,
      section: args.section,
      token: args.token,
      apiBase: args.apiBase,
      realtimeFeed: args.realtimeFeed,
      unreadNotificationsCount: args.unreadNotificationsCount,
      dashboardNotificationItems: args.dashboardNotificationItems,
      notificationsLoading: args.notificationsLoading,
      notificationsError: args.notificationsError,
      onMarkNotificationRead: args.onMarkNotificationRead,
      onNotificationItemClick: args.onNotificationItemClick,
      recommendations: args.recommendations,
      attendeeBrowseFiltered: args.attendeeBrowseFiltered,
      attendeeBrowsePool: args.attendeeBrowsePool,
      attendeeEventDetails: args.attendeeEventDetails,
      setAttendeeEventDetails: args.setAttendeeEventDetails,
      myEvents: args.myEvents,
      adminCatalogEvents: args.adminCatalogEvents,
      approvedCatalogEvents: args.approvedCatalogEvents,
      registrations: args.registrations,
      calendarSelectedEvent: args.calendarSelectedEvent,
      setCalendarSelectedEvent: args.setCalendarSelectedEvent,
      registrationLoading: args.registrationLoading,
      registrationError: args.registrationError,
      isRegisteredForEvent: args.isRegisteredForEvent,
      onRegisterForEvent: args.onRegisterForEvent,
      onCancelRegistration: args.onCancelRegistration,
      metricTiles: args.metricTiles,
      organizerAnalytics: args.organizerAnalytics,
      organizerAnalyticsLoading: args.organizerAnalyticsLoading,
      organizerAnalyticsError: args.organizerAnalyticsError,
      adminSummary: args.adminSummary,
      feedbackModal: args.feedbackModal,
      setFeedbackModal: args.setFeedbackModal,
      feedbackSubmitError: args.feedbackSubmitError,
      feedbackSubmitLoading: args.feedbackSubmitLoading,
      onSubmitFeedback: args.onSubmitFeedback,
      toAttendeeDetailFromRegistration: args.toAttendeeDetailFromRegistration,
      selectedInterestTags: args.selectedInterestTags,
      setSelectedInterestTags: args.setSelectedInterestTags,
      interestOtherInput: args.interestOtherInput,
      setInterestOtherInput: args.setInterestOtherInput,
      interestSaveFeedback: args.interestSaveFeedback,
      interestSaveLoading: args.interestSaveLoading,
      onSaveInterests: args.onSaveInterests,
      suggestTitle: args.suggestTitle,
      setSuggestTitle: args.setSuggestTitle,
      suggestDescription: args.suggestDescription,
      setSuggestDescription: args.setSuggestDescription,
      suggestRationale: args.suggestRationale,
      setSuggestRationale: args.setSuggestRationale,
      suggestStatus: args.suggestStatus,
      suggestLoading: args.suggestLoading,
      onSubmitSuggestion: args.onSubmitSuggestion,
      attendeeEventsWithoutFeedback: args.attendeeEventsWithoutFeedback,
      feedbackLoading: args.feedbackLoading,
      feedbackError: args.feedbackError,
      feedbackMine: args.feedbackMine,
      resolveEventTitle: args.resolveEventTitle,
      onDeleteFeedback: args.onDeleteFeedback,
      dashboardSearch: args.dashboardSearch,
      onRefreshMyEvents: args.onRefreshMyEvents,
      newEvent: args.newEvent,
      setNewEvent: args.setNewEvent,
      createStatus: args.createStatus,
      onCreateEventSubmit: args.onCreateEventSubmit,
      organizerSuggestionsLoading: args.organizerSuggestionsLoading,
      organizerSuggestions: args.organizerSuggestions,
      adminReviewTab: args.adminReviewTab,
      setAdminReviewTab: args.setAdminReviewTab,
      adminReviewEvent: args.adminReviewEvent,
      setAdminReviewEvent: args.setAdminReviewEvent,
      adminApproveEvent: args.adminApproveEvent,
      setAdminApproveEvent: args.setAdminApproveEvent,
      adminRejectEvent: args.adminRejectEvent,
      setAdminRejectEvent: args.setAdminRejectEvent,
      adminPendingEvent: args.adminPendingEvent,
      setAdminPendingEvent: args.setAdminPendingEvent,
      onSaveAdminComment: args.onSaveAdminComment,
      onApproveEvent: args.onApproveEvent,
      onRejectEvent: args.onRejectEvent,
      onMarkEventPending: args.onMarkEventPending
    }
  };
}

