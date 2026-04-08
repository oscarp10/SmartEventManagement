namespace SmartEventManagement.API.Models;

public class Profile
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Attendee;
    public string[] Interests { get; set; } = [];

    public ICollection<Event> OrganizedEvents { get; set; } = new List<Event>();
    public ICollection<Registration> Registrations { get; set; } = new List<Registration>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public ICollection<Feedback> Feedback { get; set; } = new List<Feedback>();
    public ICollection<EventSuggestion> EventSuggestions { get; set; } = new List<EventSuggestion>();
}
