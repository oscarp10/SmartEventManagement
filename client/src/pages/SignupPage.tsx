import type { FormEvent } from "react";
import { AuthShell } from "../components/auth/AuthShell";
import { SignupPanel } from "../components/auth/SignupPanel";
import type { Role } from "../app-types";

export type SignupPageProps = {
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
  onSubmit: (e: FormEvent) => void | Promise<void>;
  onNavigateLogin: () => void;
  onGoogleClick: () => void;
  onAppleClick: () => void;
};

export function SignupPage({
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
  onNavigateLogin,
  onGoogleClick,
  onAppleClick
}: SignupPageProps) {
  return (
    <AuthShell
      headline="Create your EventHub account in minutes."
      subheadline="Choose your role and register — data is stored in your local EventHub database (see seeded accounts on the login screen)."
    >
      <SignupPanel
        fullName={fullName}
        email={email}
        password={password}
        role={role}
        onFullNameChange={onFullNameChange}
        onEmailChange={onEmailChange}
        onPasswordChange={onPasswordChange}
        onRoleChange={onRoleChange}
        loading={loading}
        error={error}
        onSubmit={(e) => void onSubmit(e)}
        onNavigateLogin={onNavigateLogin}
        onGoogleClick={onGoogleClick}
        onAppleClick={onAppleClick}
      />
    </AuthShell>
  );
}
