namespace SmartEventManagement.API.DTOs;

public sealed record CreateFeedbackRequest(Guid EventId, Guid AttendeeId, int Rating, string Comment);
public sealed record UpdateFeedbackRequest(int Rating, string Comment);
