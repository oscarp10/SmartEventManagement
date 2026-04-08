import { HeroSection } from "@/components/marketing/HeroSection";
import { Card, CardContent } from "@/features/shared/components";
import { ABOUT_IMAGE } from "@/config/site";

export function AboutPage() {
  return (
    <>
      <HeroSection
        title="About Us"
        subtitle="Smart Event Management is built for King's Own Institute - so organizers can manage events and attendees can discover them with confidence."
        image={ABOUT_IMAGE}
      />

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Role-driven workflows",
            desc: "Different experiences for Admins, Organizers, and Attendees - so each role sees what they need."
          },
          {
            title: "Real-time updates",
            desc: "Get live feedback when events are approved and when registrations affect capacity."
          },
          {
            title: "Smarter discovery",
            desc: "Attendee recommendations use interests + keyword matching to surface relevant events."
          },
          {
            title: "Organizer-ready tools",
            desc: "Create event listings with images, pricing labels, and category metadata."
          },
          {
            title: "Admin oversight",
            desc: "Admins can approve events before they appear publicly in the catalog."
          },
          {
            title: "Built for KOI",
            desc: "Designed around the community event needs of King's Own Institute."
          }
        ].map((item) => (
          <Card key={item.title}>
            <CardContent className="p-6">
              <p className="text-base font-semibold text-slate-900">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-slate-900">Our mission</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Give KOI organizers a smooth path from idea to approved event listing, and help attendees find the right events quickly - without confusion.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              This app focuses on clear UI, role-based controls, and transparent approval + capacity updates.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                { k: "Approval first", v: "Events stay private until reviewed." },
                { k: "Capacity awareness", v: "Keep registrations aligned with limits." }
              ].map((x) => (
                <div key={x.k} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">{x.k}</p>
                  <p className="mt-1 text-sm text-slate-600">{x.v}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <h3 className="text-lg font-semibold text-slate-900">How it works</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { t: "Explore", d: "Attendees browse approved events in the catalog." },
              { t: "Create", d: "Organizers submit event listings with key details." },
              { t: "Approve", d: "Admins review listings and approve them for public view." },
              { t: "Register", d: "Capacity updates help keep registrations accurate." }
            ].map((s) => (
              <Card key={s.t}>
                <CardContent className="p-5">
                  <p className="text-sm font-semibold text-slate-900">{s.t}</p>
                  <p className="mt-2 text-sm text-slate-600">{s.d}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
