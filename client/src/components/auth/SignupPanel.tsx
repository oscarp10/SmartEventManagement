import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { Role } from "@/app-types";
import { AppleGlyph, GoogleGlyph } from "@/components/auth/SocialGlyphs";

export type SignupPanelProps = {
  fullName: string;
  email: string;
  password: string;
  role: Role;
  onFullNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onRoleChange: (v: Role) => void;
  loading: boolean;
  error: string;
  onSubmit: (e: FormEvent) => void;
  onNavigateLogin: () => void;
  onGoogleClick: () => void;
  onAppleClick: () => void;
};

export function SignupPanel({
  fullName,
  email,
  password,
  role,
  onFullNameChange,
  onEmailChange,
  onPasswordChange,
  onRoleChange,
  loading,
  error,
  onSubmit,
  onNavigateLogin,
  onGoogleClick,
  onAppleClick
}: SignupPanelProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="rounded-2xl bg-white p-8 shadow-modern-xl sm:p-10">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-[#4A556C]">Create your account</h2>
        <p className="mt-2 text-gray-600">Organizers and attendees — join the KOI event hub.</p>
      </div>

      <form className="space-y-5" onSubmit={onSubmit}>
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700" htmlFor="signup-name">
            Full name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="signup-name"
              required
              value={fullName}
              onChange={(e) => onFullNameChange(e.target.value)}
              disabled={loading}
              placeholder="Alex Chen"
              className="w-full rounded-lg border-2 border-gray-200 py-3 pl-11 pr-4 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700" htmlFor="signup-email">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="signup-email"
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
          <label className="mb-2 block text-sm font-semibold text-gray-700" htmlFor="signup-password">
            Password <span className="text-xs font-normal text-gray-500">(min. 8 characters)</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
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
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700" htmlFor="signup-role">
            Role
          </label>
          <select
            id="signup-role"
            value={role}
            onChange={(e) => onRoleChange(e.target.value as Role)}
            disabled={loading}
            className="w-full rounded-lg border-2 border-gray-200 bg-white py-3 px-4 outline-none transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="Attendee">Attendee</option>
            <option value="Organizer">Organizer</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full transform rounded-lg bg-gradient-brand py-4 font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? "Please wait…" : "Continue"}
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs font-medium uppercase tracking-wider text-gray-500">
          <span className="bg-white px-3">Or sign up with</span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white py-3 text-sm font-medium text-gray-800 transition hover:border-brand-500/40 hover:bg-gray-50"
          onClick={onGoogleClick}
        >
          <GoogleGlyph className="h-5 w-5" />
          Sign up with Google
        </button>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#222] bg-[#222] py-3 text-sm font-medium text-white transition hover:bg-black"
          onClick={onAppleClick}
        >
          <AppleGlyph className="h-5 w-5" />
          Sign up with Apple
        </button>
      </div>

      <p className="mt-6 text-center text-gray-600">
        Already have an account?{" "}
        <button type="button" className="font-bold text-brand-600 transition hover:text-brand-700" onClick={onNavigateLogin}>
          Log in
        </button>
      </p>
    </div>
  );
}
