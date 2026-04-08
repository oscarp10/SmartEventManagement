import type { Role } from "@/app-types";
import type { AuthProfile } from "@/features/auth/types";

export function toRole(value: unknown): Role {
  if (value === "Admin" || value === 0) return "Admin";
  if (value === "Organizer" || value === 1) return "Organizer";
  return "Attendee";
}

export function normalizeAuthProfile(raw: unknown): AuthProfile | null {
  if (!raw || typeof raw !== "object") return null;
  const x = raw as Record<string, unknown>;
  return {
    id: String(x.id ?? ""),
    fullName: String(x.fullName ?? ""),
    email: String(x.email ?? ""),
    role: toRole(x.role),
    interests: Array.isArray(x.interests) ? x.interests.map((i) => String(i)) : []
  };
}
