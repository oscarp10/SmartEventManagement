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
public class FeedbackController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public FeedbackController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [Authorize(Roles = "Attendee,Organizer,Admin")]
    [HttpGet("event/{eventId:guid}")]
    public async Task<ActionResult> GetForEvent(Guid eventId)
    {
        var actorIdRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(actorIdRaw, out var actorId)) return Unauthorized();
        if (User.IsInRole("Organizer") && !User.IsInRole("Admin"))
        {
            var owns = await _dbContext.Events.AsNoTracking().AnyAsync(x => x.Id == eventId && x.OrganizerId == actorId);
            if (!owns) return Forbid();
        }

        var items = await _dbContext.Feedback
            .AsNoTracking()
            .Where(x => x.EventId == eventId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new
            {
                x.Id,
                x.EventId,
                x.AttendeeId,
                x.Rating,
                x.Comment,
                x.CreatedAt
            })
            .ToListAsync();

        return Ok(items);
    }

    [Authorize(Roles = "Attendee,Admin")]
    [HttpGet("me")]
    public async Task<ActionResult> GetMine()
    {
        var actorIdRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(actorIdRaw, out var actorId)) return Unauthorized();

        var items = await _dbContext.Feedback
            .AsNoTracking()
            .Where(x => x.AttendeeId == actorId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new
            {
                x.Id,
                x.EventId,
                x.AttendeeId,
                x.Rating,
                x.Comment,
                x.CreatedAt
            })
            .ToListAsync();

        return Ok(items);
    }

    [Authorize(Roles = "Attendee,Admin")]
    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreateFeedbackRequest request)
    {
        var actorIdRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var actorIsAdmin = User.IsInRole("Admin");
        if (!Guid.TryParse(actorIdRaw, out var actorId)) return Unauthorized();
        if (!actorIsAdmin && actorId != request.AttendeeId) return Forbid();

        if (request.Rating is < 1 or > 5) return BadRequest("Rating must be between 1 and 5.");
        if (string.IsNullOrWhiteSpace(request.Comment) || request.Comment.Trim().Length < 3) return BadRequest("Comment is required.");

        var attendee = await _dbContext.Profiles.AsNoTracking().FirstOrDefaultAsync(x => x.Id == request.AttendeeId);
        if (attendee is null) return BadRequest("Attendee profile not found.");
        if (attendee.Role != UserRole.Attendee) return BadRequest("Only attendees can submit feedback.");

        var ev = await _dbContext.Events.FirstOrDefaultAsync(x => x.Id == request.EventId);
        if (ev is null) return BadRequest("Event not found.");

        var hasRegistration = await _dbContext.Registrations.AsNoTracking().AnyAsync(x =>
            x.EventId == request.EventId &&
            x.AttendeeId == request.AttendeeId &&
            x.Status != RegistrationStatus.Cancelled);
        if (!hasRegistration) return BadRequest("You must be registered for this event before leaving feedback.");

        // Only allow after event time (simple rule).
        if (ev.DateTime > DateTimeOffset.UtcNow) return BadRequest("Feedback can be submitted after the event date/time.");

        var existing = await _dbContext.Feedback.FirstOrDefaultAsync(x => x.EventId == request.EventId && x.AttendeeId == request.AttendeeId);
        if (existing is not null) return Conflict("Feedback already submitted for this event.");

        var feedback = new Feedback
        {
            Id = Guid.NewGuid(),
            EventId = request.EventId,
            AttendeeId = request.AttendeeId,
            Rating = request.Rating,
            Comment = request.Comment.Trim(),
            CreatedAt = DateTimeOffset.UtcNow
        };

        _dbContext.Feedback.Add(feedback);
        await _dbContext.SaveChangesAsync();

        await UpdateEventRating(ev.Id);

        return Ok(new
        {
            feedback.Id,
            feedback.EventId,
            feedback.AttendeeId,
            feedback.Rating,
            feedback.Comment,
            feedback.CreatedAt
        });
    }

    [Authorize(Roles = "Attendee,Admin")]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdateFeedbackRequest request)
    {
        var actorIdRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var actorIsAdmin = User.IsInRole("Admin");
        if (!Guid.TryParse(actorIdRaw, out var actorId)) return Unauthorized();

        var fb = await _dbContext.Feedback.FirstOrDefaultAsync(x => x.Id == id);
        if (fb is null) return NotFound();
        if (!actorIsAdmin && fb.AttendeeId != actorId) return Forbid();

        if (request.Rating is < 1 or > 5) return BadRequest("Rating must be between 1 and 5.");
        if (string.IsNullOrWhiteSpace(request.Comment) || request.Comment.Trim().Length < 3)
            return BadRequest("Comment is required.");

        fb.Rating = request.Rating;
        fb.Comment = request.Comment.Trim();
        await _dbContext.SaveChangesAsync();
        await UpdateEventRating(fb.EventId);

        return Ok(new
        {
            fb.Id,
            fb.EventId,
            fb.AttendeeId,
            fb.Rating,
            fb.Comment,
            fb.CreatedAt
        });
    }

    [Authorize(Roles = "Attendee,Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var actorIdRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var actorIsAdmin = User.IsInRole("Admin");
        if (!Guid.TryParse(actorIdRaw, out var actorId)) return Unauthorized();

        var fb = await _dbContext.Feedback.FirstOrDefaultAsync(x => x.Id == id);
        if (fb is null) return NotFound();
        if (!actorIsAdmin && fb.AttendeeId != actorId) return Forbid();

        var eventId = fb.EventId;
        _dbContext.Feedback.Remove(fb);
        await _dbContext.SaveChangesAsync();
        await UpdateEventRating(eventId);
        return NoContent();
    }

    private async Task UpdateEventRating(Guid eventId)
    {
        var ev = await _dbContext.Events.FirstOrDefaultAsync(x => x.Id == eventId);
        if (ev is null) return;

        var all = await _dbContext.Feedback.AsNoTracking().Where(x => x.EventId == eventId).ToListAsync();
        ev.ReviewCount = all.Count;
        ev.Rating = all.Count == 0 ? 0m : (decimal)all.Average(x => x.Rating);
        await _dbContext.SaveChangesAsync();
    }
}
