import { Bell, User, Ticket } from "lucide-react";
import type { Page, Role } from "../app-types";

export type NavigationProps = {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isAuthenticated: boolean;
  userRole: Role | null;
  onLogout: () => void;
  onExploreEvents: () => void;
  onCreateEvents: () => void;
  /** When set, shows inbox bell with optional unread badge (all authenticated pages). */
  inboxUnreadCount?: number;
  onOpenInbox?: () => void;
};

function NavLink({
  label,
  active,
  onClick
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative pb-1 text-sm font-medium transition-colors ${
        active ? "text-brand-700" : "text-slate-600 hover:text-slate-900"
      }`}
    >
      {label}
      {active ? <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-brand-600" /> : null}
    </button>
  );
}

export function Navigation({
  currentPage,
  onNavigate,
  isAuthenticated,
  userRole,
  onLogout,
  onExploreEvents,
  onCreateEvents,
  inboxUnreadCount = 0,
  onOpenInbox
}: NavigationProps) {
  const exploreActive = currentPage === "home";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-4 sm:px-8 sm:py-4 md:px-10">
        <div className="flex min-w-0 items-center gap-6 sm:gap-10">
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="group flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight text-slate-900 transition hover:text-brand-800 sm:text-xl"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm transition group-hover:bg-brand-700">
              <Ticket className="h-5 w-5" aria-hidden />
            </span>
            <span>EventHub</span>
          </button>
          <nav className="hidden items-center gap-6 sm:flex md:gap-8">
            <NavLink label="Explore events" active={exploreActive} onClick={onExploreEvents} />
            <NavLink label="About" active={currentPage === "about"} onClick={() => onNavigate("about")} />
            <NavLink label="Contact" active={currentPage === "contact"} onClick={() => onNavigate("contact")} />
            <NavLink label="Support" active={currentPage === "support"} onClick={() => onNavigate("support")} />
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onCreateEvents}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 transition hover:border-brand-500 hover:text-brand-800 sm:px-4 sm:text-sm"
          >
            <span className="sm:hidden">Create</span>
            <span className="hidden sm:inline">Create event</span>
          </button>
          {isAuthenticated && userRole ? (
            <>
              {onOpenInbox ? (
                <button
                  type="button"
                  onClick={onOpenInbox}
                  className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-brand-400 hover:bg-brand-50 hover:text-brand-800"
                  aria-label="Open activity and notifications"
                >
                  <Bell className="h-5 w-5" aria-hidden />
                  {inboxUnreadCount > 0 ? (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white shadow-sm">
                      {inboxUnreadCount > 9 ? "9+" : inboxUnreadCount}
                    </span>
                  ) : null}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => onNavigate("dashboard")}
                className="hidden items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 sm:flex"
              >
                <User className="h-4 w-4" aria-hidden />
                <span>
                  {userRole === "Admin" ? "Admin hub" : userRole === "Organizer" ? "Organizer hub" : "Attendee hub"}
                </span>
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 sm:px-4 sm:text-sm"
              >
                Log out
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate("login")}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 sm:px-5"
            >
              Log in
            </button>
          )}
        </div>
      </div>
      <div className="no-scrollbar flex gap-1 overflow-x-auto border-t border-slate-100 px-4 py-2 sm:hidden">
        {(
          [
            ["Explore", onExploreEvents],
            ["About", () => onNavigate("about")],
            ["Contact", () => onNavigate("contact")],
            ["Support", () => onNavigate("support")]
          ] as const
        ).map(([label, fn]) => (
          <button
            key={label}
            type="button"
            onClick={fn}
            className="shrink-0 rounded-md bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-brand-100 hover:text-brand-900"
          >
            {label}
          </button>
        ))}
      </div>
    </header>
  );
}
