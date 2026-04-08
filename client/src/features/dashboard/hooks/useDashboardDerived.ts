import { useMemo } from "react";
import { Activity, CalendarClock, CalendarDays, Sparkles, Star, UserCircle, Users, XCircle } from "lucide-react";
import type { DashboardSection } from "@/app-types";
import { resolveEventApprovalStatus } from "@/lib/events";
import type { EventItem, RegistrationDto } from "@/features/events/types";
import type { OrganizerAnalyticsResponse } from "@/features/dashboard/types";

type Args = {
  profileRole?: "Admin" | "Organizer" | "Attendee";
  dashboardSection: DashboardSection;
  dashboardSearch: string;
  realtimeFeedLength: number;
  recommendations: EventItem[];
  featuredEvents: EventItem[];
  approvedCatalogEvents: EventItem[];
  adminCatalogEvents: EventItem[];
  myEvents: EventItem[];
  registrations: RegistrationDto[];
  organizerAnalytics: OrganizerAnalyticsResponse | null;
};

export function useDashboardDerived({
  profileRole,
  dashboardSection,
  dashboardSearch,
  realtimeFeedLength,
  recommendations,
  featuredEvents,
  approvedCatalogEvents,
  adminCatalogEvents,
  myEvents,
  registrations,
  organizerAnalytics
}: Args) {
  const dashboardTitle = profileRole === "Admin" ? "Admin hub" : profileRole === "Organizer" ? "Organizer hub" : "Attendee hub";
  const adminSummary = useMemo(() => {
    const getStatus = (e: EventItem) => resolveEventApprovalStatus(e);
    const source = adminCatalogEvents;
    const pending = source.filter((e) => getStatus(e) === "pending").length;
    const approved = source.filter((e) => getStatus(e) === "approved").length;
    const rejected = source.filter((e) => getStatus(e) === "rejected").length;
    return { pending, approved, rejected, total: source.length };
  }, [adminCatalogEvents]);
  const homeBrowseEvents = useMemo((): EventItem[] => (approvedCatalogEvents.length > 0 ? approvedCatalogEvents : featuredEvents), [approvedCatalogEvents, featuredEvents]);
  const attendeeBrowsePool = useMemo((): EventItem[] => {
    if (profileRole !== "Attendee") return [];
    return approvedCatalogEvents.slice().sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  }, [profileRole, approvedCatalogEvents]);
  const attendeeBrowseFiltered = useMemo(() => {
    const q = dashboardSearch.trim().toLowerCase();
    if (!q) return attendeeBrowsePool;
    return attendeeBrowsePool.filter((e) => `${e.title} ${e.category} ${e.location} ${(e.tags ?? []).join(" ")}`.toLowerCase().includes(q));
  }, [attendeeBrowsePool, dashboardSearch]);
  const dashboardSearchPlaceholder = useMemo(() => {
    if (!profileRole) return "Quick search…";
    if (profileRole === "Attendee") return dashboardSection === "events" ? "Search title, category, location…" : "Open Events — search filters the browse grid";
    if (profileRole === "Organizer") return dashboardSection === "my-events" ? "Search your listings…" : "Open My events — search filters your listings";
    if (profileRole === "Admin") return dashboardSection === "approvals" ? "Filter queue by title, category, location…" : "Open Approvals — search filters the queue";
    return "Quick search…";
  }, [profileRole, dashboardSection]);
  const metricTiles = useMemo(() => {
    if (!profileRole) return [{ label: "Session", value: "Guest", icon: UserCircle, accent: "slate" as const }, { label: "Live updates", value: "0", icon: Activity, accent: "brand" as const }, { label: "Recommended", value: "0", icon: Sparkles, accent: "violet" as const }, { label: "Featured", value: "0", icon: CalendarDays, accent: "amber" as const }];
    if (profileRole === "Admin") return [{ label: "Pending review", value: String(adminSummary.pending), icon: CalendarClock, accent: "amber" as const }, { label: "Approved", value: String(adminSummary.approved), icon: CalendarDays, accent: "brand" as const }, { label: "Rejected", value: String(adminSummary.rejected), icon: XCircle, accent: "violet" as const }, { label: "Live updates", value: String(realtimeFeedLength), icon: Activity, accent: "slate" as const }];
    if (profileRole === "Organizer") {
      const pendingN = myEvents.filter((e) => resolveEventApprovalStatus(e) === "pending").length;
      const feedbackN = organizerAnalytics?.perEvent.reduce((s, x) => s + x.feedbackCount, 0) ?? 0;
      return [{ label: "My events", value: String(myEvents.length), icon: CalendarDays, accent: "brand" as const }, { label: "Pending approval", value: String(pendingN), icon: CalendarClock, accent: "amber" as const }, { label: "Feedback", value: String(feedbackN), icon: Star, accent: "violet" as const }, { label: "Live updates", value: String(realtimeFeedLength), icon: Activity, accent: "slate" as const }];
    }
    const regN = registrations.filter((r) => r.status.toLowerCase() !== "cancelled").length;
    return [{ label: "My registrations", value: String(regN), icon: Users, accent: "brand" as const }, { label: "Live updates", value: String(realtimeFeedLength), icon: Activity, accent: "slate" as const }, { label: "Recommended", value: String(recommendations.length), icon: Sparkles, accent: "violet" as const }, { label: "Featured", value: String(featuredEvents.length), icon: CalendarDays, accent: "amber" as const }];
  }, [profileRole, adminSummary, realtimeFeedLength, myEvents, organizerAnalytics, registrations, recommendations.length, featuredEvents.length]);
  const resolveEventTitle = (eventId: string) =>
    (featuredEvents.find((x) => x.id === eventId) ?? approvedCatalogEvents.find((x) => x.id === eventId) ?? adminCatalogEvents.find((x) => x.id === eventId) ?? recommendations.find((x) => x.id === eventId) ?? myEvents.find((x) => x.id === eventId))?.title ?? "Event";
  const toAttendeeDetailFromRegistration = (r: RegistrationDto): EventItem => ({ id: r.eventId, title: r.eventTitle, description: r.eventDescription ?? "", dateTime: r.eventDateTime, location: r.eventLocation, priceLabel: r.eventPriceLabel ?? "Free", imageUrl: r.eventImageUrl, rating: 0, reviewCount: 0, attendeeCount: 0, category: r.eventCategory, capacity: r.eventCapacity ?? 0, isApproved: true, organizerId: "", tags: r.eventTags ?? [] });
  return { dashboardTitle, adminSummary, homeBrowseEvents, attendeeBrowsePool, attendeeBrowseFiltered, dashboardSearchPlaceholder, metricTiles, resolveEventTitle, toAttendeeDetailFromRegistration };
}

