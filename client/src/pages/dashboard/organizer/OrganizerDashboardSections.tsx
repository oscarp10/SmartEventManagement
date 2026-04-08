import type { DashboardSection } from "../../../app-types";
import { OrganizerEventsSection } from "../../../components/organizer/OrganizerEventsSection";
import type { EventItem } from "../../../types/app-models";
import { resolveEventApprovalStatus } from "../../../lib/events";

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
