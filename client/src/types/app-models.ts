import type { Role } from "../app-types";

export type AuthProfile = { id: string; fullName: string; email: string; role: Role; interests: string[] };

export type EventItem = {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  priceLabel: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  attendeeCount: number;
  category: string;
  capacity: number;
  isApproved: boolean;
  rejectionReason?: string;
  adminComment?: string;
  registrationsOpen?: boolean;
  organizerId: string;
  tags: string[];
};

export type RegistrationDto = {
  id: string;
  eventId: string;
  attendeeId: string;
  status: string;
  eventTitle: string;
  eventDateTime: string;
  eventLocation: string;
  eventCategory: string;
  eventImageUrl: string;
  eventDescription?: string;
  eventPriceLabel?: string;
  eventCapacity?: number;
  eventTags?: string[];
};

export type FeedbackDto = {
  id: string;
  eventId: string;
  attendeeId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type OrganizerAnalyticsResponse = {
  totals: {
    totalEvents: number;
    approvedEvents: number;
    pendingEvents: number;
    rejectedEvents: number;
    totalRegistrations: number;
    totalAttended: number;
    averageRating: number;
  };
  perEvent: Array<{
    id: string;
    title: string;
    dateTime: string;
    category: string;
    capacity: number;
    status: string;
    registered: number;
    attended: number;
    engagementRate: number;
    averageRating: number;
    feedbackCount: number;
  }>;
  byMonth: Array<{ year: number; month: number; registrations: number }>;
};
