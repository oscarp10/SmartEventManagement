namespace SmartEventManagement.API.DTOs;

public sealed record CreateEventSuggestionRequest(string Title, string Description, string? Rationale);
