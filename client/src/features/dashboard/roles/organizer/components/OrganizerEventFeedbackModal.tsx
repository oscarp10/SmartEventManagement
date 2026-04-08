import { Star, X } from "lucide-react";
import type { FeedbackApiRow, OrganizerEventItem } from "@/features/dashboard/roles/organizer/components/OrganizerEventsTypes";

export function OrganizerEventFeedbackModal({
  feedbackFor,
  feedbackRows,
  feedbackLoading,
  onClose
}: {
  feedbackFor: OrganizerEventItem | null;
  feedbackRows: FeedbackApiRow[];
  feedbackLoading: boolean;
  onClose: () => void;
}) {
  if (!feedbackFor) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="pr-4 font-semibold text-slate-900">Feedback · {feedbackFor.title}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close">
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
  );
}

