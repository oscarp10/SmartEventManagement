import { createContext } from "react";
import type { ReactNode } from "react";
import { useAdminEventActions } from "@/features/events/hooks/useAdminEventActions";
import { useAttendeeInterests } from "@/features/events/hooks/useAttendeeInterests";
import { useEvents } from "@/features/events/hooks/useEvents";
import { useRegistrations } from "@/features/events/hooks/useRegistrations";
import type { AuthProfile } from "@/features/auth/types";

type EventProviderProps = {
  token: string;
  profile: AuthProfile | null;
  isAuthenticated: boolean;
  setProfile: (next: AuthProfile | null) => void;
  children: ReactNode;
};

type EventContextValue = ReturnType<typeof useEventContextValue>;

// eslint-disable-next-line react-refresh/only-export-components
export const EventContext = createContext<EventContextValue | null>(null);

function useEventContextValue({ token, profile, isAuthenticated, setProfile }: Omit<EventProviderProps, "children">) {
  const events = useEvents(token, profile, isAuthenticated);

  const registrations = useRegistrations({
    token,
    attendeeId: profile?.role === "Attendee" ? profile.id : null,
    approvedCatalogEvents: events.approvedCatalogEvents,
    recommendations: events.recommendations,
    featuredEvents: events.featuredEvents
  });

  const adminActions = useAdminEventActions(token, profile, events.loadFeaturedEvents, events.refreshAdminEvents);

  const attendeeInterests = useAttendeeInterests(token, profile, setProfile);

  return {
    ...events,
    ...registrations,
    ...adminActions,
    ...attendeeInterests
  };
}

export function EventProvider({ token, profile, isAuthenticated, setProfile, children }: EventProviderProps) {
  const value = useEventContextValue({ token, profile, isAuthenticated, setProfile });
  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

