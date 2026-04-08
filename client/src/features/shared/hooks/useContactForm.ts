import { useCallback, useState } from "react";
import { contactApi } from "@/features/shared/services/contactApi";

export function useContactForm() {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactLoading, setContactLoading] = useState(false);
  const [contactFeedback, setContactFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const submitContact = useCallback(async () => {
    setContactFeedback(null);
    setContactLoading(true);
    try {
      await contactApi.submit({
        name: contactName.trim(),
        email: contactEmail.trim(),
        subject: contactSubject.trim(),
        message: contactMessage.trim()
      });
      setContactFeedback({ type: "ok", text: "Thanks - we received your message and will get back to you soon." });
      setContactSubject("");
      setContactMessage("");
    } catch (err) {
      setContactFeedback({
        type: "err",
        text: err instanceof Error ? err.message : "Could not send your message."
      });
    } finally {
      setContactLoading(false);
    }
  }, [contactName, contactEmail, contactSubject, contactMessage]);

  const handleContactSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await submitContact();
    },
    [submitContact]
  );

  const prefillFromProfile = useCallback((fullName?: string, email?: string) => {
    if (fullName) setContactName((n) => (n ? n : fullName));
    if (email) setContactEmail((e) => (e ? e : email));
  }, []);

  return {
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
    submitContact,
    handleContactSubmit,
    prefillFromProfile
  };
}

