import type { FormEvent } from "react";
import { HeroSection } from "../components/marketing/HeroSection";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { CONTACT_IMAGE } from "../config/site";

export type ContactPageProps = {
  contactName: string;
  contactEmail: string;
  contactSubject: string;
  contactMessage: string;
  contactLoading: boolean;
  contactFeedback: { type: "ok" | "err"; text: string } | null;
  onContactNameChange: (value: string) => void;
  onContactEmailChange: (value: string) => void;
  onContactSubjectChange: (value: string) => void;
  onContactMessageChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void | Promise<void>;
};

export function ContactPage({
  contactName,
  contactEmail,
  contactSubject,
  contactMessage,
  contactLoading,
  contactFeedback,
  onContactNameChange,
  onContactEmailChange,
  onContactSubjectChange,
  onContactMessageChange,
  onSubmit
}: ContactPageProps) {
  return (
    <>
      <HeroSection
        title="Contact Us"
        subtitle="Questions about events, organizing tools, or support? Send a message - our KOI event systems team will help."
        image={CONTACT_IMAGE}
      />

      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="grid gap-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-semibold text-slate-900">Email</p>
              <p className="mt-2 text-sm text-slate-600">sajad.ghatrehsamani@koi.edu.au</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-semibold text-slate-900">Office</p>
              <p className="mt-2 text-sm text-slate-600">King's Own Institute, Melbourne, Australia</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-semibold text-slate-900">Phone</p>
              <p className="mt-2 text-sm text-slate-600">+61 (0) 123 456 789</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-semibold text-slate-900">Response time</p>
              <p className="mt-2 text-sm text-slate-600">We aim to reply within one business day.</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-slate-900">Send us a message</h2>
            <p className="mt-2 text-sm text-slate-600">Tell us what you need. We'll respond as soon as possible.</p>
            <form className="mt-6 space-y-4" onSubmit={(e) => void onSubmit(e)}>
              <div>
                <label className="block text-sm font-medium text-slate-700" htmlFor="contact-name">
                  Name
                </label>
                <input
                  id="contact-name"
                  value={contactName}
                  onChange={(e) => onContactNameChange(e.target.value)}
                  required
                  minLength={2}
                  autoComplete="name"
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700" htmlFor="contact-email">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => onContactEmailChange(e.target.value)}
                  required
                  autoComplete="email"
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700" htmlFor="contact-subject">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  value={contactSubject}
                  onChange={(e) => onContactSubjectChange(e.target.value)}
                  required
                  minLength={2}
                  placeholder="e.g. Organizer support, account help, or technical issue"
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700" htmlFor="contact-message">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  value={contactMessage}
                  onChange={(e) => onContactMessageChange(e.target.value)}
                  required
                  minLength={10}
                  rows={6}
                  placeholder="How can we help?"
                  className="mt-1 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-500"
                />
              </div>
              {contactFeedback && (
                <p
                  className={`rounded-lg px-3 py-2 text-sm ${
                    contactFeedback.type === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"
                  }`}
                >
                  {contactFeedback.text}
                </p>
              )}
              <Button className="w-full sm:w-auto" type="submit" disabled={contactLoading}>
                {contactLoading ? "Sending…" : "Send message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          {
            title: "What to include",
            desc: "Your question, the event name (if relevant), and the email you used."
          },
          {
            title: "Organizer support",
            desc: "If you're creating an event, include the organizer name and what you tried."
          },
          {
            title: "Privacy",
            desc: "We only use your message to respond. No marketing emails are sent from this form."
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
    </>
  );
}
