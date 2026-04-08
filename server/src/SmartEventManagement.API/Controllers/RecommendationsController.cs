using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartEventManagement.API.Services;
using SmartEventManagement.API.Data;

namespace SmartEventManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Attendee,Admin")]
public class RecommendationsController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly IRecommendationService _recommendationService;

    public RecommendationsController(
        AppDbContext dbContext,
        IRecommendationService recommendationService)
    {
        _dbContext = dbContext;
        _recommendationService = recommendationService;
    }

    [HttpGet("{attendeeId:guid}")]
    public async Task<ActionResult> GetForAttendee(Guid attendeeId, [FromQuery] int limit = 6)
    {
        var attendee = await _dbContext.Profiles.AsNoTracking().FirstOrDefaultAsync(x => x.Id == attendeeId);
        if (attendee is null) return NotFound("Attendee profile not found.");

        var approvedEvents = await _dbContext.Events.AsNoTracking()
            .Where(x => x.IsApproved && x.DateTime >= DateTimeOffset.UtcNow)
            .ToListAsync();

        var attendeeRegistrations = await _dbContext.Registrations.AsNoTracking()
            .Include(x => x.Event)
            .Where(x => x.AttendeeId == attendeeId)
            .ToListAsync();

        var recommendations = _recommendationService.GetRecommendations(
            attendee,
            approvedEvents,
            attendeeRegistrations,
            Math.Clamp(limit, 1, 20)
        );

        return Ok(recommendations);
    }
}
