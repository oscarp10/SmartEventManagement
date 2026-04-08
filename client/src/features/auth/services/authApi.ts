import { parseError, request } from "@/lib/apiClient";

export const authApi = {
  async login(email: string, password: string) {
    const response = await request("/api/auth/login", { method: "POST", body: { email, password } });
    const raw = await response.text();
    let data: unknown = raw;
    try {
      data = JSON.parse(raw);
    } catch {
      // plain text responses are possible on error paths
    }
    if (!response.ok) {
      if (typeof data === "string" && data.trim()) throw new Error(data);
      if (data && typeof data === "object") {
        const d = data as { detail?: string; title?: string; message?: string };
        throw new Error(d.detail || d.title || d.message || "Authentication failed.");
      }
      throw await parseError(response, "Authentication failed.");
    }
    return data as { token?: unknown; profile?: unknown };
  },
  async signup(payload: { fullName: string; email: string; password: string; role: string }) {
    const response = await request("/api/auth/register", { method: "POST", body: payload });
    const raw = await response.text();
    let data: unknown = raw;
    try {
      data = JSON.parse(raw);
    } catch {
      // plain text responses are possible on error paths
    }
    if (!response.ok) {
      if (typeof data === "string" && data.trim()) throw new Error(data);
      if (data && typeof data === "object") {
        const d = data as { detail?: string; title?: string; message?: string };
        throw new Error(d.detail || d.title || d.message || "Authentication failed.");
      }
      throw await parseError(response, "Authentication failed.");
    }
    return data as { token?: unknown; profile?: unknown };
  }
};

