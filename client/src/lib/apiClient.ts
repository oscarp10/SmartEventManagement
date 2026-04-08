type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  token?: string;
  body?: unknown;
};

export const API_BASE = import.meta.env.VITE_API_BASE?.replace(/\/$/, "") ?? "http://localhost:5000";

export async function request(path: string, options: RequestOptions = {}): Promise<Response> {
  const { method = "GET", token, body } = options;
  return fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {})
  });
}

export async function parseJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

export async function parseError(response: Response, fallback: string): Promise<Error> {
  const raw = await response.text();
  if (!raw.trim()) return new Error(fallback);
  try {
    const parsed = JSON.parse(raw) as { detail?: string; title?: string; message?: string };
    return new Error(parsed.detail || parsed.title || parsed.message || raw.replace(/^"|"$/g, "") || fallback);
  } catch {
    return new Error(raw.replace(/^"|"$/g, "") || fallback);
  }
}

