import type { AdminEvent } from "@/features/dashboard/roles/admin/components/AdminEventCard";
import type { EventItem } from "@/features/events/types";
import { resolveEventApprovalStatus } from "@/lib/events";

export function catalogItemToAdminEvent(e: EventItem): AdminEvent {
  const status = resolveEventApprovalStatus(e);
  const oid = e.organizerId;
  const shortOrg = oid.length > 14 ? `${oid.slice(0, 8)}…` : oid;
  return {
    id: e.id,
    title: e.title,
    description: e.description,
    organizerName: `Organizer (${shortOrg})`,
    date: new Date(e.dateTime).toLocaleDateString(),
    time: new Date(e.dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    location: e.location,
    capacity: e.capacity,
    status,
    rejectionReason: status === "rejected" ? (e.rejectionReason ?? undefined) : undefined,
    adminComment: e.adminComment
  };
}
