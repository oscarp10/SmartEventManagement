import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { cn } from "../../lib/utils";

const accents = {
  brand: "bg-brand-50 text-brand-800 ring-brand-100/80",
  violet: "bg-violet-50 text-violet-700 ring-violet-100/80",
  amber: "bg-amber-50 text-amber-800 ring-amber-100/80",
  slate: "bg-slate-100 text-slate-700 ring-slate-200/80"
} as const;

export type StatAccent = keyof typeof accents;

export function StatMetricCard({
  label,
  value,
  icon: Icon,
  accent = "brand"
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: StatAccent;
}) {
  return (
    <Card className="border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-100/80 transition duration-200 hover:shadow-md hover:ring-slate-200/80">
      <CardContent className="flex items-start gap-4 p-5">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ring-inset",
            accents[accent]
          )}
        >
          <Icon className="h-6 w-6" strokeWidth={2} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
          <p className="mt-1.5 truncate text-2xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
