import { Clock, MapPin } from "lucide-react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/features/shared/components";
import { DashboardMonthCalendar } from "@/features/dashboard/components/DashboardMonthCalendar";
import type { DashboardSection, Role } from "@/app-types";
import type { AuthProfile } from "@/features/auth/types";
import type { EventItem, RegistrationDto } from "@/features/events/types";
import { eventMatchesProfileInterests } from "@/lib/events";

export function DashboardCalendarSection({
  section,
  role,
  profile,
  myEvents,
  adminCatalogEvents,
  approvedCatalogEvents,
  registrations,
  calendarSelectedEvent,
  setCalendarSelectedEvent,
  registrationLoading,
  registrationError,
  isRegisteredForEvent,
  onRegisterForEvent,
  onCancelRegistration
}: {
  section: DashboardSection;
  role: Role;
  profile: AuthProfile;
  myEvents: EventItem[];
  adminCatalogEvents: EventItem[];
  approvedCatalogEvents: EventItem[];
  registrations: RegistrationDto[];
  calendarSelectedEvent: EventItem | null;
  setCalendarSelectedEvent: (e: EventItem | null) => void;
  registrationLoading: boolean;
  registrationError: string;
  isRegisteredForEvent: (eventId: string) => boolean;
  onRegisterForEvent: (eventId: string) => void | Promise<void>;
  onCancelRegistration: (eventId: string) => void | Promise<void>;
}) {
  if (section !== "calendar") return null;

  const getCalendarItems = (): { items: EventItem[]; enrolledIds: Set<string> } => {
    if (role === "Organizer") return { items: myEvents, enrolledIds: new Set() };
    if (role === "Admin") {
      const items = adminCatalogEvents.slice().sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
      return { items, enrolledIds: new Set() };
    }
    const interests = profile.interests ?? [];
    const approvedPool = approvedCatalogEvents;
    const enrolledIds = new Set(registrations.filter((r) => r.status.toLowerCase() !== "cancelled").map((r) => r.eventId));
    const byId = new Map<string, EventItem>();
    for (const e of approvedPool) if (enrolledIds.has(e.id)) byId.set(e.id, e);
    for (const e of approvedPool) if (!enrolledIds.has(e.id) && eventMatchesProfileInterests(e, interests)) byId.set(e.id, e);
    const items = Array.from(byId.values()).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    return { items, enrolledIds };
  };

  const { items: calEvents, enrolledIds } = getCalendarItems();

  return (
    <Card className="overflow-hidden border-slate-200/80 shadow-md ring-1 ring-slate-100/80">
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
        <CardDescription>
          {role === "Attendee"
            ? "Registered sessions plus approved listings that match your profile interests."
            : role === "Organizer"
              ? "Your events on a monthly grid — click a listing for details."
              : "Full catalogue timeline, including items awaiting approval or rejected."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {calEvents.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 py-10 text-center text-sm text-slate-600">
            {role === "Attendee" ? "No registered or interest-matched events yet — browse the home page and update your interests." : "Nothing to show on the calendar yet."}
          </p>
        ) : (
          <>
            {role === "Attendee" ? (
              <p className="text-xs text-slate-500">
                <span className="font-medium text-slate-700">Brand chips</span> are confirmed registrations.{" "}
                <span className="font-medium text-violet-800">Soft violet</span> listings match your interests (you can register from the overview).
              </p>
            ) : null}
            <DashboardMonthCalendar
              events={calEvents.map((e) => ({
                id: e.id,
                title: e.title,
                dateTime: e.dateTime,
                highlight: role === "Attendee" ? (enrolledIds.has(e.id) ? "enrolled" : "interest") : "default"
              }))}
              onEventClick={(ce) => {
                const full = calEvents.find((x) => x.id === ce.id);
                if (full) setCalendarSelectedEvent(full);
              }}
            />
            {calendarSelectedEvent ? (
              <Card className="border-slate-200/80 bg-slate-50/30 shadow-sm ring-1 ring-slate-100/80">
                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <CardTitle className="text-lg">{calendarSelectedEvent.title}</CardTitle>
                    <CardDescription className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" aria-hidden />
                        {new Date(calendarSelectedEvent.dateTime).toLocaleString()}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" aria-hidden />
                        {calendarSelectedEvent.location}
                      </span>
                      <span className="text-slate-600">{calendarSelectedEvent.category}</span>
                    </CardDescription>
                  </div>
                  <Button type="button" variant="secondary" size="sm" onClick={() => setCalendarSelectedEvent(null)}>
                    Close
                  </Button>
                </CardHeader>
                {role === "Attendee" ? (
                  <CardContent className="pt-0">
                    {isRegisteredForEvent(calendarSelectedEvent.id) ? (
                      <Button variant="secondary" size="sm" disabled={registrationLoading} onClick={() => void onCancelRegistration(calendarSelectedEvent.id)}>
                        {registrationLoading ? "Please wait…" : "Cancel registration"}
                      </Button>
                    ) : (
                      <Button size="sm" disabled={registrationLoading} onClick={() => void onRegisterForEvent(calendarSelectedEvent.id)}>
                        {registrationLoading ? "Please wait…" : "Register for this event"}
                      </Button>
                    )}
                    {registrationError ? <p className="mt-2 text-sm text-red-600">{registrationError}</p> : null}
                  </CardContent>
                ) : null}
              </Card>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}

