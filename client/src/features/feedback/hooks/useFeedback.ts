import { useCallback, useEffect, useMemo, useState } from "react";
import { feedbackApi } from "@/features/feedback/services/feedbackApi";
import type { RegistrationDto } from "@/features/events/types";
import type { FeedbackDto } from "@/features/feedback/types";

type FeedbackModalState = {
  eventId: string;
  feedbackId?: string;
  rating: number;
  comment: string;
} | null;

export function useFeedback(token: string, attendeeId: string | null, registrations: RegistrationDto[]) {
  const [feedbackMine, setFeedbackMine] = useState<FeedbackDto[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");
  const [feedbackModal, setFeedbackModal] = useState<FeedbackModalState>(null);
  const [feedbackSubmitLoading, setFeedbackSubmitLoading] = useState(false);
  const [feedbackSubmitError, setFeedbackSubmitError] = useState("");

  const reloadFeedback = useCallback(async () => {
    if (!token || !attendeeId) {
      setFeedbackMine([]);
      return;
    }
    setFeedbackError("");
    setFeedbackLoading(true);
    try {
      setFeedbackMine(await feedbackApi.listMine(token));
    } catch (err) {
      setFeedbackError(err instanceof Error ? err.message : "Failed to load feedback.");
    } finally {
      setFeedbackLoading(false);
    }
  }, [token, attendeeId]);

  useEffect(() => {
    void reloadFeedback();
  }, [reloadFeedback]);

  const submitFeedback = useCallback(async () => {
    if (!feedbackModal || !token || !attendeeId) return;
    setFeedbackSubmitError("");
    setFeedbackSubmitLoading(true);
    try {
      if (feedbackModal.feedbackId) {
        await feedbackApi.update(token, feedbackModal.feedbackId, {
          rating: feedbackModal.rating,
          comment: feedbackModal.comment
        });
      } else {
        await feedbackApi.create(token, {
          eventId: feedbackModal.eventId,
          attendeeId,
          rating: feedbackModal.rating,
          comment: feedbackModal.comment
        });
      }
      setFeedbackMine(await feedbackApi.listMine(token));
      setFeedbackModal(null);
    } catch (err) {
      setFeedbackSubmitError(err instanceof Error ? err.message : "Failed to submit feedback.");
    } finally {
      setFeedbackSubmitLoading(false);
    }
  }, [feedbackModal, token, attendeeId]);

  const deleteFeedback = useCallback(
    async (feedbackId: string) => {
      if (!token || !attendeeId) return;
      if (!window.confirm("Remove this feedback? Event ratings will update.")) return;
      try {
        await feedbackApi.remove(token, feedbackId);
        setFeedbackMine(await feedbackApi.listMine(token));
      } catch {
        // ignore
      }
    },
    [token, attendeeId]
  );

  const attendeeEventsWithoutFeedback = useMemo(() => {
    if (!attendeeId) return [] as { eventId: string; title: string }[];
    const fed = new Set(feedbackMine.map((f) => f.eventId));
    return registrations
      .filter((r) => r.status.toLowerCase() !== "cancelled" && !fed.has(r.eventId))
      .map((r) => ({ eventId: r.eventId, title: r.eventTitle }));
  }, [attendeeId, feedbackMine, registrations]);

  return {
    feedbackMine,
    feedbackLoading,
    feedbackError,
    feedbackModal,
    setFeedbackModal,
    feedbackSubmitLoading,
    feedbackSubmitError,
    submitFeedback,
    deleteFeedback,
    attendeeEventsWithoutFeedback
  };
}

