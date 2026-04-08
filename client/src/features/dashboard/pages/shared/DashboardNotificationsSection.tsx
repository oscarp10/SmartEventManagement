import { NotificationsPanel, type DashboardNotificationItem } from "@/features/dashboard/components/NotificationsPanel";
import type { DashboardSection } from "@/app-types";

export function DashboardNotificationsSection({
  section,
  realtimeFeed,
  unreadCount,
  items,
  loading,
  error,
  onMarkRead,
  onItemClick
}: {
  section: DashboardSection;
  realtimeFeed: string[];
  unreadCount: number;
  items: DashboardNotificationItem[];
  loading: boolean;
  error: string | null;
  onMarkRead: (id: string) => void;
  onItemClick: (item: DashboardNotificationItem) => void;
}) {
  if (section !== "notifications") return null;
  return (
    <NotificationsPanel
      activityLines={realtimeFeed}
      unreadCount={unreadCount}
      items={items}
      loading={loading}
      error={error}
      onMarkRead={onMarkRead}
      onItemClick={onItemClick}
      className="border-slate-200/80 shadow-md ring-1 ring-slate-100/80"
    />
  );
}

