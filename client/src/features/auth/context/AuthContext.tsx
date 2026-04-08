import { createContext } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";

export type AuthState = ReturnType<typeof useAuth>;

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

