import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { Footer } from "./components/Footer";
import { Button } from "./components/ui/button";
import type { AdminEvent } from "./components/admin/AdminEventCard";
import { Navigation } from "./components/Navigation";
import { DashboardShell } from "./components/layout/DashboardShell";
import type { DashboardSection, Page, Role } from "./app-types";
import { Activity, CalendarClock, CalendarDays, Sparkles, Star, UserCircle, Users, XCircle } from "lucide-react";
import { cn } from "./lib/utils";
import { NotificationsPanel, type DashboardNotificationItem } from "./components/dashboard/NotificationsPanel";
import { DashboardWelcomeCard } from "./components/dashboard/DashboardWelcomeCard";
import { ATTENDEE_INTEREST_TAGS } from "./constants/attendeeInterests";
import { inferLiveNotificationTone, normalizeEventsFromApi, resolveEventApprovalStatus } from "./lib/events";
import { API_BASE } from "./config/site";
import { normalizeAuthProfile } from "./lib/auth-profile";
import { PublicContent } from "./layouts/PublicContent";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { SupportPage } from "./pages/SupportPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { DashboardPageBody } from "./pages/dashboard/DashboardPageBody";
import type { AuthProfile, EventItem, FeedbackDto, OrganizerAnalyticsResponse, RegistrationDto } from "./types/app-models";


function App() {
  const [page, setPage] = useState<Page>("home");
  const [dashboardSection, setDashboardSection] = useState<DashboardSection>("overview");
  const [dashboardSearch, setDashboardSearch] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("Attendee");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string>(() => {
    const t = localStorage.getItem("sem_token") ?? "";
    if (t.startsWith("demo.")) {
      localStorage.removeItem("sem_token");
      localStorage.removeItem("sem_profile");
      return "";
    }
    return t;
  });
  const [profile, setProfile] = useState<AuthProfile | null>(() => {
    const t = localStorage.getItem("sem_token") ?? "";
    if (t.startsWith("demo.")) return null;
    const raw = localStorage.getItem("sem_profile");
    if (!raw) return null;
    try {
      return normalizeAuthProfile(JSON.parse(raw));
    } catch {
      return null;
    }
  });
  const [featuredEvents, setFeaturedEvents] = useState<EventItem[]>([]);
  /** Full approved public catalogue (live); used for attendee calendar interest matching. */
  const [approvedCatalogEvents, setApprovedCatalogEvents] = useState<EventItem[]>([]);
  const [recommendations, setRecommendations] = useState<EventItem[]>([]);
  const [myEvents, setMyEvents] = useState<EventItem[]>([]);
  const [adminCatalogEvents, setAdminCatalogEvents] = useState<EventItem[]>([]);
  const [realtimeFeed, setRealtimeFeed] = useState<string[]>([]);
  const [createStatus, setCreateStatus] = useState("");
  const [newEvent, setNewEvent] = useState({
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
  });
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactLoading, setContactLoading] = useState(false);
  const [contactFeedback, setContactFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [selectedInterestTags, setSelectedInterestTags] = useState<string[]>([]);
  const [interestOtherInput, setInterestOtherInput] = useState("");
  const [suggestTitle, setSuggestTitle] = useState("");
  const [suggestDescription, setSuggestDescription] = useState("");
  const [suggestRationale, setSuggestRationale] = useState("");
  const [suggestStatus, setSuggestStatus] = useState("");
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [organizerSuggestions, setOrganizerSuggestions] = useState<
    { id: string; title: string; description: string; rationale?: string; createdAt: string; attendeeName: string; attendeeEmail: string }[]
  >([]);
  const [organizerSuggestionsLoading, setOrganizerSuggestionsLoading] = useState(false);
  const [interestSaveLoading, setInterestSaveLoading] = useState(false);
  const [interestSaveFeedback, setInterestSaveFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [adminReviewEvent, setAdminReviewEvent] = useState<AdminEvent | null>(null);
  const [adminApproveEvent, setAdminApproveEvent] = useState<AdminEvent | null>(null);
  const [adminRejectEvent, setAdminRejectEvent] = useState<AdminEvent | null>(null);
  const [adminPendingEvent, setAdminPendingEvent] = useState<AdminEvent | null>(null);
  const [adminReviewTab, setAdminReviewTab] = useState<"pending" | "approved" | "rejected">("pending");

  const [registrations, setRegistrations] = useState<RegistrationDto[]>([]);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState("");

  const [feedbackMine, setFeedbackMine] = useState<FeedbackDto[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");

  const [feedbackModal, setFeedbackModal] = useState<{
    eventId: string;
    feedbackId?: string;
    rating: number;
    comment: string;
  } | null>(null);
  const [feedbackSubmitLoading, setFeedbackSubmitLoading] = useState(false);
  const [feedbackSubmitError, setFeedbackSubmitError] = useState("");

  const [notifications, setNotifications] = useState<{ id: string; userId: string; message: string; isRead: boolean; createdAt: string }[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState("");
  const [globalInboxOpen, setGlobalInboxOpen] = useState(false);
  const [calendarSelectedEvent, setCalendarSelectedEvent] = useState<EventItem | null>(null);
  const [attendeeEventDetails, setAttendeeEventDetails] = useState<EventItem | null>(null);

  const [organizerAnalytics, setOrganizerAnalytics] = useState<OrganizerAnalyticsResponse | null>(null);
  const [organizerAnalyticsLoading, setOrganizerAnalyticsLoading] = useState(false);
  const [organizerAnalyticsError, setOrganizerAnalyticsError] = useState("");

  const isAuthenticated = !!token && !!profile;

  const loadFeaturedEvents = async () => {
    const response = await fetch(`${API_BASE}/api/events`);
    if (!response.ok) return;
    const all = normalizeEventsFromApi(await response.json());
    setApprovedCatalogEvents(all);
    setFeaturedEvents(all.slice(0, 6));
  };

  const refreshAdminEvents = useCallback(async () => {
    if (!token || !profile || profile.role !== "Admin") return;
    const response = await fetch(`${API_BASE}/api/events?includeUnapproved=true`, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) return;
    setAdminCatalogEvents(normalizeEventsFromApi(await response.json()));
  }, [token, profile]);

  const refreshMyEvents = useCallback(async () => {
    if (!token || !profile || profile.role !== "Organizer") return;
    const oid = profile.id;
    const response = await fetch(`${API_BASE}/api/events/organizer/${oid}`, { headers: { Authorization: `Bearer ${token}` } });
    if (response.ok) setMyEvents(normalizeEventsFromApi(await response.json()));
  }, [token, profile]);

  const handleSaveAdminComment = async (eventId: string, comment: string) => {
    if (!token) return;
    const response = await fetch(`${API_BASE}/api/events/${eventId}/admin-comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ comment: comment || null })
    });
    if (!response.ok) return;
    await refreshAdminEvents();
    setAdminReviewEvent((prev) => (prev && prev.id === eventId ? { ...prev, adminComment: comment || undefined } : prev));
  };

  useEffect(() => {
    void loadFeaturedEvents();
  }, []);

  useEffect(() => {
    if (page !== "contact") return;
    if (profile) {
      setContactName((n) => (n ? n : profile.fullName));
      setContactEmail((e) => (e ? e : profile.email));
    }
  }, [page, profile]);

  useEffect(() => {
    if (!isAuthenticated || !profile || profile.role !== "Attendee") {
      setRecommendations([]);
      return;
    }
    const load = async () => {
      const response = await fetch(`${API_BASE}/api/recommendations/${profile.id}?limit=6`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) setRecommendations((await response.json()) as EventItem[]);
    };
    void load();
  }, [isAuthenticated, profile, token]);

  useEffect(() => {
    if (profile?.role !== "Attendee") return;
    const interests = profile.interests ?? [];
    const preset = new Set<string>([...ATTENDEE_INTEREST_TAGS]);
    setSelectedInterestTags(interests.filter((x) => preset.has(x)));
    setInterestOtherInput(interests.filter((x) => !preset.has(x)).join(", "));
  }, [profile?.id, profile?.role, profile?.interests]);

  useEffect(() => {
    if (!token || !profile || (profile.role !== "Organizer" && profile.role !== "Admin")) {
      setOrganizerSuggestions([]);
      return;
    }
    const load = async () => {
      setOrganizerSuggestionsLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/event-suggestions/for-organizers`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) setOrganizerSuggestions(await response.json());
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
      if (profile.role === "Organizer") {
        const response = await fetch(`${API_BASE}/api/events/organizer/${profile.id}`);
        if (response.ok) setMyEvents(normalizeEventsFromApi(await response.json()));
      }
      if (profile.role === "Admin") {
        await refreshAdminEvents();
      }
    };
    void loadRole();
  }, [isAuthenticated, profile, token, refreshAdminEvents]);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    const organizerId = profile?.role === "Organizer" ? profile.id : null;
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE}/hubs/events`, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();
    const syncOrganizerIfAffected = (p: { organizerId?: string }) => {
      if (!organizerId || !p.organizerId) return;
      if (String(p.organizerId) !== organizerId) return;
      void refreshMyEvents();
    };
    connection.on("EventApproved", (p: { title: string; organizerId?: string }) => {
      setRealtimeFeed((prev) => [`Event approved: ${p.title}`, ...prev].slice(0, 8));
      syncOrganizerIfAffected(p);
    });
    connection.on("EventRejected", (p: { title: string; organizerId?: string; reason?: string }) => {
      setRealtimeFeed((prev) => [`Event rejected: ${p.title}${p.reason ? ` — ${p.reason}` : ""}`, ...prev].slice(0, 8));
      syncOrganizerIfAffected(p);
    });
    connection.on("EventMarkedPending", (p: { title: string; organizerId?: string }) => {
      setRealtimeFeed((prev) => [`Event back to pending: ${p.title}`, ...prev].slice(0, 8));
      syncOrganizerIfAffected(p);
    });
    connection.on("NotificationCreated", (n: { id: string; userId: string; message: string; isRead: boolean; createdAt: string }) => {
      setNotifications((prev) => [n, ...prev].slice(0, 50));
    });
    connection.on("EventCapacityUpdated", (p: { eventId: string; registered: number; capacity: number; remaining: number }) =>
      setRealtimeFeed((prev) => [`Capacity update (${p.eventId.slice(0, 8)}): ${p.registered}/${p.capacity}, remaining ${p.remaining}`, ...prev].slice(0, 8))
    );
    connection.start().catch(() => undefined);
    return () => {
      void connection.stop();
    };
  }, [isAuthenticated, token, profile?.id, profile?.role, refreshMyEvents]);

  useEffect(() => {
    if (!isAuthenticated || !profile || profile.role !== "Attendee") {
      setRegistrations([]);
      return;
    }
    const load = async () => {
      setRegistrationError("");
      setRegistrationLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/registrations/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) throw new Error((await response.text()) || "Failed to load registrations.");
        setRegistrations((await response.json()) as RegistrationDto[]);
      } catch (err) {
        setRegistrationError(err instanceof Error ? err.message : "Failed to load registrations.");
      } finally {
        setRegistrationLoading(false);
      }
    };
    void load();
  }, [isAuthenticated, profile, token]);

  useEffect(() => {
    if (!isAuthenticated || !profile) {
      setNotifications([]);
      return;
    }
    const load = async () => {
      setNotificationsError("");
      setNotificationsLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/notifications/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) throw new Error((await response.text()) || "Failed to load notifications.");
        setNotifications((await response.json()) as { id: string; userId: string; message: string; isRead: boolean; createdAt: string }[]);
      } catch (err) {
        setNotificationsError(err instanceof Error ? err.message : "Failed to load notifications.");
      } finally {
        setNotificationsLoading(false);
      }
    };
    void load();
  }, [isAuthenticated, profile, token]);

  useEffect(() => {
    if (!isAuthenticated || !profile || profile.role !== "Organizer") {
      setOrganizerAnalytics(null);
      return;
    }

    const load = async () => {
      setOrganizerAnalyticsError("");
      setOrganizerAnalyticsLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/analytics/organizer/${profile.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error((await response.text()) || "Failed to load analytics.");
        setOrganizerAnalytics((await response.json()) as OrganizerAnalyticsResponse);
      } catch (err) {
        setOrganizerAnalyticsError(err instanceof Error ? err.message : "Failed to load analytics.");
      } finally {
        setOrganizerAnalyticsLoading(false);
      }
    };
    void load();
  }, [isAuthenticated, profile, token]);

  useEffect(() => {
    if (!isAuthenticated || !profile || profile.role !== "Attendee") {
      setFeedbackMine([]);
      return;
    }
    const load = async () => {
      setFeedbackError("");
      setFeedbackLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/feedback/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) throw new Error((await response.text()) || "Failed to load feedback.");
        setFeedbackMine((await response.json()) as FeedbackDto[]);
      } catch (err) {
        setFeedbackError(err instanceof Error ? err.message : "Failed to load feedback.");
      } finally {
        setFeedbackLoading(false);
      }
    };
    void load();
  }, [isAuthenticated, profile, token]);

  useEffect(() => {
    if (!globalInboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setGlobalInboxOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [globalInboxOpen]);

  useEffect(() => {
    if (page === "login" || page === "signup") setGlobalInboxOpen(false);
  }, [page]);

  useEffect(() => {
    if (dashboardSection !== "calendar") setCalendarSelectedEvent(null);
  }, [dashboardSection]);

  const prevPageRef = useRef<Page>(page);
  useEffect(() => {
    if (page === "dashboard" && prevPageRef.current !== "dashboard") setDashboardSection("overview");
    prevPageRef.current = page;
  }, [page]);

  const handleAuthSubmit = async (e: React.FormEvent, mode: "login" | "signup") => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "signup" ? "/api/auth/register" : "/api/auth/login";
      const payload =
        mode === "signup"
          ? { fullName, email, password, role }
          : { email, password };
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const raw = await response.text();
      let data: unknown = raw;
      try {
        data = JSON.parse(raw);
      } catch {
        // plain text response from backend is valid for error paths
      }
      if (!response.ok) {
        if (typeof data === "string" && data.trim()) throw new Error(data);
        if (data && typeof data === "object") {
          const d = data as { detail?: string; title?: string; message?: string };
          throw new Error(d.detail || d.title || d.message || "Authentication failed.");
        }
        throw new Error("Authentication failed.");
      }
      const authRaw = data as { token?: unknown; profile?: unknown };
      const nextProfile = normalizeAuthProfile(authRaw.profile);
      if (!authRaw.token || !nextProfile) throw new Error("Authentication response is invalid.");
      setToken(String(authRaw.token));
      setProfile(nextProfile);
      localStorage.setItem("sem_token", String(authRaw.token));
      localStorage.setItem("sem_profile", JSON.stringify(nextProfile));
      setPassword("");
      setGlobalInboxOpen(false);
      setPage("dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setGlobalInboxOpen(false);
    setToken("");
    setProfile(null);
    setRecommendations([]);
    setMyEvents([]);
    setAdminCatalogEvents([]);
    setApprovedCatalogEvents([]);
    setRealtimeFeed([]);
    localStorage.removeItem("sem_token");
    localStorage.removeItem("sem_profile");
    setPage("home");
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactFeedback(null);
    setContactLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName.trim(),
          email: contactEmail.trim(),
          subject: contactSubject.trim(),
          message: contactMessage.trim()
        })
      });
      if (!response.ok) {
        const errBody = await response.text();
        let msg = errBody.replace(/^"|"$/g, "");
        try {
          const j = JSON.parse(errBody) as { title?: string; detail?: string };
          if (j.detail) msg = j.detail;
          else if (j.title) msg = j.title;
        } catch {
          /* plain text error */
        }
        throw new Error(msg || "Could not send your message.");
      }
    setContactFeedback({ type: "ok", text: "Thanks - we received your message and will get back to you soon." });
      setContactSubject("");
      setContactMessage("");
    } catch (err) {
      setContactFeedback({
        type: "err",
        text: err instanceof Error ? err.message : "Could not send your message."
      });
    } finally {
      setContactLoading(false);
    }
  };

  const handleSaveInterests = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !token || profile.role !== "Attendee") return;
    setInterestSaveFeedback(null);
    setInterestSaveLoading(true);
    try {
      const extra = interestOtherInput
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
      const interests = [...new Set([...selectedInterestTags, ...extra])];

      const response = await fetch(`${API_BASE}/api/profiles/${profile.id}/interests`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ interests })
      });
      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(errBody.replace(/^"|"$/g, "") || "Failed to save interests.");
      }
      const updated = (await response.json()) as AuthProfile;
      const nextProfile = { ...profile, interests: updated.interests ?? [] };
      setProfile(nextProfile);
      localStorage.setItem("sem_profile", JSON.stringify(nextProfile));
      setInterestSaveFeedback({ type: "ok", text: "Interests saved." });
    } catch (err) {
      setInterestSaveFeedback({
        type: "err",
        text: err instanceof Error ? err.message : "Failed to save interests."
      });
    } finally {
      setInterestSaveLoading(false);
    }
  };

  const handleSubmitEventSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || profile.role !== "Attendee") return;
    setSuggestStatus("");
    if (!suggestTitle.trim() || !suggestDescription.trim()) {
      setSuggestStatus("Title and description are required.");
      return;
    }
    setSuggestLoading(true);
    try {
      if (!token) return;
      const response = await fetch(`${API_BASE}/api/event-suggestions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: suggestTitle.trim(),
          description: suggestDescription.trim(),
          rationale: suggestRationale.trim() || null
        })
      });
      if (!response.ok) throw new Error((await response.text()) || "Could not submit suggestion.");
      setSuggestTitle("");
      setSuggestDescription("");
      setSuggestRationale("");
      setSuggestStatus("Thanks — organizers can review your idea in their hub.");
    } catch (err) {
      setSuggestStatus(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSuggestLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !token || (profile.role !== "Organizer" && profile.role !== "Admin")) return;
    setCreateStatus("");
    if (!newEvent.imageUrl.trim()) {
      setCreateStatus("Add an image URL or upload an image file.");
      return;
    }
    try {
      const payload = {
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
        tags: newEvent.tags.split(",").map((x) => x.trim()).filter(Boolean)
      };
      const response = await fetch(`${API_BASE}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error((await response.text()) || "Failed to create event.");
      setCreateStatus("Event submitted. Admin approval is required before public listing.");
      if (profile.role === "Organizer") await refreshMyEvents();
      setNewEvent({
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
      });
      await loadFeaturedEvents();
    } catch (err) {
      setCreateStatus(err instanceof Error ? err.message : "Failed to create event.");
    }
  };

  const handleApproveEvent = async (eventId: string) => {
    if (!token || !profile || profile.role !== "Admin") return;
    const response = await fetch(`${API_BASE}/api/events/${eventId}/approve`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) return;
    await loadFeaturedEvents();
    await refreshAdminEvents();
  };

  const handleRejectEvent = async (eventId: string, reason: string) => {
    if (!token || !profile || profile.role !== "Admin") return;
    const response = await fetch(`${API_BASE}/api/events/${eventId}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ reason })
    });
    if (!response.ok) return;
    await loadFeaturedEvents();
    await refreshAdminEvents();
  };

  const handleMarkEventPending = async (eventId: string) => {
    if (!token || !profile || profile.role !== "Admin") return;
    const response = await fetch(`${API_BASE}/api/events/${eventId}/pending`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) return;
    await loadFeaturedEvents();
    await refreshAdminEvents();
  };

  const homeBrowseEvents = useMemo((): EventItem[] => {
    return approvedCatalogEvents.length > 0 ? approvedCatalogEvents : featuredEvents;
  }, [approvedCatalogEvents, featuredEvents]);

  const isRegisteredForEvent = (eventId: string) => {
    if (!profile || profile.role !== "Attendee") return false;
    return registrations.some((r) => r.eventId === eventId && r.status.toLowerCase() !== "cancelled");
  };

  const handleRegisterForEvent = async (eventId: string) => {
    if (!profile || !token || profile.role !== "Attendee") return;
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

      const response = await fetch(`${API_BASE}/api/registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ eventId, attendeeId: profile.id })
      });
      if (!response.ok) throw new Error((await response.text()) || "Failed to register.");
      // refresh list
      const r2 = await fetch(`${API_BASE}/api/registrations/me`, { headers: { Authorization: `Bearer ${token}` } });
      if (r2.ok) setRegistrations((await r2.json()) as RegistrationDto[]);
    } catch (err) {
      setRegistrationError(err instanceof Error ? err.message : "Failed to register.");
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleCancelRegistration = async (eventId: string) => {
    if (!profile || !token || profile.role !== "Attendee") return;
    setRegistrationError("");
    setRegistrationLoading(true);
    try {
      const reg = registrations.find((r) => r.eventId === eventId);
      if (!reg) return;
      const response = await fetch(`${API_BASE}/api/registrations/${reg.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: "Cancelled" })
      });
      if (!response.ok) throw new Error((await response.text()) || "Failed to cancel registration.");
      const r2 = await fetch(`${API_BASE}/api/registrations/me`, { headers: { Authorization: `Bearer ${token}` } });
      if (r2.ok) setRegistrations((await r2.json()) as RegistrationDto[]);
    } catch (err) {
      setRegistrationError(err instanceof Error ? err.message : "Failed to cancel registration.");
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackModal || !profile || !token || profile.role !== "Attendee") return;
    setFeedbackSubmitError("");
    setFeedbackSubmitLoading(true);
    try {
      if (feedbackModal.feedbackId) {
        const response = await fetch(`${API_BASE}/api/feedback/${feedbackModal.feedbackId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            rating: feedbackModal.rating,
            comment: feedbackModal.comment
          })
        });
        if (!response.ok) throw new Error((await response.text()) || "Failed to update feedback.");
      } else {
        const response = await fetch(`${API_BASE}/api/feedback`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            eventId: feedbackModal.eventId,
            attendeeId: profile.id,
            rating: feedbackModal.rating,
            comment: feedbackModal.comment
          })
        });
        if (!response.ok) throw new Error((await response.text()) || "Failed to submit feedback.");
      }
      const r2 = await fetch(`${API_BASE}/api/feedback/me`, { headers: { Authorization: `Bearer ${token}` } });
      if (r2.ok) setFeedbackMine((await r2.json()) as FeedbackDto[]);
      setFeedbackModal(null);
    } catch (err) {
      setFeedbackSubmitError(err instanceof Error ? err.message : "Failed to submit feedback.");
    } finally {
      setFeedbackSubmitLoading(false);
    }
  };

  const handleDeleteFeedback = async (feedbackId: string) => {
    if (!profile || profile.role !== "Attendee") return;
    if (!window.confirm("Remove this feedback? Event ratings will update.")) return;
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE}/api/feedback/${feedbackId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) return;
      const r2 = await fetch(`${API_BASE}/api/feedback/me`, { headers: { Authorization: `Bearer ${token}` } });
      if (r2.ok) setFeedbackMine((await r2.json()) as FeedbackDto[]);
    } catch {
      // ignore
    }
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const dashboardNotificationItems: DashboardNotificationItem[] = useMemo(() => {
    if (!profile) return [];
    return notifications
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((n) => ({
        id: n.id,
        body: n.message,
        read: n.isRead,
        createdAt: n.createdAt,
        tone: inferLiveNotificationTone(n.message)
      }));
  }, [profile, notifications]);

  const resolveEventTitle = (eventId: string) => {
    const e =
      featuredEvents.find((x) => x.id === eventId) ??
      approvedCatalogEvents.find((x) => x.id === eventId) ??
      adminCatalogEvents.find((x) => x.id === eventId) ??
      recommendations.find((x) => x.id === eventId) ??
      myEvents.find((x) => x.id === eventId);
    return e?.title ?? "Event";
  };

  const markNotificationRead = async (id: string) => {
    if (!profile || !token) return;
    try {
      const response = await fetch(`${API_BASE}/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) return;
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch {
      // ignore
    }
  };

  const handleNotificationActivate = (item: DashboardNotificationItem) => {
    void markNotificationRead(item.id);
    if (item.relatedEventId) {
      setPage("home");
      setGlobalInboxOpen(false);
      setCalendarSelectedEvent(null);
    }
  };

  const attendeeEventsWithoutFeedback = useMemo(() => {
    if (!profile || profile.role !== "Attendee") return [] as { eventId: string; title: string }[];
    const fed = new Set(feedbackMine.map((f) => f.eventId));
    return registrations
      .filter((r) => r.status.toLowerCase() !== "cancelled" && !fed.has(r.eventId))
      .map((r) => ({ eventId: r.eventId, title: r.eventTitle }));
  }, [profile, feedbackMine, registrations]);

  const dashboardTitle =
    profile?.role === "Admin" ? "Admin hub" : profile?.role === "Organizer" ? "Organizer hub" : "Attendee hub";

  const adminSummary = useMemo(() => {
    const getStatus = (e: EventItem) => resolveEventApprovalStatus(e);
    const source = adminCatalogEvents;
    const pending = source.filter((e) => getStatus(e) === "pending").length;
    const approved = source.filter((e) => getStatus(e) === "approved").length;
    const rejected = source.filter((e) => getStatus(e) === "rejected").length;
    return { pending, approved, rejected, total: source.length };
  }, [adminCatalogEvents]);

  const attendeeBrowsePool = useMemo((): EventItem[] => {
    if (!profile || profile.role !== "Attendee") return [];
    const pool = approvedCatalogEvents;
    return pool.slice().sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  }, [profile, approvedCatalogEvents]);

  const attendeeBrowseFiltered = useMemo(() => {
    const q = dashboardSearch.trim().toLowerCase();
    if (!q) return attendeeBrowsePool;
    return attendeeBrowsePool.filter((e) => {
      const hay = `${e.title} ${e.category} ${e.location} ${(e.tags ?? []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [attendeeBrowsePool, dashboardSearch]);

  const dashboardSearchPlaceholder = useMemo(() => {
    if (!profile) return "Quick search…";
    if (profile.role === "Attendee") {
      return dashboardSection === "events"
        ? "Search title, category, location…"
        : "Open Events — search filters the browse grid";
    }
    if (profile.role === "Organizer") {
      return dashboardSection === "my-events"
        ? "Search your listings…"
        : "Open My events — search filters your listings";
    }
    if (profile.role === "Admin") {
      return dashboardSection === "approvals"
        ? "Filter queue by title, category, location…"
        : "Open Approvals — search filters the queue";
    }
    return "Quick search…";
  }, [profile, dashboardSection]);

  const metricTiles = useMemo(() => {
    if (!profile) {
      return [
        { label: "Session", value: "Guest", icon: UserCircle, accent: "slate" as const },
        { label: "Live updates", value: "0", icon: Activity, accent: "brand" as const },
        { label: "Recommended", value: "0", icon: Sparkles, accent: "violet" as const },
        { label: "Featured", value: "0", icon: CalendarDays, accent: "amber" as const }
      ];
    }
    if (profile.role === "Admin") {
      return [
        { label: "Pending review", value: String(adminSummary.pending), icon: CalendarClock, accent: "amber" as const },
        { label: "Approved", value: String(adminSummary.approved), icon: CalendarDays, accent: "brand" as const },
        { label: "Rejected", value: String(adminSummary.rejected), icon: XCircle, accent: "violet" as const },
        { label: "Live updates", value: String(realtimeFeed.length), icon: Activity, accent: "slate" as const }
      ];
    }
    if (profile.role === "Organizer") {
      const pendingN = myEvents.filter((e) => resolveEventApprovalStatus(e) === "pending").length;
      const feedbackN = organizerAnalytics?.perEvent.reduce((s, x) => s + x.feedbackCount, 0) ?? 0;
      return [
        { label: "My events", value: String(myEvents.length), icon: CalendarDays, accent: "brand" as const },
        { label: "Pending approval", value: String(pendingN), icon: CalendarClock, accent: "amber" as const },
        { label: "Feedback", value: String(feedbackN), icon: Star, accent: "violet" as const },
        { label: "Live updates", value: String(realtimeFeed.length), icon: Activity, accent: "slate" as const }
      ];
    }
    const regN = registrations.filter((r) => r.status.toLowerCase() !== "cancelled").length;
    return [
      { label: "My registrations", value: String(regN), icon: Users, accent: "brand" as const },
      { label: "Live updates", value: String(realtimeFeed.length), icon: Activity, accent: "slate" as const },
      { label: "Recommended", value: String(recommendations.length), icon: Sparkles, accent: "violet" as const },
      { label: "Featured", value: String(featuredEvents.length), icon: CalendarDays, accent: "amber" as const }
    ];
  }, [
    profile,
    adminSummary,
    myEvents,
    realtimeFeed.length,
    recommendations.length,
    featuredEvents.length,
    registrations,
    organizerAnalytics
  ]);

  const toAttendeeDetailFromRegistration = (r: RegistrationDto): EventItem => ({
    id: r.eventId,
    title: r.eventTitle,
    description: r.eventDescription ?? "",
    dateTime: r.eventDateTime,
    location: r.eventLocation,
    priceLabel: r.eventPriceLabel ?? "Free",
    imageUrl: r.eventImageUrl,
    rating: 0,
    reviewCount: 0,
    attendeeCount: 0,
    category: r.eventCategory,
    capacity: r.eventCapacity ?? 0,
    isApproved: true,
    organizerId: "",
    tags: r.eventTags ?? []
  });

  const goExplore = () => {
    setPage("home");
    requestAnimationFrame(() => document.getElementById("featured-events")?.scrollIntoView({ behavior: "smooth" }));
  };

  const goCreateEvent = () => {
    if (isAuthenticated && profile && (profile.role === "Organizer" || profile.role === "Admin")) {
      setPage("dashboard");
      setDashboardSection("overview");
      requestAnimationFrame(() => document.getElementById("create-event-form")?.scrollIntoView({ behavior: "smooth" }));
    } else {
      setPage("signup");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-page">
      {!(page === "dashboard" && isAuthenticated && profile) ? (
        <Navigation
          currentPage={page}
          onNavigate={setPage}
          isAuthenticated={isAuthenticated}
          userRole={profile?.role ?? null}
          onLogout={handleLogout}
          onExploreEvents={goExplore}
          onCreateEvents={goCreateEvent}
          inboxUnreadCount={unreadNotificationsCount}
          onOpenInbox={isAuthenticated && profile ? () => setGlobalInboxOpen(true) : undefined}
        />
      ) : null}

      {globalInboxOpen && isAuthenticated && profile && page !== "login" && page !== "signup" ? (
        <div className="fixed inset-0 z-[60]" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close activity and notifications"
            onClick={() => setGlobalInboxOpen(false)}
          />
          <div
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl sm:max-w-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="global-inbox-title"
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
              <div className="min-w-0">
                <p id="global-inbox-title" className="text-sm font-semibold text-slate-900">
                  Activity & notifications
                </p>
                <p className="text-xs text-slate-500">
                  {unreadNotificationsCount > 0
                    ? `${unreadNotificationsCount} unread`
                    : dashboardNotificationItems.length === 0 && realtimeFeed.length === 0
                      ? "No items yet"
                      : "All caught up"}
                </p>
              </div>
              <Button type="button" variant="secondary" size="sm" onClick={() => setGlobalInboxOpen(false)}>
                Done
              </Button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              <NotificationsPanel
                showHeader={false}
                heading="Activity & notifications"
                activityLines={realtimeFeed}
                unreadCount={unreadNotificationsCount}
                items={dashboardNotificationItems}
                loading={notificationsLoading}
                error={notificationsError || null}
                onMarkRead={(id) => void markNotificationRead(id)}
                onItemClick={(item) => handleNotificationActivate(item)}
                className="max-h-[calc(100vh-5.5rem)] rounded-xl border-0 shadow-none"
              />
            </div>
          </div>
        </div>
      ) : null}

      {page === "login" && (
        <LoginPage
          email={email}
          password={password}
          loading={loading}
          error={error}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={(e) => void handleAuthSubmit(e, "login")}
          onNavigateSignup={() => setPage("signup")}
          onNavigateSupport={() => setPage("support")}
          onGoogleClick={() => setError("Google sign-in is not configured yet. Use email and password.")}
          onAppleClick={() => setError("Apple sign-in is not configured yet. Use email and password.")}
        />
      )}

      {page === "signup" && (
        <SignupPage
          fullName={fullName}
          email={email}
          password={password}
          role={role}
          loading={loading}
          error={error}
          onFullNameChange={setFullName}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onRoleChange={setRole}
          onSubmit={(e) => void handleAuthSubmit(e, "signup")}
          onNavigateLogin={() => setPage("login")}
          onGoogleClick={() => setError("Google sign-up is not configured yet. Use the form above.")}
          onAppleClick={() => setError("Apple sign-up is not configured yet. Use the form above.")}
        />
      )}

      {page !== "login" && page !== "signup" && (
        <main
          className={cn(
            "flex-1",
            page === "dashboard" && isAuthenticated && profile ? "flex min-h-0 flex-col px-0 pb-0 md:px-0" : "px-4 pb-10 md:px-10"
          )}
        >
          {page === "dashboard" && isAuthenticated && profile ? (
            <div className="flex min-h-0 flex-1 flex-col">
          <DashboardShell
            role={profile.role}
            section={dashboardSection}
            onSection={setDashboardSection}
            searchQuery={dashboardSearch}
            onSearchQuery={setDashboardSearch}
            searchPlaceholder={dashboardSearchPlaceholder}
            unreadCount={unreadNotificationsCount}
            onOpenInbox={() => setGlobalInboxOpen(true)}
            onLogout={handleLogout}
            onExplore={() => setPage("home")}
            userName={profile.fullName}
            userEmail={profile.email}
          >
            {dashboardSection === "overview" ? (
              <DashboardWelcomeCard title={dashboardTitle} fullName={profile.fullName} unreadCount={unreadNotificationsCount} />
            ) : null}

            <DashboardPageBody
              role={profile.role}
              profile={profile}
              section={dashboardSection}
              token={token}
              apiBase={API_BASE}
              realtimeFeed={realtimeFeed}
              unreadNotificationsCount={unreadNotificationsCount}
              dashboardNotificationItems={dashboardNotificationItems}
              notificationsLoading={notificationsLoading}
              notificationsError={notificationsError}
              onMarkNotificationRead={markNotificationRead}
              onNotificationItemClick={handleNotificationActivate}
              recommendations={recommendations}
              attendeeBrowseFiltered={attendeeBrowseFiltered}
              attendeeBrowsePool={attendeeBrowsePool}
              attendeeEventDetails={attendeeEventDetails}
              setAttendeeEventDetails={setAttendeeEventDetails}
              myEvents={myEvents}
              adminCatalogEvents={adminCatalogEvents}
              approvedCatalogEvents={approvedCatalogEvents}
              registrations={registrations}
              calendarSelectedEvent={calendarSelectedEvent}
              setCalendarSelectedEvent={setCalendarSelectedEvent}
              registrationLoading={registrationLoading}
              registrationError={registrationError}
              isRegisteredForEvent={isRegisteredForEvent}
              onRegisterForEvent={handleRegisterForEvent}
              onCancelRegistration={handleCancelRegistration}
              metricTiles={metricTiles}
              organizerAnalytics={organizerAnalytics}
              organizerAnalyticsLoading={organizerAnalyticsLoading}
              organizerAnalyticsError={organizerAnalyticsError}
              adminSummary={adminSummary}
              feedbackModal={feedbackModal}
              setFeedbackModal={setFeedbackModal}
              feedbackSubmitError={feedbackSubmitError}
              feedbackSubmitLoading={feedbackSubmitLoading}
              onSubmitFeedback={handleSubmitFeedback}
              toAttendeeDetailFromRegistration={toAttendeeDetailFromRegistration}
              selectedInterestTags={selectedInterestTags}
              setSelectedInterestTags={setSelectedInterestTags}
              interestOtherInput={interestOtherInput}
              setInterestOtherInput={setInterestOtherInput}
              interestSaveFeedback={interestSaveFeedback}
              interestSaveLoading={interestSaveLoading}
              onSaveInterests={handleSaveInterests}
              suggestTitle={suggestTitle}
              setSuggestTitle={setSuggestTitle}
              suggestDescription={suggestDescription}
              setSuggestDescription={setSuggestDescription}
              suggestRationale={suggestRationale}
              setSuggestRationale={setSuggestRationale}
              suggestStatus={suggestStatus}
              suggestLoading={suggestLoading}
              onSubmitSuggestion={handleSubmitEventSuggestion}
              attendeeEventsWithoutFeedback={attendeeEventsWithoutFeedback}
              feedbackLoading={feedbackLoading}
              feedbackError={feedbackError}
              feedbackMine={feedbackMine}
              resolveEventTitle={resolveEventTitle}
              onDeleteFeedback={handleDeleteFeedback}
              dashboardSearch={dashboardSearch}
              onRefreshMyEvents={refreshMyEvents}
              newEvent={newEvent}
              setNewEvent={setNewEvent}
              createStatus={createStatus}
              onCreateEventSubmit={handleCreateEvent}
              organizerSuggestionsLoading={organizerSuggestionsLoading}
              organizerSuggestions={organizerSuggestions}
              adminReviewTab={adminReviewTab}
              setAdminReviewTab={setAdminReviewTab}
              adminReviewEvent={adminReviewEvent}
              setAdminReviewEvent={setAdminReviewEvent}
              adminApproveEvent={adminApproveEvent}
              setAdminApproveEvent={setAdminApproveEvent}
              adminRejectEvent={adminRejectEvent}
              setAdminRejectEvent={setAdminRejectEvent}
              adminPendingEvent={adminPendingEvent}
              setAdminPendingEvent={setAdminPendingEvent}
              onSaveAdminComment={handleSaveAdminComment}
              onApproveEvent={handleApproveEvent}
              onRejectEvent={handleRejectEvent}
              onMarkEventPending={handleMarkEventPending}
            />
          </DashboardShell>
            </div>
          ) : (
            <PublicContent>
              {page === "home" && (
                <HomePage
                  events={homeBrowseEvents}
                  onNavigate={setPage}
                  onCreateEvent={goCreateEvent}
                  isAuthenticated={isAuthenticated}
                />
              )}
              {page === "about" && <AboutPage />}
              {page === "contact" && (
                <ContactPage
                  contactName={contactName}
                  contactEmail={contactEmail}
                  contactSubject={contactSubject}
                  contactMessage={contactMessage}
                  contactLoading={contactLoading}
                  contactFeedback={contactFeedback}
                  onContactNameChange={setContactName}
                  onContactEmailChange={setContactEmail}
                  onContactSubjectChange={setContactSubject}
                  onContactMessageChange={setContactMessage}
                  onSubmit={handleContactSubmit}
                />
              )}
              {page === "support" && <SupportPage onNavigate={setPage} />}
            </PublicContent>
          )}
        </main>
      )}

      <Footer onNavigate={(p) => setPage(p as Page)} />
    </div>
  );
}

export default App;
