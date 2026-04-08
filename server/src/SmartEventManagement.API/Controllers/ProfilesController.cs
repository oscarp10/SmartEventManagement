using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using SmartEventManagement.API.Data;
using SmartEventManagement.API.DTOs;
using SmartEventManagement.API.Models;

namespace SmartEventManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProfilesController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public ProfilesController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [Authorize(Roles = "Admin,Organizer,Attendee")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Profile>>> GetAll()
    {
        var profiles = await _dbContext.Profiles.AsNoTracking().ToListAsync();
        return Ok(profiles);
    }

    [Authorize(Roles = "Admin,Organizer,Attendee")]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Profile>> GetById(Guid id)
    {
        var profile = await _dbContext.Profiles.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (profile is null) return NotFound();
        return Ok(profile);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Profile>> Create([FromBody] CreateProfileRequest request)
    {
        var exists = await _dbContext.Profiles.AnyAsync(x => x.Email == request.Email);
        if (exists) return Conflict("A profile with this email already exists.");

        var profile = new Profile
        {
            Id = request.Id ?? Guid.NewGuid(),
            FullName = request.FullName.Trim(),
            Email = request.Email.Trim().ToLowerInvariant(),
            Role = request.Role,
            Interests = request.Interests ?? []
        };

        _dbContext.Profiles.Add(profile);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = profile.Id }, profile);
    }

    [Authorize(Roles = "Admin,Attendee")]
    [HttpPut("{id:guid}/interests")]
    public async Task<ActionResult<Profile>> UpdateInterests(Guid id, [FromBody] UpdateInterestsRequest request)
    {
        var actorIdRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var actorIsAdmin = User.IsInRole("Admin");
        if (!actorIsAdmin && (!Guid.TryParse(actorIdRaw, out var actorId) || actorId != id))
        {
            return Forbid();
        }

        var profile = await _dbContext.Profiles.FirstOrDefaultAsync(x => x.Id == id);
        if (profile is null) return NotFound();
        if (profile.Role != UserRole.Attendee) return BadRequest("Interests can only be updated for attendee profiles.");

        profile.Interests = (request.Interests ?? [])
            .Select(x => x.Trim())
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .Take(20)
            .ToArray();

        await _dbContext.SaveChangesAsync();
        return Ok(profile);
    }
}
