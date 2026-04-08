export type OrganizerEventItem = {
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
  approvalStatus?: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  adminComment?: string;
  registrationsOpen?: boolean;
  organizerId: string;
  tags: string[];
};

export type FeedbackApiRow = {
  id: string;
  eventId: string;
  attendeeId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

