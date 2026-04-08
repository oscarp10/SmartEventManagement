import type { Page, PublicEvent } from "@/app-types";

export function HomeExploreDetailsModal({
  selectedEvent,
  onClose,
  onNavigateToRegister,
  isAuthenticated
}: {
  selectedEvent: PublicEvent | null;
  onClose: () => void;
  onNavigateToRegister: (page: Page) => void;
  isAuthenticated: boolean;
}) {
  if (!selectedEvent) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
        <div className="relative aspect-[16/8] bg-slate-100">
          <img src={selectedEvent.imageUrl} alt={selectedEvent.title} className="h-full w-full object-cover" />
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
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800">{selectedEvent.category}</span>
            <span className="text-sm font-semibold text-slate-700">{selectedEvent.priceLabel}</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{selectedEvent.title}</h3>
          <p className="text-sm text-slate-600">{selectedEvent.description?.trim() || "No extra description provided by organizer."}</p>
          <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
            <p><span className="font-semibold text-slate-800">Date:</span> {new Date(selectedEvent.dateTime).toLocaleString()}</p>
            <p><span className="font-semibold text-slate-800">Location:</span> {selectedEvent.location}</p>
            <p><span className="font-semibold text-slate-800">Capacity:</span> {selectedEvent.capacity ?? "Not specified"}</p>
            <p><span className="font-semibold text-slate-800">Rating:</span> {selectedEvent.rating.toFixed(1)} ({selectedEvent.reviewCount})</p>
          </div>
          {selectedEvent.tags && selectedEvent.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedEvent.tags.map((t) => (
                <span key={`${selectedEvent.id}-${t}`} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700">
                  {t}
                </span>
              ))}
            </div>
          ) : null}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigateToRegister(isAuthenticated ? "dashboard" : "login")}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              {isAuthenticated ? "Open attendee hub to register" : "Sign in to register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

