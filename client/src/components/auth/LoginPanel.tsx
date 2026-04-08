import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { AppleGlyph, GoogleGlyph } from "@/components/auth/SocialGlyphs";

export type LoginPanelProps = {
  email: string;
  password: string;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  loading: boolean;
  error: string;
  onSubmit: (e: FormEvent) => void;
  onNavigateSignup: () => void;
  onNavigateSupport: () => void;
  onGoogleClick: () => void;
  onAppleClick: () => void;
};

export function LoginPanel({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  loading,
  error,
  onSubmit,
  onNavigateSignup,
  onNavigateSupport,
  onGoogleClick,
  onAppleClick
}: LoginPanelProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-8 shadow-modern-xl sm:p-10">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-[#4A556C]">Welcome back</h2>
          <p className="mt-2 text-gray-600">Sign in with email to manage events and registrations.</p>
        </div>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700" htmlFor="login-email">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                disabled={loading}
                placeholder="your@email.com"
                className="w-full rounded-lg border-2 border-gray-200 py-3 pl-11 pr-4 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700" htmlFor="login-password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                disabled={loading}
                placeholder="••••••••"
                className="w-full rounded-lg border-2 border-gray-200 py-3 pl-11 pr-11 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full transform rounded-lg bg-gradient-brand py-4 font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner />
                Please wait…
              </span>
            ) : (
              "Continue"
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center" aria-hidden>
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs font-medium uppercase tracking-wider text-gray-500">
            <span className="bg-white px-3">Or continue with</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white py-3 text-sm font-medium text-gray-800 transition hover:border-brand-500/40 hover:bg-gray-50"
            onClick={onGoogleClick}
          >
            <GoogleGlyph className="h-5 w-5" />
            Continue with Google
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#222] bg-[#222] py-3 text-sm font-medium text-white transition hover:bg-black"
            onClick={onAppleClick}
          >
            <AppleGlyph className="h-5 w-5" />
            Continue with Apple
          </button>
        </div>

        <p className="mt-6 text-center text-gray-600">
          New here?{" "}
          <button type="button" className="font-bold text-brand-600 transition hover:text-brand-700" onClick={onNavigateSignup}>
            Create an account
          </button>
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-modern">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">Local database seed</p>
        <p className="mt-2 text-center text-sm text-gray-600">
          After <span className="font-medium text-gray-800">docker compose</span> + <span className="font-medium text-gray-800">dotnet run</span>, the API seeds
          three accounts (first run only). Use these to sign in:
        </p>
        <ul className="mt-4 space-y-2 text-left text-xs text-gray-700 sm:text-sm">
          <li className="rounded-lg bg-slate-50 px-3 py-2 font-mono">
            admin@koi.edu.au — AdminPass123!
          </li>
          <li className="rounded-lg bg-slate-50 px-3 py-2 font-mono">
            organizer@koi.edu.au — OrganizerPass123!
          </li>
          <li className="rounded-lg bg-slate-50 px-3 py-2 font-mono">
            attendee@koi.edu.au — AttendeePass123!
          </li>
        </ul>
        <p className="mt-3 text-center text-xs text-gray-500">
          Reset the DB volume if you need the seeder to run again.
        </p>
      </div>

      <p className="text-center text-sm text-gray-600">
        Looking for your event?{" "}
        <button type="button" className="font-bold text-brand-600 transition hover:text-brand-700" onClick={onNavigateSupport}>
          Contact support
        </button>
      </p>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
