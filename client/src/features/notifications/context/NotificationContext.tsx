import { createContext } from "react";
import type { ReactNode } from "react";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { useRealtime } from "@/features/notifications/hooks/useRealtime";

type NotificationProviderProps = {
  token: string;
  isAuthenticated: boolean;
  profile: { id: string; role: "Admin" | "Organizer" | "Attendee" } | null;
  onOrganizerAffected?: () => void;
  children: ReactNode;
};

type NotificationContextValue = ReturnType<typeof useNotificationContextValue>;

// eslint-disable-next-line react-refresh/only-export-components
export const NotificationContext = createContext<NotificationContextValue | null>(null);

function useNotificationContextValue({ token, isAuthenticated, profile, onOrganizerAffected }: Omit<NotificationProviderProps, "children">) {
  const notifications = useNotifications(token, Boolean(isAuthenticated && profile));

  const realtime = useRealtime({
    token,
    enabled: Boolean(isAuthenticated),
    organizerId: profile?.role === "Organizer" ? profile.id : null,
    onOrganizerAffected,
    onNotificationCreated: notifications.prependNotificationFromRealtime
  });

  return {
    ...notifications,
    ...realtime
  };
}

export function NotificationProvider({ token, isAuthenticated, profile, onOrganizerAffected, children }: NotificationProviderProps) {
  const value = useNotificationContextValue({ token, isAuthenticated, profile, onOrganizerAffected });
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

