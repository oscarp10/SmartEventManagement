import type { Dispatch, SetStateAction } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { StatMetricCard, type StatAccent } from "../../components/dashboard/StatMetricCard";
import { DashboardMonthCalendar } from "../../components/dashboard/DashboardMonthCalendar";
import { NotificationsPanel, type DashboardNotificationItem } from "../../components/dashboard/NotificationsPanel";
import type { DashboardSection, Role } from "../../app-types";
import type { LucideIcon } from "lucide-react";
import type { AuthProfile, EventItem, OrganizerAnalyticsResponse } from "../../types/app-models";
import type { RegistrationDto } from "../../types/app-models";
import { ANALYTICS_DATA } from "../../config/site";
import { eventMatchesProfileInterests } from "../../lib/events";
import { AttendeeOverviewRegistrationsSection } from "./attendee/AttendeeDashboardSections";

export type MetricTile = {
  label: string;
  value: string;
  icon: LucideIcon;
  accent: StatAccent;
};

export function DashboardNotificationsSection({
  section,
  realtimeFeed,
  unreadCount,
  items,
  loading,
  error,
  onMarkRead,
  onItemClick
}: {
  section: DashboardSection;
  realtimeFeed: string[];
  unreadCount: number;
  items: DashboardNotificationItem[];
  loading: boolean;
  error: string | null;
  onMarkRead: (id: string) => void;
  onItemClick: (item: DashboardNotificationItem) => void;
}) {
  if (section !== "notifications") return null;
  return (
    <NotificationsPanel
      activityLines={realtimeFeed}
      unreadCount={unreadCount}
      items={items}
      loading={loading}
      error={error}
      onMarkRead={onMarkRead}
      onItemClick={onItemClick}
      className="border-slate-200/80 shadow-md ring-1 ring-slate-100/80"
    />
  );
}

export function DashboardProfileBasicSection({
  section,
  profile
}: {
  section: DashboardSection;
  profile: AuthProfile;
}) {
  if (section !== "profile") return null;
  return (
    <Card className="border-slate-200/80 shadow-md ring-1 ring-slate-100/80">
      <CardHeader>
        <CardTitle>Your account</CardTitle>
        <CardDescription>Signed-in profile used for EventHub roles and recommendations.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 pt-0 text-sm text-slate-700">
        <p>
          <span className="font-semibold text-slate-900">Name:</span> {profile.fullName}
        </p>
        <p>
          <span className="font-semibold text-slate-900">Email:</span> {profile.email}
        </p>
        <p>
          <span className="font-semibold text-slate-900">Role:</span> {profile.role}
        </p>
      </CardContent>
    </Card>
  );
}

export function DashboardCalendarSection({
  section,
  role,
  profile,
  myEvents,
  adminCatalogEvents,
  approvedCatalogEvents,
  registrations,
  calendarSelectedEvent,
  setCalendarSelectedEvent,
  registrationLoading,
  registrationError,
  isRegisteredForEvent,
  onRegisterForEvent,
  onCancelRegistration
}: {
  section: DashboardSection;
  role: Role;
  profile: AuthProfile;
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
}) {
  if (section !== "calendar") return null;

  const getCalendarItems = (): { items: EventItem[]; enrolledIds: Set<string> } => {
    if (role === "Organizer") {
      return { items: myEvents, enrolledIds: new Set() };
    }
    if (role === "Admin") {
      const items = adminCatalogEvents.slice().sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
      return { items, enrolledIds: new Set() };
    }
    const interests = profile.interests ?? [];
    const approvedPool = approvedCatalogEvents;
    const enrolledIds = new Set(registrations.filter((r) => r.status.toLowerCase() !== "cancelled").map((r) => r.eventId));
    const byId = new Map<string, EventItem>();
    for (const e of approvedPool) {
      if (enrolledIds.has(e.id)) byId.set(e.id, e);
    }
    for (const e of approvedPool) {
      if (!enrolledIds.has(e.id) && eventMatchesProfileInterests(e, interests)) byId.set(e.id, e);
    }
    const items = Array.from(byId.values()).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    return { items, enrolledIds };
  };

  const { items: calEvents, enrolledIds } = getCalendarItems();

  return (
    <Card className="overflow-hidden border-slate-200/80 shadow-md ring-1 ring-slate-100/80">
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
        <CardDescription>
          {role === "Attendee"
            ? "Registered sessions plus approved listings that match your profile interests."
            : role === "Organizer"
              ? "Your events on a monthly grid — click a listing for details."
              : "Full catalogue timeline, including items awaiting approval or rejected."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {calEvents.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 py-10 text-center text-sm text-slate-600">
            {role === "Attendee"
              ? "No registered or interest-matched events yet — browse the home page and update your interests."
              : "Nothing to show on the calendar yet."}
          </p>
        ) : (
          <>
            {role === "Attendee" ? (
              <p className="text-xs text-slate-500">
                <span className="font-medium text-slate-700">Brand chips</span> are confirmed registrations.{" "}
                <span className="font-medium text-violet-800">Soft violet</span> listings match your interests (you can register from the overview).
              </p>
            ) : null}
            <DashboardMonthCalendar
              events={calEvents.map((e) => ({
                id: e.id,
                title: e.title,
                dateTime: e.dateTime,
                highlight: role === "Attendee" ? (enrolledIds.has(e.id) ? "enrolled" : "interest") : "default"
              }))}
              onEventClick={(ce) => {
                const full = calEvents.find((x) => x.id === ce.id);
                if (full) setCalendarSelectedEvent(full);
              }}
            />
            {calendarSelectedEvent ? (
              <Card className="border-slate-200/80 bg-slate-50/30 shadow-sm ring-1 ring-slate-100/80">
                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <CardTitle className="text-lg">{calendarSelectedEvent.title}</CardTitle>
                    <CardDescription className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" aria-hidden />
                        {new Date(calendarSelectedEvent.dateTime).toLocaleString()}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" aria-hidden />
                        {calendarSelectedEvent.location}
                      </span>
                      <span className="text-slate-600">{calendarSelectedEvent.category}</span>
                    </CardDescription>
                  </div>
                  <Button type="button" variant="secondary" size="sm" onClick={() => setCalendarSelectedEvent(null)}>
                    Close
                  </Button>
                </CardHeader>
                {role === "Attendee" ? (
                  <CardContent className="pt-0">
                    {isRegisteredForEvent(calendarSelectedEvent.id) ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={registrationLoading}
                        onClick={() => void onCancelRegistration(calendarSelectedEvent.id)}
                      >
                        {registrationLoading ? "Please wait…" : "Cancel registration"}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        disabled={registrationLoading}
                        onClick={() => void onRegisterForEvent(calendarSelectedEvent.id)}
                      >
                        {registrationLoading ? "Please wait…" : "Register for this event"}
                      </Button>
                    )}
                    {registrationError ? <p className="mt-2 text-sm text-red-600">{registrationError}</p> : null}
                  </CardContent>
                ) : null}
              </Card>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardOverviewSection({
  section,
  role,
  metricTiles,
  recommendations,
  registrationLoading,
  registrationError,
  isRegisteredForEvent,
  onRegisterForEvent,
  onCancelRegistration,
  organizerAnalytics,
  organizerAnalyticsLoading,
  organizerAnalyticsError,
  adminSummary,
  feedbackModal,
  setFeedbackModal,
  feedbackSubmitError,
  feedbackSubmitLoading,
  onSubmitFeedback,
  registrations,
  onOpenRegistrationAsEvent
}: {
  section: DashboardSection;
  role: Role;
  metricTiles: MetricTile[];
  recommendations: EventItem[];
  registrationLoading: boolean;
  registrationError: string;
  isRegisteredForEvent: (eventId: string) => boolean;
  onRegisterForEvent: (eventId: string) => void | Promise<void>;
  onCancelRegistration: (eventId: string) => void | Promise<void>;
  organizerAnalytics: OrganizerAnalyticsResponse | null;
  organizerAnalyticsLoading: boolean;
  organizerAnalyticsError: string;
  adminSummary: { pending: number; approved: number; rejected: number; total: number };
  feedbackModal: { eventId: string; feedbackId?: string; rating: number; comment: string } | null;
  setFeedbackModal: Dispatch<SetStateAction<{ eventId: string; feedbackId?: string; rating: number; comment: string } | null>>;
  feedbackSubmitError: string;
  feedbackSubmitLoading: boolean;
  onSubmitFeedback: () => void | Promise<void>;
  registrations: RegistrationDto[];
  onOpenRegistrationAsEvent: (r: RegistrationDto) => void;
}) {
  if (section !== "overview") return null;

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricTiles.map((m) => (
          <StatMetricCard key={m.label} label={m.label} value={m.value} icon={m.icon} accent={m.accent} />
        ))}
      </section>
      <section className="grid gap-6">
        <Card className="border-slate-200/80 shadow-md ring-1 ring-slate-100/80">
          <CardHeader>
            <CardTitle>
              {role === "Attendee" ? "AI-powered recommendations" : role === "Organizer" ? "Organizer analytics" : "Platform snapshot"}
            </CardTitle>
            <CardDescription>
              {role === "Attendee"
                ? "Personalized suggestions from EventHub: your interest tags, event keywords, and categories you have attended before are scored together—open the bell for live hub activity too."
                : role === "Organizer"
                  ? "Registration momentum and ratings for your approved listings."
                  : "System-wide event approvals and workflow health for admin review."}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {role === "Attendee" ? (
              <div className="grid gap-3 md:grid-cols-2">
                {recommendations.map((event) => {
                  const registered = isRegisteredForEvent(event.id);
                  return (
                    <article
                      key={event.id}
                      className="flex flex-col rounded-xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/40 p-4 shadow-sm ring-1 ring-slate-100/80 transition hover:border-brand-200/90 hover:shadow-md"
                    >
                      <p className="font-semibold text-slate-900">{event.title}</p>
                      <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-600">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
                        {event.location}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
                        <CalendarDays className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
                        {new Date(event.dateTime).toLocaleDateString()}
                      </p>
                      <div className="mt-auto pt-4">
                        {registered ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled={registrationLoading}
                            onClick={() => void onCancelRegistration(event.id)}
                          >
                            {registrationLoading ? "Please wait..." : "Cancel"}
                          </Button>
                        ) : (
                          <Button size="sm" disabled={registrationLoading} onClick={() => void onRegisterForEvent(event.id)}>
                            {registrationLoading ? "Please wait..." : "Register"}
                          </Button>
                        )}
                      </div>
                    </article>
                  );
                })}
                <p className="md:col-span-2 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2 text-sm text-slate-600">
                  After you attend, manage ratings under <span className="font-medium text-slate-800">Profile</span> → Your feedback.
                </p>
                {registrationError && (
                  <p className="md:col-span-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{registrationError}</p>
                )}
              </div>
            ) : role === "Organizer" ? (
              <div className="space-y-4">
                {organizerAnalyticsError && (
                  <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{organizerAnalyticsError}</p>
                )}
                {organizerAnalyticsLoading ? (
                  <p className="text-sm text-slate-600">Loading analytics…</p>
                ) : organizerAnalytics ? (
                  <>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        { k: "Registrations", v: `${organizerAnalytics.totals.totalRegistrations}` },
                        { k: "Avg rating", v: `${organizerAnalytics.totals.averageRating.toFixed(2)}` },
                        { k: "Approved", v: `${organizerAnalytics.totals.approvedEvents}` }
                      ].map((m) => (
                        <div
                          key={m.k}
                          className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm ring-1 ring-slate-100/80"
                        >
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{m.k}</p>
                          <p className="mt-2 text-2xl font-bold text-slate-900">{m.v}</p>
                        </div>
                      ))}
                    </div>

                    <div className="h-56 rounded-2xl border border-slate-200/80 bg-slate-50/90 p-4 shadow-inner ring-1 ring-slate-100/80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={
                            organizerAnalytics.byMonth.length > 0
                              ? organizerAnalytics.byMonth.map((x) => ({
                                  month: `${x.year}-${String(x.month).padStart(2, "0")}`,
                                  registrations: x.registrations
                                }))
                              : ANALYTICS_DATA.map((x) => ({ month: x.month, registrations: x.attendance }))
                          }
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="month" stroke="#475569" fontSize={12} />
                          <YAxis stroke="#475569" fontSize={12} />
                          <Tooltip />
                          <Bar dataKey="registrations" fill="#0066cc" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-600">No analytics data yet.</p>
                )}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { k: "Pending", v: String(adminSummary.pending) },
                  { k: "Approved", v: String(adminSummary.approved) },
                  { k: "Rejected", v: String(adminSummary.rejected) },
                  { k: "Total", v: String(adminSummary.total) }
                ].map((m) => (
                  <div key={m.k} className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm ring-1 ring-slate-100/80">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{m.k}</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{m.v}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {feedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-slate-900">
                {feedbackModal.feedbackId ? "Update feedback" : "Leave feedback"}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {feedbackModal.feedbackId ? "Change your rating or comment." : "Rate the event and share a short comment."}
              </p>
            </div>
            <div className="space-y-4 px-6 py-5">
              <div>
                <label className="block text-sm font-medium text-slate-700">Rating (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={feedbackModal.rating}
                  onChange={(e) => setFeedbackModal((p) => (p ? { ...p, rating: Number(e.target.value) } : p))}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Comment</label>
                <textarea
                  rows={4}
                  value={feedbackModal.comment}
                  onChange={(e) => setFeedbackModal((p) => (p ? { ...p, comment: e.target.value } : p))}
                  className="mt-1 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500"
                />
              </div>
              {feedbackSubmitError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{feedbackSubmitError}</p>
              )}
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <Button variant="secondary" onClick={() => setFeedbackModal(null)} disabled={feedbackSubmitLoading}>
                Cancel
              </Button>
              <Button onClick={() => void onSubmitFeedback()} disabled={feedbackSubmitLoading}>
                {feedbackSubmitLoading ? "Saving..." : feedbackModal.feedbackId ? "Save changes" : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <AttendeeOverviewRegistrationsSection
        section={section}
        registrations={registrations}
        registrationLoading={registrationLoading}
        registrationError={registrationError}
        onOpenRegistrationAsEvent={onOpenRegistrationAsEvent}
      />
    </>
  );
}
