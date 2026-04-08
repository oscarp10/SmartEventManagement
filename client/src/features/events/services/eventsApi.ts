import { parseError, parseJson, request } from "@/lib/apiClient";
import type { AuthProfile } from "@/features/auth/types";
import type { RegistrationDto } from "@/features/events/types";

export const eventsApi = {
  async listApproved() {
    const response = await request("/api/events");
    if (!response.ok) throw await parseError(response, "Failed to load events.");
    return parseJson<unknown[]>(response);
  },
  async listForAdmin(token: string) {
    const response = await request("/api/events?includeUnapproved=true", { token });
    if (!response.ok) throw await parseError(response, "Failed to load events.");
    return parseJson<unknown[]>(response);
  },
  async listForOrganizer(token: string, organizerId: string) {
    const response = await request(`/api/events/organizer/${organizerId}`, { token });
    if (!response.ok) throw await parseError(response, "Failed to load organizer events.");
    return parseJson<unknown[]>(response);
  },
  async saveAdminComment(token: string, eventId: string, comment: string) {
    const response = await request(`/api/events/${eventId}/admin-comment`, { method: "POST", token, body: { comment: comment || null } });
    if (!response.ok) throw await parseError(response, "Failed to save admin comment.");
  },
  async create(token: string, payload: unknown) {
    const response = await request("/api/events", { method: "POST", token, body: payload });
    if (!response.ok) throw await parseError(response, "Failed to create event.");
  },
  async approve(token: string, eventId: string) {
    const response = await request(`/api/events/${eventId}/approve`, { method: "POST", token });
    if (!response.ok) throw await parseError(response, "Failed to approve event.");
  },
  async reject(token: string, eventId: string, reason: string) {
    const response = await request(`/api/events/${eventId}/reject`, { method: "POST", token, body: { reason } });
    if (!response.ok) throw await parseError(response, "Failed to reject event.");
  },
  async markPending(token: string, eventId: string) {
    const response = await request(`/api/events/${eventId}/pending`, { method: "POST", token });
    if (!response.ok) throw await parseError(response, "Failed to mark event pending.");
  },
  async update(token: string, eventId: string, payload: unknown) {
    const response = await request(`/api/events/${eventId}`, { method: "PUT", token, body: payload });
    if (!response.ok) throw await parseError(response, "Failed to update event.");
  },
  async setRegistrationsOpen(token: string, eventId: string, open: boolean) {
    const path = open ? "open" : "close";
    const response = await request(`/api/events/${eventId}/registrations/${path}`, { method: "POST", token });
    if (!response.ok) throw await parseError(response, "Failed to update registration window.");
  },
  async recommendations(token: string, attendeeId: string, limit = 6) {
    const response = await request(`/api/recommendations/${attendeeId}?limit=${limit}`, { token });
    if (!response.ok) throw await parseError(response, "Failed to load recommendations.");
    return parseJson<unknown[]>(response);
  },
  async submitSuggestion(token: string, body: { title: string; description: string; rationale: string | null }) {
    const response = await request("/api/event-suggestions", { method: "POST", token, body });
    if (!response.ok) throw await parseError(response, "Could not submit suggestion.");
  },
  async listOrganizerSuggestions(token: string) {
    const response = await request("/api/event-suggestions/for-organizers", { token });
    if (!response.ok) throw await parseError(response, "Failed to load organizer suggestions.");
    return parseJson<Array<{ id: string; title: string; description: string; rationale?: string; createdAt: string; attendeeName: string; attendeeEmail: string }>>(response);
  }
};

export const registrationsApi = {
  async listMine(token: string) {
    const response = await request("/api/registrations/me", { token });
    if (!response.ok) throw await parseError(response, "Failed to load registrations.");
    return parseJson<RegistrationDto[]>(response);
  },
  async create(token: string, eventId: string, attendeeId: string) {
    const response = await request("/api/registrations", { method: "POST", token, body: { eventId, attendeeId } });
    if (!response.ok) throw await parseError(response, "Failed to register.");
  },
  async updateStatus(token: string, registrationId: string, status: string) {
    const response = await request(`/api/registrations/${registrationId}/status`, { method: "PATCH", token, body: { status } });
    if (!response.ok) throw await parseError(response, "Failed to update registration.");
  }
};

export const profileApi = {
  async saveInterests(token: string, userId: string, interests: string[]) {
    const response = await request(`/api/profiles/${userId}/interests`, { method: "PUT", token, body: { interests } });
    if (!response.ok) throw await parseError(response, "Failed to save interests.");
    return parseJson<AuthProfile>(response);
  }
};

