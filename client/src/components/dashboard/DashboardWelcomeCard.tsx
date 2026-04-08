import { LayoutDashboard } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export function DashboardWelcomeCard({
  title,
  fullName,
  unreadCount
}: {
  title: string;
  fullName: string;
  unreadCount: number;
}) {
  const initial = fullName.trim().charAt(0).toUpperCase() || "?";

  return (
    <Card className="relative overflow-hidden border-slate-200/80 bg-gradient-to-br from-white via-white to-slate-50/80 shadow-md ring-1 ring-slate-200/50">
      <div className="pointer-events-none absolute -right-8 -top-24 h-48 w-48 rounded-full bg-brand-400/15 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-slate-400/10 blur-3xl" aria-hidden />
      <CardContent className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-lg font-bold text-white shadow-lg shadow-brand-600/20">
            {initial}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Welcome back, <span className="font-medium text-slate-800">{fullName}</span>. Here&rsquo;s a quick pulse of your workspace.
            </p>
          </div>
        </div>
        {unreadCount > 0 ? (
          <div className="shrink-0 rounded-xl border border-brand-200/80 bg-brand-50/90 px-4 py-3 text-sm shadow-sm ring-1 ring-brand-100/50 sm:text-right">
            <p className="font-semibold text-brand-900">
              {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}
            </p>
            <p className="mt-0.5 text-xs text-brand-800/85">Open the bell in the header to check activity and notifications.</p>
          </div>
        ) : (
          <div className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/90 px-4 py-3 text-sm text-slate-600 ring-1 ring-slate-100">
            <LayoutDashboard className="h-5 w-5 shrink-0 text-slate-400" aria-hidden />
            <span>Notifications are clear.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
