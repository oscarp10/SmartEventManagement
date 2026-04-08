import { Button } from "@/features/shared/components";
import { NotificationsPanel, type DashboardNotificationItem } from "@/features/dashboard/components/NotificationsPanel";

export type GlobalInboxDrawerProps = {
  open: boolean;
  unreadNotificationsCount: number;
  dashboardNotificationItems: DashboardNotificationItem[];
  realtimeFeed: string[];
  notificationsLoading: boolean;
  notificationsError: string;
  onClose: () => void;
  onMarkRead: (id: string) => void | Promise<void>;
  onItemClick: (item: DashboardNotificationItem) => void;
};

export function GlobalInboxDrawer({
  open,
  unreadNotificationsCount,
  dashboardNotificationItems,
  realtimeFeed,
  notificationsLoading,
  notificationsError,
  onClose,
  onMarkRead,
  onItemClick
}: GlobalInboxDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]" role="presentation">
      <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close activity and notifications" onClick={onClose} />
      <div
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl sm:max-w-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="global-inbox-title"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <div className="min-w-0">
            <p id="global-inbox-title" className="text-sm font-semibold text-slate-900">
              Activity & notifications
            </p>
            <p className="text-xs text-slate-500">
              {unreadNotificationsCount > 0
                ? `${unreadNotificationsCount} unread`
                : dashboardNotificationItems.length === 0 && realtimeFeed.length === 0
                  ? "No items yet"
                  : "All caught up"}
            </p>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          <NotificationsPanel
            showHeader={false}
            heading="Activity & notifications"
            activityLines={realtimeFeed}
            unreadCount={unreadNotificationsCount}
            items={dashboardNotificationItems}
            loading={notificationsLoading}
            error={notificationsError || null}
            onMarkRead={(id) => void onMarkRead(id)}
            onItemClick={onItemClick}
            className="max-h-[calc(100vh-5.5rem)] rounded-xl border-0 shadow-none"
          />
        </div>
      </div>
    </div>
  );
}

