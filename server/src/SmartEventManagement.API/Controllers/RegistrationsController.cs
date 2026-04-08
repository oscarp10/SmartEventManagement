using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using SmartEventManagement.API.Data;
using SmartEventManagement.API.DTOs;
using SmartEventManagement.API.Hubs;
using SmartEventManagement.API.Models;

namespace SmartEventManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RegistrationsController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly IHubContext<EventUpdatesHub> _hubContext;

    public RegistrationsController(AppDbContext dbContext, IHubContext<EventUpdatesHub> hubContext)
    {
        _dbContext = dbContext;
        _hubContext = hubContext;
    }

    [Authorize(Roles = "Attendee,Admin")]
    [HttpGet("me")]
    public async Task<ActionResult> GetMine()
    {
        var actorIdRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(actorIdRaw, out var actorId)) return Unauthorized();

        var registrations = await _dbContext.Registrations
            .AsNoTracking()
            .Include(x => x.Event)
            .Where(x => x.AttendeeId == actorId && x.Status != RegistrationStatus.Cancelled)
            .OrderByDescending(x => x.Id)
            .Select(x => new
            {
                x.Id,
                x.EventId,
                x.AttendeeId,
                status = x.Status.ToString(),
                eventTitle = x.Event.Title,
                eventDateTime = x.Event.DateTime,
                eventLocation = x.Event.Location,
                eventCategory = x.Event.Category,
                eventImageUrl = x.Event.ImageUrl,
                eventDescription = x.Event.Description,
                eventPriceLabel = x.Event.PriceLabel,
                eventCapacity = x.Event.Capacity,
                eventTags = x.Event.Tags
            })
            .ToListAsync();

        return Ok(registrations);
    }

    [Authorize(Roles = "Attendee,Admin")]
    [HttpPost]
    public async Task<ActionResult<Registration>> Register([FromBody] CreateRegistrationRequest request)
    {
        var actorIdRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var actorIsAdmin = User.IsInRole("Admin");
        if (!Guid.TryParse(actorIdRaw, out var actorId)) return Unauthorized();
        if (!actorIsAdmin && actorId != request.AttendeeId) return Forbid();

        var profile = await _dbContext.Profiles.AsNoTracking().FirstOrDefaultAsync(x => x.Id == request.AttendeeId);
        if (profile is null) return BadRequest("Attendee profile not found.");
        if (profile.Role != UserRole.Attendee) return BadRequest("Only attendees can register for events.");

        var eventEntity = await _dbContext.Events.FirstOrDefaultAsync(x => x.Id == request.EventId);
        if (eventEntity is null) return BadRequest("Event not found.");
        if (!eventEntity.IsApproved) return BadRequest("Event is not approved yet.");
        if (!eventEntity.RegistrationsOpen) return BadRequest("Registrations are closed for this event.");

        var activeCount = await _dbContext.Registrations.CountAsync(x => x.EventId == request.EventId && x.Status != RegistrationStatus.Cancelled);
        if (activeCount >= eventEntity.Capacity) return BadRequest("Event is full.");

        var duplicate = await _dbContext.Registrations.AnyAsync(x => x.EventId == request.EventId && x.AttendeeId == request.AttendeeId && x.Status != RegistrationStatus.Cancelled);
        if (duplicate) return Conflict("Already registered for this event.");

        var registration = new Registration
        {
            Id = Guid.NewGuid(),
            EventId = request.EventId,
            AttendeeId = request.AttendeeId,
            Status = RegistrationStatus.Registered
        };

        _dbContext.Registrations.Add(registration);
        await _dbContext.SaveChangesAsync();
        await BroadcastCapacityUpdate(request.EventId);

        return CreatedAtAction(nameof(GetMine), new { }, registration);
    }

    [Authorize(Roles = "Attendee,Organizer,Admin")]
    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult> UpdateStatus(Guid id, [FromBody] UpdateRegistrationStatusRequest request)
    {
        var actorIdRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var actorIsAdmin = User.IsInRole("Admin");
        if (!Guid.TryParse(actorIdRaw, out var actorId)) return Unauthorized();

        var registration = await _dbContext.Registrations.FirstOrDefaultAsync(x => x.Id == id);
        if (registration is null) return NotFound();

        // Attendee can update only their own registration; Organizer can update only registrations for their events.
        if (!actorIsAdmin)
        {
            if (User.IsInRole("Attendee") && registration.AttendeeId != actorId) return Forbid();
            if (User.IsInRole("Organizer"))
            {
                var ownsEvent = await _dbContext.Events.AsNoTracking().AnyAsync(x => x.Id == registration.EventId && x.OrganizerId == actorId);
                if (!ownsEvent) return Forbid();
            }
        }

        registration.Status = request.Status;
        await _dbContext.SaveChangesAsync();
        await BroadcastCapacityUpdate(registration.EventId);

        return NoContent();
    }

    [Authorize(Roles = "Organizer,Admin")]
    [HttpGet("organizer/{organizerId:guid}")]
    public async Task<ActionResult> GetForOrganizer(Guid organizerId)
    {
        var actorIdRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var actorIsAdmin = User.IsInRole("Admin");
        if (!Guid.TryParse(actorIdRaw, out var actorId)) return Unauthorized();
        if (!actorIsAdmin && actorId != organizerId) return Forbid();

        var registrations = await _dbContext.Registrations
            .AsNoTracking()
            .Include(x => x.Event)
            .Where(x => x.Event.OrganizerId == organizerId && x.Status != RegistrationStatus.Cancelled)
            .OrderByDescending(x => x.Id)
            .Select(x => new
            {
                x.Id,
                x.EventId,
                x.AttendeeId,
                status = x.Status.ToString(),
                eventTitle = x.Event.Title,
                eventDateTime = x.Event.DateTime
            })
            .ToListAsync();

        return Ok(registrations);
    }

    private async Task BroadcastCapacityUpdate(Guid eventId)
    {
        var eventEntity = await _dbContext.Events.AsNoTracking().FirstOrDefaultAsync(x => x.Id == eventId);
        if (eventEntity is null) return;

        var usedCapacity = await _dbContext.Registrations.CountAsync(x =>
            x.EventId == eventId &&
            x.Status != RegistrationStatus.Cancelled);

        await _hubContext.Clients.All.SendAsync("EventCapacityUpdated", new
        {
            eventId,
            capacity = eventEntity.Capacity,
            registered = usedCapacity,
            remaining = Math.Max(0, eventEntity.Capacity - usedCapacity)
        });
    }
}
