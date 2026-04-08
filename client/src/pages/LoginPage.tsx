import type { FormEvent } from "react";
import { AuthShell } from "../components/auth/AuthShell";
import { LoginPanel } from "../components/auth/LoginPanel";
export type LoginPageProps = {
  email: string;
  password: string;
  loading: boolean;
  error: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void | Promise<void>;
  onNavigateSignup: () => void;
  onNavigateSupport: () => void;
  onGoogleClick: () => void;
  onAppleClick: () => void;
};

export function LoginPage({
  email,
  password,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onNavigateSignup,
  onNavigateSupport,
  onGoogleClick,
  onAppleClick
}: LoginPageProps) {
  return (
    <AuthShell
      headline="Sign in and stay on top of every event."
      subheadline="Approve listings, publish experiences, and help attendees find what matters — all connected to your local EventHub API."
    >
      <LoginPanel
        email={email}
        password={password}
        onEmailChange={onEmailChange}
        onPasswordChange={onPasswordChange}
        loading={loading}
        error={error}
        onSubmit={(e) => void onSubmit(e)}
        onNavigateSignup={onNavigateSignup}
        onNavigateSupport={onNavigateSupport}
        onGoogleClick={onGoogleClick}
        onAppleClick={onAppleClick}
      />
    </AuthShell>
  );
}
