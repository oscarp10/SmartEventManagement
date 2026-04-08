using SmartEventManagement.API.Models;

namespace SmartEventManagement.API.DTOs;

public sealed record CreateProfileRequest(
    Guid? Id,
    string FullName,
    string Email,
    UserRole Role,
    string[]? Interests
);

public sealed record UpdateInterestsRequest(string[]? Interests);
