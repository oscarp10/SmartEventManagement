import { parseError, parseJson, request } from "@/lib/apiClient";
import type { FeedbackDto } from "@/features/feedback/types";

export const feedbackApi = {
  async listMine(token: string) {
    const response = await request("/api/feedback/me", { token });
    if (!response.ok) throw await parseError(response, "Failed to load feedback.");
    return parseJson<FeedbackDto[]>(response);
  },
  async create(token: string, body: { eventId: string; attendeeId: string; rating: number; comment: string }) {
    const response = await request("/api/feedback", { method: "POST", token, body });
    if (!response.ok) throw await parseError(response, "Failed to submit feedback.");
  },
  async update(token: string, feedbackId: string, body: { rating: number; comment: string }) {
    const response = await request(`/api/feedback/${feedbackId}`, { method: "PUT", token, body });
    if (!response.ok) throw await parseError(response, "Failed to update feedback.");
  },
  async remove(token: string, feedbackId: string) {
    const response = await request(`/api/feedback/${feedbackId}`, { method: "DELETE", token });
    if (!response.ok) throw await parseError(response, "Failed to delete feedback.");
  },
  async listByEvent(token: string, eventId: string) {
    const response = await request(`/api/feedback/event/${eventId}`, { token });
    if (!response.ok) throw await parseError(response, "Failed to load event feedback.");
    return parseJson<Array<{ id: string; eventId: string; attendeeId: string; rating: number; comment: string; createdAt: string }>>(response);
  }
};

