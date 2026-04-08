using SmartEventManagement.API.Models;

namespace SmartEventManagement.API.Services;

public interface IRecommendationService
{
    IReadOnlyCollection<Event> GetRecommendations(
        Profile attendee,
        IReadOnlyCollection<Event> approvedEvents,
        IReadOnlyCollection<Registration> attendeeRegistrations,
        int limit = 6
    );
}
