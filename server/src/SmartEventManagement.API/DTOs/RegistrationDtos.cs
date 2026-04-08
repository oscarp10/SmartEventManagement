using SmartEventManagement.API.Models;

namespace SmartEventManagement.API.DTOs;

public sealed record CreateRegistrationRequest(Guid EventId, Guid AttendeeId);
public sealed record UpdateRegistrationStatusRequest(RegistrationStatus Status);
