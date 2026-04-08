import { useCallback, useEffect, useState } from "react";
import { ATTENDEE_INTEREST_TAGS } from "@/constants/attendeeInterests";
import { profileApi } from "@/features/events/services/eventsApi";
import type { AuthProfile } from "@/features/auth/types";

export function useAttendeeInterests(
  token: string,
  profile: AuthProfile | null,
  setProfile: (next: AuthProfile | null) => void
) {
  const [selectedInterestTags, setSelectedInterestTags] = useState<string[]>([]);
  const [interestOtherInput, setInterestOtherInput] = useState("");
  const [interestSaveLoading, setInterestSaveLoading] = useState(false);
  const [interestSaveFeedback, setInterestSaveFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    if (profile?.role !== "Attendee") return;
    const interests = profile.interests ?? [];
    const preset = new Set<string>([...ATTENDEE_INTEREST_TAGS]);
    setSelectedInterestTags(interests.filter((x) => preset.has(x)));
    setInterestOtherInput(interests.filter((x) => !preset.has(x)).join(", "));
  }, [profile?.id, profile?.role, profile?.interests]);

  const saveInterests = useCallback(async () => {
    if (!profile || !token || profile.role !== "Attendee") return;
    setInterestSaveFeedback(null);
    setInterestSaveLoading(true);
    try {
      const extra = interestOtherInput
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
      const interests = [...new Set([...selectedInterestTags, ...extra])];
      const updated = await profileApi.saveInterests(token, profile.id, interests);
      const nextProfile = { ...profile, interests: updated.interests ?? [] };
      setProfile(nextProfile);
      setInterestSaveFeedback({ type: "ok", text: "Interests saved." });
    } catch (err) {
      setInterestSaveFeedback({
        type: "err",
        text: err instanceof Error ? err.message : "Failed to save interests."
      });
    } finally {
      setInterestSaveLoading(false);
    }
  }, [profile, token, interestOtherInput, selectedInterestTags, setProfile]);

  return {
    selectedInterestTags,
    setSelectedInterestTags,
    interestOtherInput,
    setInterestOtherInput,
    interestSaveLoading,
    interestSaveFeedback,
    saveInterests
  };
}

