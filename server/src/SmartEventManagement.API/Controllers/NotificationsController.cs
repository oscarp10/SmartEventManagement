using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using SmartEventManagement.API.Hubs;
using SmartEventManagement.API.DTOs;
using SmartEventManagement.API.Models;
using SmartEventManagement.API.Data;

namespace SmartEventManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly IHubContext<EventUpdatesHub> _hubContext;

    public NotificationsController(AppDbContext dbContext, IHubContext<EventUpdatesHub> hubContext)
    {
        _dbContext = dbContext;
        _hubContext = hubContext;
    }

    [Authorize(Roles = "Admin,Organizer,Attendee")]
    [HttpGet("me")]
    public async Task<ActionResult<IEnumerable<Notification>>> GetMine()
    {
        var actorIdRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(actorIdRaw, out var actorId)) return Unauthorized();

        var notifications = await _dbContext.Notifications
            .AsNoTracking()
            .Where(x => x.UserId == actorId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
        return Ok(notifications);
    }

    [Authorize(Roles = "Admin,Organizer")]
    [HttpPost]
    public async Task<ActionResult<Notification>> Create([FromBody] CreateNotificationRequest request)
    {
        var userExists = await _dbContext.Profiles.AnyAsync(x => x.Id == request.UserId);
        if (!userExists) return BadRequest("Profile not found.");

        var notification = new Notification
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            Message = request.Message.Trim(),
            IsRead = false,
            CreatedAt = DateTimeOffset.UtcNow
        };

        _dbContext.Notifications.Add(notification);
        await _dbContext.SaveChangesAsync();

        await _hubContext.Clients.Group($"user:{notification.UserId}").SendAsync("NotificationCreated", new
        {
            id = notification.Id,
            userId = notification.UserId,
            message = notification.Message,
            isRead = notification.IsRead,
            createdAt = notification.CreatedAt
        });

        return CreatedAtAction(nameof(GetMine), new { }, notification);
    }

    [Authorize(Roles = "Admin,Organizer,Attendee")]
    [HttpPatch("{id:guid}/read")]
    public async Task<ActionResult> MarkRead(Guid id)
    {
        var actorIdRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var actorIsAdmin = User.IsInRole("Admin");
        if (!Guid.TryParse(actorIdRaw, out var actorId)) return Unauthorized();

        var notification = await _dbContext.Notifications.FirstOrDefaultAsync(x => x.Id == id);
        if (notification is null) return NotFound();
        if (!actorIsAdmin && notification.UserId != actorId) return Forbid();

        notification.IsRead = true;
        await _dbContext.SaveChangesAsync();
        return NoContent();
    }
}
