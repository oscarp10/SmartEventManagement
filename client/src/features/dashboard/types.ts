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

