import type { Dispatch, SetStateAction } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarDays, MapPin } from "lucide-react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/features/shared/components";
import { StatMetricCard } from "@/features/dashboard/components/StatMetricCard";
import type { DashboardSection, Role } from "@/app-types";
import type { EventItem, RegistrationDto } from "@/features/events/types";
import type { OrganizerAnalyticsResponse } from "@/features/dashboard/types";
import { ANALYTICS_DATA } from "@/config/site";
import type { MetricTile } from "@/features/dashboard/pages/shared/types";
import { AttendeeOverviewRegistrationsSection } from "@/features/dashboard/roles/attendee/AttendeeDashboardSections";

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
            <CardTitle>{role === "Attendee" ? "AI-powered recommendations" : role === "Organizer" ? "Organizer analytics" : "Platform snapshot"}</CardTitle>
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
                          <Button variant="secondary" size="sm" disabled={registrationLoading} onClick={() => void onCancelRegistration(event.id)}>
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
                {registrationError && <p className="md:col-span-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{registrationError}</p>}
              </div>
            ) : role === "Organizer" ? (
              <div className="space-y-4">
                {organizerAnalyticsError && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{organizerAnalyticsError}</p>}
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
                        <div key={m.k} className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm ring-1 ring-slate-100/80">
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
              <h3 className="text-lg font-semibold text-slate-900">{feedbackModal.feedbackId ? "Update feedback" : "Leave feedback"}</h3>
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
              {feedbackSubmitError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{feedbackSubmitError}</p>}
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

