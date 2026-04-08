namespace SmartEventManagement.API.Models;

public class EventSuggestion
{
    public Guid Id { get; set; }
    public Guid AttendeeId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Rationale { get; set; }
    public DateTimeOffset CreatedAt { get; set; }

    public Profile Attendee { get; set; } = null!;
}
