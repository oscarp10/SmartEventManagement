namespace SmartEventManagement.API.DTOs;

public sealed record CreateEventRequest(
    string Title,
    string Description,
    DateTimeOffset DateTime,
    string Location,
    string PriceLabel,
    string ImageUrl,
    decimal Rating,
    int ReviewCount,
    int AttendeeCount,
    string Category,
    int Capacity,
    Guid OrganizerId,
    string[]? Tags
);

public sealed record UpdateEventRequest(
    string Title,
    string Description,
    DateTimeOffset DateTime,
    string Location,
    string PriceLabel,
    string ImageUrl,
    decimal Rating,
    int ReviewCount,
    int AttendeeCount,
    string Category,
    int Capacity,
    string[]? Tags
);

public sealed record RejectEventRequest(string? Reason);
public sealed record AdminCommentRequest(string? Comment);
