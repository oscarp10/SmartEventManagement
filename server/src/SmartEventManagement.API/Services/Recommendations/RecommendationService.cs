using SmartEventManagement.API.Models;

namespace SmartEventManagement.API.Services;

public class RecommendationService : IRecommendationService
{
    public IReadOnlyCollection<Event> GetRecommendations(
        Profile attendee,
        IReadOnlyCollection<Event> approvedEvents,
        IReadOnlyCollection<Registration> attendeeRegistrations,
        int limit = 6
    )
    {
        if (approvedEvents.Count == 0) return [];

        var alreadyRegisteredEventIds = attendeeRegistrations
            .Select(x => x.EventId)
            .ToHashSet();

        var interestKeywords = attendee.Interests
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .Select(x => x.Trim().ToLowerInvariant())
            .ToHashSet();

        var pastCategoryPreferences = attendeeRegistrations
            .Where(x => x.Event is not null)
            .Select(x => x.Event.Category?.Trim().ToLowerInvariant())
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .GroupBy(x => x!)
            .ToDictionary(x => x.Key, x => x.Count());

        var scored = approvedEvents
            .Where(x => !alreadyRegisteredEventIds.Contains(x.Id))
            .Select(x => new
            {
                Event = x,
                Score = CalculateScore(x, interestKeywords, pastCategoryPreferences)
            })
            .OrderByDescending(x => x.Score)
            .ThenBy(x => x.Event.DateTime)
            .Take(limit)
            .Select(x => x.Event)
            .ToArray();

        return scored;
    }

    private static int CalculateScore(Event eventItem, IReadOnlySet<string> interests, IReadOnlyDictionary<string, int> pastCategoryPreferences)
    {
        if (interests.Count == 0) return BaseScore(eventItem);

        var haystack = $"{eventItem.Title} {eventItem.Description} {string.Join(' ', eventItem.Tags)}"
            .ToLowerInvariant();

        var keywordHits = interests.Count(interest => haystack.Contains(interest, StringComparison.Ordinal));
        var tagHits = eventItem.Tags.Count(tag => interests.Contains(tag.Trim().ToLowerInvariant()));
        var categoryKey = eventItem.Category.Trim().ToLowerInvariant();
        var categoryBoost = pastCategoryPreferences.TryGetValue(categoryKey, out var times) ? Math.Min(30, times * 10) : 0;

        return BaseScore(eventItem) + (keywordHits * 12) + (tagHits * 20) + categoryBoost;
    }

    private static int BaseScore(Event eventItem)
    {
        var daysUntilEvent = Math.Max(0, (eventItem.DateTime.Date - DateTimeOffset.UtcNow.Date).Days);
        var recencyBoost = daysUntilEvent <= 14 ? 8 : 0;
        return 10 + recencyBoost;
    }
}
