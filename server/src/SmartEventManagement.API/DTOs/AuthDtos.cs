using SmartEventManagement.API.Models;

namespace SmartEventManagement.API.DTOs;

public sealed record RegisterRequest(string FullName, string Email, string Password, UserRole Role, string[]? Interests);
public sealed record LoginRequest(string Email, string Password);
public sealed record AuthResponse(string Token, AuthProfileResponse Profile);
public sealed record AuthProfileResponse(Guid Id, string FullName, string Email, UserRole Role, string[] Interests);
