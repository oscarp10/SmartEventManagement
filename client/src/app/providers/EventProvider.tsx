import type { ReactNode } from "react";
import { useAuthContext } from "@/features/auth";
import { EventProvider as FeatureEventProvider } from "@/features/events";

export function EventProvider({ children }: { children: ReactNode }) {
  const auth = useAuthContext();

  return (
    <FeatureEventProvider token={auth.token} profile={auth.profile} isAuthenticated={auth.isAuthenticated} setProfile={auth.setProfile}>
      {children}
    </FeatureEventProvider>
  );
}

