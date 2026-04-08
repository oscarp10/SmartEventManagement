namespace SmartEventManagement.API.DTOs;

public sealed record CreateNotificationRequest(Guid UserId, string Message);
