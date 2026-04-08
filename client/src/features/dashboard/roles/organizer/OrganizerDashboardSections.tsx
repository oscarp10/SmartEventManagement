import type { DashboardSection } from "@/app-types";
import { OrganizerEventsSection } from "@/features/dashboard/roles/organizer/components/OrganizerEventsSection";
import type { EventItem } from "@/features/events/types";
import { resolveEventApprovalStatus } from "@/lib/events";

export function OrganizerMyEventsSection({
  section,
  myEvents,
  searchQuery,
  token,
  apiBase,
  onRefreshMyEvents
}: {
  section: DashboardSection;
  myEvents: EventItem[];
  searchQuery: string;
  token: string;
  apiBase: string;
  onRefreshMyEvents: () => Promise<void>;
}) {
  if (section !== "my-events") return null;
  return (
    <OrganizerEventsSection
      myEvents={myEvents}
      searchQuery={searchQuery}
      token={token}
      apiBase={apiBase}
      getApprovalStatus={(e) => resolveEventApprovalStatus(e)}
      onRefreshMyEvents={onRefreshMyEvents}
    />
  );
}
