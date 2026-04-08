import { Button } from "@/features/shared/components";
import type { EventItem } from "@/features/events/types";

export function AttendeeEventDetailsModal({
  event,
  onClose,
  isRegistered,
  registrationLoading,
  registrationError,
  onRegister,
  onCancelRegistration
}: {
  event: EventItem | null;
  onClose: () => void;
  isRegistered: (eventId: string) => boolean;
  registrationLoading: boolean;
  registrationError: string;
  onRegister: (eventId: string) => void | Promise<void>;
  onCancelRegistration: (eventId: string) => void | Promise<void>;
}) {
  if (!event) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
        <div className="relative aspect-[16/8] bg-slate-100">
          <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm"
          >
            Close
          </button>
        </div>
        <div className="space-y-4 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800">{event.category}</span>
            <span className="text-sm font-semibold text-slate-700">{event.priceLabel}</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{event.title}</h3>
          <p className="text-sm text-slate-600">{event.description?.trim() || "No additional description provided by organizer."}</p>
          <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
            <p>
              <span className="font-semibold text-slate-800">Date:</span> {new Date(event.dateTime).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold text-slate-800">Location:</span> {event.location}
            </p>
            <p>
              <span className="font-semibold text-slate-800">Capacity:</span> {event.capacity || "Not specified"}
            </p>
          </div>
          {event.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {event.tags.map((t) => (
                <span key={`${event.id}-${t}`} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700">
                  {t}
                </span>
              ))}
            </div>
          ) : null}
          <div className="pt-2">
            {isRegistered(event.id) ? (
              <Button variant="secondary" disabled={registrationLoading} onClick={() => void onCancelRegistration(event.id)}>
                {registrationLoading ? "Please wait…" : "Withdraw registration"}
              </Button>
            ) : (
              <Button disabled={registrationLoading} onClick={() => void onRegister(event.id)}>
                {registrationLoading ? "Please wait…" : "Register for this event"}
              </Button>
            )}
          </div>
          {registrationError ? <p className="text-sm text-red-600">{registrationError}</p> : null}
        </div>
      </div>
    </div>
  );
}

