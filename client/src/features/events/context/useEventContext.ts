import { useContext } from "react";
import { EventContext } from "@/features/events/context/EventContext";

export function useEventContext() {
  const ctx = useContext(EventContext);
  if (!ctx) {
    throw new Error("useEventContext must be used within EventProvider");
  }
  return ctx;
}

