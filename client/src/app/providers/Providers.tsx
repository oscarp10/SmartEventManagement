import type { ReactNode } from "react";
import { AuthProvider } from "@/features/auth";
import { EventProvider } from "@/app/providers/EventProvider";
import { NotificationProvider } from "@/app/providers/NotificationProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <EventProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </EventProvider>
    </AuthProvider>
  );
}

