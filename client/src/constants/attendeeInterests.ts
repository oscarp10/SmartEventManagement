/** Preset interest tags — align with event categories and AI recommendation keywords (KOI EventHub). */
export const ATTENDEE_INTEREST_TAGS = [
  "Technology",
  "Career",
  "Networking",
  "Design",
  "Music",
  "Sports",
  "Art",
  "Food & Drink",
  "Wellness",
  "Academic",
  "Community",
  "Leadership",
  "International"
] as const;

export type AttendeeInterestTag = (typeof ATTENDEE_INTEREST_TAGS)[number];
