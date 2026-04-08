namespace SmartEventManagement.API.Models;

public class Feedback
{
    public Guid Id { get; set; }
    public Guid EventId { get; set; }
    public Guid AttendeeId { get; set; }
    public int Rating { get; set; } // 1..5
    public string Comment { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public Event Event { get; set; } = null!;
    public Profile Attendee { get; set; } = null!;
}

