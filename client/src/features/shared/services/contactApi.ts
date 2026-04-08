import { parseError, request } from "@/lib/apiClient";

export const contactApi = {
  async submit(body: { name: string; email: string; subject: string; message: string }) {
    const response = await request("/api/contact", { method: "POST", body });
    if (!response.ok) throw await parseError(response, "Could not send your message.");
  }
};

