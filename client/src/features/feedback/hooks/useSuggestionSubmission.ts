import type { AuthProfile } from "@/features/auth/types";

type Args = {
  profile: AuthProfile | null;
  suggestTitle: string;
  suggestDescription: string;
  suggestRationale: string;
  setSuggestTitle: (value: string) => void;
  setSuggestDescription: (value: string) => void;
  setSuggestRationale: (value: string) => void;
  setSuggestStatus: (value: string) => void;
  setSuggestLoading: (value: boolean) => void;
  submitSuggestion: (title: string, description: string, rationale: string) => Promise<void>;
};

export function useSuggestionSubmission({
  profile,
  suggestTitle,
  suggestDescription,
  suggestRationale,
  setSuggestTitle,
  setSuggestDescription,
  setSuggestRationale,
  setSuggestStatus,
  setSuggestLoading,
  submitSuggestion
}: Args) {
  const handleSubmitEventSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || profile.role !== "Attendee") return;
    setSuggestStatus("");
    if (!suggestTitle.trim() || !suggestDescription.trim()) {
      setSuggestStatus("Title and description are required.");
      return;
    }
    setSuggestLoading(true);
    try {
      await submitSuggestion(suggestTitle, suggestDescription, suggestRationale);
      setSuggestTitle("");
      setSuggestDescription("");
      setSuggestRationale("");
      setSuggestStatus("Thanks - organizers can review your idea in their hub.");
    } catch (err) {
      setSuggestStatus(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSuggestLoading(false);
    }
  };

  return { handleSubmitEventSuggestion };
}

