import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { AdminEvent } from "@/features/dashboard/roles/admin/components/AdminEventCard";
import type { DashboardNotificationItem } from "@/features/dashboard/components/NotificationsPanel";
import type { DashboardSection, Role } from "@/app-types";
import type { AuthProfile } from "@/features/auth/types";
import type { EventItem, RegistrationDto } from "@/features/events/types";
import type { FeedbackDto } from "@/features/feedback/types";
import type { OrganizerAnalyticsResponse } from "@/features/dashboard/types";
import { AdminApprovalsSection } from "@/features/dashboard/roles/admin/AdminApprovalsSection";
import {
  AttendeeEventDetailsModal,
  AttendeeEventDiscoverySection,
  AttendeeProfileExtensionSection
} from "@/features/dashboard/roles/attendee/AttendeeDashboardSections";
import {
  DashboardCalendarSection,
  DashboardNotificationsSection,
  DashboardOverviewSection,
  DashboardProfileBasicSection,
  type MetricTile
} from "@/features/dashboard/pages/DashboardSharedSections";
import { OrganizerAdminSharedOverview } from "@/features/dashboard/roles/organizer/OrganizerAdminSharedOverview";
import { OrganizerMyEventsSection } from "@/features/dashboard/roles/organizer/OrganizerDashboardSections";

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

export type DashboardPageBodyProps = {
  role: Role;
  profile: AuthProfile;
  section: DashboardSection;
  token: string;
  apiBase: string;
  /** Notifications */
  realtimeFeed: string[];
  unreadNotificationsCount: number;
  dashboardNotificationItems: DashboardNotificationItem[];
  notificationsLoading: boolean;
  notificationsError: string;
  onMarkNotificationRead: (id: string) => void;
  onNotificationItemClick: (item: DashboardNotificationItem) => void;
  /** Attendee browse */
  recommendations: EventItem[];
  attendeeBrowseFiltered: EventItem[];
  attendeeBrowsePool: EventItem[];
  attendeeEventDetails: EventItem | null;
  setAttendeeEventDetails: (e: EventItem | null) => void;
  /** Calendar */
  myEvents: EventItem[];
  adminCatalogEvents: EventItem[];
  approvedCatalogEvents: EventItem[];
  registrations: RegistrationDto[];
  calendarSelectedEvent: EventItem | null;
  setCalendarSelectedEvent: (e: EventItem | null) => void;
  registrationLoading: boolean;
  registrationError: string;
  isRegisteredForEvent: (eventId: string) => boolean;
  onRegisterForEvent: (eventId: string) => void | Promise<void>;
  onCancelRegistration: (eventId: string) => void | Promise<void>;
  /** Overview */
  metricTiles: MetricTile[];
  organizerAnalytics: OrganizerAnalyticsResponse | null;
  organizerAnalyticsLoading: boolean;
  organizerAnalyticsError: string;
  adminSummary: { pending: number; approved: number; rejected: number; total: number };
  feedbackModal: { eventId: string; feedbackId?: string; rating: number; comment: string } | null;
  setFeedbackModal: Dispatch<SetStateAction<{ eventId: string; feedbackId?: string; rating: number; comment: string } | null>>;
  feedbackSubmitError: string;
  feedbackSubmitLoading: boolean;
  onSubmitFeedback: () => void | Promise<void>;
  toAttendeeDetailFromRegistration: (r: RegistrationDto) => EventItem;
  /** Attendee profile */
  selectedInterestTags: string[];
  setSelectedInterestTags: Dispatch<SetStateAction<string[]>>;
  interestOtherInput: string;
  setInterestOtherInput: (v: string) => void;
  interestSaveFeedback: { type: "ok" | "err"; text: string } | null;
  interestSaveLoading: boolean;
  onSaveInterests: (e: FormEvent<HTMLFormElement>) => void | Promise<void>;
  suggestTitle: string;
  setSuggestTitle: (v: string) => void;
  suggestDescription: string;
  setSuggestDescription: (v: string) => void;
  suggestRationale: string;
  setSuggestRationale: (v: string) => void;
  suggestStatus: string;
  suggestLoading: boolean;
  onSubmitSuggestion: (e: FormEvent<HTMLFormElement>) => void | Promise<void>;
  attendeeEventsWithoutFeedback: { eventId: string; title: string }[];
  feedbackLoading: boolean;
  feedbackError: string;
  feedbackMine: FeedbackDto[];
  resolveEventTitle: (eventId: string) => string;
  onDeleteFeedback: (id: string) => void;
  /** Organizer */
  dashboardSearch: string;
  onRefreshMyEvents: () => Promise<void>;
  newEvent: NewEventDraft;
  setNewEvent: Dispatch<SetStateAction<NewEventDraft>>;
  createStatus: string;
  onCreateEventSubmit: (e: FormEvent<HTMLFormElement>) => void | Promise<void>;
  organizerSuggestionsLoading: boolean;
  organizerSuggestions: SuggestionItem[];
  /** Admin */
  adminReviewTab: "pending" | "approved" | "rejected";
  setAdminReviewTab: (t: "pending" | "approved" | "rejected") => void;
  adminReviewEvent: AdminEvent | null;
  setAdminReviewEvent: (e: AdminEvent | null) => void;
  adminApproveEvent: AdminEvent | null;
  setAdminApproveEvent: (e: AdminEvent | null) => void;
  adminRejectEvent: AdminEvent | null;
  setAdminRejectEvent: (e: AdminEvent | null) => void;
  adminPendingEvent: AdminEvent | null;
  setAdminPendingEvent: (e: AdminEvent | null) => void;
  onSaveAdminComment: (eventId: string, comment: string) => void | Promise<void>;
  onApproveEvent: (eventId: string) => void | Promise<void>;
  onRejectEvent: (eventId: string, reason: string) => void | Promise<void>;
  onMarkEventPending: (eventId: string) => void | Promise<void>;
};

export function DashboardPageBody(p: DashboardPageBodyProps) {
  const { role, profile, section } = p;

  return (
    <div className="min-w-0 space-y-6 md:space-y-8">
      <DashboardNotificationsSection
        section={section}
        realtimeFeed={p.realtimeFeed}
        unreadCount={p.unreadNotificationsCount}
        items={p.dashboardNotificationItems}
        loading={p.notificationsLoading}
        error={p.notificationsError || null}
        onMarkRead={(id) => void p.onMarkNotificationRead(id)}
        onItemClick={p.onNotificationItemClick}
      />

      {role === "Attendee" && (
        <AttendeeEventDiscoverySection
          section={section}
          recommendations={p.recommendations}
          attendeeBrowseFiltered={p.attendeeBrowseFiltered}
          attendeeBrowsePool={p.attendeeBrowsePool}
          onOpenEventDetails={(e) => p.setAttendeeEventDetails(e)}
        />
      )}

      <DashboardProfileBasicSection section={section} profile={profile} />

      <DashboardCalendarSection
        section={section}
        role={role}
        profile={profile}
        myEvents={p.myEvents}
        adminCatalogEvents={p.adminCatalogEvents}
        approvedCatalogEvents={p.approvedCatalogEvents}
        registrations={p.registrations}
        calendarSelectedEvent={p.calendarSelectedEvent}
        setCalendarSelectedEvent={p.setCalendarSelectedEvent}
        registrationLoading={p.registrationLoading}
        registrationError={p.registrationError}
        isRegisteredForEvent={p.isRegisteredForEvent}
        onRegisterForEvent={p.onRegisterForEvent}
        onCancelRegistration={p.onCancelRegistration}
      />

      <DashboardOverviewSection
        section={section}
        role={role}
        metricTiles={p.metricTiles}
        recommendations={p.recommendations}
        registrationLoading={p.registrationLoading}
        registrationError={p.registrationError}
        isRegisteredForEvent={p.isRegisteredForEvent}
        onRegisterForEvent={p.onRegisterForEvent}
        onCancelRegistration={p.onCancelRegistration}
        organizerAnalytics={p.organizerAnalytics}
        organizerAnalyticsLoading={p.organizerAnalyticsLoading}
        organizerAnalyticsError={p.organizerAnalyticsError}
        adminSummary={p.adminSummary}
        feedbackModal={p.feedbackModal}
        setFeedbackModal={p.setFeedbackModal}
        feedbackSubmitError={p.feedbackSubmitError}
        feedbackSubmitLoading={p.feedbackSubmitLoading}
        onSubmitFeedback={p.onSubmitFeedback}
        registrations={p.registrations}
        onOpenRegistrationAsEvent={(r) => p.setAttendeeEventDetails(p.toAttendeeDetailFromRegistration(r))}
      />

      {role === "Attendee" && (
        <AttendeeProfileExtensionSection
          section={section}
          selectedInterestTags={p.selectedInterestTags}
          setSelectedInterestTags={p.setSelectedInterestTags}
          interestOtherInput={p.interestOtherInput}
          setInterestOtherInput={p.setInterestOtherInput}
          interestSaveFeedback={p.interestSaveFeedback}
          interestSaveLoading={p.interestSaveLoading}
          onSaveInterests={p.onSaveInterests}
          suggestTitle={p.suggestTitle}
          setSuggestTitle={p.setSuggestTitle}
          suggestDescription={p.suggestDescription}
          setSuggestDescription={p.setSuggestDescription}
          suggestRationale={p.suggestRationale}
          setSuggestRationale={p.setSuggestRationale}
          suggestStatus={p.suggestStatus}
          suggestLoading={p.suggestLoading}
          onSubmitSuggestion={p.onSubmitSuggestion}
          attendeeEventsWithoutFeedback={p.attendeeEventsWithoutFeedback}
          onStartFeedbackForEvent={(eventId) => p.setFeedbackModal({ eventId, rating: 5, comment: "" })}
          feedbackLoading={p.feedbackLoading}
          feedbackError={p.feedbackError}
          feedbackMine={p.feedbackMine}
          resolveEventTitle={p.resolveEventTitle}
          onEditFeedback={(f) => p.setFeedbackModal({ eventId: f.eventId, feedbackId: f.id, rating: f.rating, comment: f.comment })}
          onDeleteFeedback={p.onDeleteFeedback}
        />
      )}

      {role === "Attendee" && (
        <AttendeeEventDetailsModal
          event={p.attendeeEventDetails}
          onClose={() => p.setAttendeeEventDetails(null)}
          isRegistered={p.isRegisteredForEvent}
          registrationLoading={p.registrationLoading}
          registrationError={p.registrationError}
          onRegister={p.onRegisterForEvent}
          onCancelRegistration={p.onCancelRegistration}
        />
      )}

      {role === "Organizer" && (
        <OrganizerMyEventsSection
          section={section}
          myEvents={p.myEvents}
          searchQuery={p.dashboardSearch}
          token={p.token}
          apiBase={p.apiBase}
          onRefreshMyEvents={p.onRefreshMyEvents}
        />
      )}

      {role === "Admin" && (
        <AdminApprovalsSection
          section={section}
          adminCatalogEvents={p.adminCatalogEvents}
          dashboardSearch={p.dashboardSearch}
          adminReviewTab={p.adminReviewTab}
          setAdminReviewTab={p.setAdminReviewTab}
          adminReviewEvent={p.adminReviewEvent}
          setAdminReviewEvent={p.setAdminReviewEvent}
          adminApproveEvent={p.adminApproveEvent}
          setAdminApproveEvent={p.setAdminApproveEvent}
          adminRejectEvent={p.adminRejectEvent}
          setAdminRejectEvent={p.setAdminRejectEvent}
          adminPendingEvent={p.adminPendingEvent}
          setAdminPendingEvent={p.setAdminPendingEvent}
          onSaveAdminComment={p.onSaveAdminComment}
          onApproveEvent={p.onApproveEvent}
          onRejectEvent={p.onRejectEvent}
          onMarkEventPending={p.onMarkEventPending}
        />
      )}

      {(role === "Organizer" || role === "Admin") && (
        <OrganizerAdminSharedOverview
          section={section}
          organizerSuggestionsLoading={p.organizerSuggestionsLoading}
          organizerSuggestions={p.organizerSuggestions}
          newEvent={p.newEvent}
          setNewEvent={p.setNewEvent}
          createStatus={p.createStatus}
          onCreateEventSubmit={p.onCreateEventSubmit}
        />
      )}
    </div>
  );
}
