import { useEffect, useMemo } from "react";
import type { Page } from "@/app-types";
import { useEventContext } from "@/features/events";
import { useContactForm } from "@/features/shared";
import { PublicPageView } from "@/features/shared/pages/PublicPageView";

type HomePageProps = {
  page: Page;
  isAuthenticated: boolean;
  onNavigate: (page: Page) => void;
  onCreateEvent: () => void;
  prefillName?: string;
  prefillEmail?: string;
};

export function HomePageContainer({ page, isAuthenticated, onNavigate, onCreateEvent, prefillName, prefillEmail }: HomePageProps) {
  const events = useEventContext();
  const {
    contactName,
    setContactName,
    contactEmail,
    setContactEmail,
    contactSubject,
    setContactSubject,
    contactMessage,
    setContactMessage,
    contactLoading,
    contactFeedback,
    handleContactSubmit,
    prefillFromProfile
  } = useContactForm();

  const homeBrowseEvents = useMemo(() => {
    return events.approvedCatalogEvents.length > 0 ? events.approvedCatalogEvents : events.featuredEvents;
  }, [events.approvedCatalogEvents, events.featuredEvents]);

  useEffect(() => {
    if (prefillName || prefillEmail) {
      prefillFromProfile(prefillName, prefillEmail);
    }
  }, [prefillName, prefillEmail, prefillFromProfile]);

  return (
    <PublicPageView
      page={page}
      isAuthenticated={isAuthenticated}
      homeBrowseEvents={homeBrowseEvents}
      onNavigate={onNavigate}
      onCreateEvent={onCreateEvent}
      contactName={contactName}
      contactEmail={contactEmail}
      contactSubject={contactSubject}
      contactMessage={contactMessage}
      contactLoading={contactLoading}
      contactFeedback={contactFeedback}
      onContactNameChange={setContactName}
      onContactEmailChange={setContactEmail}
      onContactSubjectChange={setContactSubject}
      onContactMessageChange={setContactMessage}
      onContactSubmit={handleContactSubmit}
    />
  );
}

