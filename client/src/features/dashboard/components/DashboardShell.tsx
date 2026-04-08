import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Calendar,
  ChevronDown,
  Compass,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  Ticket,
  User,
  X
} from "lucide-react";
import type { DashboardSection, Role } from "@/app-types";
import { cn } from "@/features/shared";

export type DashboardShellNavItem = {
  id: DashboardSection;
  label: string;
  icon: typeof LayoutDashboard;
};

const SECTION_HEADING: Record<DashboardSection, string> = {
  overview: "Dashboard",
  events: "Browse events",
  calendar: "Calendar",
  notifications: "Notifications",
  profile: "Profile",
  approvals: "Approvals",
  "my-events": "My events"
};

export type DashboardShellProps = {
  role: Role;
  section: DashboardSection;
  onSection: (s: DashboardSection) => void;
  searchQuery: string;
  onSearchQuery: (q: string) => void;
  searchPlaceholder: string;
  unreadCount: number;
  onOpenInbox: () => void;
  onLogout: () => void;
  onExplore: () => void;
  userName: string;
  userEmail: string;
  children: React.ReactNode;
};

function navItemsForRole(role: Role): DashboardShellNavItem[] {
  const tail: DashboardShellNavItem[] = [
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile", label: "Profile", icon: User }
  ];
  if (role === "Attendee") {
    return [
      { id: "overview", label: "Dashboard", icon: LayoutDashboard },
      { id: "events", label: "Events", icon: Compass },
      ...tail
    ];
  }
  const base: DashboardShellNavItem[] = [{ id: "overview", label: "Dashboard", icon: LayoutDashboard }, ...tail];
  if (role === "Organizer") {
    return [
      base[0],
      { id: "my-events", label: "My events", icon: FolderKanban },
      ...base.slice(1)
    ];
  }
  if (role === "Admin") {
    return [
      base[0],
      { id: "approvals", label: "Approvals", icon: ShieldCheck },
      ...base.slice(1)
    ];
  }
  return base;
}

export function DashboardShell({
  role,
  section,
  onSection,
  searchQuery,
  onSearchQuery,
  searchPlaceholder,
  unreadCount,
  onOpenInbox,
  onLogout,
  onExplore,
  userName,
  userEmail,
  children
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!profileRef.current?.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const items = navItemsForRole(role);

  const navigateToSection = (s: DashboardSection) => {
    setSidebarOpen(false);
    onSection(s);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-page lg:flex-row">
      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-200 lg:static lg:z-0 lg:shadow-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-14 items-center justify-between gap-2 border-b border-slate-100 px-4 lg:h-16">
          <button
            type="button"
            onClick={onExplore}
            className="flex min-w-0 items-center gap-2 text-left font-bold tracking-tight text-slate-900"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
              <Ticket className="h-5 w-5" aria-hidden />
            </span>
            <span className="truncate text-sm sm:text-base">EventHub</span>
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3" aria-label="Dashboard">
          {items.map((item) => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateToSection(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition",
                  active ? "bg-brand-50 text-brand-900 ring-1 ring-brand-200/80" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className="h-5 w-5 shrink-0 opacity-80" aria-hidden />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-slate-100 p-3">
          <button
            type="button"
            onClick={onExplore}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-brand-300 hover:text-brand-900"
          >
            ← Public site
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
            <button
              type="button"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{SECTION_HEADING[section]}</p>
              <h1 className="truncate text-lg font-bold text-slate-900">{userName}</h1>
            </div>
            <div className="flex w-full flex-[1_1_100%] items-center gap-2 sm:flex-[1_1_auto] sm:max-w-md lg:max-w-lg">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => onSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenInbox}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-brand-400 hover:bg-brand-50"
                aria-label="Open activity and notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                ) : null}
              </button>
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((o) => !o)}
                  className="flex max-w-[10rem] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm shadow-sm transition hover:border-brand-300 sm:max-w-xs"
                  aria-expanded={profileOpen}
                  aria-haspopup="menu"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                    <User className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1 truncate font-medium text-slate-900">{userName}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
                </button>
                {profileOpen ? (
                  <div
                    className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-lg ring-1 ring-slate-100"
                    role="menu"
                  >
                    <div className="border-b border-slate-100 px-3 py-2">
                      <p className="truncate text-sm font-semibold text-slate-900">{userName}</p>
                      <p className="truncate text-xs text-slate-500">{userEmail}</p>
                      <p className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                        {role}
                      </p>
                    </div>
                    <button
                      type="button"
                      role="menuitem"
                      className="flex w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => {
                        setProfileOpen(false);
                        navigateToSection("profile");
                      }}
                    >
                      Profile settings
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className="flex w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => {
                        setProfileOpen(false);
                        onExplore();
                      }}
                    >
                      Explore events
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50"
                      onClick={() => {
                        setProfileOpen(false);
                        onLogout();
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
