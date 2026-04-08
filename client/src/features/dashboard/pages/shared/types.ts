import type { LucideIcon } from "lucide-react";
import type { StatAccent } from "@/features/dashboard/components/StatMetricCard";

export type MetricTile = {
  label: string;
  value: string;
  icon: LucideIcon;
  accent: StatAccent;
};

