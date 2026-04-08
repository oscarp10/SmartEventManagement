import type { FormEvent } from "react";
import { eventsApi } from "@/features/events/services/eventsApi";
import { feedbackApi } from "@/features/feedback/services/feedbackApi";
import type { FeedbackApiRow, OrganizerEventItem } from "@/features/dashboard/roles/organizer/components/OrganizerEventsTypes";

type EditForm = {
  title: string;
  description: string;
  dateTime: string;
  location: string;
  priceLabel: string;
  imageUrl: string;
  category: string;
  capacity: string;
  tags: string;
  rating: string;
  reviewCount: string;
  attendeeCount: string;
};

type Args = {
  token: string;
  onRefreshMyEvents: () => Promise<void>;
  setEditStatus: (value: string) => void;
  setActionBusyId: (value: string | null) => void;
  setFeedbackRows: (rows: FeedbackApiRow[]) => void;
  setFeedbackLoading: (value: boolean) => void;
  setFeedbackFor: (event: OrganizerEventItem | null) => void;
};

export function useOrganizerEventActions({
  token,
  onRefreshMyEvents,
  setEditStatus,
  setActionBusyId,
  setFeedbackRows,
  setFeedbackLoading,
  setFeedbackFor
}: Args) {
  const submitEdit = async (ev: FormEvent, editing: OrganizerEventItem | null, editForm: EditForm) => {
    ev.preventDefault();
    if (!editing) return;
    setEditStatus("");
    try {
      const body = {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        dateTime: new Date(editForm.dateTime).toISOString(),
        location: editForm.location.trim(),
        priceLabel: editForm.priceLabel.trim() || "Free",
        imageUrl: editForm.imageUrl.trim(),
        rating: parseFloat(editForm.rating) || 0,
        reviewCount: parseInt(editForm.reviewCount, 10) || 0,
        attendeeCount: parseInt(editForm.attendeeCount, 10) || 0,
        category: editForm.category.trim() || "General",
        capacity: Math.max(1, parseInt(editForm.capacity, 10) || 1),
        tags: editForm.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      };
      await eventsApi.update(token, editing.id, body);
      await onRefreshMyEvents();
      return { ok: true as const };
    } catch (err) {
      setEditStatus(err instanceof Error ? err.message : "Update failed.");
      return { ok: false as const };
    }
  };

  const toggleRegistrations = async (eventItem: OrganizerEventItem, open: boolean) => {
    setActionBusyId(eventItem.id);
    try {
      await eventsApi.setRegistrationsOpen(token, eventItem.id, open);
      await onRefreshMyEvents();
    } finally {
      setActionBusyId(null);
    }
  };

  const loadFeedback = async (eventItem: OrganizerEventItem) => {
    setFeedbackFor(eventItem);
    setFeedbackRows([]);
    setFeedbackLoading(true);
    try {
      setFeedbackRows(await feedbackApi.listByEvent(token, eventItem.id));
    } finally {
      setFeedbackLoading(false);
    }
  };

  return { submitEdit, toggleRegistrations, loadFeedback };
}

