type TimeScope = "all" | "upcoming" | "past";
type ApprovalScope = "all" | "pending" | "approved" | "rejected";

export function OrganizerEventFilters({
  timeScope,
  setTimeScope,
  approvalScope,
  setApprovalScope,
  timeCounts,
  approvalCounts
}: {
  timeScope: TimeScope;
  setTimeScope: (v: TimeScope) => void;
  approvalScope: ApprovalScope;
  setApprovalScope: (v: ApprovalScope) => void;
  timeCounts: { all: number; upcoming: number; past: number };
  approvalCounts: { all: number; pending: number; approved: number; rejected: number };
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">When</p>
      <div className="flex flex-wrap gap-1 rounded-xl border border-slate-200/90 bg-slate-50/80 p-1">
        {(
          [
            ["all", "All dates", timeCounts.all],
            ["upcoming", "Upcoming", timeCounts.upcoming],
            ["past", "Past / completed", timeCounts.past]
          ] as const
        ).map(([key, label, count]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTimeScope(key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium tabular-nums transition ${
              timeScope === key ? "bg-brand-600 text-white shadow-sm" : "text-slate-600 hover:bg-white"
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Approval</p>
      <div className="flex flex-wrap gap-1 rounded-xl border border-slate-200/90 bg-white p-1 shadow-sm">
        {(
          [
            ["all", "All", approvalCounts.all],
            ["pending", "Pending", approvalCounts.pending],
            ["approved", "Approved", approvalCounts.approved],
            ["rejected", "Rejected", approvalCounts.rejected]
          ] as const
        ).map(([key, label, count]) => (
          <button
            key={key}
            type="button"
            onClick={() => setApprovalScope(key)}
            className={`rounded-lg px-3 py-2 text-sm font-medium tabular-nums transition sm:px-4 ${
              approvalScope === key ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>
    </div>
  );
}

