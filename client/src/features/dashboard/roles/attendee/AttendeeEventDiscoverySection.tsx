import { Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/features/shared/components";
import type { EventItem } from "@/features/events/types";
import type { DashboardSection } from "@/app-types";

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
              No personalized picks yet. Add interest tags under <span className="font-medium text-slate-800">Profile</span>, or check back after more events
              are approved.
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

