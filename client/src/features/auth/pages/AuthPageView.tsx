import type { FormEvent } from "react";
import type { Role } from "@/app-types";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { SignupPage } from "@/features/auth/pages/SignupPage";

type AuthMode = "login" | "signup";

export type AuthPageViewProps = {
  mode: AuthMode;
  fullName: string;
  email: string;
  password: string;
  role: Role;
  loading: boolean;
  error: string;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onRoleChange: (value: Role) => void;
  onSubmit: (e: FormEvent, mode: AuthMode) => void | Promise<void>;
  onNavigateSignup: () => void;
  onNavigateLogin: () => void;
  onNavigateSupport: () => void;
  onSetError: (value: string) => void;
};

export function AuthPageView({
  mode,
  fullName,
  email,
  password,
  role,
  loading,
  error,
  onFullNameChange,
  onEmailChange,
  onPasswordChange,
  onRoleChange,
  onSubmit,
  onNavigateSignup,
  onNavigateLogin,
  onNavigateSupport,
  onSetError
}: AuthPageViewProps) {
  if (mode === "login") {
    return (
      <LoginPage
        email={email}
        password={password}
        loading={loading}
        error={error}
        onEmailChange={onEmailChange}
        onPasswordChange={onPasswordChange}
        onSubmit={(e) => void onSubmit(e, "login")}
        onNavigateSignup={onNavigateSignup}
        onNavigateSupport={onNavigateSupport}
        onGoogleClick={() => onSetError("Google sign-in is not configured yet. Use email and password.")}
        onAppleClick={() => onSetError("Apple sign-in is not configured yet. Use email and password.")}
      />
    );
  }

  return (
    <SignupPage
      fullName={fullName}
      email={email}
      password={password}
      role={role}
      loading={loading}
      error={error}
      onFullNameChange={onFullNameChange}
      onEmailChange={onEmailChange}
      onPasswordChange={onPasswordChange}
      onRoleChange={onRoleChange}
      onSubmit={(e) => void onSubmit(e, "signup")}
      onNavigateLogin={onNavigateLogin}
      onGoogleClick={() => onSetError("Google sign-up is not configured yet. Use the form above.")}
      onAppleClick={() => onSetError("Apple sign-up is not configured yet. Use the form above.")}
    />
  );
}

