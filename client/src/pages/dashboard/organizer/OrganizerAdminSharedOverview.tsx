import type { Dispatch, FormEvent, SetStateAction } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import type { DashboardSection } from "../../../app-types";

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

export function OrganizerAdminSharedOverview({
  section,
  organizerSuggestionsLoading,
  organizerSuggestions,
  newEvent,
  setNewEvent,
  createStatus,
  onCreateEventSubmit
}: {
  section: DashboardSection;
  organizerSuggestionsLoading: boolean;
  organizerSuggestions: SuggestionItem[];
  newEvent: NewEventDraft;
  setNewEvent: Dispatch<SetStateAction<NewEventDraft>>;
  createStatus: string;
  onCreateEventSubmit: (e: FormEvent<HTMLFormElement>) => void | Promise<void>;
}) {
  if (section !== "overview") return null;
  return (
    <>
      <Card className="border-slate-200/80 shadow-md ring-1 ring-slate-100/80">
        <CardHeader>
          <CardTitle>Ideas from attendees</CardTitle>
          <CardDescription>
            Event concepts attendees recommend for the calendar—review titles and rationale before planning.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {organizerSuggestionsLoading ? (
            <p className="mt-2 text-sm text-slate-600">Loading suggestions…</p>
          ) : organizerSuggestions.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 py-8 text-center text-sm text-slate-600">
              No suggestions yet. Attendees can send ideas from their hub.
            </p>
          ) : (
            <ul className="mt-2 space-y-3">
              {organizerSuggestions.map((s) => (
                <li
                  key={String(s.id)}
                  className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm ring-1 ring-slate-100/80"
                >
                  <p className="font-semibold text-slate-900">{s.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{s.description}</p>
                  {s.rationale ? <p className="mt-2 text-sm italic text-slate-500">Why: {s.rationale}</p> : null}
                  <p className="mt-2 text-xs text-slate-400">
                    {s.attendeeName} · {new Date(s.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card id="create-event-form" className="scroll-mt-24 border-slate-200/80 shadow-md ring-1 ring-slate-100/80">
        <CardHeader>
          <CardTitle>Create visual event card</CardTitle>
          <CardDescription>Add title, image, price, and metadata so your event appears in the public catalogue.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form
            onSubmit={(e) => void onCreateEventSubmit(e)}
            className="grid gap-4 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 sm:p-4 md:grid-cols-2"
          >
            <input
              value={newEvent.title}
              onChange={(e) => setNewEvent((p) => ({ ...p, title: e.target.value }))}
              placeholder="Event title"
              required
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500"
            />
            <input
              value={newEvent.location}
              onChange={(e) => setNewEvent((p) => ({ ...p, location: e.target.value }))}
              placeholder="Location"
              required
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500"
            />
            <input
              type="datetime-local"
              value={newEvent.dateTime}
              onChange={(e) => setNewEvent((p) => ({ ...p, dateTime: e.target.value }))}
              required
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500"
            />
            <input
              value={newEvent.category}
              onChange={(e) => setNewEvent((p) => ({ ...p, category: e.target.value }))}
              placeholder="Category"
              required
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500"
            />
            <input
              value={newEvent.priceLabel}
              onChange={(e) => setNewEvent((p) => ({ ...p, priceLabel: e.target.value }))}
              placeholder="Price label"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500"
            />
            <input
              value={newEvent.capacity}
              onChange={(e) => setNewEvent((p) => ({ ...p, capacity: e.target.value }))}
              placeholder="Capacity"
              type="number"
              min={1}
              required
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500"
            />
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Event image</label>
              <p className="text-xs text-slate-600">
                Paste an image URL or upload a file from your device (stored as data in the listing).
              </p>
              <input
                value={newEvent.imageUrl}
                onChange={(e) => setNewEvent((p) => ({ ...p, imageUrl: e.target.value }))}
                placeholder="https://… or use upload below"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const r = new FileReader();
                  r.onload = () => {
                    if (typeof r.result === "string") setNewEvent((p) => ({ ...p, imageUrl: r.result as string }));
                  };
                  r.readAsDataURL(f);
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500"
              />
            </div>
            <textarea
              value={newEvent.description}
              onChange={(e) => setNewEvent((p) => ({ ...p, description: e.target.value }))}
              placeholder="Description"
              required
              className="md:col-span-2 min-h-28 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500"
            />
            <input
              value={newEvent.tags}
              onChange={(e) => setNewEvent((p) => ({ ...p, tags: e.target.value }))}
              placeholder="Tags (comma separated)"
              className="md:col-span-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500"
            />
            <div className="grid grid-cols-3 gap-3 md:col-span-2">
              <input
                value={newEvent.rating}
                onChange={(e) => setNewEvent((p) => ({ ...p, rating: e.target.value }))}
                placeholder="Rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500"
              />
              <input
                value={newEvent.reviewCount}
                onChange={(e) => setNewEvent((p) => ({ ...p, reviewCount: e.target.value }))}
                placeholder="Reviews"
                type="number"
                min="0"
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500"
              />
              <input
                value={newEvent.attendeeCount}
                onChange={(e) => setNewEvent((p) => ({ ...p, attendeeCount: e.target.value }))}
                placeholder="Attendees"
                type="number"
                min="0"
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500"
              />
            </div>
            <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-slate-600">{createStatus}</p>
              <Button type="submit" className="w-full sm:w-auto">
                Create Event
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
