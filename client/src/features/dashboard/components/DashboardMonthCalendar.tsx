import { useMemo, useState, type ReactNode } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

export type CalendarEventHighlight = "enrolled" | "interest" | "default";

export type DashboardCalendarEvent = {
  id: string;
  title: string;
  dateTime: string;
  highlight?: CalendarEventHighlight;
};

type DashboardMonthCalendarProps = {
  events: DashboardCalendarEvent[];
  onEventClick?: (event: DashboardCalendarEvent) => void;
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

function toLocalDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function highlightClasses(h: CalendarEventHighlight | undefined): string {
  switch (h) {
    case "interest":
      return "bg-violet-50 text-violet-900 ring-1 ring-violet-200/90 hover:bg-violet-100/90";
    case "enrolled":
      return "bg-brand-600 text-white hover:bg-brand-700";
    default:
      return "bg-brand-600 text-white hover:bg-brand-700";
  }
}

export function DashboardMonthCalendar({ events, onEventClick }: DashboardMonthCalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const byDay = useMemo(() => {
    const map = new Map<string, DashboardCalendarEvent[]>();
    for (const e of events) {
      const key = toLocalDateKey(new Date(e.dateTime));
      const list = map.get(key);
      if (list) list.push(e);
      else map.set(key, [e]);
    }
    for (const [, list] of map) {
      list.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    }
    return map;
  }, [events]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const previousMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return byDay.get(dateStr) ?? [];
  };

  const cells: ReactNode[] = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    cells.push(<div key={`empty-${i}`} className="aspect-square border-b border-r border-slate-200/90 bg-slate-50/80 p-1.5 sm:p-2" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const eventsOnDay = getEventsForDay(day);
    const todayCell = isToday(day);

    cells.push(
      <div
        key={day}
        className={`aspect-square border-b border-r border-slate-200/90 p-1.5 transition-colors sm:p-2 ${
          todayCell ? "bg-brand-50/60 ring-1 ring-inset ring-brand-200/80" : "bg-white hover:bg-slate-50/80"
        }`}
      >
        <div className={`text-xs font-semibold sm:text-sm ${todayCell ? "text-brand-800" : "text-slate-700"}`}>{day}</div>
        <div className="mt-1 space-y-0.5">
          {eventsOnDay.slice(0, 2).map((event) => (
            <button
              key={event.id}
              type="button"
              onClick={() => onEventClick?.(event)}
              className={`w-full truncate rounded-md px-1.5 py-0.5 text-left text-[10px] font-medium shadow-sm transition sm:text-xs ${highlightClasses(
                event.highlight ?? "default"
              )}`}
              title={event.title}
            >
              {event.title}
            </button>
          ))}
          {eventsOnDay.length > 2 ? (
            <div className="px-1 text-[10px] text-slate-500 sm:text-xs">+{eventsOnDay.length - 2} more</div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm ring-1 ring-slate-100/80 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 sm:text-xl">
          <CalendarIcon className="h-5 w-5 shrink-0 text-brand-600 sm:h-6 sm:w-6" aria-hidden />
          {monthNames[month]} {year}
        </h3>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={previousMonth}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0 border-l border-t border-slate-200/90">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="border-b border-r border-slate-200/90 bg-slate-50/90 py-2 text-center text-[11px] font-semibold text-slate-600 sm:text-sm">
            {d}
          </div>
        ))}
        {cells}
      </div>
    </div>
  );
}
