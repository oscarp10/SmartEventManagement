import { CalendarClock, CalendarDays, FileText, XCircle } from "lucide-react";
import type { AdminEvent } from "@/features/dashboard/roles/admin/components/AdminEventCard";
import { AdminEventCard } from "@/features/dashboard/roles/admin/components/AdminEventCard";
import { EventReviewModal } from "@/features/dashboard/roles/admin/components/EventReviewModal";
import { ApprovalConfirmationModal } from "@/features/dashboard/roles/admin/components/ApprovalConfirmationModal";
import { PendingConfirmationModal } from "@/features/dashboard/roles/admin/components/PendingConfirmationModal";
import { RejectionConfirmationModal } from "@/features/dashboard/roles/admin/components/RejectionConfirmationModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/features/shared/components";
import { StatMetricCard } from "@/features/dashboard/components/StatMetricCard";
import type { DashboardSection } from "@/app-types";
import { cn } from "@/features/shared";
import { catalogItemToAdminEvent } from "@/lib/catalogToAdminEvent";
import { resolveEventApprovalStatus } from "@/lib/events";
import type { EventItem } from "@/features/events/types";

export function AdminApprovalsSection({
  section,
  adminCatalogEvents,
  dashboardSearch,
  adminReviewTab,
  setAdminReviewTab,
  adminReviewEvent,
  setAdminReviewEvent,
  adminApproveEvent,
  setAdminApproveEvent,
  adminRejectEvent,
  setAdminRejectEvent,
  adminPendingEvent,
  setAdminPendingEvent,
  onSaveAdminComment,
  onApproveEvent,
  onRejectEvent,
  onMarkEventPending
}: {
  section: DashboardSection;
  adminCatalogEvents: EventItem[];
  dashboardSearch: string;
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
}) {
  if (section !== "approvals") return null;
  const getStatus = (e: EventItem) => resolveEventApprovalStatus(e);
  const source = adminCatalogEvents;
  const tabCounts = {
    pending: source.filter((e) => getStatus(e) === "pending").length,
    approved: source.filter((e) => getStatus(e) === "approved").length,
    rejected: source.filter((e) => getStatus(e) === "rejected").length
  };
  const q = dashboardSearch.trim().toLowerCase();
  const byTab = source.filter((e) => getStatus(e) === adminReviewTab);
  const filtered = byTab
    .filter((e) => {
      if (!q) return true;
      const hay = `${e.title} ${e.category} ${e.location} ${(e.tags ?? []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    })
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  return (
    <>
      <Card className="border-slate-200/80 shadow-md ring-1 ring-slate-100/80">
        <CardHeader>
          <CardTitle>Admin review console</CardTitle>
          <CardDescription>
            Review submissions by status, open details, and approve or reject with one consistent workflow.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-0">
          <section className="grid gap-4 sm:grid-cols-3">
            <StatMetricCard label="Pending review" value={String(tabCounts.pending)} icon={CalendarClock} accent="amber" />
            <StatMetricCard label="Approved" value={String(tabCounts.approved)} icon={CalendarDays} accent="brand" />
            <StatMetricCard label="Rejected" value={String(tabCounts.rejected)} icon={XCircle} accent="violet" />
          </section>

          <div className="inline-flex flex-wrap gap-1 rounded-xl border border-slate-200/90 bg-white p-1 shadow-sm ring-1 ring-slate-100/60">
            {(
              [
                ["pending", "Pending"],
                ["approved", "Approved"],
                ["rejected", "Rejected"]
              ] as const
            ).map(([tab, label]) => (
              <button
                key={tab}
                type="button"
                onClick={() => setAdminReviewTab(tab)}
                className={cn(
                  "rounded-lg px-5 py-2.5 text-sm font-medium tabular-nums transition-all duration-200",
                  adminReviewTab === tab ? "bg-brand-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
                )}
              >
                {label} ({tabCounts[tab]})
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 py-16 text-center">
              <FileText className="mx-auto h-14 w-14 text-slate-300" strokeWidth={1.25} aria-hidden />
              <h3 className="mt-4 text-lg font-semibold text-slate-700">
                {q && byTab.length > 0 ? "No matching listings" : `No ${adminReviewTab} events`}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                {q && byTab.length > 0
                  ? "Try another keyword or clear the search bar above."
                  : "There are currently no listings in this queue."}
              </p>
            </div>
          ) : (
            <div className="max-h-[min(560px,calc(100vh-22rem))] overflow-y-auto pr-1">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((e) => {
                  const ev = catalogItemToAdminEvent(e);
                  return (
                    <AdminEventCard
                      key={ev.id}
                      event={ev}
                      onReview={(item) => setAdminReviewEvent(item)}
                      onMarkAsPending={(item) => setAdminPendingEvent(item)}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {adminReviewEvent && (
        <EventReviewModal
          event={adminReviewEvent}
          onClose={() => setAdminReviewEvent(null)}
          onSaveAdminComment={(comment) => onSaveAdminComment(adminReviewEvent.id, comment)}
          onApprove={() => {
            setAdminApproveEvent(adminReviewEvent);
            setAdminReviewEvent(null);
          }}
          onReject={() => {
            setAdminRejectEvent(adminReviewEvent);
            setAdminReviewEvent(null);
          }}
        />
      )}

      {adminApproveEvent && (
        <ApprovalConfirmationModal
          onCancel={() => setAdminApproveEvent(null)}
          onConfirm={() => {
            void (async () => {
              await onApproveEvent(adminApproveEvent.id);
              setAdminApproveEvent(null);
            })();
          }}
        />
      )}

      {adminRejectEvent && (
        <RejectionConfirmationModal
          onCancel={() => setAdminRejectEvent(null)}
          onConfirm={(reason) => {
            void (async () => {
              await onRejectEvent(adminRejectEvent.id, reason);
              setAdminRejectEvent(null);
            })();
          }}
        />
      )}

      {adminPendingEvent && (
        <PendingConfirmationModal
          onCancel={() => setAdminPendingEvent(null)}
          onConfirm={() => {
            void (async () => {
              await onMarkEventPending(adminPendingEvent.id);
              setAdminPendingEvent(null);
            })();
          }}
        />
      )}
    </>
  );
}
