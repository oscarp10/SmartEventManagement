namespace SmartEventManagement.API.Models;

public class Event
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTimeOffset DateTime { get; set; }
    public string Location { get; set; } = string.Empty;
    public string PriceLabel { get; set; } = "Free";
    public string ImageUrl { get; set; } = string.Empty;
    public decimal Rating { get; set; } = 0m;
    public int ReviewCount { get; set; }
    public int AttendeeCount { get; set; }
    public string Category { get; set; } = "General";
    public int Capacity { get; set; }
    public bool IsApproved { get; set; }
    public string? RejectionReason { get; set; }
    /// <summary>Guidance from admin for the organizer (e.g. requested changes before approval).</summary>
    public string? AdminComment { get; set; }
    /// <summary>When false, new attendee registrations are blocked.</summary>
    public bool RegistrationsOpen { get; set; } = true;
    public Guid OrganizerId { get; set; }
    public string[] Tags { get; set; } = [];

    public Profile Organizer { get; set; } = null!;
    public ICollection<Registration> Registrations { get; set; } = new List<Registration>();
    public ICollection<Feedback> Feedback { get; set; } = new List<Feedback>();
}
