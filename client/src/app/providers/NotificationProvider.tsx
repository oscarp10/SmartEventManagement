import type { ReactNode } from "react";
import { useAuthContext } from "@/features/auth";
import { useEventContext } from "@/features/events";
import { NotificationProvider as FeatureNotificationProvider } from "@/features/notifications";

export function NotificationProvider({ children }: { children: ReactNode }) {
  const auth = useAuthContext();
  const events = useEventContext();

  return (
    <FeatureNotificationProvider
      token={auth.token}
      isAuthenticated={auth.isAuthenticated}
      profile={auth.profile}
      onOrganizerAffected={() => {
        void events.refreshMyEvents();
      }}
    >
      {children}
    </FeatureNotificationProvider>
  );
}

