import { parseError, parseJson, request } from "@/lib/apiClient";
import type { OrganizerAnalyticsResponse } from "@/features/dashboard/types";

export const dashboardApi = {
  async organizerAnalytics(token: string, organizerId: string) {
    const response = await request(`/api/analytics/organizer/${organizerId}`, { token });
    if (!response.ok) throw await parseError(response, "Failed to load analytics.");
    return parseJson<OrganizerAnalyticsResponse>(response);
  }
};

