import { Calendar, MapPin, User } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export interface AdminEvent {
  id: string;
  title: string;
  description: string;
  organizerName: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  adminComment?: string;
}

interface AdminEventCardProps {
  event: AdminEvent;
  onReview: (event: AdminEvent) => void;
  onMarkAsPending?: (event: AdminEvent) => void;
  isRemoving?: boolean;
}

export function AdminEventCard({ event, onReview, onMarkAsPending, isRemoving = false }: AdminEventCardProps) {
  const styles: Record<AdminEvent["status"], string> = {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
    rejected: "bg-red-100 text-red-800 border-red-200"
  };

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-100/70 transition-all duration-300 hover:border-brand-200/80 hover:shadow-md ${
        isRemoving ? "scale-95 opacity-0" : "scale-100 opacity-100"
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="mb-2 truncate text-lg font-semibold text-slate-900">{event.title}</h3>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <User className="h-4 w-4" />
            <span className="truncate">Organizer: {event.organizerName}</span>
          </div>
        </div>
        <Badge className={`${styles[event.status]} border`}>{event.status.charAt(0).toUpperCase() + event.status.slice(1)}</Badge>
      </div>

      {event.adminComment ? (
        <p className="mb-3 rounded-lg border border-brand-200/80 bg-brand-50/90 px-3 py-2 text-xs text-brand-950">
          <span className="font-semibold">Admin note: </span>
          {event.adminComment}
        </p>
      ) : null}
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="h-4 w-4" />
          <span>
            {event.date} at {event.time}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <MapPin className="h-4 w-4" />
          <span className="truncate">{event.location}</span>
        </div>
      </div>

      <Button onClick={() => onReview(event)} className="w-full">
        Review
      </Button>

      {event.status !== "pending" && onMarkAsPending && (
        <Button onClick={() => onMarkAsPending(event)} variant="secondary" className="mt-2 w-full">
          Mark as Pending
        </Button>
      )}
    </div>
  );
}

