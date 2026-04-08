import type { NotificationTone } from "../components/dashboard/NotificationsPanel";

export type EventApprovalState = "pending" | "approved" | "rejected";

type EventApprovalLike = {
  rejectionReason?: string;
  isApproved: boolean;
};

type EventInterestLike = {
  category: string;
  tags: string[];
};

type EventApiLike = EventApprovalLike & {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  priceLabel: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  attendeeCount: number;
  category: string;
  capacity: number;
  adminComment?: string;
  registrationsOpen?: boolean;
  organizerId: string;
  tags: string[];
};

/** Shared approval rule so Admin, Organizer, and Explore views stay aligned. */
export function resolveEventApprovalStatus(e: EventApprovalLike): EventApprovalState {
  if (e.rejectionReason) return "rejected";
  if (e.isApproved) return "approved";
  return "pending";
}

export function normalizeEventFromApi(raw: unknown): EventApiLike {
  const x = raw as Record<string, unknown>;
  const tagsRaw = x.tags;
  const tags = Array.isArray(tagsRaw) ? tagsRaw.map((t) => String(t)) : [];
  const rej = x.rejectionReason;
  const ac = x.adminComment;

  let dateTime: string;
  if (typeof x.dateTime === "string") dateTime = x.dateTime;
  else if (x.dateTime != null) dateTime = new Date(x.dateTime as string | number).toISOString();
  else dateTime = new Date().toISOString();

  return {
    id: String(x.id ?? ""),
    title: String(x.title ?? ""),
    description: String(x.description ?? ""),
    dateTime,
    location: String(x.location ?? ""),
    priceLabel: String(x.priceLabel ?? "Free"),
    imageUrl: String(x.imageUrl ?? ""),
    rating: Number(x.rating ?? 0),
    reviewCount: Number(x.reviewCount ?? 0),
    attendeeCount: Number(x.attendeeCount ?? 0),
    category: String(x.category ?? "General"),
    capacity: Math.max(0, Number(x.capacity ?? 0)),
    isApproved: Boolean(x.isApproved),
    rejectionReason: rej != null && String(rej).trim() !== "" ? String(rej) : undefined,
    adminComment: ac != null && String(ac).trim() !== "" ? String(ac) : undefined,
    registrationsOpen: x.registrationsOpen !== false,
    organizerId: String(x.organizerId ?? ""),
    tags
  };
}

export function normalizeEventsFromApi(data: unknown): EventApiLike[] {
  if (!Array.isArray(data)) return [];
  return data.map(normalizeEventFromApi);
}

export function eventMatchesProfileInterests(e: EventInterestLike, interests: string[]): boolean {
  if (interests.length === 0) return false;
  const lower = interests.map((x) => x.toLowerCase());
  return lower.includes(e.category.toLowerCase()) || e.tags.some((t) => lower.includes(t.toLowerCase()));
}

export function inferLiveNotificationTone(message: string): NotificationTone {
  const m = message.toLowerCase();
  if (m.includes("reject") || m.includes("failed") || m.includes("error")) return "error";
  if (m.includes("approv") || m.includes("confirm") || m.includes("registered")) return "success";
  if (m.includes("pending") || m.includes("capacity") || m.includes("warning")) return "warning";
  return "info";
}
