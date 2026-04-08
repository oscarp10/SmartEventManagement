import { Activity, AlertCircle, Bell, CheckCircle, Info, XCircle } from "lucide-react";
import { Button } from "@/features/shared/components";
import type { LucideIcon } from "lucide-react";

export type NotificationTone = "success" | "error" | "warning" | "info";

export type DashboardNotificationItem = {
  id: string;
  title?: string;
  body: string;
  read: boolean;
  createdAt: string;
  tone?: NotificationTone;
  relatedEventId?: string;
};

export type NotificationsPanelProps = {
  unreadCount: number;
  items: DashboardNotificationItem[];
  loading: boolean;
  error: string | null;
  onMarkRead: (id: string) => void;
  /** Whole-row tap: e.g. mark read + navigate to related content */
  onItemClick?: (item: DashboardNotificationItem) => void;
  className?: string;
  showHeader?: boolean;
  /** Real-time hub lines (merged above notifications on all pages) */
  activityLines?: string[];
  /** Main heading — default "Notifications" */
  heading?: string;
};

function formatNotificationTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMs < 0) return date.toLocaleDateString();
  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return "Yesterday";
  return date.toLocaleDateString();
}

const toneIcon: Record<NotificationTone, { icon: LucideIcon; className: string }> = {
  success: { icon: CheckCircle, className: "text-emerald-600" },
  error: { icon: XCircle, className: "text-red-600" },
  warning: { icon: AlertCircle, className: "text-amber-600" },
  info: { icon: Info, className: "text-brand-600" }
};

export function NotificationsPanel({
  unreadCount,
  items,
  loading,
  error,
  onMarkRead,
  onItemClick,
  className = "",
  showHeader = true,
  activityLines = [],
  heading = "Activity & notifications"
}: NotificationsPanelProps) {
  const hasActivity = activityLines.length > 0;
  const showEmptyNotifications = !loading && items.length === 0;

  return (
    <div
      className={`flex max-h-[min(85vh,720px)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-modern ${className}`}
    >
      {showHeader ? (
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 ring-1 ring-brand-100/80">
              <Bell className="h-5 w-5 text-brand-600" aria-hidden />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-900">{heading}</h3>
              <p className="text-xs text-slate-500">
                {unreadCount > 0 ? `${unreadCount} unread` : items.length === 0 && !hasActivity ? "Nothing new yet" : "Inbox & live updates"}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="min-h-0 flex-1 space-y-0 overflow-y-auto">
        {error ? <p className="m-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

        {hasActivity ? (
          <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Activity className="h-3.5 w-3.5 text-brand-600" aria-hidden />
              Live activity
            </div>
            <ul className="space-y-2">
              {activityLines.map((line, idx) => (
                <li
                  key={`${idx}-${line.slice(0, 40)}`}
                  className="rounded-lg border border-slate-200/90 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm"
                >
                  {line}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="border-b border-slate-100 px-4 py-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Notifications</p>
        </div>

        {loading ? (
          <div className="space-y-2 p-3">
            {[1, 2, 3].map((s) => (
              <div key={s} className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm">
                <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
                <div className="mt-2 h-3 w-full animate-pulse rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : showEmptyNotifications ? (
          <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Bell className="h-8 w-8 text-slate-400" aria-hidden />
            </div>
            <p className="mt-3 font-medium text-slate-700">No notifications</p>
            <p className="mt-1 max-w-xs text-sm text-slate-500">Alerts for registrations, approvals, and reminders appear here.</p>
          </div>
        ) : (
          items.map((n) => {
            const tone: NotificationTone = n.tone ?? "info";
            const { icon: Icon, className: iconClass } = toneIcon[tone];
            return (
              <article
                key={n.id}
                role={onItemClick ? "button" : undefined}
                tabIndex={onItemClick ? 0 : undefined}
                onKeyDown={
                  onItemClick
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onItemClick(n);
                        }
                      }
                    : undefined
                }
                onClick={
                  onItemClick
                    ? () => {
                        onItemClick(n);
                      }
                    : undefined
                }
                className={`mx-2 my-2 rounded-xl border border-slate-200/80 px-4 py-3 shadow-sm transition-colors ${
                  onItemClick ? "cursor-pointer hover:bg-slate-50/80" : ""
                } ${!n.read ? "bg-brand-50/40 ring-1 ring-brand-100/70" : "bg-white"}`}
              >
                <div className="flex gap-3">
                  <div className="mt-0.5 shrink-0">
                    <Icon className={`h-5 w-5 ${iconClass}`} aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      {n.title ? <p className="text-sm font-semibold text-slate-900">{n.title}</p> : null}
                      {!n.read ? <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-500" aria-hidden /> : null}
                    </div>
                    <p className={`text-sm leading-relaxed text-slate-600 ${n.title ? "mt-0.5" : "font-medium text-slate-800"}`}>{n.body}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatNotificationTime(n.createdAt)}</p>
                    {!n.read ? (
                      <div className="mt-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            onMarkRead(n.id);
                          }}
                        >
                          Mark read
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
