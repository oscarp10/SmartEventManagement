using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using SmartEventManagement.API.Hubs;
using SmartEventManagement.API.DTOs;
using SmartEventManagement.API.Models;
using SmartEventManagement.API.Data;

namespace SmartEventManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly IHubContext<EventUpdatesHub> _hubContext;

    public EventsController(AppDbContext dbContext, IHubContext<EventUpdatesHub> hubContext)
    {
        _dbContext = dbContext;
        _hubContext = hubContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Event>>> GetAll([FromQuery] bool includeUnapproved = false)
    {
        if (includeUnapproved)
        {
            if (User?.Identity?.IsAuthenticated != true)
                return Unauthorized();
            if (!User.IsInRole("Admin"))
                return Forbid();
        }

        var query = _dbContext.Events.AsNoTracking();
        if (!includeUnapproved) query = query.Where(x => x.IsApproved);
        var events = await query.OrderBy(x => x.DateTime).ToListAsync();
        return Ok(events);
    }

    [HttpGet("organizer/{organizerId:guid}")]
    public async Task<ActionResult<IEnumerable<Event>>> GetByOrganizer(Guid organizerId)
    {
        var events = await _dbContext.Events.AsNoTracking().Where(x => x.OrganizerId == organizerId).OrderByDescending(x => x.DateTime).ToListAsync();
        return Ok(events);
    }

    [Authorize(Roles = "Organizer,Admin")]
    [HttpPost]
    public async Task<ActionResult<Event>> Create([FromBody] CreateEventRequest request)
    {
        var organizerExists = await _dbContext.Profiles.AnyAsync(x => x.Id == request.OrganizerId);
        if (!organizerExists) return BadRequest("Organizer profile not found.");

        var entity = new Event
        {
            Id = Guid.NewGuid(),
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            DateTime = request.DateTime,
            Location = request.Location.Trim(),
            PriceLabel = string.IsNullOrWhiteSpace(request.PriceLabel) ? "Free" : request.PriceLabel.Trim(),
            ImageUrl = request.ImageUrl.Trim(),
            Rating = request.Rating,
            ReviewCount = request.ReviewCount,
            AttendeeCount = request.AttendeeCount,
            Category = string.IsNullOrWhiteSpace(request.Category) ? "General" : request.Category.Trim(),
            Capacity = request.Capacity,
            OrganizerId = request.OrganizerId,
            IsApproved = false,
            RegistrationsOpen = true,
            Tags = request.Tags ?? []
        };

        _dbContext.Events.Add(entity);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new { id = entity.Id }, entity);
    }

    [Authorize(Roles = "Organizer,Admin")]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdateEventRequest request)
    {
        var actorIdRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(actorIdRaw, out var actorId)) return Unauthorized();
        var isAdmin = User.IsInRole("Admin");

        var entity = await _dbContext.Events.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();
        if (!isAdmin && entity.OrganizerId != actorId) return Forbid();

        entity.Title = request.Title.Trim();
        entity.Description = request.Description.Trim();
        entity.DateTime = request.DateTime;
        entity.Location = request.Location.Trim();
        entity.PriceLabel = string.IsNullOrWhiteSpace(request.PriceLabel) ? entity.PriceLabel : request.PriceLabel.Trim();
        entity.ImageUrl = request.ImageUrl.Trim();
        entity.Rating = request.Rating;
        entity.ReviewCount = request.ReviewCount;
        entity.AttendeeCount = request.AttendeeCount;
        entity.Category = string.IsNullOrWhiteSpace(request.Category) ? entity.Category : request.Category.Trim();
        entity.Capacity = request.Capacity;
        entity.Tags = request.Tags ?? [];

        await _dbContext.SaveChangesAsync();
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("{id:guid}/admin-comment")]
    public async Task<ActionResult> SetAdminComment(Guid id, [FromBody] AdminCommentRequest request)
    {
        var entity = await _dbContext.Events.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();

        entity.AdminComment = string.IsNullOrWhiteSpace(request.Comment) ? null : request.Comment.Trim();
        await _dbContext.SaveChangesAsync();
        return NoContent();
    }

    [Authorize(Roles = "Organizer,Admin")]
    [HttpPost("{id:guid}/registrations/close")]
    public async Task<ActionResult> CloseRegistrations(Guid id)
    {
        var actorIdRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(actorIdRaw, out var actorId)) return Unauthorized();
        var isAdmin = User.IsInRole("Admin");

        var entity = await _dbContext.Events.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();
        if (!isAdmin && entity.OrganizerId != actorId) return Forbid();

        entity.RegistrationsOpen = false;
        await _dbContext.SaveChangesAsync();
        return NoContent();
    }

    [Authorize(Roles = "Organizer,Admin")]
    [HttpPost("{id:guid}/registrations/open")]
    public async Task<ActionResult> OpenRegistrations(Guid id)
    {
        var actorIdRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(actorIdRaw, out var actorId)) return Unauthorized();
        var isAdmin = User.IsInRole("Admin");

        var entity = await _dbContext.Events.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();
        if (!isAdmin && entity.OrganizerId != actorId) return Forbid();

        entity.RegistrationsOpen = true;
        await _dbContext.SaveChangesAsync();
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("{id:guid}/approve")]
    public async Task<ActionResult> Approve(Guid id)
    {
        var entity = await _dbContext.Events.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();

        entity.IsApproved = true;
        entity.RejectionReason = null;
        await _dbContext.SaveChangesAsync();

        await _hubContext.Clients.All.SendAsync("EventApproved", new
        {
            eventId = entity.Id,
            title = entity.Title,
            organizerId = entity.OrganizerId
        });

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("{id:guid}/reject")]
    public async Task<ActionResult> Reject(Guid id, [FromBody] RejectEventRequest request)
    {
        var entity = await _dbContext.Events.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();

        entity.IsApproved = false;
        entity.RejectionReason = string.IsNullOrWhiteSpace(request.Reason) ? "Rejected by admin." : request.Reason.Trim();
        await _dbContext.SaveChangesAsync();

        await _hubContext.Clients.All.SendAsync("EventRejected", new
        {
            eventId = entity.Id,
            title = entity.Title,
            organizerId = entity.OrganizerId,
            reason = entity.RejectionReason
        });

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("{id:guid}/pending")]
    public async Task<ActionResult> MarkPending(Guid id)
    {
        var entity = await _dbContext.Events.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();

        entity.IsApproved = false;
        entity.RejectionReason = null;
        await _dbContext.SaveChangesAsync();

        await _hubContext.Clients.All.SendAsync("EventMarkedPending", new
        {
            eventId = entity.Id,
            title = entity.Title,
            organizerId = entity.OrganizerId
        });

        return NoContent();
    }
}
