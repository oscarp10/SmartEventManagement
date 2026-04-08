export type Role = "Admin" | "Organizer" | "Attendee";
export type Page = "home" | "login" | "signup" | "about" | "contact" | "support" | "dashboard";

/** Left-rail sections inside the authenticated dashboard shell. */
export type DashboardSection =
  | "overview"
  | "events"
  | "calendar"
  | "notifications"
  | "profile"
  | "approvals"
  | "my-events";

export type PublicEvent = {
  id: string;
  title: string;
  location: string;
  dateTime: string;
  priceLabel: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  attendeeCount: number;
  category: string;
  description?: string;
  tags?: string[];
  capacity?: number;
};
