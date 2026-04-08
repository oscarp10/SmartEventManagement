import type { Dispatch, FormEvent, SetStateAction } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { ATTENDEE_INTEREST_TAGS } from "../../../constants/attendeeInterests";
import { cn } from "../../../lib/utils";
import type { EventItem, FeedbackDto, RegistrationDto } from "../../../types/app-models";
import type { DashboardSection } from "../../../app-types";

export function AttendeeEventDiscoverySection({
  section,
  recommendations,
  attendeeBrowseFiltered,
  attendeeBrowsePool,
  onOpenEventDetails
}: {
  section: DashboardSection;
  recommendations: EventItem[];
  attendeeBrowseFiltered: EventItem[];
  attendeeBrowsePool: EventItem[];
  onOpenEventDetails: (e: EventItem) => void;
}) {
  if (section !== "events") return null;
  return (
    <div className="space-y-6">
      <Card className="border-violet-200/70 bg-gradient-to-b from-violet-50/60 via-white to-white shadow-md ring-1 ring-violet-100/80">
        <CardHeader className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-700 shadow-sm ring-1 ring-violet-200/80">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg">Recommended for you</CardTitle>
              <CardDescription>
                Picks from EventHub based on your interests, event tags, and what you&apos;ve joined—same engine as the dashboard home.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {recommendations.length === 0 ? (
            <p className="rounded-xl border border-dashed border-violet-200/80 bg-violet-50/40 py-8 text-center text-sm text-slate-600">
              No personalized picks yet. Add interest tags under{" "}
              <span className="font-medium text-slate-800">Profile</span>, or check back after more events are approved.
            </p>
          ) : (
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
              {recommendations.map((e) => (
                <article
                  key={e.id}
                  className="min-w-[min(100%,280px)] shrink-0 snap-start overflow-hidden rounded-xl border border-violet-200/60 bg-white shadow-sm ring-1 ring-violet-100/60 transition hover:border-violet-300 hover:shadow-md sm:min-w-0"
                  role="button"
                  tabIndex={0}
                  onClick={() => onOpenEventDetails(e)}
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter" || ev.key === " ") onOpenEventDetails(e);
                  }}
                >
                  <div className="relative aspect-[16/9] bg-slate-100">
                    <img src={e.imageUrl} alt={e.title} className="h-full w-full object-cover" />
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-violet-600/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                      <Sparkles className="h-3 w-3" aria-hidden />
                      For you
                    </span>
                  </div>
                  <div className="p-3 sm:p-4">
                    <p className="font-semibold leading-snug text-slate-900">{e.title}</p>
                    <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                      {new Date(e.dateTime).toLocaleDateString()} — {e.location}
                    </p>
                    <p className="mt-1 text-xs font-medium text-violet-800">{e.category}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 shadow-md ring-1 ring-slate-100/80">
        <CardHeader>
          <CardTitle>Browse approved events</CardTitle>
          <CardDescription>
            Use the search field above to filter by title, category, or location. Open a card for full details and registration.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {attendeeBrowseFiltered.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 py-10 text-center text-sm text-slate-600">
              {attendeeBrowsePool.length === 0
                ? "No approved events are available yet."
                : "No events match your search. Try another keyword or clear the search bar."}
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {attendeeBrowseFiltered.map((e) => (
                <article
                  key={e.id}
                  className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-100/80 transition hover:border-brand-200/80 hover:shadow-md"
                  role="button"
                  tabIndex={0}
                  onClick={() => onOpenEventDetails(e)}
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter" || ev.key === " ") onOpenEventDetails(e);
                  }}
                >
                  <div className="relative aspect-[16/9] bg-slate-100">
                    <img src={e.imageUrl} alt={e.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-slate-900">{e.title}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {new Date(e.dateTime).toLocaleDateString()} — {e.location}
                    </p>
                    <p className="mt-1 text-xs font-medium text-brand-700">{e.category}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function AttendeeOverviewRegistrationsSection({
  section,
  registrations,
  registrationLoading,
  registrationError,
  onOpenRegistrationAsEvent
}: {
  section: DashboardSection;
  registrations: RegistrationDto[];
  registrationLoading: boolean;
  registrationError: string;
  onOpenRegistrationAsEvent: (r: RegistrationDto) => void;
}) {
  if (section !== "overview") return null;
  return (
    <section>
      <Card className="border-slate-200/80 shadow-md ring-1 ring-slate-100/80">
        <CardHeader>
          <CardTitle>My registrations</CardTitle>
          <CardDescription>Events you&apos;re signed up for from the database-backed catalogue.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {registrationLoading ? (
            <p className="mt-4 text-sm text-slate-600">Loading...</p>
          ) : registrationError ? (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{registrationError}</p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {registrations.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 py-8 text-center text-sm text-slate-600">
                  No registrations yet.
                </p>
              ) : (
                registrations.slice(0, 5).map((r) => (
                  <article
                    key={r.id}
                    className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-100/80 transition hover:border-brand-200/80 hover:shadow-md"
                    role="button"
                    tabIndex={0}
                    onClick={() => onOpenRegistrationAsEvent(r)}
                    onKeyDown={(ev) => {
                      if (ev.key === "Enter" || ev.key === " ") onOpenRegistrationAsEvent(r);
                    }}
                  >
                    <div className="relative aspect-[16/9] bg-slate-100">
                      <img src={r.eventImageUrl} alt={r.eventTitle} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-slate-900">{r.eventTitle}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {new Date(r.eventDateTime).toLocaleDateString()} — {r.eventLocation}
                      </p>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

export function AttendeeProfileExtensionSection({
  section,
  selectedInterestTags,
  setSelectedInterestTags,
  interestOtherInput,
  setInterestOtherInput,
  interestSaveFeedback,
  interestSaveLoading,
  onSaveInterests,
  suggestTitle,
  setSuggestTitle,
  suggestDescription,
  setSuggestDescription,
  suggestRationale,
  setSuggestRationale,
  suggestStatus,
  suggestLoading,
  onSubmitSuggestion,
  attendeeEventsWithoutFeedback,
  onStartFeedbackForEvent,
  feedbackLoading,
  feedbackError,
  feedbackMine,
  resolveEventTitle,
  onEditFeedback,
  onDeleteFeedback
}: {
  section: DashboardSection;
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
  onStartFeedbackForEvent: (eventId: string) => void;
  feedbackLoading: boolean;
  feedbackError: string;
  feedbackMine: FeedbackDto[];
  resolveEventTitle: (eventId: string) => string;
  onEditFeedback: (f: FeedbackDto) => void;
  onDeleteFeedback: (id: string) => void;
}) {
  if (section !== "profile") return null;
  return (
    <>
      <Card className="border-slate-200/80 bg-white shadow-md ring-1 ring-slate-100/80">
        <CardHeader>
          <CardTitle>My interests</CardTitle>
          <CardDescription>
            Tap preset tags that match you—they drive AI-style recommendations. Add extra topics below if needed.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form className="space-y-4" onSubmit={(e) => void onSaveInterests(e)}>
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Choose interest tags</p>
              <div className="flex flex-wrap gap-2">
                {ATTENDEE_INTEREST_TAGS.map((tag) => {
                  const on = selectedInterestTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() =>
                        setSelectedInterestTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
                      }
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                        on
                          ? "border-brand-500 bg-brand-600 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50/80"
                      )}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Other interests</label>
              <input
                value={interestOtherInput}
                onChange={(e) => setInterestOtherInput(e.target.value)}
                placeholder="e.g. robotics, debate (comma-separated)"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500"
              />
            </div>
            {interestSaveFeedback && (
              <p
                className={`rounded-lg px-3 py-2 text-sm ${
                  interestSaveFeedback.type === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"
                }`}
              >
                {interestSaveFeedback.text}
              </p>
            )}
            <Button type="submit" className="w-full sm:w-auto" disabled={interestSaveLoading}>
              {interestSaveLoading ? "Saving..." : "Save interests"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 bg-white shadow-md ring-1 ring-slate-100/80">
        <CardHeader>
          <CardTitle>Suggest an event</CardTitle>
          <CardDescription>
            Share an idea for a future campus event—organizers and admins can review submissions in their hub.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form
            className="grid gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 sm:p-4"
            onSubmit={(e) => void onSubmitSuggestion(e)}
          >
            <input
              value={suggestTitle}
              onChange={(e) => setSuggestTitle(e.target.value)}
              placeholder="Working title"
              required
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500"
            />
            <textarea
              value={suggestDescription}
              onChange={(e) => setSuggestDescription(e.target.value)}
              placeholder="What would happen? Who is it for?"
              required
              rows={3}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500"
            />
            <textarea
              value={suggestRationale}
              onChange={(e) => setSuggestRationale(e.target.value)}
              placeholder="Why now? (optional)"
              rows={2}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500"
            />
            {suggestStatus ? <p className="text-sm text-slate-600">{suggestStatus}</p> : null}
            <Button type="submit" className="w-full sm:w-auto" disabled={suggestLoading}>
              {suggestLoading ? "Sending…" : "Send to organizers"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 bg-white shadow-md ring-1 ring-slate-100/80">
        <CardHeader>
          <CardTitle>Your feedback</CardTitle>
          <CardDescription>Ratings for events you joined — add new ones or edit and remove anytime.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {attendeeEventsWithoutFeedback.length > 0 ? (
            <div className="mb-6 rounded-xl border border-dashed border-brand-200/80 bg-brand-50/40 p-4 ring-1 ring-brand-100/50">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Add a rating</p>
              <p className="mt-1 text-sm text-slate-600">Pick an event you are registered for and have not rated yet.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {attendeeEventsWithoutFeedback.map((x) => (
                  <Button
                    key={x.eventId}
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => onStartFeedbackForEvent(x.eventId)}
                  >
                    {x.title}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="space-y-3">
            {feedbackLoading ? (
              <p className="text-sm text-slate-600">Loading your feedback…</p>
            ) : feedbackError ? (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{feedbackError}</p>
            ) : feedbackMine.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 py-8 text-center text-sm text-slate-600">
                No ratings yet. Join an event, then add your feedback here.
              </p>
            ) : (
              [...feedbackMine]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((f) => (
                  <div
                    key={f.id}
                    className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm ring-1 ring-slate-100/80 transition hover:border-brand-200/80"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">{resolveEventTitle(f.eventId)}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {f.comment?.trim() ? f.comment : <span className="italic text-slate-400">No comment</span>}
                      </p>
                      <p className="mt-2 text-xs text-slate-400">{new Date(f.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                        {f.rating}/5
                      </span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => onEditFeedback(f)}>
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => void onDeleteFeedback(f.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

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
          <p className="text-sm text-slate-600">
            {event.description?.trim() || "No additional description provided by organizer."}
          </p>
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
