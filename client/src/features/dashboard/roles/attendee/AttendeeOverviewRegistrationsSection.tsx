import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/features/shared/components";
import type { RegistrationDto } from "@/features/events/types";
import type { DashboardSection } from "@/app-types";

export function AttendeeOverviewRegistrationsSection({
  section,
  registrations,
  registrationLoading,
  registrationError,
  onOpenRegistrationAsEvent
}: {
  section: DashboardSection;
  registrations: RegistrationDto[];
  registrationLoading: boolean;
  registrationError: string;
  onOpenRegistrationAsEvent: (r: RegistrationDto) => void;
}) {
  if (section !== "overview") return null;
  return (
    <section>
      <Card className="border-slate-200/80 shadow-md ring-1 ring-slate-100/80">
        <CardHeader>
          <CardTitle>My registrations</CardTitle>
          <CardDescription>Events you&apos;re signed up for from the database-backed catalogue.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {registrationLoading ? (
            <p className="mt-4 text-sm text-slate-600">Loading...</p>
          ) : registrationError ? (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{registrationError}</p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {registrations.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 py-8 text-center text-sm text-slate-600">
                  No registrations yet.
                </p>
              ) : (
                registrations.slice(0, 5).map((r) => (
                  <article
                    key={r.id}
                    className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-100/80 transition hover:border-brand-200/80 hover:shadow-md"
                    role="button"
                    tabIndex={0}
                    onClick={() => onOpenRegistrationAsEvent(r)}
                    onKeyDown={(ev) => {
                      if (ev.key === "Enter" || ev.key === " ") onOpenRegistrationAsEvent(r);
                    }}
                  >
                    <div className="relative aspect-[16/9] bg-slate-100">
                      <img src={r.eventImageUrl} alt={r.eventTitle} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-slate-900">{r.eventTitle}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {new Date(r.eventDateTime).toLocaleDateString()} — {r.eventLocation}
                      </p>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

