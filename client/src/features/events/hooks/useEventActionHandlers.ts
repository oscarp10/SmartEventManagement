import { useCallback } from "react";
import { useEventContext } from "@/features/events/context/useEventContext";

type UseEventActionHandlersArgs = {
  onAdminCommentSaved?: (eventId: string, comment: string) => void;
};

export function useEventActionHandlers({ onAdminCommentSaved }: UseEventActionHandlersArgs = {}) {
  const events = useEventContext();

  const handleSaveInterests = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await events.saveInterests();
    },
    [events]
  );

  const handleCreateEvent = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await events.createEvent();
    },
    [events]
  );

  const handleSaveAdminComment = useCallback(
    async (eventId: string, comment: string) => {
      await events.saveAdminComment(eventId, comment);
      onAdminCommentSaved?.(eventId, comment);
    },
    [events, onAdminCommentSaved]
  );

  return { handleSaveInterests, handleCreateEvent, handleSaveAdminComment };
}

