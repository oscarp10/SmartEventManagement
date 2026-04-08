import { useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Heart,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wallet,
  Headphones
} from "lucide-react";
import type { Page, PublicEvent } from "../app-types";

export type HomeExploreProps = {
  events: PublicEvent[];
  onNavigate: (page: Page) => void;
  /** Primary “Create event” path (organizer dashboard or signup). */
  onCreateEvent?: () => void;
  isAuthenticated?: boolean;
};

const DEFAULT_CATEGORIES = ["All", "Technology", "Business", "Networking", "Music", "Art", "Food & Drink"];

/** Full-bleed hero — campus / events atmosphere (Booking.com–style imagery). */
const HERO_BACKGROUND =
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2400&q=85";

function scrollToFeatured() {
  requestAnimationFrame(() => document.getElementById("featured-events")?.scrollIntoView({ behavior: "smooth" }));
}

export function HomeExplore({ events, onNavigate, onCreateEvent, isAuthenticated = false }: HomeExploreProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState<PublicEvent | null>(null);

  const categories = useMemo(() => {
    const fromData = [...new Set(events.map((e) => e.category).filter(Boolean))];
    const merged = [...DEFAULT_CATEGORIES.slice(1)];
    for (const c of fromData) {
      if (!merged.includes(c)) merged.push(c);
    }
    merged.sort((a, b) => a.localeCompare(b));
    return ["All", ...merged];
  }, [events]);

  const filteredEvents = useMemo(
    () =>
      events.filter((event) => {
        const catOk = selectedCategory === "All" || event.category === selectedCategory;
        const q = searchQuery.trim().toLowerCase();
        const searchOk =
          !q ||
          event.title.toLowerCase().includes(q) ||
          event.location.toLowerCase().includes(q) ||
          event.category.toLowerCase().includes(q);
        return catOk && searchOk;
      }),
    [events, selectedCategory, searchQuery]
  );

  const totalEvents = events.length;
  const totalAttendees = events.reduce((s, e) => s + e.attendeeCount, 0);
  const avgRating = events.length === 0 ? 0 : events.reduce((s, e) => s + e.rating, 0) / events.length;
  const totalReviews = events.reduce((s, e) => s + e.reviewCount, 0);

  const handleCreateClick = () => {
    if (onCreateEvent) onCreateEvent();
    else onNavigate("signup");
  };

  return (
    <div className="min-h-screen bg-page">
      {/* Hero — TryBooking-style: compact height, headline + search + primary actions; events follow immediately */}
      <section className="relative min-h-[min(52vh,520px)] border-b border-slate-900/20 md:min-h-[min(58vh,580px)]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={HERO_BACKGROUND}
            alt=""
            className="h-full w-full object-cover object-center"
            decoding="async"
            fetchPriority="high"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/55 to-slate-950/85"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-tr from-brand-950/40 via-transparent to-transparent mix-blend-soft-light"
            aria-hidden
          />
        </div>

        <div className="relative mx-auto flex min-h-[min(52vh,520px)] max-w-7xl flex-col justify-center px-4 py-16 md:min-h-[min(58vh,580px)] md:py-20">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/95 shadow-sm backdrop-blur-md sm:text-xs">
              <Sparkles className="h-3.5 w-3.5 text-brand-300" aria-hidden />
              King&apos;s Own Institute · EventHub
            </div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-white text-balance drop-shadow-sm md:text-4xl lg:text-5xl">
              Find your next campus event
            </h1>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-white/85 md:text-lg">
              Admin-approved listings only — search, filter, then sign in to register.
            </p>
          </div>

          <div className="mt-6 w-full max-w-5xl">
            <div
              className="rounded-2xl border border-white/20 bg-white p-2 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/5 md:p-3"
              role="search"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-stretch md:gap-0 md:divide-x md:divide-slate-200">
                <label className="flex flex-1 cursor-text items-center gap-3 px-4 py-3 md:py-2 md:pl-5">
                  <span className="sr-only">Search</span>
                  <Search className="h-5 w-5 shrink-0 text-brand-600" aria-hidden />
                  <input
                    type="search"
                    placeholder="Event name, location, or category"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full min-w-0 border-0 bg-transparent py-2 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:ring-0"
                  />
                </label>
                <div className="flex items-center px-4 py-2 md:w-[220px] md:shrink-0 md:py-0">
                  <label className="flex w-full flex-col gap-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Category</span>
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        scrollToFeatured();
                      }}
                      className="w-full cursor-pointer border-0 bg-transparent py-1.5 text-sm font-semibold text-slate-900 outline-none focus:ring-0"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c === "All" ? "All categories" : c}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="flex flex-col gap-2 p-2 md:flex-row md:items-stretch md:border-l md:border-slate-200 md:p-2">
                  <button
                    type="button"
                    onClick={scrollToFeatured}
                    className="rounded-xl bg-brand-600 px-8 py-3.5 text-center text-sm font-bold text-white shadow-md transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 md:min-w-[140px]"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleCreateClick}
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-brand-900 shadow-md transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900/80 sm:px-6 sm:py-3"
            >
              Create event
            </button>
            <button
              type="button"
              onClick={scrollToFeatured}
              className="rounded-lg border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900/80 sm:px-6 sm:py-3"
            >
              View events
            </button>
            <a
              href="https://www.trybooking.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-white/75 underline decoration-white/30 underline-offset-2 hover:text-white"
            >
              Inspired by TryBooking
            </a>
          </div>
        </div>
      </section>

      {/* Approved catalogue — directly under hero (TryBooking: discover first, story later) */}
      <section className="sticky top-[var(--nav-offset,0px)] z-10 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-3 md:py-3.5">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-medium transition-all sm:px-5 sm:py-2 ${
                  selectedCategory === category
                    ? "bg-brand-600 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-800"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-2 pt-5">
        <div className="flex flex-wrap items-end justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm ring-1 ring-slate-100/70">
          <h2 className="text-lg text-slate-600">
            <span className="text-2xl font-bold text-slate-900">{filteredEvents.length}</span> approved{" "}
            {filteredEvents.length === 1 ? "event" : "events"}
            {selectedCategory !== "All" && <span className="text-slate-600"> · {selectedCategory}</span>}
          </h2>
          <p className="text-xs text-slate-500">Sign in to register · Only admin-approved events are shown</p>
        </div>
      </section>

      <section id="featured-events" className="mx-auto max-w-7xl scroll-mt-28 px-4 pb-12 md:pb-16">
        {filteredEvents.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center text-slate-600">
            No events match your filters. Try another category or clear your search.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <article
                key={event.id}
                className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-modern transition-all duration-300 hover:-translate-y-0.5 hover:shadow-modern-lg"
                role="button"
                tabIndex={0}
                onClick={() => setSelectedEvent(event)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSelectedEvent(event);
                }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 rounded-full bg-white/95 p-2 shadow-md transition-all hover:bg-white"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Save event"
                  >
                    <Heart className="h-5 w-5 text-slate-600 hover:fill-brand-600 hover:text-brand-600" />
                  </button>
                  <div className="absolute left-3 top-3 rounded-md bg-brand-700 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
                    Approved
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-800">{event.category}</span>
                    <span className="text-sm font-semibold text-slate-600">{event.priceLabel}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-brand-700">{event.title}</h3>
                  <div className="mt-2 flex items-start gap-2 text-sm text-slate-600">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                    <span>{event.location}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                    <span>{new Date(event.dateTime).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
                      <span className="font-semibold text-slate-900">{event.rating.toFixed(1)}</span>
                      <span className="text-slate-500">({event.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <Users className="h-4 w-4" aria-hidden />
                      <span>{event.attendeeCount}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Compact stats — social proof after browse (TryBooking keeps proof light) */}
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

      {/* Why EventHub — moved to end, tighter spacing */}
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
            {[
              { title: "Approved first", body: "Public grid shows admin-approved events only.", icon: ShieldCheck },
              { title: "Attendee-friendly", body: "Browse, filter, then sign in to register.", icon: CheckCircle2 },
              { title: "Fair pricing story", body: "Free listings stay lightweight for student-run events.", icon: Wallet },
              { title: "Organizer + admin", body: "Draft, review, publish — dashboards per role.", icon: Headphones }
            ].map((item) => (
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
            onClick={handleCreateClick}
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

      {selectedEvent ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
            <div className="relative aspect-[16/8] bg-slate-100">
              <img src={selectedEvent.imageUrl} alt={selectedEvent.title} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
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
                  onClick={() => onNavigate(isAuthenticated ? "dashboard" : "login")}
                  className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  {isAuthenticated ? "Open attendee hub to register" : "Sign in to register"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
