import { useState } from "react";
import type { Role } from "@/app-types";
import { normalizeAuthProfile } from "@/lib/auth-profile";
import { authApi } from "@/features/auth/services/authApi";
import type { AuthProfile } from "@/features/auth/types";

type AuthMode = "login" | "signup";

export function useAuth() {
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

  const isAuthenticated = Boolean(token && profile);

  const submitAuth = async (mode: AuthMode) => {
    setError("");
    setLoading(true);
    try {
      const authRaw =
        mode === "signup"
          ? await authApi.signup({ fullName, email, password, role })
          : await authApi.login(email, password);
      const nextProfile = normalizeAuthProfile(authRaw.profile);
      if (!authRaw.token || !nextProfile) throw new Error("Authentication response is invalid.");
      const nextToken = String(authRaw.token);
      setToken(nextToken);
      setProfile(nextProfile);
      localStorage.setItem("sem_token", nextToken);
      localStorage.setItem("sem_profile", JSON.stringify(nextProfile));
      setPassword("");
      return { ok: true as const };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
      return { ok: false as const };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = (nextProfile: AuthProfile | null) => {
    setProfile(nextProfile);
    if (nextProfile) localStorage.setItem("sem_profile", JSON.stringify(nextProfile));
  };

  const logout = () => {
    setToken("");
    setProfile(null);
    localStorage.removeItem("sem_token");
    localStorage.removeItem("sem_profile");
  };

  return {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole,
    loading,
    error,
    setError,
    token,
    profile,
    setProfile: updateProfile,
    isAuthenticated,
    submitAuth,
    logout
  };
}

