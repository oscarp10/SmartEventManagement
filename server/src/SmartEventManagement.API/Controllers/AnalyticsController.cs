using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartEventManagement.API.Models;
using SmartEventManagement.API.Data;

namespace SmartEventManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public AnalyticsController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [Authorize(Roles = "Organizer,Admin")]
    [HttpGet("organizer/{organizerId:guid}")]
    public async Task<ActionResult> GetOrganizerAnalytics(Guid organizerId)
    {
        var actorIdRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var actorIsAdmin = User.IsInRole("Admin");
        if (!Guid.TryParse(actorIdRaw, out var actorId)) return Unauthorized();
        if (!actorIsAdmin && actorId != organizerId) return Forbid();

        var now = DateTimeOffset.UtcNow;

        var events = await _dbContext.Events.AsNoTracking()
            .Where(x => x.OrganizerId == organizerId)
            .OrderByDescending(x => x.DateTime)
            .Select(x => new
            {
                x.Id,
                x.Title,
                x.DateTime,
                x.Category,
                x.Capacity,
                x.IsApproved,
                x.RejectionReason,
                x.Rating,
                x.ReviewCount
            })
            .ToListAsync();

        var eventIds = events.Select(x => x.Id).ToArray();

        var registrations = await _dbContext.Registrations.AsNoTracking()
            .Where(x => eventIds.Contains(x.EventId) && x.Status != RegistrationStatus.Cancelled)
            .Select(x => new { x.EventId, x.AttendeeId, x.Status })
            .ToListAsync();

        var feedback = await _dbContext.Feedback.AsNoTracking()
            .Where(x => eventIds.Contains(x.EventId))
            .Select(x => new { x.EventId, x.Rating })
            .ToListAsync();

        var totalEvents = events.Count;
        var approvedEvents = events.Count(x => x.IsApproved);
        var pendingEvents = events.Count(x => !x.IsApproved && x.RejectionReason == null);
        var rejectedEvents = events.Count(x => !x.IsApproved && x.RejectionReason != null);

        var totalRegistrations = registrations.Count;
        var totalAttended = registrations.Count(x => x.Status == RegistrationStatus.Attended);

        var averageRating = feedback.Count == 0 ? 0 : feedback.Average(x => x.Rating);

        var perEvent = events.Select(e =>
        {
            var regCount = registrations.Count(r => r.EventId == e.Id);
            var attendedCount = registrations.Count(r => r.EventId == e.Id && r.Status == RegistrationStatus.Attended);
            var fb = feedback.Where(f => f.EventId == e.Id).ToList();
            var avg = fb.Count == 0 ? 0 : fb.Average(x => x.Rating);
            var status = e.IsApproved ? "approved" : (e.RejectionReason != null ? "rejected" : "pending");
            return new
            {
                e.Id,
                e.Title,
                e.DateTime,
                e.Category,
                e.Capacity,
                status,
                registered = regCount,
                attended = attendedCount,
                engagementRate = e.Capacity <= 0 ? 0 : Math.Round((decimal)regCount / e.Capacity * 100m, 2),
                averageRating = Math.Round(avg, 2),
                feedbackCount = fb.Count
            };
        });

        var byMonth = registrations
            .GroupBy(x =>
            {
                // Use event date month instead of registration timestamp (not stored).
                var ev = events.FirstOrDefault(e => e.Id == x.EventId);
                var dt = ev?.DateTime ?? now;
                return new { dt.Year, dt.Month };
            })
            .Select(g => new
            {
                year = g.Key.Year,
                month = g.Key.Month,
                registrations = g.Count()
            })
            .OrderBy(x => x.year).ThenBy(x => x.month)
            .ToList();

        return Ok(new
        {
            totals = new
            {
                totalEvents,
                approvedEvents,
                pendingEvents,
                rejectedEvents,
                totalRegistrations,
                totalAttended,
                averageRating = Math.Round(averageRating, 2)
            },
            perEvent,
            byMonth
        });
    }
}

