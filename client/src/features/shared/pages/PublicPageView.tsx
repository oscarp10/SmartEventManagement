import type { Page } from "@/app-types";
import { PublicContent } from "@/layouts/PublicContent";
import { AboutPage } from "@/features/shared/pages/AboutPage";
import { ContactPage } from "@/features/shared/pages/ContactPage";
import { HomePage } from "@/features/events/pages/HomePage";
import { SupportPage } from "@/features/shared/pages/SupportPage";
import type { EventItem } from "@/features/events/types";

type ContactFeedback = { type: "ok" | "err"; text: string } | null;

export type PublicPageViewProps = {
  page: Page;
  isAuthenticated: boolean;
  homeBrowseEvents: EventItem[];
  onNavigate: (page: Page) => void;
  onCreateEvent: () => void;
  contactName: string;
  contactEmail: string;
  contactSubject: string;
  contactMessage: string;
  contactLoading: boolean;
  contactFeedback: ContactFeedback;
  onContactNameChange: (value: string) => void;
  onContactEmailChange: (value: string) => void;
  onContactSubjectChange: (value: string) => void;
  onContactMessageChange: (value: string) => void;
  onContactSubmit: (e: React.FormEvent) => void | Promise<void>;
};

export function PublicPageView({
  page,
  isAuthenticated,
  homeBrowseEvents,
  onNavigate,
  onCreateEvent,
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
  onContactSubmit
}: PublicPageViewProps) {
  return (
    <PublicContent>
      {page === "home" && <HomePage events={homeBrowseEvents} onNavigate={onNavigate} onCreateEvent={onCreateEvent} isAuthenticated={isAuthenticated} />}
      {page === "about" && <AboutPage />}
      {page === "contact" && (
        <ContactPage
          contactName={contactName}
          contactEmail={contactEmail}
          contactSubject={contactSubject}
          contactMessage={contactMessage}
          contactLoading={contactLoading}
          contactFeedback={contactFeedback}
          onContactNameChange={onContactNameChange}
          onContactEmailChange={onContactEmailChange}
          onContactSubjectChange={onContactSubjectChange}
          onContactMessageChange={onContactMessageChange}
          onSubmit={onContactSubmit}
        />
      )}
      {page === "support" && <SupportPage onNavigate={onNavigate} />}
    </PublicContent>
  );
}

