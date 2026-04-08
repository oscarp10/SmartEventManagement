import { useEffect, useState } from "react";
import { dashboardApi } from "@/features/dashboard/services/dashboardApi";
import type { OrganizerAnalyticsResponse } from "@/features/dashboard/types";

export function useOrganizerAnalytics(token: string, organizerId: string | null) {
  const [organizerAnalytics, setOrganizerAnalytics] = useState<OrganizerAnalyticsResponse | null>(null);
  const [organizerAnalyticsLoading, setOrganizerAnalyticsLoading] = useState(false);
  const [organizerAnalyticsError, setOrganizerAnalyticsError] = useState("");

  useEffect(() => {
    if (!token || !organizerId) {
      setOrganizerAnalytics(null);
      return;
    }
    const load = async () => {
      setOrganizerAnalyticsError("");
      setOrganizerAnalyticsLoading(true);
      try {
        setOrganizerAnalytics(await dashboardApi.organizerAnalytics(token, organizerId));
      } catch (err) {
        setOrganizerAnalyticsError(err instanceof Error ? err.message : "Failed to load analytics.");
      } finally {
        setOrganizerAnalyticsLoading(false);
      }
    };
    void load();
  }, [token, organizerId]);

  return { organizerAnalytics, organizerAnalyticsLoading, organizerAnalyticsError };
}

