import { DashboardShell } from "@/features/dashboard/components/DashboardShell";
import { DashboardWelcomeCard } from "@/features/dashboard/components/DashboardWelcomeCard";
import type { DashboardSection } from "@/app-types";
import type { AuthProfile } from "@/features/auth/types";
import { DashboardPageBody, type DashboardPageBodyProps } from "@/features/dashboard/pages/DashboardPageBody";

export type DashboardViewProps = {
  profile: AuthProfile;
  section: DashboardSection;
  onSection: (section: DashboardSection) => void;
  searchQuery: string;
  onSearchQuery: (value: string) => void;
  searchPlaceholder: string;
  unreadCount: number;
  onOpenInbox: () => void;
  onLogout: () => void;
  onExplore: () => void;
  title: string;
  bodyProps: DashboardPageBodyProps;
};

export function DashboardView({
  profile,
  section,
  onSection,
  searchQuery,
  onSearchQuery,
  searchPlaceholder,
  unreadCount,
  onOpenInbox,
  onLogout,
  onExplore,
  title,
  bodyProps
}: DashboardViewProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DashboardShell
        role={profile.role}
        section={section}
        onSection={onSection}
        searchQuery={searchQuery}
        onSearchQuery={onSearchQuery}
        searchPlaceholder={searchPlaceholder}
        unreadCount={unreadCount}
        onOpenInbox={onOpenInbox}
        onLogout={onLogout}
        onExplore={onExplore}
        userName={profile.fullName}
        userEmail={profile.email}
      >
        {section === "overview" ? <DashboardWelcomeCard title={title} fullName={profile.fullName} unreadCount={unreadCount} /> : null}
        <DashboardPageBody {...bodyProps} />
      </DashboardShell>
    </div>
  );
}

