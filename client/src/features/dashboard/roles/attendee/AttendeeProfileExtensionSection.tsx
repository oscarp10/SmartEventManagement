import type { Dispatch, FormEvent, SetStateAction } from "react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/features/shared/components";
import { ATTENDEE_INTEREST_TAGS } from "@/constants/attendeeInterests";
import { cn } from "@/features/shared";
import type { FeedbackDto } from "@/features/feedback/types";
import type { DashboardSection } from "@/app-types";

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
                      onClick={() => setSelectedInterestTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))}
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
              <p className={`rounded-lg px-3 py-2 text-sm ${interestSaveFeedback.type === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>
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
          <CardDescription>Share an idea for a future campus event—organizers and admins can review submissions in their hub.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form className="grid gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 sm:p-4" onSubmit={(e) => void onSubmitSuggestion(e)}>
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
                  <Button key={x.eventId} type="button" variant="secondary" size="sm" onClick={() => onStartFeedbackForEvent(x.eventId)}>
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
                      <p className="mt-1 text-sm text-slate-600">{f.comment?.trim() ? f.comment : <span className="italic text-slate-400">No comment</span>}</p>
                      <p className="mt-2 text-xs text-slate-400">{new Date(f.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">{f.rating}/5</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => onEditFeedback(f)}>
                        Edit
                      </Button>
                      <Button type="button" variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => void onDeleteFeedback(f.id)}>
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

