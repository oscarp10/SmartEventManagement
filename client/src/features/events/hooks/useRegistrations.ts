import { useCallback, useEffect, useState } from "react";
import { registrationsApi } from "@/features/events/services/eventsApi";
import type { EventItem, RegistrationDto } from "@/features/events/types";

type UseRegistrationsArgs = {
  token: string;
  attendeeId: string | null;
  approvedCatalogEvents: EventItem[];
  recommendations: EventItem[];
  featuredEvents: EventItem[];
};

export function useRegistrations({ token, attendeeId, approvedCatalogEvents, recommendations, featuredEvents }: UseRegistrationsArgs) {
  const [registrations, setRegistrations] = useState<RegistrationDto[]>([]);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState("");

  const reloadRegistrations = useCallback(async () => {
    if (!token || !attendeeId) {
      setRegistrations([]);
      return;
    }
    setRegistrationError("");
    setRegistrationLoading(true);
    try {
      setRegistrations(await registrationsApi.listMine(token));
    } catch (err) {
      setRegistrationError(err instanceof Error ? err.message : "Failed to load registrations.");
    } finally {
      setRegistrationLoading(false);
    }
  }, [token, attendeeId]);

  useEffect(() => {
    void reloadRegistrations();
  }, [reloadRegistrations]);

  const isRegisteredForEvent = useCallback(
    (eventId: string) => registrations.some((r) => r.eventId === eventId && r.status.toLowerCase() !== "cancelled"),
    [registrations]
  );

  const registerForEvent = useCallback(
    async (eventId: string) => {
      if (!token || !attendeeId) return;
      setRegistrationError("");
      setRegistrationLoading(true);
      try {
        const catalogEvent =
          approvedCatalogEvents.find((x) => x.id === eventId) ??
          recommendations.find((x) => x.id === eventId) ??
          featuredEvents.find((x) => x.id === eventId);
        if (catalogEvent?.registrationsOpen === false) {
          setRegistrationError("Registrations are closed for this event.");
          return;
        }
        await registrationsApi.create(token, eventId, attendeeId);
        setRegistrations(await registrationsApi.listMine(token));
      } catch (err) {
        setRegistrationError(err instanceof Error ? err.message : "Failed to register.");
      } finally {
        setRegistrationLoading(false);
      }
    },
    [token, attendeeId, approvedCatalogEvents, recommendations, featuredEvents]
  );

  const cancelRegistration = useCallback(
    async (eventId: string) => {
      if (!token || !attendeeId) return;
      setRegistrationError("");
      setRegistrationLoading(true);
      try {
        const reg = registrations.find((r) => r.eventId === eventId);
        if (!reg) return;
        await registrationsApi.updateStatus(token, reg.id, "Cancelled");
        setRegistrations(await registrationsApi.listMine(token));
      } catch (err) {
        setRegistrationError(err instanceof Error ? err.message : "Failed to cancel registration.");
      } finally {
        setRegistrationLoading(false);
      }
    },
    [token, attendeeId, registrations]
  );

  return {
    registrations,
    setRegistrations,
    registrationLoading,
    registrationError,
    isRegisteredForEvent,
    registerForEvent,
    cancelRegistration,
    reloadRegistrations
  };
}

