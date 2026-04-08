import { HeroSection } from "@/components/marketing/HeroSection";
import { Button } from "@/features/shared/components";
import { Card, CardContent } from "@/features/shared/components";
import { SUPPORT_IMAGE } from "@/config/site";
import type { Page } from "@/app-types";

export type SupportPageProps = {
  onNavigate: (page: Page) => void;
};

export function SupportPage({ onNavigate }: SupportPageProps) {
  return (
    <>
      <HeroSection
        title="Help & support"
        subtitle="Find answers, update event registration details, and get help from the Smart Event Management team."
        image={SUPPORT_IMAGE}
      />

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Event registration help",
            desc: "Search your confirmation email for your event registration reference. If you can't access the registration, contact us with the event name and the email you used."
          },
          {
            title: "Organizer tools",
            desc: "Log in as an organizer to manage listings, capacity, and approvals. Events appear publicly only after admin review."
          },
          {
            title: "Response times",
            desc: "We aim to reply within one business day. For urgent campus safety issues, follow your institution's emergency procedures first."
          }
        ].map((x) => (
          <Card key={x.title}>
            <CardContent className="p-6">
              <p className="text-sm font-semibold text-slate-900">{x.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{x.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardContent className="space-y-4 p-6">
          <h2 className="text-lg font-semibold text-slate-900">Looking for your event?</h2>
          <p className="text-sm text-slate-600">
            If you registered for an event and need access help or registration updates, email{" "}
            <a className="font-medium text-brand-700 hover:underline" href="mailto:sajad.ghatrehsamani@koi.edu.au">
              sajad.ghatrehsamani@koi.edu.au
            </a>{" "}
            with your event title and the email address used for the registration.
          </p>
          <Button variant="secondary" onClick={() => onNavigate("contact")}>
            Go to Contact Us
          </Button>
        </CardContent>
      </Card>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {[
          { q: "How do approvals work?", a: "Organizers submit listings; admins review and approve events before they appear publicly." },
          { q: "Can I update my interests?", a: "Yes - attendees can set interests after login to improve recommendations." },
          { q: "Why did an event show ‘Pending’?", a: "Some events require admin review before they become visible in the catalog." },
          { q: "How do capacity updates work?", a: "Registrations update capacity tracking so event limits stay accurate." }
        ].map((item) => (
          <Card key={item.q}>
            <CardContent className="p-6">
              <p className="text-sm font-semibold text-slate-900">{item.q}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.a}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
