using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartEventManagement.API.Data;
using SmartEventManagement.API.DTOs;
using SmartEventManagement.API.Models;

namespace SmartEventManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventSuggestionsController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public EventSuggestionsController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [Authorize(Roles = "Attendee")]
    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreateEventSuggestionRequest request)
    {
        var actorIdRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(actorIdRaw, out var actorId)) return Unauthorized();

        var profile = await _dbContext.Profiles.AsNoTracking().FirstOrDefaultAsync(x => x.Id == actorId);
        if (profile is null || profile.Role != UserRole.Attendee) return Forbid();

        if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Description))
            return BadRequest("Title and description are required.");

        var entity = new EventSuggestion
        {
            Id = Guid.NewGuid(),
            AttendeeId = actorId,
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            Rationale = string.IsNullOrWhiteSpace(request.Rationale) ? null : request.Rationale.Trim(),
            CreatedAt = DateTimeOffset.UtcNow
        };

        _dbContext.EventSuggestions.Add(entity);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(ListForOrganizers), new { }, new { entity.Id });
    }

    [Authorize(Roles = "Organizer,Admin")]
    [HttpGet("for-organizers")]
    public async Task<ActionResult> ListForOrganizers()
    {
        var list = await _dbContext.EventSuggestions
            .AsNoTracking()
            .Include(x => x.Attendee)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new
            {
                x.Id,
                x.Title,
                x.Description,
                x.Rationale,
                x.CreatedAt,
                attendeeName = x.Attendee.FullName,
                attendeeEmail = x.Attendee.Email
            })
            .ToListAsync();

        return Ok(list);
    }
}
