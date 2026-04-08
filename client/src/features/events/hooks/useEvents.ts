import { useCallback, useEffect, useState } from "react";
import { normalizeEventsFromApi } from "@/lib/events";
import { eventsApi } from "@/features/events/services/eventsApi";
import type { AuthProfile } from "@/features/auth/types";
import type { EventItem } from "@/features/events/types";

const DEFAULT_NEW_EVENT = {
  title: "",
  description: "",
  dateTime: "",
  location: "",
  priceLabel: "Free",
  imageUrl: "",
  rating: "4.5",
  reviewCount: "0",
  attendeeCount: "0",
  category: "General",
  capacity: "100",
  tags: "general, campus"
};

export function useEvents(token: string, profile: AuthProfile | null, isAuthenticated: boolean) {
  const [featuredEvents, setFeaturedEvents] = useState<EventItem[]>([]);
  const [approvedCatalogEvents, setApprovedCatalogEvents] = useState<EventItem[]>([]);
  const [recommendations, setRecommendations] = useState<EventItem[]>([]);
  const [myEvents, setMyEvents] = useState<EventItem[]>([]);
  const [adminCatalogEvents, setAdminCatalogEvents] = useState<EventItem[]>([]);
  const [createStatus, setCreateStatus] = useState("");
  const [newEvent, setNewEvent] = useState(DEFAULT_NEW_EVENT);
  const [organizerSuggestions, setOrganizerSuggestions] = useState<
    { id: string; title: string; description: string; rationale?: string; createdAt: string; attendeeName: string; attendeeEmail: string }[]
  >([]);
  const [organizerSuggestionsLoading, setOrganizerSuggestionsLoading] = useState(false);

  const loadFeaturedEvents = useCallback(async () => {
    try {
      const all = normalizeEventsFromApi(await eventsApi.listApproved());
      setApprovedCatalogEvents(all);
      setFeaturedEvents(all.slice(0, 6));
    } catch {
      // non-blocking
    }
  }, []);

  const refreshAdminEvents = useCallback(async () => {
    if (!token || !profile || profile.role !== "Admin") return;
    try {
      setAdminCatalogEvents(normalizeEventsFromApi(await eventsApi.listForAdmin(token)));
    } catch {
      // non-blocking
    }
  }, [token, profile]);

  const refreshMyEvents = useCallback(async () => {
    if (!token || !profile || profile.role !== "Organizer") return;
    try {
      setMyEvents(normalizeEventsFromApi(await eventsApi.listForOrganizer(token, profile.id)));
    } catch {
      // non-blocking
    }
  }, [token, profile]);

  const saveAdminComment = useCallback(
    async (eventId: string, comment: string) => {
      if (!token) return;
      try {
        await eventsApi.saveAdminComment(token, eventId, comment);
        await refreshAdminEvents();
      } catch {
        // non-blocking
      }
    },
    [token, refreshAdminEvents]
  );

  useEffect(() => {
    void loadFeaturedEvents();
  }, [loadFeaturedEvents]);

  useEffect(() => {
    if (!isAuthenticated || !profile || profile.role !== "Attendee" || !token) {
      setRecommendations([]);
      return;
    }
    const load = async () => {
      try {
        const data = await eventsApi.recommendations(token, profile.id, 6);
        setRecommendations(data as EventItem[]);
      } catch {
        // non-blocking
      }
    };
    void load();
  }, [isAuthenticated, profile, token]);

  useEffect(() => {
    if (!token || !profile || (profile.role !== "Organizer" && profile.role !== "Admin")) {
      setOrganizerSuggestions([]);
      return;
    }
    const load = async () => {
      setOrganizerSuggestionsLoading(true);
      try {
        setOrganizerSuggestions(await eventsApi.listOrganizerSuggestions(token));
      } finally {
        setOrganizerSuggestionsLoading(false);
      }
    };
    void load();
  }, [token, profile]);

  useEffect(() => {
    if (!isAuthenticated || !profile) {
      setMyEvents([]);
      setAdminCatalogEvents([]);
      setApprovedCatalogEvents([]);
      return;
    }
    const loadRole = async () => {
      if (profile.role === "Organizer" && token) {
        try {
          setMyEvents(normalizeEventsFromApi(await eventsApi.listForOrganizer(token, profile.id)));
        } catch {
          // non-blocking
        }
      }
      if (profile.role === "Admin") {
        await refreshAdminEvents();
      }
    };
    void loadRole();
  }, [isAuthenticated, profile, token, refreshAdminEvents]);

  const submitSuggestion = useCallback(
    async (title: string, description: string, rationale: string) => {
      if (!token) throw new Error("Not authenticated.");
      await eventsApi.submitSuggestion(token, {
        title: title.trim(),
        description: description.trim(),
        rationale: rationale.trim() || null
      });
    },
    [token]
  );

  const createEvent = useCallback(async () => {
    if (!profile || !token || (profile.role !== "Organizer" && profile.role !== "Admin")) return;
    setCreateStatus("");
    if (!newEvent.imageUrl.trim()) {
      setCreateStatus("Add an image URL or upload an image file.");
      return;
    }
    try {
      await eventsApi.create(token, {
        title: newEvent.title.trim(),
        description: newEvent.description.trim(),
        dateTime: new Date(newEvent.dateTime).toISOString(),
        location: newEvent.location.trim(),
        priceLabel: newEvent.priceLabel.trim() || "Free",
        imageUrl: newEvent.imageUrl.trim(),
        rating: Number(newEvent.rating),
        reviewCount: Number(newEvent.reviewCount),
        attendeeCount: Number(newEvent.attendeeCount),
        category: newEvent.category.trim() || "General",
        capacity: Number(newEvent.capacity),
        organizerId: profile.id,
        tags: newEvent.tags
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean)
      });
      setCreateStatus("Event submitted. Admin approval is required before public listing.");
      if (profile.role === "Organizer") await refreshMyEvents();
      setNewEvent(DEFAULT_NEW_EVENT);
      await loadFeaturedEvents();
    } catch (err) {
      setCreateStatus(err instanceof Error ? err.message : "Failed to create event.");
    }
  }, [profile, token, newEvent, refreshMyEvents, loadFeaturedEvents]);

  return {
    featuredEvents,
    approvedCatalogEvents,
    recommendations,
    myEvents,
    adminCatalogEvents,
    createStatus,
    newEvent,
    setNewEvent,
    organizerSuggestions,
    organizerSuggestionsLoading,
    setAdminCatalogEvents,
    setMyEvents,
    setRecommendations,
    loadFeaturedEvents,
    refreshAdminEvents,
    refreshMyEvents,
    saveAdminComment,
    submitSuggestion,
    createEvent
  };
}

