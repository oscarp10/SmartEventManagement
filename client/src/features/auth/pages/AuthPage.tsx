import { useAuthContext } from "@/features/auth";
import { AuthPageView } from "@/features/auth/pages/AuthPageView";

type AuthMode = "login" | "signup";

type AuthPageProps = {
  mode: AuthMode;
  onNavigate: (page: "login" | "signup" | "support") => void;
  onAuthenticated: () => void;
};

export function AuthPage({ mode, onNavigate, onAuthenticated }: AuthPageProps) {
  const auth = useAuthContext();

  const handleAuthSubmit = async (e: React.FormEvent, submitMode: AuthMode) => {
    e.preventDefault();
    const result = await auth.submitAuth(submitMode);
    if (result.ok) {
      onAuthenticated();
    }
  };

  return (
    <AuthPageView
      mode={mode}
      fullName={auth.fullName}
      email={auth.email}
      password={auth.password}
      role={auth.role}
      loading={auth.loading}
      error={auth.error}
      onFullNameChange={auth.setFullName}
      onEmailChange={auth.setEmail}
      onPasswordChange={auth.setPassword}
      onRoleChange={auth.setRole}
      onSubmit={handleAuthSubmit}
      onNavigateSignup={() => onNavigate("signup")}
      onNavigateLogin={() => onNavigate("login")}
      onNavigateSupport={() => onNavigate("support")}
      onSetError={auth.setError}
    />
  );
}

