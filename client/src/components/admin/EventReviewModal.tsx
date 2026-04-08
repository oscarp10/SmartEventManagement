import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Users, X } from "lucide-react";
import { Button } from "../ui/button";
import type { AdminEvent } from "./AdminEventCard";

interface EventReviewModalProps {
  event: AdminEvent;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  /** Persists guidance for the organizer without changing approval state */
  onSaveAdminComment?: (comment: string) => void | Promise<void>;
}

export function EventReviewModal({ event, onClose, onApprove, onReject, onSaveAdminComment }: EventReviewModalProps) {
  const [note, setNote] = useState(event.adminComment ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNote(event.adminComment ?? "");
  }, [event.id, event.adminComment]);

  const handleSaveNote = async () => {
    if (!onSaveAdminComment) return;
    setSaving(true);
    try {
      await onSaveAdminComment(note.trim());
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-6 backdrop-blur-md">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-8 py-6">
          <h2 className="text-2xl font-semibold text-slate-900">Event Review</h2>
          <button type="button" onClick={onClose} className="text-slate-500 transition hover:text-slate-700" aria-label="Close">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6 px-8 py-6">
          <div>
            <h3 className="mb-2 text-xl font-semibold text-slate-900">{event.title}</h3>
            <p className="leading-relaxed text-slate-600">{event.description}</p>
          </div>

          <div className="grid gap-4 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-5 w-5 text-slate-500" aria-hidden />
                <div>
                  <div className="mb-1 text-sm text-slate-500">Date</div>
                  <div className="font-medium text-slate-900">{event.date}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-slate-500" aria-hidden />
                <div>
                  <div className="mb-1 text-sm text-slate-500">Time</div>
                  <div className="font-medium text-slate-900">{event.time}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-slate-500" aria-hidden />
                <div>
                  <div className="mb-1 text-sm text-slate-500">Location</div>
                  <div className="font-medium text-slate-900">{event.location}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="mt-0.5 h-5 w-5 text-slate-500" aria-hidden />
                <div>
                  <div className="mb-1 text-sm text-slate-500">Capacity</div>
                  <div className="font-medium text-slate-900">{event.capacity} attendees</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-1 text-sm text-slate-500">Organizer</div>
            <div className="font-medium text-slate-900">{event.organizerName}</div>
          </div>

          {onSaveAdminComment ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
              <label htmlFor="admin-review-note" className="mb-2 block text-sm font-semibold text-slate-800">
                Note to organizer
              </label>
              <p className="mb-2 text-xs text-slate-600">Optional. Saved without approving or rejecting — useful for requested image or copy changes.</p>
              <textarea
                id="admin-review-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                placeholder="e.g. Please use a higher-resolution hero image and confirm room capacity."
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-brand-500"
              />
              <div className="mt-3">
                <Button type="button" variant="secondary" disabled={saving} onClick={() => void handleSaveNote()}>
                  {saving ? "Saving…" : "Save admin note"}
                </Button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 px-8 py-6">
          <Button type="button" onClick={onReject} variant="secondary">
            Reject
          </Button>
          <Button type="button" onClick={onApprove}>
            Approve
          </Button>
        </div>
      </div>
    </div>
  );
}
