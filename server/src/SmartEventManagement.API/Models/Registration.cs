namespace SmartEventManagement.API.Models;

public class Registration
{
    public Guid Id { get; set; }
    public Guid EventId { get; set; }
    public Guid AttendeeId { get; set; }
    public RegistrationStatus Status { get; set; } = RegistrationStatus.Registered;

    public Event Event { get; set; } = null!;
    public Profile Attendee { get; set; } = null!;
}
