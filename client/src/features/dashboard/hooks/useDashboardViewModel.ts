import type { DashboardSection } from "@/app-types";
import type { AuthProfile } from "@/features/auth/types";
import type { DashboardPageBodyProps } from "@/features/dashboard/pages/DashboardPageBody";

type Args = {
  profile: AuthProfile | null;
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

export function useDashboardViewModel(args: Args) {
  if (!args.profile) return null;
  return {
    ...args,
    profile: args.profile
  };
}

