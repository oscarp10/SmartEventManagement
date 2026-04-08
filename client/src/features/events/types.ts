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

