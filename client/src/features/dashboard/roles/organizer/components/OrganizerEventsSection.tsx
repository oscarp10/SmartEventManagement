import { useMemo, useState } from "react";
import {
  CalendarDays,
  Lock,
  LockOpen,
  MapPin,
  MessageSquareText,
  Pencil,
  Star,
  X
} from "lucide-react";
import { Button } from "@/features/shared/components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/features/shared/components";
import { useOrganizerEventActions } from "@/features/dashboard/roles/organizer/hooks/useOrganizerEventActions";

/** Mirrors App `EventItem` fields used here */
export type OrganizerEventItem = {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  priceLabel: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  attendeeCount: number;
  category: string;
  capacity: number;
  isApproved: boolean;
  approvalStatus?: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  adminComment?: string;
  registrationsOpen?: boolean;
  organizerId: string;
  tags: string[];
};

type FeedbackApiRow = {
  id: string;
  eventId: string;
  attendeeId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function isPastEvent(e: OrganizerEventItem): boolean {
  return new Date(e.dateTime).getTime() < Date.now();
}

function isUpcomingEvent(e: OrganizerEventItem): boolean {
  return new Date(e.dateTime).getTime() >= Date.now();
}

export function OrganizerEventsSection({
  myEvents,
  searchQuery = "",
  token,
  apiBase: _apiBase,
  getApprovalStatus,
  onRefreshMyEvents
}: {
  myEvents: OrganizerEventItem[];
  /** Top-bar dashboard search; filters the grid without changing tab counts. */
  searchQuery?: string;
  token: string;
  apiBase: string;
  getApprovalStatus: (e: OrganizerEventItem) => "pending" | "approved" | "rejected";
  onRefreshMyEvents: () => Promise<void>;
}) {
  void _apiBase;
  const [timeScope, setTimeScope] = useState<"all" | "upcoming" | "past">("all");
  const [approvalScope, setApprovalScope] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [editing, setEditing] = useState<OrganizerEventItem | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    dateTime: "",
    location: "",
    priceLabel: "Free",
    imageUrl: "",
    category: "General",
    capacity: "100",
    tags: "general",
    rating: "4.5",
    reviewCount: "0",
    attendeeCount: "0"
  });
  const [editStatus, setEditStatus] = useState("");
  const [feedbackFor, setFeedbackFor] = useState<OrganizerEventItem | null>(null);
  const [feedbackRows, setFeedbackRows] = useState<FeedbackApiRow[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);

  const timeCounts = useMemo(
    () => ({
      all: myEvents.length,
      upcoming: myEvents.filter((e) => isUpcomingEvent(e)).length,
      past: myEvents.filter((e) => isPastEvent(e)).length
    }),
    [myEvents]
  );

  const approvalCounts = useMemo(() => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;
    for (const e of myEvents) {
      const a = getApprovalStatus(e);
      if (a === "pending") pending += 1;
      else if (a === "approved") approved += 1;
      else rejected += 1;
    }
    return { all: myEvents.length, pending, approved, rejected };
  }, [myEvents, getApprovalStatus]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return myEvents.filter((e) => {
      const a = getApprovalStatus(e);
      if (approvalScope !== "all" && a !== approvalScope) return false;
      if (timeScope === "upcoming" && !isUpcomingEvent(e)) return false;
      if (timeScope === "past" && !isPastEvent(e)) return false;
      if (q) {
        const hay = `${e.title} ${e.category} ${e.location} ${e.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [myEvents, timeScope, approvalScope, getApprovalStatus, searchQuery]);

  const openEdit = (e: OrganizerEventItem) => {
    setEditing(e);
    setEditStatus("");
    setEditForm({
      title: e.title,
      description: e.description,
      dateTime: toDatetimeLocalValue(e.dateTime),
      location: e.location,
      priceLabel: e.priceLabel,
      imageUrl: e.imageUrl,
      category: e.category,
      capacity: String(e.capacity),
      tags: e.tags.join(", "),
      rating: String(e.rating),
      reviewCount: String(e.reviewCount),
      attendeeCount: String(e.attendeeCount)
    });
  };

  const { submitEdit, toggleRegistrations, loadFeedback } = useOrganizerEventActions({
    token,
    onRefreshMyEvents,
    setEditStatus,
    setActionBusyId,
    setFeedbackRows,
    setFeedbackLoading,
    setFeedbackFor
  });

  const regOpen = (e: OrganizerEventItem) => e.registrationsOpen !== false;

  return (
    <>
      <Card className="overflow-hidden border-slate-200/80 bg-white shadow-md ring-1 ring-slate-100/80">
        <CardHeader>
          <CardTitle>Your listings</CardTitle>
          <CardDescription>
            Filter by schedule and approval state, edit details (including images), respond to admin notes, close bookings when full, and read
            attendee feedback after events.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">When</p>
            <div className="flex flex-wrap gap-1 rounded-xl border border-slate-200/90 bg-slate-50/80 p-1">
              {(
                [
                  ["all", "All dates", timeCounts.all],
                  ["upcoming", "Upcoming", timeCounts.upcoming],
                  ["past", "Past / completed", timeCounts.past]
                ] as const
              ).map(([key, label, count]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTimeScope(key)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium tabular-nums transition ${
                    timeScope === key ? "bg-brand-600 text-white shadow-sm" : "text-slate-600 hover:bg-white"
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Approval</p>
            <div className="flex flex-wrap gap-1 rounded-xl border border-slate-200/90 bg-white p-1 shadow-sm">
              {(
                [
                  ["all", "All", approvalCounts.all],
                  ["pending", "Pending", approvalCounts.pending],
                  ["approved", "Approved", approvalCounts.approved],
                  ["rejected", "Rejected", approvalCounts.rejected]
                ] as const
              ).map(([key, label, count]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setApprovalScope(key)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium tabular-nums transition sm:px-4 ${
                    approvalScope === key ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 py-10 text-center text-sm text-slate-600">
              {searchQuery.trim()
                ? "No listings match your search. Try another keyword or clear the bar above."
                : "No events match these filters."}
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((e) => {
                const a = getApprovalStatus(e);
                const badge =
                  a === "approved"
                    ? "bg-emerald-100 text-emerald-800 ring-emerald-200"
                    : a === "rejected"
                      ? "bg-red-100 text-red-800 ring-red-200"
                      : "bg-amber-100 text-amber-900 ring-amber-200";
                const past = isPastEvent(e);
                return (
                  <article
                    key={e.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-100/80 transition hover:border-brand-200/80 hover:shadow-md"
                  >
                    <div className="relative aspect-[16/10] bg-slate-100">
                      <img src={e.imageUrl} alt="" className="h-full w-full object-cover" />
                      <span className={`absolute left-3 top-3 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${badge}`}>
                        {a}
                      </span>
                      {!regOpen(e) ? (
                        <span className="absolute right-3 top-3 rounded-md bg-slate-900/85 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                          Bookings closed
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <h3 className="line-clamp-2 font-semibold text-slate-900">{e.title}</h3>
                      <p className="flex items-center gap-1.5 text-xs text-slate-600">
                        <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        <span className="truncate">{e.location}</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-slate-600">
                        <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        {new Date(e.dateTime).toLocaleString()}
                      </p>
                      {e.adminComment ? (
                        <div className="rounded-lg border border-brand-200/80 bg-brand-50/90 px-3 py-2 text-xs text-brand-950">
                          <span className="font-semibold">Admin note: </span>
                          {e.adminComment}
                        </div>
                      ) : null}
                      {a === "rejected" && e.rejectionReason ? (
                        <div className="rounded-lg border border-red-200 bg-red-50/90 px-3 py-2 text-xs text-red-900">
                          <span className="font-semibold">Rejection: </span>
                          {e.rejectionReason}
                        </div>
                      ) : null}
                      <div className="mt-auto flex flex-wrap gap-2 pt-2">
                        <Button type="button" variant="secondary" size="sm" className="h-8 gap-1 text-xs" onClick={() => openEdit(e)}>
                          <Pencil className="h-3.5 w-3.5" aria-hidden />
                          Edit
                        </Button>
                        {a === "approved" && !past ? (
                          regOpen(e) ? (
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              className="h-8 gap-1 text-xs"
                              disabled={actionBusyId === e.id}
                              onClick={() => void toggleRegistrations(e, false)}
                            >
                              <Lock className="h-3.5 w-3.5" aria-hidden />
                              Close bookings
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              className="h-8 gap-1 text-xs"
                              disabled={actionBusyId === e.id}
                              onClick={() => void toggleRegistrations(e, true)}
                            >
                              <LockOpen className="h-3.5 w-3.5" aria-hidden />
                              Open bookings
                            </Button>
                          )
                        ) : null}
                        {past && a === "approved" ? (
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="h-8 gap-1 text-xs"
                            onClick={() => void loadFeedback(e)}
                          >
                            <MessageSquareText className="h-3.5 w-3.5" aria-hidden />
                            Feedback
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {editing ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Edit event</h2>
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form
              onSubmit={(ev) => {
                void (async () => {
                  const result = await submitEdit(ev, editing, editForm);
                  if (result?.ok) setEditing(null);
                })();
              }}
              className="grid gap-3 bg-slate-50/60 p-6 md:grid-cols-2"
            >
              <input
                value={editForm.title}
                onChange={(x) => setEditForm((p) => ({ ...p, title: x.target.value }))}
                required
                placeholder="Title"
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm md:col-span-2"
              />
              <input
                value={editForm.location}
                onChange={(x) => setEditForm((p) => ({ ...p, location: x.target.value }))}
                required
                placeholder="Location"
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              />
              <input
                type="datetime-local"
                value={editForm.dateTime}
                onChange={(x) => setEditForm((p) => ({ ...p, dateTime: x.target.value }))}
                required
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              />
              <input
                value={editForm.category}
                onChange={(x) => setEditForm((p) => ({ ...p, category: x.target.value }))}
                required
                placeholder="Category"
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              />
              <input
                value={editForm.priceLabel}
                onChange={(x) => setEditForm((p) => ({ ...p, priceLabel: x.target.value }))}
                placeholder="Price"
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              />
              <input
                value={editForm.capacity}
                onChange={(x) => setEditForm((p) => ({ ...p, capacity: x.target.value }))}
                type="number"
                min={1}
                required
                placeholder="Capacity"
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              />
              <input
                value={editForm.imageUrl}
                onChange={(x) => setEditForm((p) => ({ ...p, imageUrl: x.target.value }))}
                required
                placeholder="Image URL"
                className="md:col-span-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              />
              <label className="md:col-span-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600">
                <span className="mb-1 block text-xs font-medium text-slate-500">Or upload a local image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(ev) => {
                    const f = ev.target.files?.[0];
                    if (!f) return;
                    const r = new FileReader();
                    r.onload = () => {
                      if (typeof r.result === "string") setEditForm((p) => ({ ...p, imageUrl: r.result as string }));
                    };
                    r.readAsDataURL(f);
                  }}
                  className="w-full text-sm"
                />
              </label>
              <textarea
                value={editForm.description}
                onChange={(x) => setEditForm((p) => ({ ...p, description: x.target.value }))}
                required
                placeholder="Description"
                className="md:col-span-2 min-h-24 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              />
              <input
                value={editForm.tags}
                onChange={(x) => setEditForm((p) => ({ ...p, tags: x.target.value }))}
                placeholder="Tags, comma separated"
                className="md:col-span-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              />
              <div className="grid grid-cols-3 gap-2 md:col-span-2">
                <input
                  value={editForm.rating}
                  onChange={(x) => setEditForm((p) => ({ ...p, rating: x.target.value }))}
                  type="number"
                  step="0.1"
                  className="rounded-xl border border-slate-300 bg-white px-2 py-2 text-sm"
                />
                <input
                  value={editForm.reviewCount}
                  onChange={(x) => setEditForm((p) => ({ ...p, reviewCount: x.target.value }))}
                  type="number"
                  className="rounded-xl border border-slate-300 bg-white px-2 py-2 text-sm"
                />
                <input
                  value={editForm.attendeeCount}
                  onChange={(x) => setEditForm((p) => ({ ...p, attendeeCount: x.target.value }))}
                  type="number"
                  className="rounded-xl border border-slate-300 bg-white px-2 py-2 text-sm"
                />
              </div>
              {editStatus ? <p className="md:col-span-2 text-sm text-red-600">{editStatus}</p> : null}
              <div className="flex justify-end gap-2 md:col-span-2">
                <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
                <Button type="submit">Save changes</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {feedbackFor ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="pr-4 font-semibold text-slate-900">Feedback · {feedbackFor.title}</h2>
              <button
                type="button"
                onClick={() => setFeedbackFor(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              {feedbackLoading ? (
                <p className="text-sm text-slate-600">Loading…</p>
              ) : feedbackRows.length === 0 ? (
                <p className="text-sm text-slate-600">No feedback submitted for this event yet.</p>
              ) : (
                <ul className="space-y-4">
                  {feedbackRows.map((f) => (
                    <li key={f.id} className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
                        {f.rating}/5
                        <span className="text-xs font-normal text-slate-500">{new Date(f.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-700">{f.comment}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
