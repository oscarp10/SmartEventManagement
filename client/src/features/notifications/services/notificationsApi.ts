import { parseError, parseJson, request } from "@/lib/apiClient";

export const notificationsApi = {
  async listMine(token: string) {
    const response = await request("/api/notifications/me", { token });
    if (!response.ok) throw await parseError(response, "Failed to load notifications.");
    return parseJson<Array<{ id: string; userId: string; message: string; isRead: boolean; createdAt: string }>>(response);
  },
  async markRead(token: string, id: string) {
    const response = await request(`/api/notifications/${id}/read`, { method: "PATCH", token });
    if (!response.ok) throw await parseError(response, "Failed to mark notification read.");
  }
};

