import { Calendar, Star, Users } from "lucide-react";

export function HomeExploreBottomSections({
  totalEvents,
  totalAttendees,
  avgRating,
  totalReviews,
  whyItems,
  onCreateClick
}: {
  totalEvents: number;
  totalAttendees: number;
  avgRating: number;
  totalReviews: number;
  whyItems: readonly { title: string; body: string; icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }> }[];
  onCreateClick: () => void;
}) {
  return (
    <>
      <section className="border-t border-slate-200 bg-slate-50 py-6">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 sm:grid-cols-3">
          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-100/70">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Listings</p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-700">
              <Calendar className="h-4 w-4 text-brand-600" aria-hidden />
              <strong className="text-slate-900">{totalEvents}</strong>
            </p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-100/70">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Capacity tracked</p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-700">
              <Users className="h-4 w-4 text-brand-600" aria-hidden />
              <strong className="text-slate-900">{totalAttendees}</strong>
            </p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-100/70">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Rating & reviews</p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-700">
              <Star className="h-4 w-4 text-amber-500" aria-hidden />
              <strong className="text-slate-900">{avgRating.toFixed(1)}</strong>
              <span className="text-slate-500">· {totalReviews} reviews</span>
            </p>
          </article>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-10 md:py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-xl font-bold text-slate-900 md:text-2xl">Why EventHub</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-slate-600">
            Campus ticketing ideas from platforms like{" "}
            <a href="https://www.trybooking.com/" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-700 hover:underline">
              TryBooking
            </a>
            — simple discovery, no cross-selling in your catalogue, clear roles for KOI.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whyItems.map((item) => (
              <article key={item.title} className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <item.icon className="h-5 w-5 text-brand-600" aria-hidden />
                <h3 className="mt-2 text-sm font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-gradient-brand py-8 text-center text-white">
        <div className="mx-auto max-w-2xl px-4">
          <p className="text-sm font-medium text-brand-100">Organizers</p>
          <h2 className="mt-1 text-lg font-bold md:text-xl">List an event — admin reviews before it goes live</h2>
          <button
            type="button"
            onClick={onCreateClick}
            className="mt-4 rounded-lg border border-white/90 bg-white px-5 py-2.5 text-sm font-semibold text-brand-900 shadow-sm transition hover:bg-brand-50"
          >
            Create event
          </button>
        </div>
      </section>

      <section className="bg-page py-6 text-center">
        <p className="mx-auto max-w-xl px-4 text-xs text-slate-500">
          Built for King&apos;s Own Institute — clear roles, capacity-aware registrations, and support links in the header.
        </p>
      </section>
    </>
  );
}

